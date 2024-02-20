import styled from 'styled-components';

interface IAuthFormContainerProps {
  width: number;
  children: React.ReactNode;
}

const AuthFormContainer = ({ width, children }: IAuthFormContainerProps) => {
  return <Container $width={width}>{children}</Container>;
};

export default AuthFormContainer;

const Container = styled.div<{ $width: number }>`
  position: relative;
  z-index: 3;
  padding: 40px;
  border-radius: 4px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 9);
  width: ${props => props.$width}px;
  background: #3d3d3d;
  font-size: 20px;
`;
