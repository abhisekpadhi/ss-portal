import store from '../store';
import {resetStore} from '../reducers/credentialsReducer';
import {signOut} from 'next-auth/react';

export async function logout() {
    await signOut({callbackUrl: '/login'});
    store.dispatch(resetStore());
    return;
}
