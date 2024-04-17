import styled from 'styled-components';
import { TemplatesToolbar } from 'widgets/TemplatesToolbar';
import { Flex, Tour, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useTourState } from 'shared/states/useTourState';
import { TypeAnimation } from 'react-type-animation';
import '../styles/index.scss';
import AnimationBlock from 'pages/MainPage/ui/AnimationBlock';
import { getRandomInt } from 'shared/helpers/getRandomInt';

export const PageAuth = () => {
  const [animationStep, setAnimationStep] = useState<number>(0);

  const tourItems = useTourState(state => state.tourItems);
  const openTour = useTourState(state => state.openTour);
  const setOpenTour = useTourState(state => state.setOpenTour);

  const createRandomProperties = () => {
    return {
      size: getRandomInt(10, 150),
      left: getRandomInt(0, 95),
      delay: getRandomInt(0, 15),
      duration: getRandomInt(15, 45),
    };
  };

  const animationArray = useMemo(() => {
    return new Array(15).fill(undefined);
  }, []);
  return (
    <PageWrapper>
      <Content>
        <Flex vertical gap={20}>
          <TypeAnimation
            sequence={[
              'Здравствуйте!',
              50,
              '👋 Приветствуем тебя на платформе SynthiLearn!',
              () => {
                setAnimationStep(1);
              },
            ]}
            wrapper="span"
            cursor={false}
            speed={{ type: 'keyStrokeDelayInMs', value: 50 }}
            style={{ fontSize: '2.5em', display: 'inline-block' }}
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
                maxWidth: '900px',
                fontSize: '2em',
                lineHeight: '3rem',
                display: 'inline-block',
              }}
            />
          )}
          <GideBlock
            gap={10}
            align={'center'}
            className={animationStep === 2 ? 'show' : ''}
          >
            <Typography.Title level={3}>
              <HighlightText>
                Пройдите
                <img src={require('/src/shared/assets/png/underline.png')} />
              </HighlightText> небольшой гайд, чтобы лучше понять, как работает
              платформа 👉
            </Typography.Title>
            <GoGide onClick={() => setOpenTour(true)}>Начать гайд</GoGide>
          </GideBlock>
        </Flex>
        <Tour
          open={openTour}
          onClose={() => setOpenTour(false)}
          steps={tourItems}
        />
        <ul className={'circles'}>
          {animationStep === 2 &&
            animationArray.map((_, index) => (
              <AnimationBlock {...createRandomProperties()} key={index} />
            ))}
        </ul>
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
  position: relative;
  padding: 5% 10%;
  flex-grow: 1;
`;

const GideBlock = styled(Flex)`
  position: relative;
  top: 20px;
  opacity: 0;
  transition: all 0.5s;

  &.show {
    opacity: 1;
    top: 0;
  }
`;

const GoGide = styled.div`
  position: relative;
  transition: all 0.5s;
  top: -2px;
  font-size: 1.5rem;
  line-height: 1.5rem;
  cursor: pointer;
  color: #3e5f8a;
  font-weight: 600;
  z-index: 2;

  &:hover {
    top: -6px;
    color: #5e6eff;

    &::before {
      background: #5e6eff;
    }
  }

  &::before {
    content: '';
    transition: all 0.5s;
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #3e5f8a;
  }
`;

const HighlightText = styled.span`
position: relative;

  & img {
    position: absolute;
    bottom: -12px;
    left: -5px;
    right: 5px;
    width: 110%;
  }
  
`
