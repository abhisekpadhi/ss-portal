/**
 * when you use the emulator, localhost (127.0.0.1) refers to the device's own loopback service,
 * not the one on your machine as you may expect.
 * You can use 10.0.2.2 to access my actual machine, it is an alias set up to help in development.
 * The constant __DEV__ is set automatically.
 * Building the bundle via --dev=false should unset __DEV__.
 */

export const __DEV__ = process.env.NODE_ENV !== 'production';

interface isvc {
    [k: string]: {
        [k: string]: string;
    };
}

const apiUrls = {
    // dev: {
    //     API_URL: 'http://10.0.2.2:5000', // For emulator
    // },
    dev: {
        API_URL: 'http://localhost:3000', // Use IP - when running on real device
    },
    prod: {
        API_URL: 'https://api.suresampatti.com',
    },
};

const getApiUrls = (key: string) => {
    if (__DEV__) {
        return (apiUrls as isvc).dev[key];
    } else {
        return (apiUrls as isvc).prod[key];
    }
};

export const API_URL = getApiUrls('API_URL');
