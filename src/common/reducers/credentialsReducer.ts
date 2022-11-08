export interface ICredentialsState {
    accessToken: string;
    refreshToken: string;
    accessTokenUpdatedAtMs: number;
    refreshTokenUpdatedAtMs: number;
}

//initial state
const initialState = {
    accessToken: '',
    refreshToken: '',
    accessTokenUpdatedAtMs: 0, //epoch timestamp
    refreshTokenUpdatedAtMs: 0,
};

// Reset store (at logout)
export const RESET = 'RESET';

// Credentials
export const ADD_CREDS = 'ADD_CREDS';
export const REMOVE_CREDS = 'REMOVE_CREDS';

export const addCreds = (creds: ICredentialsState) => ({
    type: ADD_CREDS,
    data: creds,
});

export const removeCreds = () => ({
    type: REMOVE_CREDS,
});

export const resetStore = () => ({
    type: RESET,
});

const credentialsReducer = (
    state: ICredentialsState = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_CREDS:
            return {
                ...state,
                ...action.data,
            };
        case REMOVE_CREDS:
            return initialState;
        default:
            return state;
    }
};

export default credentialsReducer;
