import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import {getTrusteeRequests, grantRequest, rejectRequest} from './api';
import {notify} from '../../common/lib/utils';
import {TTrusteeAccessRequestsDataForPortal} from 'models/trustee-vault-access';
import TrusteeRequestsTable from './components/TrusteeRequestsTable';
import Box from '@mui/material/Box';
import CustomButton from '../../common/components/CustomButton';
import CustomDialog from '../../common/components/CustomDialog';
import {BeatLoader} from 'react-spinners';
import {COLORS} from '../../constants';

function TrusteeRequestsScreen() {
    const [fetching, setFetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [data, setData] = useState<TTrusteeAccessRequestsDataForPortal[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const fetchData = async () => {
        if (!hasMore) {
            notify({
                message: "That's all, no more data.",
                severity: 'warning',
            });
            return;
        }
        const limit = 100;
        try {
            offset === 0 ? setFetching(true) : setFetchingMore(true);
            const res = await getTrusteeRequests({
                status: ['REQUESTED', 'CANCELLED', 'REJECTED', 'GRANTED'],
                limit,
                offset,
            });
            console.log('res', res);
            if (res.data.requests !== null) {
                setData(res.data.requests);
                setOffset(res.data.offset);
                setHasMore(res.data.requests.length === limit);
            } else {
                notify({
                    message: 'Failed to fetch data',
                    severity: 'error',
                });
            }
            offset === 0 ? setFetching(false) : setFetchingMore(false);
        } catch (e) {
            notify({
                message: 'Failed to fetch data',
                severity: 'error',
            });
            offset === 0 ? setFetching(false) : setFetchingMore(false);
            console.debug(e);
        }
    };
    useEffect(() => {
        fetchData().then(_ => {});
    }, []);
    const [requestId, setRequestId] = useState('');
    const [open, setOpen] = useState(false);
    const [grant, setGrant] = useState(false);
    const [reject, setReject] = useState(false);
    const [progress, setProgress] = useState(false);
    const handleGrant = async () => {
        setProgress(true);
        try {
            const res = await grantRequest({requestId});
            if (res.data.message === 'ok') {
                notify({
                    message: 'Granted access',
                    severity: 'success',
                });
            } else {
                notify({
                    message: 'Failed to grant access. Error' + res.data.message,
                    severity: 'error',
                });
            }
            setRequestId('');
            setOpen(false);
            setGrant(false);
            await fetchData();
        } catch (e) {
            console.debug('error', e);
            notify({
                message: 'Failed to grant access, server error',
                severity: 'error',
            });
        }
    };
    const handleReject = async () => {
        setProgress(true);
        try {
            const res = await rejectRequest({requestId});
            if (res.data.message === 'ok') {
                notify({
                    message: 'Rejected access',
                    severity: 'success',
                });
            } else {
                notify({
                    message:
                        'Failed to reject access. Error' + res.data.message,
                    severity: 'error',
                });
            }
            setRequestId('');
            setOpen(false);
            setReject(false);
            await fetchData();
        } catch (e) {
            console.debug('error', e);
            notify({
                message: 'Failed to reject access, server error',
                severity: 'error',
            });
        }
    };
    useEffect(() => {
        if (requestId.length > 0) {
            setOpen(true);
        }
    }, [requestId]);
    useEffect(() => {
        if (grant && requestId.length > 0) {
            handleGrant().then(_ => {});
        }
    }, [requestId, grant]);
    useEffect(() => {
        if (reject && requestId.length > 0) {
            handleReject().then(_ => {});
        }
    }, [requestId, reject]);
    const getDialogContent = () => {
        return (
            <Box>
                {progress ? (
                    <BeatLoader size={12} color={COLORS.theme} />
                ) : (
                    <Box>
                        <Box mt={2}>
                            <CustomButton
                                label={'Approve request'}
                                progress={false}
                                onClick={() => {
                                    setGrant(true);
                                }}
                            />
                        </Box>
                        <Box mt={2}>
                            <CustomButton
                                label={'Reject request'}
                                progress={false}
                                onClick={() => {
                                    setReject(true);
                                }}
                                color={'secondary'}
                            />
                        </Box>
                    </Box>
                )}
            </Box>
        );
    };
    return (
        <Container>
            <Box>
                <TrusteeRequestsTable
                    rows={data}
                    onPressAction={(requestId: string) =>
                        setRequestId(requestId)
                    }
                />
            </Box>
            <Box mt={3} textAlign={'center'}>
                <CustomButton
                    disabled={!hasMore}
                    label={'Load more'}
                    progress={offset === 0 ? fetching : fetchingMore}
                    onClick={() => {
                        fetchData().then(_ => {});
                    }}
                />
            </Box>
            <Box>
                <CustomDialog
                    open={open}
                    setOpen={setOpen}
                    title={'Request actions'}
                    dialogContent={getDialogContent()}
                    onClose={() => {
                        setRequestId('');
                    }}
                />
            </Box>
        </Container>
    );
}

export default TrusteeRequestsScreen;
