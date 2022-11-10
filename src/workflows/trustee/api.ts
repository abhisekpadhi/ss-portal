import {
    IVaultAccessRequestDeleteReq,
    TrusteeVaultAccessRequestStatus,
    TTrusteeAccessRequestsDataForPortal,
} from 'models/trustee-vault-access';
import {ApiUtils, makeParams} from '../../common/lib/ApiUtils';
import {API_URL} from '../../common/lib/endpoints';
import {ApiRoutes} from 'models/api-routes';
import {IApiResponse} from 'models/common';

export const getTrusteeRequests = (payload: {
    status: string[];
    limit: number;
    offset: number;
}) => {
    return ApiUtils.makeGetRequest<{
        data: {requests: TTrusteeAccessRequestsDataForPortal[]; offset: number};
    }>(
        API_URL +
            ApiRoutes.trusteeVaultAccessRequest.root +
            ApiRoutes.trusteeVaultAccessRequest.routes.getAllForPortal +
            makeParams(payload),
    );
};

export const grantRequest = (payload: IVaultAccessRequestDeleteReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.trusteeVaultAccessRequest.root +
            ApiRoutes.trusteeVaultAccessRequest.routes.grant,
        payload,
    );
};

export const rejectRequest = (payload: IVaultAccessRequestDeleteReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.trusteeVaultAccessRequest.root +
            ApiRoutes.trusteeVaultAccessRequest.routes.reject,
        payload,
    );
};
