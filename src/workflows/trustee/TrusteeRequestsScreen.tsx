import React, {useEffect, useState} from 'react';
import Container from '@mui/material/Container';
import {getTrusteeRequests} from './api';
import {notify} from '../../common/lib/utils';
import {TTrusteeAccessRequestsDataForPortal} from 'models/trustee-vault-access';
import TrusteeRequestsTable from './components/TrusteeRequestsTable';
import Box from '@mui/material/Box';
import CustomButton from '../../common/components/CustomButton';
import CustomDialog from '../../common/components/CustomDialog';
import {Button, IconButton, TextField} from '@mui/material';
import CustomTextField from '../../common/components/CustomTextField';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SendIcon from '@mui/icons-material/Send';

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
                severity: 'warn',
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
    const [open, setOpen] = useState(false);
    const [commentText, setCommentText] = useState('');

    const getDialogContent = () => {
        return (
            <Box>
                <Box mt={2}>
                    <CustomButton
                        label={'Approve request'}
                        progress={false}
                        onClick={() => {}}
                    />
                </Box>
                <Box mt={2}>
                    <Box sx={{fontSize: 18, fontWeight: 800}}>Comments</Box>
                    <ul>
                        <li>Added some random comment</li>
                        <li>Added some random comment</li>
                    </ul>
                    <Box mt={2} mb={1}>
                        Add a comment
                    </Box>
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems={'center'}
                        flex={1}>
                        <Box display={'flex'} flex={8}>
                            <CustomTextField
                                id={'commentInput'}
                                label={'Comment'}
                                value={commentText}
                                onChange={text => {
                                    setCommentText(
                                        text.replace(/[^0-9.]/g, ''),
                                    );
                                }}
                                style={{
                                    width: '100%',
                                }}
                            />
                        </Box>
                        <Box display={'flex'} flex={2} ml={2}>
                            <IconButton
                                onClick={() => {}}
                                aria-label="add comment"
                                size="small">
                                <SendIcon fontSize="large" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    };
    return (
        <Container>
            <Box>
                <TrusteeRequestsTable
                    rows={data}
                    onPressAction={() => setOpen(true)}
                />
            </Box>
            <Box mt={3} textAlign={'center'}>
                <CustomButton
                    label={'Load more'}
                    progress={offset === 0 ? fetching : fetchingMore}
                    onClick={fetchData}
                />
            </Box>
            <Box>
                <CustomDialog
                    open={open}
                    setOpen={setOpen}
                    title={'Request comments'}
                    dialogContent={getDialogContent()}
                />
            </Box>
        </Container>
    );
}

export default TrusteeRequestsScreen;
