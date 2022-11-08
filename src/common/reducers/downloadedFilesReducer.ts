export type TDownloadedFiles = {
    [docId: string]: string; // Ex: file:///data/user/0/com.suresampatti/files/download/IMG_20220915_124505.jpg
};

const init: TDownloadedFiles = {};

export const ADD_DOWNLOADED_FILE = 'ADD_DOWNLOADED_FILE';

export const addDownloadedFile = (data: TDownloadedFiles) => ({
    type: ADD_DOWNLOADED_FILE,
    data,
});

const downloadedFilesReducer = (
    state = init,
    action: {type: string; data: TDownloadedFiles},
) => {
    switch (action.type) {
        case ADD_DOWNLOADED_FILE:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default downloadedFilesReducer;
