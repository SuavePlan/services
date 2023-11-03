import MemoryDb from "../../src/db/MemoryDb";


describe('MemoryDb', () => {
    let db: MemoryDb;

    beforeEach(() => {
        db = new MemoryDb();
    });

    describe('set', () => {
        it('should set a value for a given key', async () => {
            const result = await db.set('testKey', 'testValue');
            expect(result).toBe('testValue');
        });
    });

    describe('get', () => {
        it('should retrieve a value for a given key', async () => {
            await db.set('testKey', 'testValue');
            const result = await db.get('testKey');
            expect(result).toBe('testValue');
        });

        it('should return undefined for a non-existent key', async () => {
            const result = await db.get('nonExistentKey');
            expect(result).toBeUndefined();
        });
    });

    describe('delete', () => {
        it('should delete a key-value pair and return true', async () => {
            await db.set('testKey', 'testValue');
            const result = await db.delete('testKey');
            expect(result).toBe(true);
            expect(await db.get('testKey')).toBeUndefined();
        });

        it('should return false when trying to delete a non-existent key', async () => {
            const result = await db.delete('nonExistentKey');
            expect(result).toBe(false);
        });
    });

    describe('update', () => {
        it('should update the value for an existing key', async () => {
            await db.set('testKey', 'testValue');
            const updatedValue = await db.update('testKey', 'updatedValue');
            expect(updatedValue).toBe('updatedValue');
            expect(await db.get('testKey')).toBe('updatedValue');
        });

        it('should throw an error when trying to update a non-existent key', async () => {
            await expect(db.update('nonExistentKey', 'value')).rejects.toThrow('Key nonExistentKey not found.');
        });
    });
});
