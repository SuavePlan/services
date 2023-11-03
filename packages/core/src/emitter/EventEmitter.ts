import {event, EventEmitter2} from 'eventemitter2';
import AbstractEmitter, {eventNS, ListenerFn} from "./";
import {Service} from "typedi";

@Service('event.default')
export default class EventEmitter extends AbstractEmitter {

    constructor() {
        super();
        this._ee = new EventEmitter2({
            wildcard: true,
            delimiter: ':',
            newListener: false,
            maxListeners: 20,
            verboseMemoryLeak: false
        });

        return new Proxy(this, {
            get: (target, prop, receiver) => {
				if (typeof prop === 'string' || typeof prop === 'symbol') {
					if (this.hasOwnProperty(prop) && typeof this[prop as keyof this] === 'function') {
						return Reflect.get(target, prop, receiver);
					}
				}
                if (typeof this._ee[prop] === 'function') {
                    return this._ee[prop].bind(this._ee);
                }
                return Reflect.get(target, prop, receiver);
            }
        });
    }


    addListener(eventName: event, listener: ListenerFn): this {
        this._ee.on(eventName, listener);
        return this;
    }

    emit(eventName: event, ...args: any[]): boolean {
        return this._ee.emit(eventName, ...args);
    }

    eventNames(): (event | eventNS)[] {
        return this._ee.eventNames();
    }

    getMaxListeners(): number {
        return this._ee.getMaxListeners();
    }

    listenerCount(eventName: event): number {
        return this._ee.listenerCount(eventName);
    }

    listeners(eventName: event): ListenerFn[] {
        return this._ee.listeners(eventName);
    }

    off(eventName: event, listener: ListenerFn): this {
        this._ee.off(eventName, listener);
        return this;
    }

    on(eventName: event, listener: ListenerFn): this {
        this._ee.on(eventName, listener);
        return this;
    }

    once(eventName: event, listener: ListenerFn): this {
        this._ee.once(eventName, listener);
        return this;
    }

    prependListener(eventName: event, listener: ListenerFn): this {
        this._ee.prependListener(eventName, listener);
        return this;
    }

    prependOnceListener(eventName: event, listener: ListenerFn): this {
        this._ee.prependOnceListener(eventName, listener);
        return this;
    }

    removeAllListeners(eventName?: event): this {
        this._ee.removeAllListeners(eventName);
        return this;
    }

    removeListener(eventName: event, listener: ListenerFn): this {
        this._ee.removeListener(eventName, listener);
        return this;
    }

    setMaxListeners(n: number): this {
        this._ee.setMaxListeners(n);
        return this;
    }
}

export {EventEmitter}
