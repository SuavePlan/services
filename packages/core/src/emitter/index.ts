
export * from './EventEmitter'

export type event = (symbol | string);
export type eventNS = string | event[];

export interface ListenerFn {
	(...values: any[]): void;
}

export default class AbstractEmitter {

	protected _ee: any;

	get emitter() {
		return this._ee;
	}

	addListener(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('addListener not implemented');
	}

	emit(eventName: event, ...args: any[]): boolean {
		throw new Error('emit not implemented');
	}

	eventNames(): (event | eventNS)[] {
		throw new Error('eventNames not implemented');
	}

	getMaxListeners(): number {
		throw new Error('getMaxListeners not implemented');
	}

	listenerCount(eventName: event, listener?: ListenerFn): number {
		throw new Error('listenerCount not implemented');
	}

	listeners(eventName?: event | eventNS): ListenerFn[] {
		throw new Error('listeners not implemented');
	}

	off(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('off not implemented');
	}

	on(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('on not implemented');
	}

	once(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('once not implemented');
	}

	prependListener(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('prependListener not implemented');
	}

	prependOnceListener(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('prependOnceListener not implemented');
	}

	removeAllListeners(event?: event): this {
		throw new Error('removeAllListeners not implemented');
	}

	removeListener(eventName: event, listener: (...args: any[]) => void): this {
		throw new Error('removeListener not implemented');
	}

	setMaxListeners(n: number): this {
		throw new Error('setMaxListeners not implemented');
	}

}

export {AbstractEmitter}
