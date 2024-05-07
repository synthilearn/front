import styled from 'styled-components';
import {
  ConfigProvider,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  SelectProps,
  Typography,
} from 'antd';
import { TYPES_WORD_OPTIONS } from 'shared/const';
import AuthBtn from 'shared/components/AuthBtn';
import { useMutation } from '@tanstack/react-query';
import {
  IBackendRes,
  IGameData,
  IGameParameters,
  IWord,
  IWordTemplate,
} from 'shared/interfaces';
import { $api } from 'shared/api';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface IProps {
  goToGame: () => void;
}

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options: TYPES_WORD_OPTIONS,
  placeholder: 'Выберите части речи',
  maxTagCount: 'responsive',
};
const ChooseGameParameters = ({ goToGame }: IProps) => {
  const [timer, setTimer] = useState(0);
  const timerIntervalId = useRef<NodeJS.Timer | null>(null);
  const [form] = Form.useForm();

  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const {
    mutate: startGame,
    isPending: startingGame,
    data: gameData,
  } = useMutation({
    mutationFn: (payload: IGameParameters) => {
      return $api.post<IBackendRes<IGameData>>(
        'game-service/v1/game',
        payload,
        {
          params: { workarea_id: currentWorkarea?.id },
        },
      );
    },
    onSuccess: async () => {
      console.log('starting', new Date(), new Date().getMilliseconds());
      setTimer(11);
      timerIntervalId.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    },
  });

  const { data: gameParameters } = useQuery({
    queryKey: ['gameParameters'],
    enabled: !!currentWorkarea?.id,
    queryFn: () => {
      return $api.get<IBackendRes<IGameParameters>>(
        'game-service/v1/parameter',
        {
          params: { workarea_id: currentWorkarea?.id },
        },
      );
    },
  });

  function chooseEndingForSecond(count: number): string {
    const endings: any = {
      1: 'а',
      2: 'ы',
      3: 'ы',
      4: 'ы',
    };

    return endings[count % 10] || '';
  }

  const handleStartGame = () => {
    form
      .validateFields()
      .then(values => {
        startGame({
          dictionaryId,
          ...values,
          typeOfGame: 'DEFAULT',
        });
      })
      .catch(e => {
        console.log(e);
      });
  };

  const dictionaryId = useMemo(() => {
    return currentWorkarea?.widgets?.find(
      widget => widget.type === 'DICTIONARY',
    )?.id;
  }, [currentWorkarea]);

  useEffect(() => {
    if (!timer && timerIntervalId.current) {
      clearInterval(timerIntervalId.current);
      goToGame();
    }
  }, [timer]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            controlHeight: 50,
            fontSize: 20,
          },
        },
      }}
    >
      {gameParameters?.data?.resultData && (
        <Flex align={'center'} gap={20} vertical>
          <Typography.Title level={3}>
            Проверь свой уровень знаний слов в игре!
          </Typography.Title>
          <FormStyled
            initialValues={gameParameters?.data?.resultData}
            form={form}
            layout="vertical"
          >
            <FormItem
              label={'Части речи'}
              name={'partsOfSpeech'}
              rules={[
                {
                  required: true,
                  message: 'Выберите хотя бы одну часть речи',
                },
              ]}
            >
              <Select {...sharedProps} />
            </FormItem>
            <FormItem
              label={'Типы слов'}
              name={'phraseTypes'}
              rules={[
                {
                  required: true,
                  message: 'Выберите хотя бы один тип',
                },
              ]}
            >
              <Select
                mode={'multiple'}
                options={[
                  {
                    label: 'Слово',
                    value: 'WORD',
                  },
                  {
                    label: 'Фраза',
                    value: 'PHRASE',
                  },
                ]}
                placeholder={'Выберите типы слов'}
              />
            </FormItem>
            <Flex gap={20}>
              <FormItem
                label={'Количество слов'}
                name={'translatesAmount'}
                rules={[
                  {
                    required: true,
                    message: 'Заполните поле',
                  },
                  {
                    type: 'number',
                    max: 20,
                    message: 'Максимум 20 слов',
                  },
                ]}
              >
                <InputStyled placeholder={'20'} />
              </FormItem>
              <FormItem
                label={'Количество времени на 1 слово'}
                name={'timeOnWord'}
                rules={[
                  {
                    required: true,
                    message: 'Заполните поле',
                  },
                  {
                    type: 'number',
                    max: 60,
                    message: 'Максимум минута',
                  },
                ]}
              >
                <InputStyled
                  placeholder={'10'}
                  formatter={value =>
                    value
                      ? `${value} ${
                          'секунд' + chooseEndingForSecond(Number(value))
                        }`
                      : ''
                  }
                />
              </FormItem>
            </Flex>
          </FormStyled>
          {!!timer && (
            <Flex gap={15} align={'center'} vertical>
              <Title level={3}>Игра начнется через</Title>
              <Title level={3}>{timer}</Title>
            </Flex>
          )}
          {!gameData?.data && (
            <AuthBtn isLoading={startingGame} handleClick={handleStartGame}>
              Начать игру
            </AuthBtn>
          )}
        </Flex>
      )}
    </ConfigProvider>
  );
};

export default ChooseGameParameters;

const FormStyled = styled(Form)`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 700px;
`;

const FormItem = styled(Form.Item)`
  width: 100%;
  & .ant-form-item-required {
    font-size: 18px !important;
    padding-bottom: 2px !important;

    &::before {
      content: none;
      opacity: 0;
    }
  }
`;

const InputStyled = styled(InputNumber).attrs(() => ({
  controls: false,
}))`
  width: 100%;
`;

const Title = styled(Typography.Title)`
  margin: 0 !important;
`;
