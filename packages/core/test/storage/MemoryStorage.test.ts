import MemoryStorage from "../../src/storage/MemoryStorage"; // Assuming you are using Jest
import "reflect-metadata"
import EventEmitter from "../../src/emitter/EventEmitter";

describe('MemoryStorage', () => {
    let storage: MemoryStorage;
    const ee = new EventEmitter();

    beforeEach(() => {
        storage = new MemoryStorage(ee);
    });

    it('should store and retrieve data', async () => {
        expect(typeof storage.event).toEqual('object');
    });

    it('should store and retrieve data', async () => {
        await storage.put('testKey', 'testValue');
        const value = await storage.get('testKey');
        expect(value).toBe('testValue');
    });

    it('should return null for non-existent keys', async () => {
        const value = await storage.get('nonExistentKey');
        expect(value).toBeNull();
    });

    it('should return entry for a key', async () => {
        await storage.put('testKey', 'testValue');
        const entry = await storage.entry('testKey');
        expect(entry).toEqual({key: 'testKey', value: 'testValue'});
    });

    it('should return null for entry of non-existent keys', async () => {
        const entry = await storage.entry('nonExistentKey');
        expect(entry).toBeNull();
    });

    it('should delete a key', async () => {
        await storage.put('testKey', 'testValue');
        await storage.del('testKey');
        const value = await storage.get('testKey');
        expect(value).toBeNull();
    });

    it('should create a symlink', async () => {
        await storage.put('originalKey', 'originalValue');
        await storage.symlink('originalKey', 'linkKey');
        const value = await storage.get('linkKey');
        expect(value).toBe('originalValue');
    });

    it('should list all keys', async () => {
        await storage.put('key1', 'value1');
        await storage.put('key2', 'value2');
        const keys = await storage.list();
        expect(keys).toEqual(['key1', 'key2']);
    });

    it('should create a read stream', () => {
        storage.put('testKey', 'testValue');
        const stream = storage.createReadStream('testKey');
        expect(stream).toEqual(['testValue']);
    });

    it('should create a write stream', () => {
        const writeStream = storage.createWriteStream('testKey');
        writeStream.write('testValue');
        expect(storage.get('testKey')).resolves.toBe('testValue');
    });
});
