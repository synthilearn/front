import React from 'react';
import './styles/index.scss';
import { useAppState } from 'shared/states/useAppState';
import { ConfigProvider, Spin } from 'antd';
import AppAuthRouter from 'app/AppAuthRouter';

const App = () => {
  const isLoading = useAppState(state => state.isLoading);
  return (
    <div className="app">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#D20A11',
            colorBorder: '#163E6C',
            colorText: '#163E6C',
          },
          components: {
            Input: {
              controlHeightSM: 300,
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
