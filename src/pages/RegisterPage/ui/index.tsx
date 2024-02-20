import styled from 'styled-components';
import { COLOR_SECONDARY } from 'shared/const';
import { RegisterStepsModal } from 'widgets/RegisterStepsModal';
import { AnimationBackground } from 'widgets/AnimationBackground';

export const RegisterPage = () => {
  return (
    <RegisterPageContainer>
      <AnimationBackground />
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
