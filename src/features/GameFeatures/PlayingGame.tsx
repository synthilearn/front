import styled from 'styled-components';
import { IGame } from 'shared/interfaces';

interface IProps {
  currentGame: IGame | undefined;
}
const PlayingGame = ({ currentGame }: IProps) => {
  return (
    <>
      {currentGame && (
        <div style={{ width: '100%' }}>
          <DelayBar
            $delay={
              (new Date(currentGame?.stageEndTime).getTime() -
                new Date().getTime()) /
              1000
            }
          />
          <div> слово: {currentGame?.currentPhrase}</div>
          <div>варианты: {currentGame?.answerOptions.toString()}</div>
        </div>
      )}
    </>
  );
};

export default PlayingGame;

const DelayBar = styled.div<{ $delay: number }>`
  @keyframes decreaseWidth {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }

  width: 100%;
  height: 20px;
  background-color: blue;
  animation: decreaseWidth ${({ $delay }) => $delay}s linear forwards;
`;
