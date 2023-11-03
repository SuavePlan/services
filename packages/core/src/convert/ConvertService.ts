import {Service} from "typedi";

@Service('convert')
export default class ConvertService {
    base64ToUint8Array = base64ToUint8Array
    uint8ArrayToBase64 = uint8ArrayToBase64
    hexToUint8Array = hexToUint8Array
    uint8ArrayToHex = uint8ArrayToHex
    stringToUint8Array = stringToUint8Array
    uint8ArrayToString = uint8ArrayToString
}


export function stringToUint8Array(str: string): Uint8Array {
    if (typeof TextEncoder !== 'undefined') {
        return new TextEncoder().encode(str);
    }
    return new Uint8Array(Buffer.from(str, 'utf-8'));
}

export function uint8ArrayToString(buffer: Uint8Array): string {
    if (typeof TextDecoder !== 'undefined') {
        return new TextDecoder().decode(buffer);
    }
    return Buffer.from(buffer).toString('utf-8');
}


export function base64ToUint8Array(str: string): Uint8Array {
    return new Uint8Array([...atob(str)].map(char => char.charCodeAt(0)));
}

export function uint8ArrayToBase64(arr: Uint8Array | number[]) {
    return btoa(String.fromCharCode.apply(null, Array.from(arr)));
}

export function hexToUint8Array(str: string): Uint8Array {
	const match = str.match(/.{1,2}/g) as RegExpMatchArray | null;
	if (match === null) {
		throw new Error('Invalid input string');
	}
	return new Uint8Array(match.map(byte => parseInt(byte, 16)));
}


export function uint8ArrayToHex(arr: Uint8Array | number[]): string {
    return Array.prototype.map.call(arr, byte => {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}
