import styled from 'styled-components';
import { Layout as LayoutAntd } from 'antd';
import { Sidebar } from 'widgets/Sidebar';
import { Header } from 'widgets/Header';
import { COLOR_PRIMARY, COLOR_SECONDARY } from 'shared/const';
import { useState } from 'react';

const { Header: HeaderAntd, Content, Sider } = LayoutAntd;

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  const [siderIsOpen, setSiderIsOpen] = useState(true);

  const changeOpenSider = () => {
    setSiderIsOpen(prev => !prev);
  };
  return (
    <LayoutStyled>
      <Sider width={siderIsOpen ? '300px' : '100px'}>
        <Sidebar siderIsOpen={siderIsOpen} changeOpenSider={changeOpenSider} />
      </Sider>
      <LayoutStyled>
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <ContentWrapper>{children}</ContentWrapper>
      </LayoutStyled>
    </LayoutStyled>
  );
};

export default Layout;

const LayoutStyled = styled(LayoutAntd)`
  height: 100%;
`;

const HeaderWrapper = styled(HeaderAntd)`
  height: 72px;
  background-color: ${COLOR_PRIMARY};
  border-left: 2px solid #1b5583;
`;

const ContentWrapper = styled(Content)`
  background: ${COLOR_SECONDARY};
`;
