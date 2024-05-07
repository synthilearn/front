import styled from 'styled-components';
import { SelectProps } from 'antd';
import { TYPES_WORD_OPTIONS } from 'shared/const';
import { useMemo, useState } from 'react';
import ChooseGameParameters from 'features/GameFeatures/ChooseGameParameters';
import PlayingGame from 'features/GameFeatures/PlayingGame';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import { IBackendRes, IGame, ITranslation } from 'shared/interfaces';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options: TYPES_WORD_OPTIONS,
  placeholder: 'Выберите части речи',
  maxTagCount: 'responsive',
};

export const GameWidget = () => {
  const [gameStep, setGameStep] = useState<0 | 1 | 2>(0);
  const [currentWord, setCurrentWord] = useState<number>(1);

  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const { data: currentGame } = useQuery({
    queryKey: ['playingGame'],
    enabled: gameStep === 1,
    queryFn: () => {
      return $api.get<IBackendRes<IGame>>('game-service/v1/game', {
        params: {
          workarea_id: currentWorkarea?.id,
        },
      });
    },
  });

  const goToGame = () => {
    // тут какой-то запрос на слово должен быть
    console.log(new Date(), new Date().getMilliseconds());
    setGameStep(1);
  };

  const setNextWord = () => {
    setCurrentWord(prev => prev + 1);
  };

  const gamePages = useMemo(() => {
    return [
      <ChooseGameParameters goToGame={goToGame} />,
      <PlayingGame currentGame={currentGame?.data?.resultData} />,
    ];
  }, [currentGame?.data]);

  return <WidgetWrapper>{gamePages[gameStep]}</WidgetWrapper>;
};

const WidgetWrapper = styled.div`
  padding: 15px 3%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
