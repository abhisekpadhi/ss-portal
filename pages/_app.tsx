import * as React from 'react';
import {useEffect, useState} from 'react';
import type {AppProps} from 'next/app';
import {CacheProvider, EmotionCache} from '@emotion/react';
import {
    Alert,
    AlertColor,
    createTheme,
    CssBaseline,
    Snackbar,
    ThemeProvider,
} from '@mui/material';
import createEmotionCache from '../src/common/lib/createEmotionCache';
import lightThemeOptions from '../styles/theme/lightThemeOptions';
import '../styles/globals.css';
import Layout from '../src/common/components/Layout';
import {SessionProvider} from 'next-auth/react';
import LoadingIndicator from '../src/common/components/LoadingIndicator';
import {useRouter} from 'next/router';
import {persistStore} from 'redux-persist';
import configurePersistedStore from '../src/common/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {SnackObservable, TSnackPayload} from '../src/common/observables';
import {createWrapper} from 'next-redux-wrapper';

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const lightTheme = createTheme(lightThemeOptions);

export const store = configurePersistedStore;
export const persistedStore = persistStore(store);
export const wrapper = createWrapper(() => store);

const MyApp: React.FunctionComponent<MyAppProps> = (props: any) => {
    const {
        session,
        Component,
        emotionCache = clientSideEmotionCache,
        pageProps,
    } = props;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // show loading spinner on route change
    useEffect(() => {
        const handleStart = (_: string) => {
            setLoading(true);
        };
        const handleStop = () => {
            setLoading(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);
    const [snack, setSnack] = useState<TSnackPayload | null>(null);
    useEffect(() => {
        SnackObservable.subscribe({
            next: (value: TSnackPayload) => {
                setSnack(value);
            },
        });
    }, []);

    const handleClose = () => setSnack(null);
    return (
        <Provider store={store}>
            <PersistGate persistor={persistedStore} loading={null}>
                <SessionProvider session={session}>
                    <CacheProvider value={emotionCache}>
                        <ThemeProvider theme={lightTheme}>
                            <CssBaseline />
                            <Layout>
                                <>
                                    <Component {...pageProps} />
                                    {snack && (
                                        <Snackbar
                                            open={snack.message.length > 0}
                                            autoHideDuration={3000}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'center',
                                            }}>
                                            <Alert severity={snack.severity}>
                                                {snack.message}
                                            </Alert>
                                        </Snackbar>
                                    )}
                                </>
                            </Layout>
                            {loading && <LoadingIndicator />}
                        </ThemeProvider>
                    </CacheProvider>
                </SessionProvider>
            </PersistGate>
        </Provider>
    );
};

export default wrapper.withRedux(MyApp);
