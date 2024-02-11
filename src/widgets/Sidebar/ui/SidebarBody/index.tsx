import styled from 'styled-components';
import { getItem, MenuItem } from './helpers/getMenuItem';
import { CloseOutlined, DesktopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MenuStyled } from 'shared/components/StyledComponents';
import { IAreaItem } from 'shared/interfaces';

interface ISidebarBodyProps {
  activeAreas: IAreaItem[];
  deactiveAreas: IAreaItem[];
  collapsed: boolean;
}

const SidebarBody = ({
  activeAreas,
  deactiveAreas,
  collapsed,
}: ISidebarBodyProps) => {
  const navigate = useNavigate();
  const items: MenuItem[] = [
    getItem(
      'Активные',
      'activeAreaTitle',
      <DesktopOutlined />,
      activeAreas.map(({ label, clickLink }) => getItem(label, clickLink)),
    ),

    getItem(
      'Деактивированные',
      'deactiveAreaTitle',
      <CloseOutlined />,
      deactiveAreas.map(({ label, clickLink }) => getItem(label, clickLink)),
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
        onSelect={({ item, key }) => {
          navigate(key);
        }}
      />
    </SidebarBodyWrappper>
  );
};

export default SidebarBody;

const SidebarBodyWrappper = styled.div``;
