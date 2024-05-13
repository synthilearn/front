import {
  Collapse,
  CollapseProps,
  Divider,
  Flex,
  notification,
  Pagination,
  Spin,
} from 'antd';
import styled from 'styled-components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { $api } from 'shared/api';
import {
  IBackendRes,
  IGameGeneralStatistic,
  IGameParameters,
  IWord,
} from 'shared/interfaces';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
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

  const getCollapseChildren = ({
    id,
    incorrectTranslates,
    translatesLackTime,
    correctTranslates,
  }: any) => {
    if (id !== activeGameId) {
      return undefined;
    }

    const data = {
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
    };

    return (
      <div style={{ maxWidth: 300 }}>
        <Doughnut data={data} />
      </div>
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
`;

const GamesStatisticWrapper = styled(Flex)``;

const DividerWrapper = styled.div`
  max-width: 300px;
`;
