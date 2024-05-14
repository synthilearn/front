import styled, { css } from 'styled-components';
import { IWordGame } from 'shared/interfaces';
import { Flex } from 'antd';
import { COLOR_TEXT } from 'shared/const';
import AnswerOption from 'features/GameFeatures/AnswerOption';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  currentWordGame: IWordGame | undefined;
  nextWord: () => void;
  answerQuestion: (translate: string) => void;
  selectedWord: string | undefined;
  rightWord: string | undefined;
  setSelectedWord: (value: undefined | string) => void;
}
const PlayingGame = ({
  currentWordGame,
  nextWord,
  answerQuestion,
  selectedWord,
  rightWord,
  setSelectedWord,
}: IProps) => {
  const delayBarRef = useRef<HTMLDivElement>();
  const [isTimeStop, setIsTimeStop] = useState(false);

  const handleAnswerQuestion = (translate: string) => {
    setIsTimeStop(true);
    const barWidth = delayBarRef.current.clientWidth;
    delayBarRef.current.style.animation = null;
    delayBarRef.current.style.width = `${barWidth}px`;
    answerQuestion(translate);
  };
  useEffect(() => {
    if (currentWordGame) {
      delayBarRef.current.style.width = null;
      setIsTimeStop(false);
      const timerId = setTimeout(
        () => {
          setIsTimeStop(true);
          nextWord();
        },
        new Date(currentWordGame?.stageEndTime).getTime() -
          new Date().getTime() +
          1000,
      );

      return () => clearTimeout(timerId);
    }
  }, [currentWordGame]);

  return (
    <GameWrapper align={'center'} gap={'10%'} vertical>
      {currentWordGame && (
        <>
          <div style={{ width: '100%' }}>
            <DelayBar
              ref={delayBarRef}
              $delay={
                (new Date(currentWordGame?.stageEndTime).getTime() -
                  new Date().getTime()) /
                1000
              }
              $stopDelay={isTimeStop}
            />
          </div>
          <QuestionWrapper>
            <Counter>{`${currentWordGame.currentStage}/${currentWordGame.allStages}`}</Counter>
            <Word justify={'center'} align={'center'}>
              {currentWordGame?.currentPhrase}
            </Word>
            <AnswerOptionsList justify={'center'} gap={15} wrap={'wrap'}>
              {currentWordGame?.answerOptions.map(option => (
                <AnswerOption
                  optionText={option}
                  onClick={handleAnswerQuestion}
                  selectedWord={selectedWord}
                  rightWord={rightWord}
                />
              ))}
            </AnswerOptionsList>
          </QuestionWrapper>
        </>
      )}
    </GameWrapper>
  );
};

export default PlayingGame;

const GameWrapper = styled(Flex)`
  width: 100%;
  height: 100%;
`;

const DelayBar = styled.div<{ $delay: number; $stopDelay: boolean }>`
  @keyframes decreaseWidth {
    from {
      width: 100%;
      background-color: ${COLOR_TEXT};
    }
    70% {
      background-color: ${COLOR_TEXT};
    }
    to {
      width: 0;
      background: red;
    }
  }

  border-radius: 3px;
  height: 20px;
  background-color: ${COLOR_TEXT};

  ${({ $stopDelay, $delay }) =>
    $stopDelay
      ? css`
          animation: none;
        `
      : css`
          animation: decreaseWidth ${$delay}s linear forwards;
        `}
`;

const Counter = styled(Flex)`
  font-size: 30px;
  justify-content: flex-start;
`;

const QuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  width: 100%;
  padding: 10% 5%;
`;

const Word = styled(Flex)`
  padding: 20px 50px;
  font-size: 30px;
  font-weight: 500;
  border: 3px solid ${COLOR_TEXT};
  border-radius: 10px;
  width: max-content;
`;

const AnswerOptionsList = styled(Flex)`
  max-width: 50%;
`;
