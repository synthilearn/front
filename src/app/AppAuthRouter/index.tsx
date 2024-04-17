import { Route, Routes } from 'react-router-dom';
import { privateRoutes } from 'app/AppAuthRouter/privateRoutes';
import { publicRoutes } from 'app/AppAuthRouter/publicRoutes';
import Layout from 'app/Layout';
import {useAppState} from "shared/states/useAppState";

const AppAuthRouter = () => {
  const isAuthUser = useAppState(state => state.isAuthUser)

  return (
    <Routes>
      {isAuthUser ? (
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
