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

function camelize(str: string) {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
}

export const toCamelCase = (str: string) =>
    str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) =>
            idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase(),
        )
        .replace(/\s+/g, '');
