import styled from 'styled-components';

export const Header = () => {
  return <></>;
};

const HeaderWrapper = styled.div`
  height: 90px;
  position: fixed;
  margin: 0 auto;
  max-width: 1440px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #ebe6d6;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;
