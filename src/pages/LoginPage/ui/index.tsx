import { AnimationBackground } from 'widgets/AnimationBackground';
import styled from 'styled-components';
import { LoginModal } from 'widgets/LoginModal';

export const LoginPage = () => {
  return (
    <LoginPageWrapper>
      <AnimationBackground itemColor={'#000438'} />
      <LoginModal />
    </LoginPageWrapper>
  );
};

const LoginPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-width: 100%;
  background: #00087d;
`;
