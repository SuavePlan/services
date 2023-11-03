import AbstractDb from "./";
import {Service} from "typedi";

@Service('db.rx')
export default class RxDb extends AbstractDb {

    delete(key: string): Promise<boolean> {
        return Promise.resolve(false);
    }

    get(key: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    set(key: string, value: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    update(key: string, value: any): Promise<any> {
        return Promise.resolve(undefined);
    }

}
