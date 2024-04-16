import styled from 'styled-components';
import { TemplatesToolbar } from 'widgets/TemplatesToolbar';
import { Button, Flex, Tour, Typography } from 'antd';
import { useState } from 'react';
import { useTourState } from 'shared/states/useTourState';
import { TypeAnimation } from 'react-type-animation';

export const PageAuth = () => {
  const [animationStep, setAnimationStep] = useState<number>(0);

  const tourItems = useTourState(state => state.tourItems);
  const openTour = useTourState(state => state.openTour);
  const setOpenTour = useTourState(state => state.setOpenTour);
  return (
    <PageWrapper>
      <Content>
        <Flex vertical gap={20}>
          <TypeAnimation
            sequence={[
              'Здравствуйте!',
              100,
              '👋 Приветствуем тебя на платформе SynthiLearn!',
              () => {
                setAnimationStep(1);
              },
            ]}
            speed={50}
            wrapper="span"
            cursor={false}
            style={{ fontSize: '2em', display: 'inline-block' }}
          />
          {animationStep > 0 && (
            <TypeAnimation
              sequence={[
                'У нас ты найдешь не только самые актуальные курсы по различным областям знаний, но и уникальную возможность выбирать обучающие программы, соответствующие именно твоим интересам и потребностям. ',
                () => {
                  setAnimationStep(2);
                },
              ]}
              speed={{ type: 'keyStrokeDelayInMs', value: 20 }}
              wrapper="span"
              cursor={true}
              style={{
                fontSize: '1.5em',
                lineHeight: '2.5rem',
                display: 'inline-block',
              }}
            />
          )}
          <Flex gap={10} align={'center'}>
            <Typography.Title level={4}>
              Пройдите небольшой гайд, чтобы лучше понять, как работает
              платформа 👉
            </Typography.Title>
            <Button onClick={() => setOpenTour(true)}>Начать гайд</Button>
          </Flex>
        </Flex>
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
  padding: 5% 10%;
  flex-grow: 1;
`;
