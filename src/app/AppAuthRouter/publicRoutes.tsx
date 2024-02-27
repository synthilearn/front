import { IRoute } from './routeType';
import { Navigate } from 'react-router-dom';
import { LoginPage } from 'pages/LoginPage/ui';
import { RegisterPage } from 'pages/RegisterPage';

export const publicRoutes: IRoute[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <Navigate to="/login" replace={true} /> },
];
