import {ApiUtils, makeParams} from '../../common/lib/ApiUtils';
import {IAddAgentRequest, IAgent, IAgentRemoveRequest} from 'models/agent';
import {API_URL} from '../../common/lib/endpoints';
import {ApiRoutes} from 'models/api-routes';
import {IApiResponse} from 'models/common';

const API_BASE = API_URL + ApiRoutes.agents.root;

export const getAgent = (payload: {phone: string}) => {
    return ApiUtils.makeGetRequest<{
        data: {agent: IAgent | null};
        errors: null;
    }>(API_BASE + ApiRoutes.agents.routes.getAgent + makeParams(payload));
};

export const addAgent = (payload: IAddAgentRequest) => {
    return ApiUtils.makePostRequestWithJsonBody<{data: {agent: IAgent}}>(
        API_BASE + ApiRoutes.agents.routes.addAgent,
        payload,
    );
};

export const removeAgent = (payload: IAgentRemoveRequest) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_BASE + ApiRoutes.agents.routes.removeAgent,
        payload,
    );
};

export const getAllAgents = (payload: {limit: number; offset: number}) => {
    return ApiUtils.makeGetRequest<{data: IAgent[]}>(
        API_BASE + ApiRoutes.agents.routes.getAllAgents + makeParams(payload),
    );
};
