import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { produce } from 'immer';
import { TourProps } from 'antd';
import styled from 'styled-components';

export type TToureState = {
  tourItems: TourProps['steps'];
  setTargetTourItem: (index: number, target: HTMLElement) => void;
  openTour: boolean;
  setOpenTour: (openTour: boolean) => void;
};

const DEFAULT_NEXT_BTN_PROPS = {
  children: 'Далее',
    type: 'default'
};

const DEFAULT_PREV_BTN_PROPS = {
  children: 'Назад',
};

const DescriptionWrapper = styled.div`
  padding: 15px 0;
`;

export const useTourState = create<TToureState>()(
  devtools(
    set => ({
      openTour: false,
      setOpenTour: openTour => {
        set({ openTour });
      },
      tourItems: [
        {
          title: '👋 Приветсвуем вас на платформе SynthiLearn!',
          description: (
            <DescriptionWrapper>
              Здесь вы можете начать получать знания, создавая различные области
              для своего обучения
            </DescriptionWrapper>
          ),
          target: () => null,
          nextButtonProps: DEFAULT_NEXT_BTN_PROPS,
        },
        {
          title: 'Шаблоны областей',
          description: (
            <DescriptionWrapper>
              Ниже представлены все шаблоны рабочих областей, которые вы можете
              создать, чтобы начать ими пользоваться
            </DescriptionWrapper>
          ),
          target: () => null,
          nextButtonProps: DEFAULT_NEXT_BTN_PROPS,
          prevButtonProps: DEFAULT_PREV_BTN_PROPS,
          placement: 'topLeft',
        },
        {
          title: 'Ваши области изучения',
          description: (
            <DescriptionWrapper>
              Ниже представлены все шаблоны рабочих областей, которые вы можете
              создать, чтобы начать ими пользоваться
            </DescriptionWrapper>
          ),
          target: () => null,
          nextButtonProps: DEFAULT_NEXT_BTN_PROPS,
          prevButtonProps: DEFAULT_PREV_BTN_PROPS,
          placement: 'bottomLeft',
        },
        {
          title: 'Профиль пользователя',
          description: (
            <DescriptionWrapper>
              Тут можно перейти на страницу профиля и просмотреть свои данные
            </DescriptionWrapper>
          ),
          target: () => null,
          nextButtonProps: DEFAULT_NEXT_BTN_PROPS,
          prevButtonProps: DEFAULT_PREV_BTN_PROPS,
          placement: 'bottomRight',
        },
        {
          title: 'Обучайся на SynthiLearn!',
          description: (
            <DescriptionWrapper>
              Надеюсь, наши подсказки помогли тебе ознакомиться с платформой,
              начинай обучатсья прямо сейчас
            </DescriptionWrapper>
          ),
          target: () => null,
          nextButtonProps: {
            children: 'Начать обучаться!',
              type: 'default'
          },
          prevButtonProps: DEFAULT_PREV_BTN_PROPS,
        },
      ],
      setTargetTourItem: (index, target) => {
        set(
          produce((draft: TToureState) => {
            draft.tourItems[index].target = () => target;
          }),
        );
      },
    }),
    {
      anonymousActionType: 'useTourState action',
      name: 'useTourState',
    },
  ),
);
