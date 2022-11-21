import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import {
    CheckCircleOutline,
    ErrorOutline,
    InfoOutlined,
    WarningAmber,
} from '@mui/icons-material';
import Box from '@mui/material/Box';
import {COLORS, SeverityTypes} from '../../constants';
import ProgressIndicator from './ProgressIndicator';

export interface AlertDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    body: string;
    btnLabel?: string;
    btnClick?: () => void;
    buttons?: {
        agreeLabel: string;
        onAgree: () => void;
        disagreeLabel: string;
        onDisagree?: () => void;
        agreeIsDanger?: boolean;
    };
    status?: SeverityTypes;
    progress?: boolean;
}

export default function AlertDialog(props: AlertDialogProps) {
    const handleClose = () => {
        props.onClose();
    };
    const getUserDefinedBtns = () => {
        if (!props.buttons) {
            return null;
        }
        return (
            <DialogActions>
                <Button
                    onClick={() => {
                        props.buttons!.onDisagree
                            ? props.buttons!.onDisagree()
                            : handleClose();
                    }}>
                    {props.buttons.disagreeLabel}
                </Button>
                <Button
                    color={
                        props.buttons?.agreeIsDanger ? 'secondary' : 'primary'
                    }
                    onClick={props.buttons!.onAgree}
                    autoFocus>
                    {props.buttons.agreeLabel}
                </Button>
            </DialogActions>
        );
    };
    const getDefaultBtns = () => {
        return (
            <DialogActions>
                <Button onClick={props.btnClick ? props.btnClick : handleClose}>
                    {props.btnLabel ? props.btnLabel : 'OK'}
                </Button>
            </DialogActions>
        );
    };
    const getSuccessIcon = () => (
        <CheckCircleOutline sx={{fontSize: '4rem', color: COLORS.success}} />
    );
    const getErrorIcon = () => (
        <ErrorOutline sx={{fontSize: '4rem', color: COLORS.error}} />
    );
    const getInfoIcon = () => (
        <InfoOutlined sx={{fontSize: '4rem', color: COLORS.info}} />
    );
    const getWarnIcon = () => (
        <WarningAmber sx={{fontSize: '4rem', color: COLORS.warn}} />
    );
    const getStatusIcon = () => {
        if (!props.status) {
            return null;
        }
        switch (props.status) {
            case 'success':
                return getSuccessIcon();
            case 'warn':
                return getWarnIcon();
            case 'error':
                return getErrorIcon();
            case 'info':
                return getInfoIcon();
            default:
                return getInfoIcon();
        }
    };
    return (
        <Dialog
            open={props.open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            {props.progress ? (
                <Box
                    sx={{
                        height: 320,
                        width: 320,
                    }}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}>
                    <ProgressIndicator />
                </Box>
            ) : (
                <>
                    {props.status && (
                        <Box
                            sx={{
                                height: 16,
                                backgroundColor: COLORS[props.status],
                                width: '100%',
                            }}
                        />
                    )}
                    {props.status && (
                        <Box sx={{textAlign: 'center', pt: 4}}>
                            {getStatusIcon()}
                        </Box>
                    )}
                    <DialogTitle id="alert-dialog-title">
                        {props.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {props.body}
                        </DialogContentText>
                    </DialogContent>
                    {props.buttons ? getUserDefinedBtns() : getDefaultBtns()}
                </>
            )}
        </Dialog>
    );
}
