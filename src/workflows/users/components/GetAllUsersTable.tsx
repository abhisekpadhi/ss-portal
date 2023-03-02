import React, {useEffect, useState} from 'react';
import {getAllUsers} from '../api';
import {notify} from '../../../common/lib/utils';
import {Box, Button} from '@mui/material';
import UserAccountsTable from './UserAccountsTable';
import {IUserAccount} from 'models/user';
import ProgressIndicator from '../../../common/components/ProgressIndicator';

function GetAllUsersTable() {
    const [fetching, setFetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState<IUserAccount[]>([]);
    const limit = 50;
    const fetchData = async () => {
        offset > 0 ? setFetchingMore(true) : setFetching(true);
        try {
            const res = await getAllUsers({limit, offset});
            offset > 0 ? setFetchingMore(false) : setFetching(false);
            if (res.data) {
                setData(res.data);
                if (res.data.length === limit) {
                    setOffset(prev => prev + limit);
                }
                setHasMore(res.data.length === limit);
            } else {
                notify({
                    message: 'Failed to fetch data, response - ' + res,
                    severity: 'warning',
                });
            }
        } catch (e) {
            offset > 0 ? setFetchingMore(false) : setFetching(false);
            console.error(e);
            notify({
                message: 'Failed to fetch data',
                severity: 'error',
            });
        }
    };
    useEffect(() => {
        fetchData().then(_ => {});
    }, []);
    if (fetching) {
        return (
            <Box>
                <ProgressIndicator />
            </Box>
        );
    }
    return (
        <Box>
            <UserAccountsTable rows={data} />
            {fetchingMore ? (
                <ProgressIndicator />
            ) : hasMore ? (
                <Box marginY={2}>
                    <Button
                        size={'large'}
                        variant={'contained'}
                        color={'primary'}
                        onClick={fetchData}>
                        Load more
                    </Button>
                </Box>
            ) : (
                <></>
            )}
        </Box>
    );
}

export default GetAllUsersTable;
