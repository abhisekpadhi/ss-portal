import {TSummaryResponseUnit} from 'models/vault';

export type TSummaryState = {
    summary: TSummaryResponseUnit[];
};

const init: TSummaryState = {
    summary: [],
};

export const ADD_SUMMARY = 'ADD_SUMMARY';

export const addSummary = (data: TSummaryState) => ({
    type: ADD_SUMMARY,
    data,
});

const downloadedFilesReducer = (
    state = init,
    action: {type: string; data: TSummaryState},
) => {
    switch (action.type) {
        case ADD_SUMMARY:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default downloadedFilesReducer;
