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
            colorBgContainer: '#b8b8b8',
            // colorTextPlaceholder: '#8c8c8c',
            fontSize: 16,
          },
          components: {
            Input: {
              // colorText: COLOR_SECONDARY,
              fontSize: 18,
              controlHeight: 40,
            },
            DatePicker: {
              controlHeight: 40,
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
