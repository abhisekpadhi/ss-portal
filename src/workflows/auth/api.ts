import {ApiUtils} from '../../common/lib/ApiUtils';
import {ILoginResponse, TAdminLoginReq} from 'models/login';
import {ApiRoutes} from 'models/api-routes';
import {API_URL} from '../../common/lib/endpoints';

const API_BASE = API_URL + ApiRoutes.auth.root;

export const loginWithGoogleAuthToken = (payload: TAdminLoginReq) => {
    return ApiUtils.makePostRequestWithJsonBodyUnsafe<{
        data: ILoginResponse;
        errors: null;
    }>(API_BASE + ApiRoutes.auth.routes.adminLogin, payload);
};
