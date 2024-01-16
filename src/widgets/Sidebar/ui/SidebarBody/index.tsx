import styled from 'styled-components';
import { getItem, MenuItem } from './helpers/getMenuItem';
import { CloseOutlined, DesktopOutlined } from '@ant-design/icons';
import { MenuStyled } from 'shared/components/StyledComponents';

interface ISidebarBodyProps {
  activeAreas: string[];
  deactiveAreas: string[];
  collapsed: boolean;
}

const SidebarBody = ({
  activeAreas,
  deactiveAreas,
  collapsed,
}: ISidebarBodyProps) => {
  const items: MenuItem[] = [
    getItem(
      'Активные',
      'activeAreaTitle',
      <DesktopOutlined />,
      activeAreas.map((area, idx) => getItem(area, idx)),
    ),

    getItem(
      'Деактивированные',
      'deactiveAreaTitle',
      <CloseOutlined />,
      deactiveAreas.map((area, idx) => getItem(area, idx)),
    ),
  ];
  return (
    <SidebarBodyWrappper>
      <MenuStyled
        $collapsed={collapsed}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['activeAreaTitle']}
        mode={collapsed ? 'vertical' : 'inline'}
        inlineIndent={16}
        items={items}
      />
    </SidebarBodyWrappper>
  );
};

export default SidebarBody;

const SidebarBodyWrappper = styled.div``;
