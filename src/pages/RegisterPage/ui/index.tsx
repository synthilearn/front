import styled from 'styled-components';
import { COLOR_PRIMARY, COLOR_SECONDARY } from 'shared/const';
import { RegisterStepsModal } from 'widgets/RegisterStepsModal';

export const RegisterPage = () => {
  return (
    <RegisterPageContainer>
      <AnimationnWrapper>
        {Array(150)
          .fill(0)
          .map((_, index) => (
            <SquareItem key={index}></SquareItem>
          ))}
      </AnimationnWrapper>
      <RegisterStepsModal />
    </RegisterPageContainer>
  );
};

const RegisterPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100%;
  background: ${COLOR_SECONDARY};
`;

const AnimationnWrapper = styled.section`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
  overflow: hidden;

  &::before {
    @keyframes animate {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }

    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(#000, ${COLOR_PRIMARY}, #000);
    animation: animate 5s linear infinite;
  }
`;

const SquareItem = styled.span`
  position: relative;
  display: block;
  width: calc(10vw - 2px);
  height: calc(10vw - 2px);
  background: #181818;
  z-index: 2;
  transition: 1.5s;

  &:hover {
    background: ${COLOR_PRIMARY};
    transition: 0s;
  }
`;
