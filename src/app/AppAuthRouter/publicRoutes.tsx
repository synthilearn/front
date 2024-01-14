import {IRoute} from "./routeType";
import {Navigate} from "react-router-dom";
import {LoginPage} from "pages/LoginPage/ui";
import {MainPage} from "pages/MainPage/ui";

export const publicRoutes: IRoute[] = [
    {path: "/", element: <MainPage/>},
    {path: "/login", element: <LoginPage/>},
    {path: "*", element: <Navigate to="/" replace={true}/>},
];