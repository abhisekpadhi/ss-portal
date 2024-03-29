import {ApiUtils, makeParams} from '../../common/lib/ApiUtils';
import {API_URL} from '../../common/lib/endpoints';
import {ApiRoutes} from 'models/api-routes';
import {
    IDocUpload,
    IInputTypeAddReq,
    IInputTypeRemoveReq,
    IInputTypeUpdateReq,
    ITaxonomyCache,
    IVaultCategoryAddReq,
    IVaultCategoryRemoveReq,
    IVaultCategoryUpdateReq,
    IVaultDataInputType,
    IVaultSubCategoryAddReq,
    IVaultSubCategoryRemoveReq,
    IVaultSubCategoryUpdateReq,
    IVaultVaultTaxonomyNameUpdateReq,
    THistory,
    TUrlsOfUpload,
    TVaultDataResponse,
} from 'models/vault';
import {IApiResponse} from 'models/common';

export const getTaxonomy = () => {
    return ApiUtils.makeGetRequest<{data: ITaxonomyCache}>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.getAll,
    );
};

export const addCategory = (payload: IVaultCategoryAddReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.addCategory,
        payload,
    );
};

export const updateCategory = (payload: IVaultCategoryUpdateReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.updateCategory,
        payload,
    );
};

export const removeCategory = (payload: IVaultCategoryRemoveReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.removeCategory,
        payload,
    );
};

export const addSubCategory = (payload: IVaultSubCategoryAddReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.addSubcategory,
        payload,
    );
};

export const updateSubCategory = (payload: IVaultSubCategoryUpdateReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.updateSubcategory,
        payload,
    );
};

export const removeSubCategory = (payload: IVaultSubCategoryRemoveReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.removeSubCategory,
        payload,
    );
};

export const getInputs = (payload: {
    categoryId: string;
    subCategoryId: string;
}) => {
    return ApiUtils.makeGetRequest<{data: IVaultDataInputType[]}>(
        API_URL +
            ApiRoutes.vaultDataInputs.root +
            ApiRoutes.vaultDataInputs.routes.get +
            makeParams(payload),
    );
};

export const addInput = (payload: IInputTypeAddReq) => {
    return ApiUtils.makePostRequestWithJsonBody<{
        data: {inputType: IVaultDataInputType};
    }>(
        API_URL +
            ApiRoutes.vaultDataInputs.root +
            ApiRoutes.vaultDataInputs.routes.add,
        payload,
    );
};

export const updateInput = (payload: IInputTypeUpdateReq) => {
    return ApiUtils.makePostRequestWithJsonBody<{
        data: {inputType: IVaultDataInputType};
    }>(
        API_URL +
            ApiRoutes.vaultDataInputs.root +
            ApiRoutes.vaultDataInputs.routes.update,
        payload,
    );
};

export const removeInput = (payload: IInputTypeRemoveReq) => {
    return ApiUtils.makePostRequestWithJsonBody<IApiResponse>(
        API_URL +
            ApiRoutes.vaultDataInputs.root +
            ApiRoutes.vaultDataInputs.routes.remove,
        payload,
    );
};

export const getDataOfUser = (payload: {
    userPhone: string;
    limit: number;
    offset: number;
}) => {
    return ApiUtils.makeGetRequest<{
        data: TVaultDataResponse;
    }>(
        API_URL +
            ApiRoutes.vaultData.root +
            ApiRoutes.vaultData.routes.getAllDataOfUser +
            makeParams(payload),
    );
};

export const updateTaxonomyName = (
    payload: IVaultVaultTaxonomyNameUpdateReq,
) => {
    return ApiUtils.makePostRequestWithJsonBody<{data: string}>(
        API_URL +
            ApiRoutes.vaultTaxonomy.root +
            ApiRoutes.vaultTaxonomy.routes.updateName,
        payload,
    );
};
