import {deserialize, serialize} from "../../src/utils/serialize-deserialize";

describe('serialize & deserialize', () => {

    it('serializes and deserializes primitives', () => {
        const original = 'Hello, World!';
        const serialized = serialize(original);
        const deserialized = deserialize(serialized);

        expect(deserialized).toBe(original);
    });

    it('serializes and deserializes arrays', () => {
        const original = ['Hello', 'World', 123, true, new Uint8Array([1, 2, 3])];
        const serialized = serialize(original);
        const deserialized = deserialize(serialized);

        expect(deserialized).toEqual(original);
        expect(deserialized[4]).toBeInstanceOf(Uint8Array);
    });

    it('serializes and deserializes objects', () => {
        const original = {
            string: 'Hello, World!',
            number: 123,
            boolean: true,
            uint8array: new Uint8Array([1, 2, 3])
        };
        const serialized = serialize(original);
        const deserialized = deserialize(serialized);

        expect(deserialized).toEqual(original);
        expect(deserialized.uint8array).toBeInstanceOf(Uint8Array);
    });

    it('serializes and deserializes nested objects and arrays', () => {
        const original = {
            array: [1, 2, 3, {nested: 'string', nestedArray: [new Uint8Array([4, 5, 6])]}],
            nestedObj: {
                nested: new Uint8Array([7, 8, 9])
            }
        };
        const serialized = serialize(original);
        const deserialized = deserialize(serialized);

        expect(deserialized).toEqual(original);
        expect(deserialized.array[3].nestedArray[0]).toBeInstanceOf(Uint8Array);
        expect(deserialized.nestedObj.nested).toBeInstanceOf(Uint8Array);
    });
});
