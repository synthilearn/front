import React from 'react';
import './styles/index.scss';
import Layout from 'app/Layout';
import { useAppState } from 'shared/states/useAppState';
import { Spin } from 'antd';

const App = () => {
  const isLoading = useAppState(state => state.isLoading);
  return (
    <div className="app">
      <Layout />
      {isLoading && <Spin fullscreen />}
    </div>
  );
};

export default App;
