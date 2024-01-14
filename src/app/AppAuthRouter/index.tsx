import {Route, Routes} from 'react-router-dom';
import {privateRoutes} from 'app/AppAuthRouter/privateRoutes';
import {publicRoutes} from 'app/AppAuthRouter/publicRoutes';

//см. реализацию в хакатон/проект

const AppAuthRouter = () => {
  const isLogged = !!localStorage.getItem('accessToken');
  // const role: TIRole = localStorage.getItem('role') as TIRole;

  // const roleAccessRoutes = role === 'ROLE_CLIENT'
  //       ? ClientRoutes
  //       : ManagerRoutes

  const routesForAuthUser = [...privateRoutes];

  return (
    <Routes>
      {isLogged ? (
        <>
          {routesForAuthUser.map(route => (
            <Route {...route} key={route.path} />
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
