import styled from 'styled-components';
import { TemplatesToolbar } from 'widgets/TemplatesToolbar';

export const PageAuth = () => {
  return (
    <PageWrapper>
      <Content></Content>
      <TemplatesToolbar />
    </PageWrapper>
  );
};

export default PageAuth;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Content = styled.div`
  flex-grow: 1;
`;
