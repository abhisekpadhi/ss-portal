import {IUserAccount} from 'models/user';

// state type
export type IUserAccountState = Omit<
    IUserAccount,
    'id' | 'createdAt' | 'currentActive'
>;

// initial state
const initialState: IUserAccountState = {
    userId: '',
    fullName: '',
    email: '',
    phone: '',
};

// action types
export const ADD_USER_ACCOUNT = 'ADD_USER_ACCOUNT';

// actions
export const addUserAccount = (userAccount: Partial<IUserAccountState>) => ({
    type: ADD_USER_ACCOUNT,
    data: userAccount,
});

// reducer
const userAccountReducer = (
    state = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_USER_ACCOUNT:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default userAccountReducer;
