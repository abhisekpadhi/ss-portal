import {SnackObservable, TSnackPayload} from '../observables';

export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(_ => {
        notify({
            message: 'Copied to clipboard!',
            severity: 'success',
        });
    });
}

export function clipText(t: string, max?: number, ellipsis: boolean = false) {
    return (
        t.substring(0, Math.min(max ?? 22, t.length)).trim() +
        (ellipsis ? '...' : '')
    );
}

export function notify(payload: TSnackPayload) {
    SnackObservable.next(payload);
}
