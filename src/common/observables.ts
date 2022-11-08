import {Subject} from 'rxjs';
import {SeverityTypes} from '../constants';

export type TSnackPayload = {
    message: string;
    severity: SeverityTypes;
};

export const SnackObservable = new Subject<TSnackPayload>();
