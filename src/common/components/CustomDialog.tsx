import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Switch from '@mui/material/Switch';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    dialogContent?: React.ReactNode;
    dialogActions?: React.ReactNode;
};
export default function CustomDialog(props: Props) {
    const {open} = props;
    const setOpen = (open: boolean) => {
        props.setOpen(open);
    };
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] =
        React.useState<DialogProps['maxWidth']>('sm');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMaxWidthChange = (
        event: SelectChangeEvent<typeof maxWidth>,
    ) => {
        setMaxWidth(
            // @ts-expect-error autofill of arbitrary value is not handled.
            event.target.value,
        );
    };

    const handleFullWidthChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setFullWidth(event.target.checked);
    };

    return (
        <React.Fragment>
            <Dialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                open={open}
                onClose={handleClose}>
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>{props.dialogContent}</DialogContent>
                <DialogActions>
                    {props.dialogActions}
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
