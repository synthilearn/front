import styled from 'styled-components';
import { notification, SelectProps } from 'antd';
import { TYPES_WORD_OPTIONS } from 'shared/const';
import { useMemo, useState } from 'react';
import ChooseGameParameters from 'features/GameFeatures/ChooseGameParameters';
import PlayingGame from 'features/GameFeatures/PlayingGame';
import { useQuery } from '@tanstack/react-query';
import { $api } from 'shared/api';
import {
  IBackendRes,
  IWordGame,
  ITranslation,
  IWord,
  IAnswerQuestion,
} from 'shared/interfaces';
import { useCurrentWorkarea } from 'shared/states/useCurrentWorkarea';
import { useMutation } from '@tanstack/react-query';

interface IQuestionAnswer {
  translate: string;
  stage: number;
  gameId: string;
  workareaId: string;
}

const sharedProps: SelectProps = {
  mode: 'multiple',
  style: { width: '100%' },
  options: TYPES_WORD_OPTIONS,
  placeholder: 'Выберите части речи',
  maxTagCount: 'responsive',
};

export const GameWidget = () => {
  const [gameStep, setGameStep] = useState<0 | 1 | 2>(0);
  const [selectedWord, setSelectedWord] = useState<string>();
  const [rightWord, setRightWord] = useState<string>();

  const currentWorkarea = useCurrentWorkarea(state => state.currentWorkarea);

  const { data: currentWordGame, refetch: wordRefetch } = useQuery({
    queryKey: ['playingGame'],
    enabled: gameStep === 1,
    queryFn: () => {
      setSelectedWord(undefined);
      setRightWord(undefined);
      return $api.get<IBackendRes<IWordGame>>('game-service/v1/game', {
        params: {
          workarea_id: currentWorkarea?.id,
        },
      });
    },
  });

  const { mutate: answerQuestion, isPending: editingWord } = useMutation({
    mutationFn: (translate: string) => {
      setSelectedWord(translate);

      return $api.post<IBackendRes<IAnswerQuestion>>(
        'game-service/v1/game/answer',
        {
          translate,
          stage: currentWordGame?.data?.resultData?.currentStage,
          gameId: currentWordGame?.data?.resultData?.gameId,
          workareaId: currentWorkarea?.id,
        },
      );
    },
    onSuccess: async res => {
      setRightWord(res.data.resultData.rightTranslate);
    },
  });

  const goToGame = () => {
    console.log(new Date(), new Date().getMilliseconds());
    setGameStep(1);
  };

  const setNextWord = async () => {
    await wordRefetch();
  };

  const handleAnswerQuestion = async (translate: string) => {
    await answerQuestion(translate);

    setTimeout(() => {
      wordRefetch();
    }, 2000);
  };

  const gamePages = useMemo(() => {
    return [
      <ChooseGameParameters goToGame={goToGame} />,
      <PlayingGame
        currentWordGame={currentWordGame?.data?.resultData}
        nextWord={setNextWord}
        answerQuestion={handleAnswerQuestion}
        selectedWord={selectedWord}
        rightWord={rightWord}
      />,
    ];
  }, [currentWordGame?.data, selectedWord, rightWord]);

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
