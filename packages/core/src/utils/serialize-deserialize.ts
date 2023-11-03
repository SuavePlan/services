import * as sa from 'serialize-anything';
import {uint8ArrayToString} from "../convert/ConvertService";

function convertUint8ArrayToString(data: any): any {
    if (data instanceof Uint8Array) {
        return `uint8array:[${Array.from(data)}]`;
    } else if (Array.isArray(data)) {
        return data.map(convertUint8ArrayToString);
    } else if (typeof data === 'object' && data !== null) {
        const newData: any = {};
        for (const key in data) {
            newData[key] = convertUint8ArrayToString(data[key]);
        }
        return newData;
    } else {
        return data;
    }
}

function convertStringToUint8Array(data: any): any {
    if (Array.isArray(data)) {
        return data.map(convertStringToUint8Array);
    } else if (typeof data === 'string' && data.startsWith('uint8array:')) {
        const arr = data.slice('uint8array:'.length + 1, -1).split(',').map(Number);
        return new Uint8Array(arr);
    } else if (typeof data === 'object' && data !== null) {
        const newData: any = {};
        for (const key in data) {
            newData[key] = convertStringToUint8Array(data[key]);
        }
        return newData;
    } else {
        return data;
    }
}

export function serialize(item: any): string {
    // Function to convert Uint8Array values to strings


    //  console.log({ serialize: [item, sa.serialize(convertUint8ArrayToString(item))]})

    return sa.serialize(convertUint8ArrayToString(item));
}

export function deserialize(item: string | Uint8Array): any {


    //  console.log({ item });

    if (item instanceof Uint8Array) {
        return sa.deserialize(uint8ArrayToString(item));
    }

    return convertStringToUint8Array(sa.deserialize(item));
}

export default {serialize, deserialize}