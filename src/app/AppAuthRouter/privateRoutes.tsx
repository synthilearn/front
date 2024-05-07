import { IRoute } from './routeType';
import { Navigate } from 'react-router-dom';
import { MainPage } from 'pages/MainPage';
import { LearnLanguagePage } from 'pages/LearnLanguagePage';
import { ProfilePage } from 'pages/ProfilePage';

export const privateRoutes: IRoute[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/profile',
    element: <ProfilePage />,
  },
  { path: '*', element: <Navigate to="/" replace={true} /> },
];
