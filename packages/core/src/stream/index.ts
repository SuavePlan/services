import {Service, Container} from 'typedi';
import {ReadableStream} from './streams';
import {createEncryptor, createDecryptor, createSigner, createVerifier} from './sodium/sodiumStream';
import {KeyChain} from "../crypto";


@Service('stream.default')
export class StreamService {
    private keychain: KeyChain;

    constructor() {
        // Assuming you have a KeychainService or similar to provide the keychain
        this.keychain = Container.get('crypto.keychain').getKeychain();
    }

    async encrypt(input: ReadableStream<Uint8Array>): Promise<ReadableStream<Uint8Array>> {
        const encryptor = await createEncryptor(this.keychain);
        return input.pipeThrough(encryptor);
    }

    async decrypt(input: ReadableStream<Uint8Array>): Promise<ReadableStream<Uint8Array>> {
        const decryptor = await createDecryptor(this.keychain);
        return input.pipeThrough(decryptor);
    }

    async sign(input: ReadableStream<Uint8Array>, chunkSize: number): Promise<ReadableStream<Uint8Array>> {
        const signer = await createSigner(this.keychain, chunkSize);
        return input.pipeThrough(signer);
    }

    async verify(input: ReadableStream<Uint8Array>): Promise<ReadableStream<Uint8Array>> {
        const verifier = await createVerifier(this.keychain);
        return input.pipeThrough(verifier);
    }
}
