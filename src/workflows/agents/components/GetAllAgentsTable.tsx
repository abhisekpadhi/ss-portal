import React, {useEffect, useState} from 'react';
import {getAllAgents} from '../api';
import {IAgent} from 'models/agent';
import {notify} from '../../../common/lib/utils';
import {Box, Button} from '@mui/material';
import AgentsTable from './AgentsTable';
import {signIn} from 'next-auth/react';
import {Google} from '@mui/icons-material';
import {commonGradient} from '../../../../styles/common-styles';
import ProgressIndicator from '../../../common/components/ProgressIndicator';

function GetAllAgentsTable() {
    const [fetching, setFetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [data, setData] = useState<IAgent[]>([]);
    const limit = 50;
    const fetchData = async () => {
        offset > 0 ? setFetchingMore(true) : setFetching(true);
        try {
            const res = await getAllAgents({limit, offset});
            // console.log('all agents >>> ', res);
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
            <AgentsTable rows={data} />
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

export default GetAllAgentsTable;
