
import {Service} from "typedi";
import AbstractStorage from "./index";

@Service('storage.memory')
export default class MemoryStorage extends AbstractStorage {
    private storage: { [key: string]: any } = {};

    async put(key: string, data: any): Promise<void> {
        this.storage[key] = data;
    }

    async get(key: string): Promise<any> {
        return this.storage[key] || null;
    }

    async entry(key: string): Promise<{ key: string; value: any } | null> {
        if (this.storage[key]) {
            return {
                key: key,
                value: this.storage[key],
            };
        }
        return null;
    }

    async del(key: string): Promise<void> {
        delete this.storage[key];
    }

    async symlink(key: string, linkname: string): Promise<void> {
        this.storage[linkname] = this.storage[key];
    }

    async list(): Promise<string[]> {
        return Object.keys(this.storage);
    }

    createReadStream(key: string): any[] {
        return [this.storage[key]];
    }

    createWriteStream(key: string): { write: (data: any) => void } {
        return {
            write: (data: any) => {
                this.storage[key] = data;
            },
        };
    }
}

export {MemoryStorage}
