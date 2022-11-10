import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React, {useState} from 'react';
import {
    TrusteeVaultAccessRequestStatus,
    TTrusteeAccessRequestsDataForPortal,
} from 'models/trustee-vault-access';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {clipText, copyToClipboard, notify} from '../../../common/lib/utils';
import DownloadIcon from '@mui/icons-material/Download';
import download from 'downloadjs';
import {COLORS} from '../../../constants';
import {BeatLoader} from 'react-spinners';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function TrusteeRequestsTable(props: {
    rows: TTrusteeAccessRequestsDataForPortal[];
    onPressAction: (requestId: string) => void;
}) {
    const [downloading, setDownloading] = useState(false);
    const downloadFile = async (url: string) => {
        setDownloading(true);
        try {
            await download(url);
            notify({
                message: 'File download started',
                severity: 'success',
            });
            setDownloading(false);
        } catch (e) {
            setDownloading(false);
            console.debug('err', e);
            notify({
                message: '‼️Failed to download file',
                severity: 'error',
            });
        }
    };
    const {rows} = props;
    const getStatusChip = (text: string) => {
        let color:
            | 'success'
            | 'error'
            | 'info'
            | 'default'
            | 'primary'
            | 'secondary'
            | 'warning'
            | undefined = 'default';
        switch (text) {
            case 'GRANTED':
                color = 'success';
                break;
            case 'REJECTED':
                color = 'error';
                break;
            case 'CANCELLED':
                color = 'default';
                break;
            default:
                color = 'info';
                break;
        }
        return <Chip label={text} color={color} />;
    };
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead sx={{backgroundColor: '#c5c5c5'}}>
                    <TableRow>
                        <TableCell>Request ID</TableCell>
                        <TableCell>Owner</TableCell>
                        <TableCell>Trustee</TableCell>
                        <TableCell>Document</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow
                            key={row.requestId}
                            sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                            }}>
                            <TableCell component="th" scope="row">
                                {row.requestId}
                            </TableCell>
                            <TableCell>
                                <Box mb={1}>{row.ownerName}</Box>
                                <Box>
                                    <Chip
                                        label={clipText(
                                            row.ownerUserId,
                                            16,
                                            true,
                                        )}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            copyToClipboard(row.ownerUserId);
                                        }}
                                        aria-label="copy"
                                        size="small">
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box mb={1}>{row.trusteeName}</Box>
                                <Box>
                                    <Chip
                                        label={clipText(
                                            row.ownerUserId,
                                            16,
                                            true,
                                        )}
                                    />
                                    <IconButton
                                        onClick={() => {
                                            copyToClipboard(row.trusteeUserId);
                                        }}
                                        aria-label="copy"
                                        size="small">
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Button
                                    disabled={downloading}
                                    onClick={() => downloadFile(row.docUrl)}
                                    sx={{textTransform: 'none'}}
                                    endIcon={<DownloadIcon fontSize="small" />}>
                                    {downloading ? (
                                        <BeatLoader
                                            size={12}
                                            color={COLORS.theme}
                                        />
                                    ) : (
                                        row.docUploadName
                                    )}
                                </Button>
                            </TableCell>
                            <TableCell>
                                {getStatusChip(row.requestStatus)}
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => {
                                        props.onPressAction(row.requestId);
                                    }}
                                    aria-label="options"
                                    size="small">
                                    <MoreHorizIcon fontSize="medium" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TrusteeRequestsTable;
