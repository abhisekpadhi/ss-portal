export const RestApiRoutes = {
    login: '/login',
    loginWithToken: '/login/token',
}

export const UnAuthenticatedRoutes = [
    RestApiRoutes.login,
    RestApiRoutes.loginWithToken
]
