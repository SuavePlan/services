import {
    base64ToUint8Array,
    hexToUint8Array,
    uint8ArrayToHex,
    uint8ArrayToBase64,
    stringToUint8Array,
    uint8ArrayToString
} from "../convert/ConvertService";
import {isBase64, isHex} from "../validation";
// import validator from "validator";
// import isNumeric = validator.isNumeric;

export abstract class AbstractKey {

    constructor(...args: any[]) {

        let bytes = typeof args[0] === 'string' ? convertData(args[0], 'uint8array') : (args[0] instanceof Uint8Array ? args[0] : new Uint8Array(32));

        return new Proxy(this, {
            get(target: AbstractKey, prop: string | symbol, receiver: any): any {

                if (typeof prop === 'symbol') {
                    return Reflect.get(target, prop);
                } else if (prop === 'toString' || prop === 'hex') {
                    return uint8ArrayToHex(bytes);
                } else if (prop === 'bytes' || prop === 'valueOf') {
					return () => bytes;
				} else if (prop === 'base64') {
					return () => uint8ArrayToBase64(bytes);
				} else if (prop === 'toJSON' || prop === 'json') {
					return () => JSON.stringify(Array.from(bytes))
				}

                if (Reflect.has(target, prop)) {
                    return Reflect.get(target, prop, receiver);
                } else if (Reflect.has(bytes, prop)) {
                    const value = Reflect.get(bytes, prop);
                    if (typeof value === 'function') {
                        return value.bind(bytes);
                    }
                    return value;
                }
                return undefined;
            },
			set:(target: this, p: string | symbol, newValue: any) => {
				if (p === 'bytes') {
					bytes = newValue;
					return true;
				}
				return false;
			}
        });
    }
    static create<T extends typeof AbstractKey>(this: T, input?: AbstractKey | Uint8Array | number[] | string): InstanceType<T> {

		if (this === AbstractKey) {
			throw new Error("AbstractKey.create cannot be called on the abstract class itself.");
		}
        let bytes: Uint8Array;

        if (typeof input === 'undefined') {
            bytes = this.getRandomBytes(32);
        } else if (typeof input === 'string') {
            if (isBase64(input)) {
                bytes = base64ToUint8Array(input);
            } else if (isHex(input)) {
                bytes = hexToUint8Array(input);
            } else {
                throw new Error('Unable to detect key type');
            }
        } else if (input instanceof Uint8Array || Array.isArray(input)) {
            bytes = input instanceof Uint8Array ? input : Uint8Array.from(input);

        } else {
            throw new Error('invalid input');
        }

		const ConcreteClass = this as unknown as { new (bytes: Uint8Array): InstanceType<T> };
		return new ConcreteClass(bytes);

    }

	get hex(): string {
		throw new Error('hex is over-ridden');
	}

	toString(): string {
		throw new Error('toString is over-ridden');
	}

    static getRandomBytes(length: number): Uint8Array {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            const buffer = new Uint8Array(length);
            crypto.getRandomValues(buffer);
            return buffer;
        } else {
            return new Uint8Array(Array.from({length}, () => Math.floor(Math.random() * 256)));
        }
    }



}

export class PrivateKey extends AbstractKey {
}

export class PrivateSignKey extends AbstractKey {
}

export class PublicKey extends AbstractKey {
}

export class PublicSignKey extends AbstractKey {
}

export class SymmetricKey extends AbstractKey {
}

export interface KeyChainInterface {
    'public'?: PublicKey;
    'private'?: PrivateKey;
    'publicSign'?: PrivateSignKey;
    'privateSign'?: PublicSignKey;
    'symmetric'?: SymmetricKey;

}

export class KeyChain {

    get public(): PublicKey {
        throw new Error('Public Key not set.');
    }

    get private(): PrivateKey {
        throw new Error('Private Key not set.');
    }

    get publicSign(): PublicSignKey {
        throw new Error('PublicSign Key not set.');
    }

    get privateSign(): PrivateSignKey {
        throw new Error('PrivateSign Key not set.');
    }

	get symmetric(): SymmetricKey {
		throw new Error('Symmetric Key not set.');
	}

