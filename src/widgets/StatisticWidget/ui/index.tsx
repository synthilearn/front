import {
  Collapse,
  CollapseProps,
  Divider,
  Flex,
  notification,
  Pagination,
  Spin,
  Table,
  TableProps,
} from 'antd';
import styled, { css } from 'styled-components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { $api } from 'shared/api';
import {
  IBackendRes,
  IGameGeneralStatistic,
  IGameParameters,
  IGameStatistic,
  IWord,
  IWordStatistic,
} from 'shared/interfaces';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  FallOutlined,
  LoadingOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const DEFAULT_PAGE_SIZE = 5;

ChartJS.register(ArcElement, Tooltip, Legend);

export const StatisticWidget = () => {
  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const [page, setPage] = useState<number>(0);

  const [activeGameId, setActiveGameId] = useState<string>();

  const { data: gamesRes } = useQuery({
    queryKey: ['games', page],
    enabled: !!currentWorkarea?.id,
    queryFn: () => {
      return $api.post<
        IBackendRes<{ games: IGameGeneralStatistic[]; totalPages: number }>
      >('game-service/v1/game/all', {
        workareaId: currentWorkarea.id,
        page,
        size: DEFAULT_PAGE_SIZE,
      });
    },
  });

  const {
    mutate: getGameStatistic,
    isPending: gettingGameStatistic,
    data: gameStatistic,
  } = useMutation({
    mutationFn: (gameId: string) => {
      return $api.get<IBackendRes<any>>(`game-service/v1/statistic/${gameId}`);
    },
    onSuccess: async res => {
      setActiveGameId(res.data.resultData.id);
    },
  });

  const columns: TableProps<IWordStatistic>['columns'] = [
    {
      title: 'Слово',
      key: 'word',
      dataIndex: 'word',
    },
    {
      title: 'Выбранный перевод',
      key: 'chosenTranslate',
      render: (_: any, { correct, answer }) => (
        <AnswerWrapper $isCorrect={correct}>{answer}</AnswerWrapper>
      ),
    },
    {
      title: 'Правильный перевод',
      key: 'rightTranslate',
      dataIndex: 'correctAnswerText',
    },
    {
      title: 'Рейтинг слова',
      key: 'wordProgress',
      width: 150,
      render: (_: any, { newProgress, correct }) => (
        <Flex
          gap={8}
          justify={'center'}
          align={'center'}
          style={{
            color: correct ? 'rgba(54, 207, 201, 1)' : 'rgba(255, 120, 117, 1)',
          }}
        >
          {correct ? <RiseOutlined /> : <FallOutlined />}
          {newProgress}
        </Flex>
      ),
    },
  ];

  const handleActiveGameChange = (keys: string[]) => {
    if (!keys.length) {
      setActiveGameId(undefined);
    } else {
      getGameStatistic(keys[keys.length - 1]);
    }
  };

  const handleChangePage = (page: number) => {
    setPage(page - 1);
  };

  const getChartData = (
    incorrectTranslates: number,
    translatesLackTime: number,
    correctTranslates: number,
  ) => ({
    labels: ['Неправильно', 'Не отвечено', 'Правильно'],
    datasets: [
      {
        label: 'Количество слов',
        data: [incorrectTranslates, translatesLackTime, correctTranslates],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  const getCollapseChildren = ({
    id,
    incorrectTranslates,
    translatesLackTime,
    correctTranslates,
    phraseInfos,
  }: IGameStatistic) => {
    if (id !== activeGameId) {
      return undefined;
    }

    const tableData: IWordStatistic[] = [];

    for (const word in phraseInfos) {
      if (phraseInfos.hasOwnProperty(word)) {
        tableData.push({ word, ...phraseInfos[word] });
      }
    }

    return (
      <CollapseChildrenWrapper gap={50}>
        <div style={{ maxWidth: 350 }}>
          <Doughnut
            data={getChartData(
              incorrectTranslates,
              translatesLackTime,
              correctTranslates,
            )}
          />
        </div>
        <WordsStatisticWrapper>
          <TableStyled
            columns={columns}
            dataSource={tableData}
            pagination={false}
          />
        </WordsStatisticWrapper>
      </CollapseChildrenWrapper>
    );
  };

  const items: CollapseProps['items'] = useMemo(() => {
    return gamesRes?.data
      ? gamesRes.data.resultData.games.map(game => ({
          key: game.id,
          label: dayjs(game.creationDate).format(dateFormat),
          extra: !game.statisticCreated ? (
            <Spin
              indicator={<LoadingOutlined style={{ color: '#F0F8FF' }} spin />}
            />
          ) : game.result === 'FAILED' ? (
            <CloseCircleOutlined style={{ color: 'rgba(255, 120, 117, 1)' }} />
          ) : (
            <CheckCircleOutlined style={{ color: 'rgba(54, 207, 201, 1)' }} />
          ),
          children:
            game.id === activeGameId &&
            gameStatistic?.data &&
            getCollapseChildren(gameStatistic?.data?.resultData),
        }))
      : [];
  }, [gamesRes, gameStatistic?.data]);
  return (
    <StatisticWrapper>
      <GamesStatisticWrapper gap={20} vertical>
        <DividerWrapper>
          <Divider>Игры</Divider>
        </DividerWrapper>
        <Collapse
          activeKey={activeGameId}
          items={items}
          onChange={handleActiveGameChange}
        />
        {gamesRes?.data?.resultData?.totalPages > 1 && (
          <Flex justify={'flex-end'} style={{ marginTop: 10 }}>
            {' '}
            <Pagination
              current={page + 1}
              total={
                (gamesRes?.data?.resultData.totalPages ?? 1) * DEFAULT_PAGE_SIZE
              }
              pageSize={DEFAULT_PAGE_SIZE}
              onChange={handleChangePage}
              showSizeChanger={false}
            />
          </Flex>
        )}
      </GamesStatisticWrapper>
    </StatisticWrapper>
  );
};

const StatisticWrapper = styled.div`
  padding: 15px 5%;
  max-height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2f0736;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #130a14;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const GamesStatisticWrapper = styled(Flex)``;

const DividerWrapper = styled.div`
  max-width: 300px;
`;

const WordsStatisticWrapper = styled.div`
  max-height: 450px;
  overflow-y: auto;
  width: 100%;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2f0736;
    border-radius: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: #130a14;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const AnswerWrapper = styled.span<{ $isCorrect: boolean }>`
  font-weight: 500;
  ${({ $isCorrect }) =>
    $isCorrect
      ? css`
          color: rgba(54, 207, 201, 1);
        `
      : css`
          color: rgba(255, 120, 117, 1);
          text-decoration: line-through;
        `}
`;

const TableStyled = styled(Table)`
  & .ant-table-cell {
    text-align: center !important;
  }
`;

const CollapseChildrenWrapper = styled(Flex)`
  padding: 20px 25px;
`;
