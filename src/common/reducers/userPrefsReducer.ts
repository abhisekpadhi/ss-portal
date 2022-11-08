export interface IUserPref {
    prefKey: string;
    prefData: string;
    userId: string;
};
export interface IUserPrefsState {
    prefs: IUserPref[];
}

//initial state
const initialState: IUserPrefsState = {
    prefs: [],
};

export const ADD_USER_PREFS = 'ADD_USER_PREFS';
export const addUserPrefs = (data: IUserPrefsState) => ({
    type: ADD_USER_PREFS,
    data,
});

const userPrefsReducer = (
    state = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_USER_PREFS:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default userPrefsReducer;
