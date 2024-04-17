import { PageNotAuth } from 'pages/MainPage/ui/PageNotAuth';
import { checkIsAuth } from 'shared/helpers/checkIsAuth';
import PageAuth from 'pages/MainPage/ui/PageAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const MainPage = () => {
  const navigate = useNavigate();
  // useEffect(() => {
  //   const queryString = window.location.search;
  //   const urlParams = new URLSearchParams(queryString);
  //
  //   if (queryString) {
  //     for (const [key, value] of urlParams) {
  //       if (key === 'access_token') {
  //         localStorage.setItem('accessToken', value);
  //       }
  //       if (key === 'refresh_token') {
  //         localStorage.setItem('refreshToken', value);
  //       }
  //     }
  //
  //     navigate('/');
  //   }
  // }, []); // для входа через github

  return <>{checkIsAuth() ? <PageAuth /> : <PageNotAuth />}</>;
};
