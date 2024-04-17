import styled from 'styled-components';
import { ConfigProvider, notification } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { MenuStyled } from 'shared/components/StyledComponents';
import { useAppState } from 'shared/states/useAppState';

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
              onClick: () => {
                localStorage.clear();
                useAppState.getState().setIsAuth();

                notification.success({
                  message: undefined,
                  description: 'Вы вышли из аккаунта!',
                });
              },
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
