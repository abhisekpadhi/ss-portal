import {
    TrusteeVaultAccessRequestStatus,
    TTrusteeAccessRequestsDataForPortal,
} from 'models/trustee-vault-access';
import {ApiUtils, makeParams} from '../../common/lib/ApiUtils';
import {API_URL} from '../../common/lib/endpoints';
import {ApiRoutes} from 'models/api-routes';

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
