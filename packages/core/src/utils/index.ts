import {serialize, deserialize} from './serialize-deserialize'
import {Service} from "typedi";
import {AbstractClass} from "../service";
import {getValidTlds,hasValidTld, splitDomain} from "./domain";
import {normalizeEmail} from './email';
import proxyWithFeatures from "./proxy";
@Service('utils')
class Utils extends AbstractClass {

    serializer = serialize;
    deserializer = deserialize;
	getValidTlds = getValidTlds;
	hasValidTld = hasValidTld;
	splitDomain=splitDomain;
	normalizeEmail=normalizeEmail;
	proxyWithFeatures=proxyWithFeatures;

}

export default Utils;
