import 'reflect-metadata';
import Container from "../../src/index";
import ConvertService from "../../src/convert/ConvertService";

describe('Convert Service', () => {

    Container.set('convert', new ConvertService());

    let convert: ConvertService;


    beforeEach(() => {
        convert = Container.get('convert');
    });

    describe('base64ToUint8Array', () => {
        it('should correctly convert base64 to Uint8Array', () => {
            const base64 = btoa('hello');
            const uint8Array = convert.base64ToUint8Array(base64);
            expect(uint8Array).toEqual(new Uint8Array([104, 101, 108, 108, 111]));  // ASCII values for 'hello'
        });
    });

    describe('uint8ArrayToBase64', () => {
        it('should correctly convert Uint8Array to base64', () => {
            const uint8Array = new Uint8Array([104, 101, 108, 108, 111]);
            const base64 = convert.uint8ArrayToBase64(uint8Array);
            expect(base64).toBe(btoa('hello'));
        });
    });

    describe('hexToUint8Array', () => {
        it('should correctly convert hex to Uint8Array', () => {
            const hex = '68656c6c6f';
            const uint8Array = convert.hexToUint8Array(hex);
            expect(uint8Array).toEqual(new Uint8Array([104, 101, 108, 108, 111]));
        });
    });

    describe('uint8ArrayToHex', () => {
        it('should correctly convert Uint8Array to hex', () => {
            const uint8Array = new Uint8Array([104, 101, 108, 108, 111]);
            const hex = convert.uint8ArrayToHex(uint8Array);
            expect(hex).toBe('68656c6c6f');
        });
    });

});
