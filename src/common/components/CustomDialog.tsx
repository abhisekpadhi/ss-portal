import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select, {SelectChangeEvent} from '@mui/material/Select';

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    onClose?: () => void;
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
        props.onClose && props.onClose();
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
