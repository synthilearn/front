import React from 'react';
import './styles/index.scss';
import { useAppState } from 'shared/states/useAppState';
import { ConfigProvider, Spin } from 'antd';
import AppAuthRouter from 'app/AppAuthRouter';
import {
  COLOR_PRIMARY,
  COLOR_SECONDARY,
  COLOR_TEXT,
  COLOR_TEXT_DISABLED,
} from 'shared/const';

const App = () => {
  const isLoading = useAppState(state => state.isLoading);
  return (
    <div className="app">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: COLOR_SECONDARY,
            colorBorder: '#163E6C',
            colorText: COLOR_TEXT,
            colorBgContainer: 'rgba(0,0,0, 0.1)',
            colorBgElevated: '#3E5F8A',
            fontSize: 16,
            controlHeight: 40,
            colorTextDisabled: '#c9c9c9',
            colorBgContainerDisabled: 'rgba(0,0,0, 0.4)',
          },
          components: {
            Input: {
              fontSize: 18,
            },
            Menu: {
              itemSelectedBg: COLOR_SECONDARY,
              itemSelectedColor: COLOR_TEXT,
              dangerItemColor: COLOR_TEXT,
              dangerItemHoverColor: COLOR_TEXT,
              itemDisabledColor: COLOR_TEXT_DISABLED,
            },
            Steps: {
              colorPrimary: COLOR_PRIMARY,
            },
          },
        }}
      >
        <AppAuthRouter />
      </ConfigProvider>
      {isLoading && <Spin fullscreen />}
    </div>
  );
};

export default App;
