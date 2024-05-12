import styled, { css } from 'styled-components';
import { IWordGame } from 'shared/interfaces';
import { Flex } from 'antd';
import { COLOR_TEXT } from 'shared/const';
import AnswerOption from 'features/GameFeatures/AnswerOption';
import { useEffect, useRef } from 'react';

interface IProps {
  currentWordGame: IWordGame | undefined;
  nextWord: () => void;
  answerQuestion: (translate: string) => void;
  selectedWord: string | undefined;
  rightWord: string | undefined;
}
const PlayingGame = ({
  currentWordGame,
  nextWord,
  answerQuestion,
  selectedWord,
  rightWord,
}: IProps) => {
  const delayBarRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (currentWordGame) {
      const timerId = setTimeout(
        () => {
          nextWord();
        },
        new Date(currentWordGame?.stageEndTime).getTime() -
          new Date().getTime(),
      );

      // if (delayBarRef.current) {
      //   console.log(delayBarRef.current);
      //   delayBarRef.current.style.width = '100%';
      // }

      return clearTimeout(timerId);
    }
  }, [currentWordGame]);

  // useEffect(() => {
  //   if (selectedWord && delayBarRef.current) {
  //     delayBarRef.current.style.animation = 'none';
  //   }
  // }, [selectedWord]);
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
              $stopDelay={!!selectedWord}
            />
          </div>
          <QuestionWrapper>
            <Word justify={'center'} align={'center'}>
              {currentWordGame?.currentPhrase}
            </Word>
            <AnswerOptionsList justify={'center'} gap={15} wrap={'wrap'}>
              {currentWordGame?.answerOptions.map(option => (
                <AnswerOption
                  optionText={option}
                  onClick={answerQuestion}
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
    }
    to {
      width: 0;
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
          width: 100%;
        `}
`;

const QuestionWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 50px;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5%;
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
