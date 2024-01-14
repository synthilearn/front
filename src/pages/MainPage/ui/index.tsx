import {PageNotAuth} from "pages/MainPage/ui/PageNotAuth";
import {checkIsAuth} from "shared/helpers/checkIsAuth";
import PageAuth from "pages/MainPage/ui/PageAuth";


export const MainPage = () => {
    return (
        <>
            {checkIsAuth() ?
                <PageAuth/>
                :
                <PageNotAuth/>
            }
        </>
    )
}

