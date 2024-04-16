import styled from 'styled-components';
import { TemplatesToolbar } from 'widgets/TemplatesToolbar';
import { Button, Tour, TourProps } from 'antd';
import { useRef } from 'react';
import { useTourState } from 'shared/states/useTourState';

export const PageAuth = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const tourItems = useTourState(state => state.tourItems);
  const openTour = useTourState(state => state.openTour);
  const setOpenTour = useTourState(state => state.setOpenTour);
  const steps: TourProps['steps'] = [
    {
      title: 'Upload File',
      description: 'Put your files here.',
      cover: (
        <img
          alt="tour.png"
          src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
        />
      ),
      target: () => ref1.current,
    },
    {
      title: 'Save',
      description: 'Save your changes.',
      target: () => ref2.current,
    },
    {
      title: 'Other Actions',
      description: 'Click to see other actions.',
      target: () => ref3.current,
    },
  ];
  return (
    <PageWrapper>
      <Content>
        <Button onClick={() => setOpenTour(true)}>Начать</Button>
        <Tour
          open={openTour}
          onClose={() => setOpenTour(false)}
          steps={tourItems}
        />
      </Content>
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
