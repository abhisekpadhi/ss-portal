import {HomeScreenData} from 'models/home';

const initialState: HomeScreenData = {
    profileCompletePercent: 0,
    docsUploadedCount: 0,
    subscriptionActive: false,
    nominatedByList: [],
    recentArticles: [],
    expressions: [],
    agents: [],
};

export const ADD_HOME_DATA = 'ADD_HOME_DATA';

export const addHomeData = (data: Partial<HomeScreenData>) => ({
    type: ADD_HOME_DATA,
    data,
});

const userAccountReducer = (
    state = initialState,
    action: any,
) => {
    switch (action.type) {
        case ADD_HOME_DATA:
            return {
                ...(state !== null ? state : {}),
                ...action.data,
            };
        default:
            return state;
    }
};

export default userAccountReducer;
