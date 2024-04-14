import styled from 'styled-components';
import { UserBlock } from 'features/UserBlock';

export const Header = () => {
  return (
    <HeaderWrapper>
      <UserBlock />
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
