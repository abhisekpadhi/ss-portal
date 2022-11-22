import React, {useState} from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import CustomTextField from '../../../common/components/CustomTextField';
import {
    IDocUpload,
    THistory,
    TUrlsOfUpload,
    TVaultDataResponse,
} from 'models/vault';
import {getDataOfUser} from '../api';
import {notify} from '../../../common/lib/utils';
import ProgressIndicator from '../../../common/components/ProgressIndicator';
import {TableBar} from '@mui/icons-material';

const fetchLimit = 100;

function Data() {
    const [phone, setPhone] = useState('');
    const [data, setData] = useState<{
        history: THistory;
        urlsOfUploads: TUrlsOfUpload;
        docIdToDocMap: {[docId: string]: IDocUpload};
    } | null>(null);

    const [fetching, setFetching] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = async () => {
        setPhone('');
        offset > 0 ? setFetchingMore(true) : setFetching(true);
        try {
            const res = await getDataOfUser({
                userPhone: phone,
                limit: fetchLimit,
                offset,
            });
            console.log('res', res);
            if (res.data !== null) {
                setData(prev => ({
                    ...prev,
                    history: {
                        ...prev?.history,
                        ...res.data.history,
                    },
                    urlsOfUploads: {
                        ...prev?.urlsOfUploads,
                        ...res.data.urlsOfUploads,
                    },
                    docIdToDocMap: {
                        ...prev?.docIdToDocMap,
                        ...res.data.docIdToDocMap,
                    },
                }));
            }
            if (Object.keys(res.data.history).length === fetchLimit) {
                setOffset(res.data.offset);
                setHasMore(true);
            } else {
                setHasMore(false);
            }
            offset > 0 ? setFetchingMore(false) : setFetching(false);
        } catch (e) {
            console.debug('err', e);
            notify({
                message: 'Failed to fetch data',
                severity: 'error',
            });
            offset > 0 ? setFetchingMore(false) : setFetching(false);
        }
    };

    return (
        <Box>
            <Box display={'flex'} alignItems={'center'}>
                <CustomTextField
                    label={'User phone no.'}
                    id={'userId'}
                    value={phone}
                    onChange={setPhone}
                    inputProps={{
                        maxLength: 10,
                    }}
                />
                <Button
                    disabled={phone.length !== 10 || fetching}
                    variant={'outlined'}
                    onClick={fetchData}
                    sx={{marginLeft: 1.4}}>
                    {fetching ? <ProgressIndicator /> : 'Fetch data'}
                </Button>
            </Box>
            <Box>
                {/*for each vault data id*/}
                {data !== null &&
                    Object.keys(data.history).map((vaultDataId, idx) => (
                        <Box
                            key={vaultDataId}
                            paddingY={1.4}
                            sx={{borderBottom: '1px solid #cdc'}}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    background: '#e5e5e5',
                                                    width: 136,
                                                }}>
                                                Vault data id
                                            </TableCell>
                                            <TableCell>{vaultDataId}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    background: '#e5e5e5',
                                                    width: 142,
                                                }}>
                                                Data
                                            </TableCell>
                                            <TableCell>
                                                <TableContainer
                                                    component={Paper}>
                                                    <Table sx={{minWidth: 420}}>
                                                        <TableBody>
                                                            {data.history[
                                                                vaultDataId
                                                            ].map(unit =>
                                                                Object.keys(
                                                                    unit,
                                                                ).map(key => (
                                                                    <TableRow>
                                                                        <TableCell
                                                                            sx={{
                                                                                background:
                                                                                    '#e5e5e5',
                                                                                width: 136,
                                                                            }}>
                                                                            {
                                                                                key
                                                                            }
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {key ===
                                                                            'inputType' ? (
                                                                                <Box>
                                                                                    <Box>
                                                                                        Input
                                                                                        type:{' '}
                                                                                        {
                                                                                            unit
                                                                                                .inputType
                                                                                                .type
                                                                                        }
                                                                                    </Box>
                                                                                    <Box>
                                                                                        File
                                                                                        type:{' '}
                                                                                        {
                                                                                            unit
                                                                                                .inputType
                                                                                                .fileType
                                                                                        }
                                                                                    </Box>
                                                                                    <Box>
                                                                                        Input
                                                                                        name:{' '}
                                                                                        {
                                                                                            unit
                                                                                                .inputType
                                                                                                .inputName
                                                                                        }
                                                                                    </Box>
                                                                                </Box>
                                                                            ) : (
                                                                                unit[
                                                                                    key
                                                                                ]
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )),
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ))}
            </Box>
        </Box>
    );
}

export default Data;
