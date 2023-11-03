import 'reflect-metadata';

import {v4 as uuidv4} from 'uuid';
import AbstractEmitter from "../emitter";

export interface IService {
	readonly id: string;
	readonly type: string;
	isAvailable(): Promise<boolean>;
	initialize(): Promise<void>;
	execute(payload: any): Promise<any>;
}

export abstract class AbstractServiceNode extends AbstractService {
	protected _type = 'node';
}

export abstract class AbstractServiceWeb extends AbstractService {

	protected _type = 'web'

}

export abstract class AbstractClass extends AbstractEmitter {

}


export abstract class AbstractService extends AbstractClass implements IService {

	protected _type = 'common'
	protected _id = uuidv4();

	get type() {
		return this._type;
	}


	get id() {
		return this._id;
	}

	abstract execute(payload: any): Promise<any>;

	abstract initialize(): Promise<void>;

	abstract isAvailable(): Promise<boolean>;
	/*
	execute(payload: any): Promise<any> {
		return Promise.resolve(undefined);
	}

	initialize(): Promise<void> {
		return Promise.resolve(undefined);
	}

	isAvailable(): Promise<boolean> {
		return Promise.resolve(false);
	}

	 */


}
