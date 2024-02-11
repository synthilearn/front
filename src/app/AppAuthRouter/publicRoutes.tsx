import { IRoute } from './routeType';
import { Navigate } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/ui';
import { MainPage } from 'pages/MainPage/ui';
import Layout from 'app/Layout';
import { LearnLanguagePage } from 'pages/LearnLanguagePage';
import { RegisterPage } from 'pages/RegisterPage';

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
  {
    path: '/active-area/learn-language',
    element: (
      <Layout>
        <LearnLanguagePage />
      </Layout>
    ),
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <Navigate to="/" replace={true} /> },
];
