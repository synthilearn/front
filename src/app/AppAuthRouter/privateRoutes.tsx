import { IRoute } from './routeType';
import { Navigate } from 'react-router-dom';
import { MainPage } from 'pages/MainPage';
import { LearnLanguagePage } from 'pages/LearnLanguagePage';

export const privateRoutes: IRoute[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/active-area/learn-language',
    element: <LearnLanguagePage />,
  },
  { path: '*', element: <Navigate to="/" replace={true} /> },
];
