import {KeyChainInterface} from "../../crypto";
import * as _sodium from "libsodium-wrappers";
import {TransformStream} from "../streams";


export function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
    const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
    const result = new Uint8Array(totalLength);

    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }

    return result;
}


export async function createEncryptor(keychain: KeyChainInterface): Promise<TransformStream<Uint8Array, Uint8Array>> {
    await _sodium.ready;
    const sodium = _sodium;

    let state;
    return new TransformStream({
        async transform(chunk, controller) {
            if (typeof keychain.symmetric === 'undefined') {
                throw new Error('Symmetric sign key is missing');
            }
            if (!state) {
                const res = sodium.crypto_secretstream_xchacha20poly1305_init_push(keychain.symmetric as unknown as Uint8Array);
                state = res.state;
                controller.enqueue(res.header);  // Push the header as the first chunk
            }
            const encryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_push(state, new Uint8Array(chunk), null, sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE);
            controller.enqueue(encryptedChunk);
        }
    });
}

export async function createDecryptor(keychain: KeyChainInterface): Promise<TransformStream<Uint8Array, Uint8Array>> {
    await _sodium.ready;
    const sodium = _sodium;

    let state;
    return new TransformStream({
        async transform(chunk, controller) {
            if (typeof keychain.symmetric === 'undefined') {
                throw new Error('Symmetric key is missing');
            }
            if (!state) {
                const header = new Uint8Array(chunk).slice(0, sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
                state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, keychain.symmetric as unknown as Uint8Array);
                chunk = chunk.slice(sodium.crypto_secretstream_xchacha20poly1305_HEADERBYTES);
            }
            const decryptedChunk = sodium.crypto_secretstream_xchacha20poly1305_pull(state, new Uint8Array(chunk));
            controller.enqueue(decryptedChunk.message);
        }
    });
}

export async function createSigner(keychain: KeyChainInterface, chunkSize: number): Promise<TransformStream<Uint8Array, Uint8Array>> {

    await _sodium.ready;
    const sodium = _sodium;
    let buffer = new Uint8Array(0);

    return new TransformStream({
        transform(chunk, controller) {
            if (typeof keychain.privateSign === 'undefined') {
                throw new Error('Private sign key is missing');
            }
            buffer = concatUint8Arrays(buffer, chunk);
            while (buffer.length >= chunkSize) {
                const chunkToSign = buffer.slice(0, chunkSize);
                const signedChunk = sodium.crypto_sign(chunkToSign, keychain.privateSign as unknown as Uint8Array);
                controller.enqueue(signedChunk);
                buffer = buffer.slice(chunkSize);
            }
        },
        flush(controller) {
            if (typeof keychain.privateSign === 'undefined') {
                throw new Error('Private sign key is missing');
            }
            if (buffer.length > 0) {
                const signedChunk = sodium.crypto_sign(buffer, keychain.privateSign as unknown as Uint8Array);
                controller.enqueue(signedChunk);
            }
        }
    });
}

export async function createVerifier(keychain): Promise<TransformStream<Uint8Array, Uint8Array>> {
    await _sodium.ready;
    const sodium = _sodium;

    return new TransformStream({
        transform(chunk, controller) {
            const verifiedChunk = sodium.crypto_sign_open(chunk, keychain.publicSign);
            controller.enqueue(verifiedChunk);
        }
    });
}
