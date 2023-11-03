import {serialize, deserialize} from './serialize-deserialize'
import {Service} from "typedi";
import {AbstractClass} from "../service";


@Service('utils')
class Utils extends AbstractClass {

    public serializer = serialize;
    public deserializer = deserialize;

}

export default Utils;