    constructor(...args: (AbstractKey | KeyChainInterface)[]) {

        const keyChain: KeyChainInterface = {};

        args.forEach((arg: any) => {
            if (arg instanceof AbstractKey) {
                const keyName = arg.constructor.name.replace('Key', '').charAt(0).toLowerCase() + arg.constructor.name.replace('Key', '').slice(1);
                keyChain[keyName as keyof KeyChainInterface] = arg;
            } else if (typeof arg === 'object' && null !== arg && Object.keys(arg).length > 0 && Object.values(arg).every(val => val instanceof AbstractKey)) {
                Object.assign(keyChain, arg);
            } else {
                throw new Error("Arguments are not keys.");
            }
        });

        return new Proxy(this, {
            get(target, prop) {

                if (typeof prop === 'symbol') {
                    return Reflect.get(target, prop);
                }

                // Handle the toString call
                if (prop === 'toString') {

                    return function () {
                        // Convert array-like objects to proper arrays before stringifying
                        return JSON.stringify({
                            'public': keyChain.public ? (keyChain.public as PublicKey).hex : undefined,
                            'private': keyChain.private ? (keyChain.private as PrivateKey).hex : undefined
                        });
                    };
                }

                // Handle the toString call
                if (prop === 'serialize' || prop === 'toJSON') {
                    return function () {
                        // Convert array-like objects to proper arrays before stringifying
                        return JSON.stringify({
                            'public': keyChain.public ? Array.from(keyChain.public as unknown as Uint8Array) : undefined,
                            'private': keyChain.private ? Array.from(keyChain.private as unknown as Uint8Array) : undefined
                        });
                    };
                }

                if (prop === 'deserialize') {
                    return new KeyChain();
                }

                if (keyChain[prop as keyof KeyChainInterface] && prop !== "_format") {
                    return Reflect.get(keyChain, prop);
                } else if (prop in target) {
                    return Reflect.get(target, prop);
                }
                if (['then', '$$typeof', 'nodeType', 'tagName', '@@__IMMUTABLE_ITERABLE__@@', '@@__IMMUTABLE_RECORD__@@'].includes(prop)) {
                    return null;
                }

                throw new Error(`${String(prop)} Key not set.`);

            },
            set() {
                throw new Error("Keys are immutable.");
            }
        } as ProxyHandler<KeyChain>);
    }

    static deserialize(data: string): KeyChainInterface {
        const parsedData = JSON.parse(data);
        const output: KeyChainInterface = {};
        for (const key in parsedData) {
            if (key === 'private') {
                output[key] = new PrivateKey(parsedData[key]);
            } else if (key === 'public') {
                output[key] = new PublicKey(parsedData[key]);
            } else if (key === 'privateSign') {
                output[key] = new PrivateSignKey(parsedData[key]);
            } else if (key === 'publicSign') {
                output[key] = new PublicSignKey(parsedData[key]);
            } else if (key === 'symmetric') {
                output[key] = new SymmetricKey(parsedData[key]);
            }
        }
        return output;
    }

    // dummy function for typescript. proxy overrides it.
    serialize(): string {
        throw new Error('serialize not implemented');
    }

    toValue() {
		throw new Error('toString is overridden');
    }

	toString() {
		throw new Error('toString is overridden');
	}
}

/*
 *
 *
 *    Crypto conversion functions
 *
 *
 */

export type CryptoDataType = string | Uint8Array;

export type CryptoFormat = 'base64' | 'hex' | 'uint8array' | 'string';

export type CryptoData<T extends CryptoFormat> =
    T extends 'base64' ? string :
        T extends 'hex' ? string :
            T extends 'string' ? string :
                Uint8Array;

export function convertData<T extends CryptoFormat>(data: any, format: T): CryptoData<T> {
    if (typeof data === 'string') {
        if (isBase64(data)) {
            data = base64ToUint8Array(data);
        } else if (isHex(data)) {
            data = hexToUint8Array(data);
        } else {
            data = stringToUint8Array(data);
        }
    }

    switch (format) {
        case 'string':
            return uint8ArrayToString(data as Uint8Array) as CryptoData<T>;
        case 'base64':
            return uint8ArrayToBase64(data as Uint8Array) as CryptoData<T>;
        case 'hex':
            return uint8ArrayToHex(data as Uint8Array) as CryptoData<T>;
        case 'uint8array':
            return data as CryptoData<T>;
        default:
            throw new Error('Output format not recognized.');
    }
}


export abstract class AbstractCrypto {

    protected _kc: KeyChainInterface;

    constructor(keyChain?: KeyChainInterface) {
        this._kc = keyChain || {};
    }

    async init(): Promise<KeyChainInterface> {
        if (Object.keys(this._kc).length === 0) {
            this._kc = await (this.constructor as typeof AbstractCrypto).createKeychain();
        }
        return this._kc;
    }

    static async createKeychain(): Promise<KeyChainInterface> {
        throw new Error('keychain not set up');
    }

    get kc(): KeyChainInterface {
        return this._kc;
    }

    set kc(keyChain: KeyChainInterface) {
        this._kc = keyChain;
    }

    abstract encrypt<T extends CryptoFormat>(data: any, outputType?: T): Promise<CryptoData<T>>;

    abstract decrypt(data: any): Promise<any>;

    abstract sign<T extends CryptoFormat>(data: any, outputType?: T): Promise<CryptoData<T>>;

    abstract verify(signedData: any, signature: Uint8Array, keyChain: KeyChainInterface): Promise<boolean>;

}
