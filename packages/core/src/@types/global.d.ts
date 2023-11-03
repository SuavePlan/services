export type AllKeysOptional<T> = { [P in keyof T]+?: T[P] };
export type StringOrUint8Array = string | Uint8Array;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T = {}> = new (...arguments_: any[]) => T;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

