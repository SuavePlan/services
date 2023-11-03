import "reflect-metadata";
import {
    convertData,
    AbstractCrypto,
    CryptoData,
    CryptoFormat,
    KeyChainInterface,
    PrivateKey,
    PrivateSignKey,
    PublicKey,
    PublicSignKey,
    SymmetricKey,
} from "./index";

const sodium = require('libsodium-wrappers-sumo');

import {Service} from "typedi";
import {serialize, deserialize} from "../utils/serialize-deserialize";

@Service('crypto.sodium')
export default class SodiumCrypto extends AbstractCrypto {

    static async createKeychain(): Promise<KeyChainInterface> {
        return createKeychain();
    }

    async encrypt<T extends CryptoFormat>(data: any, outputType: T = 'base64' as T): Promise<CryptoData<T>> {
        return encrypt<T>(data, await this.kc, outputType);
    }

    async decrypt(data: any): Promise<any> {
        return decrypt(data, await this.kc);
    }

    async sign<T extends CryptoFormat>(data: any, outputType: T = 'base64' as T): Promise<CryptoData<T>> {
        return sign<T>(data, await this.kc, outputType);
    }

    async verify(signedData: any, signature: Uint8Array): Promise<boolean> {
        return verify(signedData, signature, await this.kc);
    }
}

export async function encrypt<T extends CryptoFormat = 'base64'>(data: any, keyChain: KeyChainInterface, outputType: T = 'base64' as T): Promise<CryptoData<T>> {
    if (!keyChain.public) {
        throw new Error('public key is missing');
    }

    if (!keyChain.private) {
        throw new Error('private key is missing');
    }
    await sodium.ready;

    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const encrypted = sodium.crypto_box_easy(serialize(data), nonce, keyChain.public as unknown as Uint8Array, keyChain.private as unknown as Uint8Array);

// Concatenate nonce and encrypted data
    const mergedData = new Uint8Array(nonce.length + encrypted.length);
    mergedData.set(nonce);
    mergedData.set(encrypted, nonce.length);

    return convertData<T>(mergedData, outputType);
}

export async function decrypt(encryptedData: any, keyChain: KeyChainInterface): Promise<any> {
    if (typeof keyChain.public === 'undefined') {
        throw new Error('public key is missing');
    }
    if (typeof keyChain.private === 'undefined') {
        throw new Error('private key is missing');
    }
    await sodium.ready;
    const data = convertData(encryptedData, 'uint8array');
    const nonce = data.slice(0, sodium.crypto_box_NONCEBYTES);
    const cipherText = data.slice(sodium.crypto_box_NONCEBYTES);
    const decrypted = sodium.crypto_box_open_easy(cipherText, nonce, keyChain.public as unknown as Uint8Array, keyChain.private as unknown as Uint8Array);

    return deserialize(convertData<'uint8array'>(decrypted, 'uint8array'));
}

export async function sign<T extends CryptoFormat>(data: any, keyChain: KeyChainInterface, outputType: T = 'base64' as T): Promise<CryptoData<T>> {
    if (typeof keyChain.privateSign === 'undefined') {
        throw new Error('privateSign key is missing');
    }
    await sodium.ready;
    const signed = sodium.crypto_sign_detached(convertData(data, 'uint8array'), keyChain.privateSign as unknown as Uint8Array);
    return convertData<T>(signed, outputType);
}

export async function verify(signedData: any, signature: Uint8Array, keyChain: KeyChainInterface): Promise<boolean> {
    if (typeof keyChain.publicSign === 'undefined') {
        throw new Error('publicSign key is missing');
    }
    await sodium.ready;
    return sodium.crypto_sign_verify_detached(convertData(signature, 'uint8array'), convertData(signedData, 'uint8array'), keyChain.publicSign as unknown as Uint8Array);
}

export async function createKeychain(): Promise<KeyChainInterface> {
    return {...await generateBoxKeyPair(), ...await generateSigningKeyPair()};
}

export async function generateSalt<T extends CryptoFormat>(format: T = 'uint8array' as T): Promise<CryptoData<T>> {
    await sodium.ready;
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES ?? 16);
    return convertData<T>(salt, format);
}

export async function generateSecretNonce<T extends CryptoFormat>(format: T = 'uint8array' as T): Promise<CryptoData<T>> {
    await sodium.ready;
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    return convertData<T>(nonce, format);
}

export async function generateSignSeed<T extends CryptoFormat>(format: T = 'uint8array' as T): Promise<CryptoData<T>> {
    await sodium.ready;
    const seed = sodium.randombytes_buf(sodium.crypto_sign_SEEDBYTES);
    return convertData<T>(seed, format);
}

export async function createPasswordHash<T extends CryptoFormat>(password: string, format: T = 'uint8array' as T): Promise<CryptoData<T>> {
    await sodium.ready;

    const algorithm = sodium.crypto_pwhash_ALG_DEFAULT;
    const passwordSalt = await generateSalt('uint8array');  // Keep this as Uint8Array for internal processing
    const passwordKey = sodium.crypto_pwhash(sodium.crypto_secretbox_KEYBYTES, password, passwordSalt, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE, algorithm);
    return convertData<T>(passwordKey, format);
}

export async function generateSecretBoxKey(): Promise<SymmetricKey> {
    await sodium.ready;
    const key = sodium.crypto_secretbox_keygen();
    return key as SymmetricKey;
}

export async function generateBoxKeyPair(): Promise<{ public: PublicKey, private: PrivateKey }> {
    await sodium.ready;
    const keyPair = sodium.crypto_box_keypair();
    return {
        public: keyPair.publicKey as PublicKey,
        private: keyPair.privateKey as PrivateKey
    }
}

export async function generateSigningKeyPair(): Promise<{ publicSign: PublicSignKey, privateSign: PrivateSignKey }> {
    await sodium.ready;
    const seed = sodium.randombytes_buf(sodium.crypto_sign_SEEDBYTES);
    const keyPair = sodium.crypto_sign_seed_keypair(seed);
    const publicSign = keyPair.publicKey as PublicSignKey;
    const privateSign = keyPair.privateKey as PrivateSignKey;
    return {
        publicSign,
        privateSign
    }
}
