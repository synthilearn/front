import { IRoute } from './routeType';
import { Navigate } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/ui';
import { MainPage } from 'pages/MainPage/ui';
import Layout from 'app/Layout';

export const publicRoutes: IRoute[] = [
  // Layout потом использовать только для privateRoutes
  {
    path: '/',
    element: (
      <Layout>
        <MainPage />
      </Layout>
    ),
  },
  { path: '/login', element: <LoginPage /> },
  { path: '*', element: <Navigate to="/" replace={true} /> },
];
