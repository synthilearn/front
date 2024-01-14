export const checkIsAuth = () => {
    return !!localStorage.getItem('accessToken')
}