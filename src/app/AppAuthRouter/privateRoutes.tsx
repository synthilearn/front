import { IRoute } from './routeType';
import { Navigate } from 'react-router-dom';
import { MainPage } from 'pages/MainPage';

export const privateRoutes: IRoute[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  { path: '*', element: <Navigate to="/" replace={true} /> },
];
