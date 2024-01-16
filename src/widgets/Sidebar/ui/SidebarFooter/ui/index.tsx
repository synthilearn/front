import styled from 'styled-components';
import { ConfigProvider } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { MenuStyled } from 'shared/components/StyledComponents';

interface ISidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter = ({ collapsed }: ISidebarFooterProps) => {
  return (
    <SidebarFooterWrapper>
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemHoverBg: '#ff4d4f',
            },
          },
        }}
      >
        <MenuStyled
          items={[
            {
              key: 'exit',
              label: 'Выйти',
              danger: true,
              icon: <LogoutOutlined />,
            },
          ]}
          mode={collapsed ? 'vertical' : 'inline'}
          inlineIndent={16}
          $collapsed={collapsed}
        />
      </ConfigProvider>
    </SidebarFooterWrapper>
  );
};

const SidebarFooterWrapper = styled.div``;
