import styled, { css } from 'styled-components';
import { Menu } from 'antd';
import { COLOR_PRIMARY } from 'shared/const';

export const MenuStyled = styled(Menu)<{ $collapsed: boolean }>`
  background: ${COLOR_PRIMARY} !important;
  border-inline-end: unset !important;

  ${({ $collapsed }) =>
    $collapsed &&
    css`
      margin-left: 4px;

      & .ant-menu-submenu-arrow {
        display: none;
      }

      & .ant-menu-submenu-title {
        padding-inline-end: 0;
      }

      & .ant-menu-title-content {
        display: none;
      }

      & .menuitem {
        line-height: 52px;
      }
    `}
`;
