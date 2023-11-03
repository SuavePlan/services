
export * from './MemoryStorage'


import AbstractEmitter from "../emitter";

export default abstract class AbstractStorage {

	protected _event: AbstractEmitter;

	constructor(event: AbstractEmitter) {
		this._event = event;
	}

	get event() {
		return this._event;
	}

	abstract put(key: string, data: any): Promise<void>;

	abstract get(key: string): Promise<any>;

	abstract entry(key: string): Promise<{ key: string; value: any } | null>;

	abstract del(key: string): Promise<void>;

	abstract symlink(key: string, linkname: string): Promise<void>;

	abstract list(): Promise<string[]>;

	abstract createReadStream(key: string): any[];

	abstract createWriteStream(key: string): { write: (data: any) => void };
}

export { AbstractStorage }
