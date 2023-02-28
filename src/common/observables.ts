import {Subject} from 'rxjs';
import {AlertColor} from '@mui/material';

export type TSnackPayload = {
    message: string;
    severity: AlertColor;
};

export const SnackObservable = new Subject<TSnackPayload>();
