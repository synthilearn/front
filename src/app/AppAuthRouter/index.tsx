import { Route, Router, Routes } from 'react-router-dom';
import { privateRoutes } from 'app/AppAuthRouter/privateRoutes';
import { publicRoutes } from 'app/AppAuthRouter/publicRoutes';
import Layout from 'app/Layout';
import { useAppState } from 'shared/states/useAppState';
import { LearnLanguagePage } from 'pages/LearnLanguagePage';
import { DictionaryWidget } from 'widgets/DictionaryWidget';
import { GameWidget } from 'widgets/GameWidget';

const AppAuthRouter = () => {
  const isAuthUser = useAppState(state => state.isAuthUser);

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
          <Route
            path="/active-area/learn-language"
            element={
              <Layout>
                <LearnLanguagePage />
              </Layout>
            }
          >
            <Route path={'dictionary'} element={<DictionaryWidget />} />
            <Route path={'game'} element={<GameWidget />} />
          </Route>
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
