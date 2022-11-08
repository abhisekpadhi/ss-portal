//initial state
import {ITaxonomyCache} from 'models/vault';

export type TTaxonomyState = {
    data: ITaxonomyCache | null;
    updatedAt: number;
};

const initialState: TTaxonomyState = {
    data: null,
    updatedAt: 0,
};

// Credentials
export const ADD_TAXONOMY = 'ADD_TAXONOMY';

export const addTaxonomy = (data: ITaxonomyCache) => ({
    type: ADD_TAXONOMY,
    data,
});

const credentialsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case ADD_TAXONOMY:
            return {
                ...state,
                data: action.data,
                updatedAt: Date.now(),
            };
        default:
            return state;
    }
};

export default credentialsReducer;
