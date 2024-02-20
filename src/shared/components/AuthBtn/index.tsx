import styled from 'styled-components';
import { Spin } from 'antd';

interface IAuthBrnProps {
  isLoading: boolean;
  handleClick: () => void;
  children: React.ReactNode;
}

const AuthBtn = ({ isLoading, handleClick, children }: IAuthBrnProps) => {
  return (
    <StyledButton onClick={handleClick}>
      {isLoading ? <SpinStyled /> : children}
    </StyledButton>
  );
};

export default AuthBtn;

const StyledButton = styled.span`
  line-height: 50px;
  height: 50px;
  text-align: center;
  width: 250px;
  cursor: pointer;
  color: #fff;
  transition: all 0.5s;
  position: relative;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: rgba(255, 255, 255, 0.1);
    transition: all 0.3s;
  }

  &:hover::before {
    opacity: 0;
    transform: scale(0.5, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0;
    transition: all 0.3s;
    border: 1px solid rgba(255, 255, 255, 0.5);
    transform: scale(1.2, 1.2);
  }

  &:hover::after {
    opacity: 1;
    transform: scale(1, 1);
  }
`;

const SpinStyled = styled(Spin)`
  & .ant-spin-dot-item {
    background-color: white;
  }
`;
