import {ApiUtils, makeParams} from '../../common/lib/ApiUtils';
import {API_URL} from '../../common/lib/endpoints';
import {ApiRoutes} from 'models/api-routes';
import {IUserAccount} from 'models/user';

const API_BASE = API_URL + ApiRoutes.portal.root;

export const getAllUsers = (payload: {limit: number; offset: number}) => {
    return ApiUtils.makeGetRequest<{data: IUserAccount[]}>(
        API_BASE + ApiRoutes.portal.routes.getAllUsers + makeParams(payload),
    );
};
