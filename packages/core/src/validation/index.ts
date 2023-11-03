import {Service} from "typedi";
import validator from "validator";

// does an exclusive test to ensure it isn't Hex
export const isBase64 = (input: string): boolean => validator.isBase64(input) && !validator.isHexadecimal(input);

// Does an exclusive test to ensure it isn't Base64
export const isHex = (input: string): boolean => !validator.isBase64(input) && validator.isHexadecimal(input);


@Service('validation')
export default class Validation {
    isBase64 = isBase64;
    isHex = isHex;

}


export {Validation}