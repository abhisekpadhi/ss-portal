import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React from 'react';
import {IAgent} from 'models/agent';

function AgentsTable(props: {rows: IAgent[]}) {
    const {rows} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead sx={{backgroundColor: '#c5c5c5'}}>
                    <TableRow>
                        <TableCell>Full name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Agent ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow
                            key={row.agentId}
                            sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                            }}>
                            <TableCell component="th" scope="row">
                                {row.fullName}
                            </TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>{row.agentId}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AgentsTable;
