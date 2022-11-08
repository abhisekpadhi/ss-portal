import React, {useEffect, useState} from 'react';
import {signIn, signOut, useSession} from 'next-auth/react';
import Container from '@mui/material/Container';
import {Paper} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {useRouter} from 'next/router';
import {Google} from '@mui/icons-material';
import {
    bgGradient,
    commonGradient,
    flexColumnCenter,
} from '../../../styles/common-styles';
import Typography from '@mui/material/Typography';
import {loginWithGoogleAuthToken} from './api';
import {addCreds} from '../../common/reducers/credentialsReducer';
import {addUserAccount} from '../../common/reducers/userAccountReducer';
import {notify} from '../../common/lib/utils';
import {useDispatch} from 'react-redux';

function LoginScreenV2() {
    const {data: session} = useSession();
    const router = useRouter();
    const [next, setNext] = useState('/login');
    useEffect(() => {
        const searchStr = window.location.search.substring(1); // ignore first ? character
        const params = new URLSearchParams(searchStr);
        if (params.has('next')) {
            console.log(`redirecting to next`);
            const nxt = params.get('next') ?? '/app';
            setNext(nxt);
        }
    }, []);
    const [processing, setProcessing] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (session !== null) {
            const token = (session?.accessToken ?? '') as string;
            console.log('loginScreen session', session);
            console.log('g token', token);
            if (token.length === 0) {
                return;
            }
            (async () => {
                try {
                    setProcessing(true);
                    const resp = await loginWithGoogleAuthToken({
                        googleAuthToken: token,
                    });
                    console.log('loginResp', resp.data);
                    if (resp.data.userAccount && resp.data.token) {
                        dispatch(
                            addCreds({
                                accessToken: resp.data.token,
                                accessTokenUpdatedAtMs: Date.now(),
                                refreshToken: '',
                                refreshTokenUpdatedAtMs: 0,
                            }),
                        );
                        dispatch(addUserAccount(resp.data.userAccount));
                        notify({
                            message: '✅ Logged in',
                            severity: 'success',
                        });
                    }
                    setProcessing(false);
                } catch (e) {
                    notify({
                        message: 'Failed to login',
                        severity: 'error',
                    });
                    setProcessing(false);
                }
            })();
        }
    }, [session]);
    const getContent = () => {
        if (session) {
            return (
                <>
                    ✅ Signed in as {session?.user?.email} <br />
                    <br />
                    <Button
                        variant={'contained'}
                        color={'success'}
                        onClick={() => {
                            router.push('/app').then(_ => {});
                        }}
                        size={'large'}
                        sx={{color: 'white', my: 1}}>
                        Go to dashboard
                    </Button>
                    <Button
                        variant={'outlined'}
                        color={'error'}
                        onClick={() => signOut({callbackUrl: '/login'})}
                        size={'large'}
                        sx={{my: 1}}>
                        Sign out
                    </Button>
                </>
            );
        }
        return (
            <>
                <Button
                    size={'large'}
                    variant={'contained'}
                    color={'primary'}
                    onClick={() => signIn('google', {callbackUrl: next})}
                    startIcon={<Google />}
                    sx={{
                        backgroundImage: commonGradient,
                    }}>
                    Continue with Google
                </Button>
            </>
        );
    };
    return (
        <Box sx={{...bgGradient}}>
            <Container sx={{...flexColumnCenter, height: '100vh'}}>
                <Paper
                    className={'loginPaper'}
                    sx={{
                        p: 4,
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                    elevation={6}>
                    <Typography
                        sx={{mb: 4, fontSize: '2rem', fontWeight: 'bold'}}>
                        SureSampatti Portal
                    </Typography>
                    {getContent()}
                </Paper>
            </Container>
        </Box>
    );
}

export default LoginScreenV2;
