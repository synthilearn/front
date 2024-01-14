import styled, { css } from 'styled-components';
import { COLOR_PRIMARY, COLOR_TEXT } from 'shared/const';
import { MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface ISidebarProps {
  siderIsOpen: boolean;
  changeOpenSider: () => void;
}

export const Sidebar = ({ changeOpenSider, siderIsOpen }: ISidebarProps) => {
  return (
    <SidebarWrapper>
      <SidebarHeader $isVertical={!siderIsOpen}>
        <SidebarLogo $isVertical={!siderIsOpen}>SynthiLearn</SidebarLogo>
        <ButtonStyled
          $isRotate={!siderIsOpen}
          onClick={changeOpenSider}
          size={'large'}
          type={'text'}
          icon={<MenuIconStyled />}
        />
      </SidebarHeader>
    </SidebarWrapper>
  );
};

const SidebarWrapper = styled.div`
  background: ${COLOR_PRIMARY};
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const SidebarHeader = styled.div<{ $isVertical: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

  ${({ $isVertical }) =>
    $isVertical &&
    css`
      flex-direction: column-reverse;
      gap: 56px;
      justify-content: center;
    `}
`;

const SidebarLogo = styled.div<{ $isVertical: boolean }>`
  font-size: 22px;
  letter-spacing: 2px;

  transform: rotate(${props => (props.$isVertical ? '-90deg' : '0deg')});
`;

const MenuIconStyled = styled(MenuFoldOutlined)`
  color: ${COLOR_TEXT};
`;

const ButtonStyled = styled(Button)<{ $isRotate: boolean }>`
  transition: all 0.3s;
  transform: rotate(${props => (props.$isRotate ? '-180deg' : '0deg')});
`;
