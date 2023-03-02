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
import {IUserAccount} from 'models/user';

function UserAccountsTable(props: {rows: IUserAccount[]}) {
    const {rows} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead sx={{backgroundColor: '#c5c5c5'}}>
                    <TableRow>
                        <TableCell>Full name</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>User ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow
                            key={row.userId}
                            sx={{
                                '&:last-child td, &:last-child th': {border: 0},
                            }}>
                            <TableCell component="th" scope="row">
                                {row.fullName}
                            </TableCell>
                            <TableCell>{row.phone}</TableCell>
                            <TableCell>{row.email}</TableCell>
                            <TableCell>{row.userId}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default UserAccountsTable;
