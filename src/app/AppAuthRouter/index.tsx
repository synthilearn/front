import { Route, Routes } from 'react-router-dom';
import { privateRoutes } from 'app/AppAuthRouter/privateRoutes';
import { publicRoutes } from 'app/AppAuthRouter/publicRoutes';
import Layout from 'app/Layout';

const AppAuthRouter = () => {
  const isLogged = !!localStorage.getItem('accessToken');

  return (
    <Routes>
      {isLogged ? (
        <>
          {privateRoutes.map(({ path, element }) => (
            <Route
              element={<Layout>{element}</Layout>}
              path={path}
              key={path}
            />
          ))}
        </>
      ) : (
        <>
          {publicRoutes.map(route => (
            <Route {...route} key={route.path} />
          ))}
        </>
      )}
    </Routes>
  );
};

export default AppAuthRouter;
