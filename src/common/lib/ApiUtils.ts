import store from '../store';
import {ICredentialsState} from '../reducers/credentialsReducer';

type arrType = string[] | number[];

export const makeParams = (payload: {
    [k: string]: string | number | arrType;
}) => {
    let result = '?';
    const keys = Object.keys(payload).entries();
    for (const [idx, key] of Array.from(keys)) {
        if (payload[key] instanceof Array) {
            if ((payload[key] as unknown[]).length > 0) {
                const listData = payload[key] as unknown[];
                let partial = `&${key}=${encodeURIComponent(
                    listData[0] as string | number,
                )}`;
                listData.slice(1).forEach(o => {
                    partial += `&${key}=${encodeURIComponent(
                        o as string | number,
                    )}`;
                });
                if (result === '?') {
                    result += partial.slice(1);
                } else {
                    result += partial;
                }
            }
        } else {
            result +=
                idx === 0
                    ? `${key}=${encodeURIComponent(
                          payload[key] as string | number,
                      )}`
                    : `&${key}=${encodeURIComponent(
                          payload[key] as string | number,
                      )}`;
        }
    }
    return result;
};

// test
// console.log(
//     makeParams({
//         foo: 'bar',
//         l: ['cat ate (the rat + 453 balls.)', 'dog'],
//         code: 123,
//         itemsIds: [111, 222, 333],
//     }),
// );

export class ApiUtils {
    // safe api calls - uses auth token
    static async makeGetRequest<T>(
        url: string,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return await this.makeApiCall(
            url,
            {
                method: 'GET',
                signal,
            },
            headers ? headers : {},
        );
    }

    static async makePostRequestWithJsonBody<T>(
        url: string,
        body: object,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return await this.makeApiCall(
            url,
            {
                method: 'POST',
                body: JSON.stringify(body),
                signal,
            },
            {
                ...headers,
                'Content-Type': 'application/json',
            },
        );
    }

    static async makePostRequestWithFormDataBody<T>(
        url: string,
        body: FormData,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return await this.makeApiCall(
            url,
            {
                method: 'POST',
                body: body,
                signal,
            },
            headers ? headers : {},
        );
    }

    // unsafe api calls - does not uses auth token
    static makeGetRequestUnsafe<T>(
        url: string,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return this.makeApiCallUnsafe(
            url,
            {method: 'GET', signal},
            headers ? headers : {},
        );
    }

    static makePostRequestWithJsonBodyUnsafe<T>(
        url: string,
        body: object,
        headers?: object,
        signal?: AbortSignal,
    ): Promise<T> {
        return this.makeApiCallUnsafe(
            url,
            {
                method: 'POST',
                body: JSON.stringify(body),
                signal,
            },
            {
                ...headers,
                'Content-Type': 'application/json',
            },
        );
    }

    static makePostRequestWithFormDataBodyUnsafe(
        url: string,
        body: FormData,
        headers?: object,
        signal?: AbortSignal,
    ) {
        return this.makeApiCallUnsafe(
            url,
            {
                method: 'POST',
                body: body,
                signal,
            },
            {
                ...headers,
            },
        );
    }

    private static async makeApiCall<T>(
        url: string,
        options: object,
        headers: object,
    ): Promise<T> {
        const makeApiCall = () => {
            const accessToken = (
                (store.getState() as any)
                    .credentialsReducer as ICredentialsState
            ).accessToken;
            return fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: accessToken,
                },
            })
                .then(this.handleResponseParsing)
                .then((data: T) => data);
        };
        return makeApiCall();
    }

    private static async makeApiCallUnsafe<T>(
        url: string,
        options: object,
        headers: object,
    ): Promise<T> {
        const apiCall = () => {
            return fetch(url, {
                ...options,
                headers: {
                    ...headers,
                },
            })
                .then(this.handleResponseParsing)
                .then(this.handleData);
        };
        return apiCall();
    }

    private static handleResponseParsing(r: Response) {
        const ct =
            r.headers.get('content-type')?.replace('; charset=utf-8', '') || '';
        // handle response parsing here
        switch (ct) {
            case 'application/json':
                return r.json();
            case 'application/octet-stream':
                return r.blob();
            default:
                return r.text();
        }
    }

    private static handleData<T>(d: T): T {
        // Make data mutations here
        return d;
    }
}
