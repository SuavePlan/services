import SodiumCrypto, {
    generateSalt,
    generateSecretNonce,
    generateSignSeed,
    createPasswordHash,
    generateSecretBoxKey,
    generateBoxKeyPair,
    generateSigningKeyPair
} from "../../src/crypto/SodiumCrypto";
import {CryptoData} from "../../src/crypto"; // Adjust the path accordingly

describe("SodiumCrypto", () => {
    let crypto: SodiumCrypto;

    beforeAll(async () => {
        crypto = new SodiumCrypto();
        await crypto.init();
    });

    it("should encrypt and decrypt data", async () => {
        const encrypted = await crypto.encrypt("test data", 'base64') as CryptoData<"base64">;
        const decrypted = await crypto.decrypt(encrypted);
        expect(decrypted).toBe("test data");
    });

    it("should sign and verify data", async () => {
        const signed = await crypto.sign("test data", 'uint8array');
        const isValid = await crypto.verify("test data", signed);
        expect(isValid).toBe(true);
    });

    // ... Additional tests for other methods in SodiumCrypto
});

describe("Utility functions", () => {

    it("should generate salt", async () => {
        const salt = await generateSalt('base64');
        expect(typeof salt).toBe("string");
    });

    it("should generate secret nonce", async () => {
        const nonce = await generateSecretNonce('base64');
        expect(typeof nonce).toBe("string");
    });

    it("should generate sign seed", async () => {
        const seed = await generateSignSeed('base64');
        expect(typeof seed).toBe("string");
    });

    it("should create password hash", async () => {
        const hash = await createPasswordHash("password", "base64");
        expect(typeof hash).toBe("string");
    });

    it("should generate secret box key", async () => {
        const key = await generateSecretBoxKey();
        expect(key).toBeInstanceOf(Uint8Array);
    });

    it("should generate box key pair", async () => {
        const keyPair = await generateBoxKeyPair();
        expect(keyPair.public).toBeInstanceOf(Uint8Array);
        expect(keyPair.private).toBeInstanceOf(Uint8Array);
    });

    it("should generate signing key pair", async () => {
        const keyPair = await generateSigningKeyPair();
        expect(keyPair.publicSign).toBeInstanceOf(Uint8Array);
        expect(keyPair.privateSign).toBeInstanceOf(Uint8Array);
    });

});
