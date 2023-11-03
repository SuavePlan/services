import AbstractDb from "./";
import {Service} from "typedi";

@Service('db.memory')
export default class MemoryDb extends AbstractDb {
    private data: { [key: string]: any } = {};

    async set(key: string, value: any): Promise<any> {
        this.data[key] = value;
        return value;
    }

    async get(key: string): Promise<any> {
        return this.data[key];
    }

    async delete(key: string): Promise<boolean> {
        if (this.data[key]) {
            delete this.data[key];
            return true;
        }
        return false;
    }

    async update(key: string, value: any): Promise<any> {
        if (this.data[key]) {
            this.data[key] = value;
            return value;
        }
        throw new Error(`Key ${key} not found.`);
    }
}
