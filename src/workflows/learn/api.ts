import {
    IArticles,
    ICreateArticleRequest,
    IPinArticleReq,
    IUpdateArticleRequest,
} from 'models/articles';
import {ApiRoutes} from 'models/api-routes';
import {ApiUtils, makeParams} from '../../common/lib/ApiUtils';
import {API_URL} from '../../common/lib/endpoints';
import {IApiResponse} from 'models/common';

export const addArticle = (payload: ICreateArticleRequest) => {
    return ApiUtils.makePostRequestWithJsonBody<{data: {article: IArticles}}>(
        API_URL + ApiRoutes.articles.root + ApiRoutes.articles.routes.add,
        payload,
    );
};

export const removeArticle = (payload: IPinArticleReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL + ApiRoutes.articles.root + ApiRoutes.articles.routes.remove,
        payload,
    );
};

export const updateArticle = (payload: IUpdateArticleRequest) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL + ApiRoutes.articles.root + ApiRoutes.articles.routes.update,
        payload,
    );
};

export const republishArticle = (payload: IPinArticleReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL + ApiRoutes.articles.root + ApiRoutes.articles.routes.republish,
        payload,
    );
};

export const pinArticle = (payload: IPinArticleReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL + ApiRoutes.articles.root + ApiRoutes.articles.routes.pin,
        payload,
    );
};

export const unpinArticle = (payload: IPinArticleReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL + ApiRoutes.articles.root + ApiRoutes.articles.routes.unpin,
        payload,
    );
};

export const getUnpinnedArticles = (payload: {
    limit: number;
    offset: number;
}) => {
    return ApiUtils.makeGetRequest<{
        data: {articles: IArticles[]; offset: number};
    }>(
        API_URL +
            ApiRoutes.articles.root +
            ApiRoutes.articles.routes.getAll +
            makeParams(payload),
    );
};

export const getPinnedArticles = (payload: {limit: number; offset: number}) => {
    return ApiUtils.makeGetRequest<{
        data: {articles: IArticles[]; offset: number};
    }>(
        API_URL +
            ApiRoutes.articles.root +
            ApiRoutes.articles.routes.getAllPinned +
            makeParams(payload),
    );
};
