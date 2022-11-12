import {
    Box,
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {clipText, copyToClipboard, notify} from '../../../common/lib/utils';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {IArticles} from 'models/articles';
import PushPinIcon from '@mui/icons-material/PushPin';

function ArticlesTable(props: {
    rows: IArticles[];
    onPressAction: (articleId: string) => void;
}) {
    const {rows} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead sx={{backgroundColor: '#c5c5c5'}}>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Link</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow
                            key={row.articleId}
                            sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                            }}>
                            <TableCell component="th" scope="row">
                                {row.title}
                            </TableCell>
                            <TableCell>
                                <Box display={'flex'} alignItems={'center'}>
                                    <Box mr={1.4}>
                                        {clipText(row.link, 48, true)}
                                    </Box>
                                    <Box>
                                        <IconButton
                                            onClick={() => {
                                                copyToClipboard(row.link);
                                            }}
                                            aria-label="copy"
                                            size="small">
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => {
                                        props.onPressAction(row.articleId);
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

export default ArticlesTable;
