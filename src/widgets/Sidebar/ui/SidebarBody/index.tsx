import styled from 'styled-components';
import { getItem, MenuItem } from './helpers/getMenuItem';
import { CloseOutlined, DesktopOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { MenuStyled } from 'shared/components/StyledComponents';
import { IAreaItem } from 'shared/interfaces';
import { useEffect, useRef } from 'react';
import { useTourState } from 'shared/states/useTourState';

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
  const menuRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const setTargetTourItem = useTourState(state => state.setTargetTourItem);
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

  useEffect(() => {
    console.log(menuRef.current);
    setTargetTourItem(2, menuRef.current);
  }, [menuRef.current]);

  return (
    <SidebarBodyWrappper>
      <div ref={menuRef}>
        <MenuStyled
          selectedKeys={[
            //@ts-ignore
            items[0]?.children?.find(
              (area: any) => area?.key === location.pathname,
            )?.key,
          ]}
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
      </div>
    </SidebarBodyWrappper>
  );
};

export default SidebarBody;

const SidebarBodyWrappper = styled.div``;
