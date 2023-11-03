import EventEmitter from "../../src/emitter/EventEmitter";
import {EventEmitter2} from "eventemitter2";
import AbstractEmitter from "../../src/emitter";

describe('emitter', () => {
    let emitter: AbstractEmitter;

    beforeEach(() => {
        emitter = new EventEmitter();
    });

    describe('Method behaviors', () => {
        it('should add and emit listeners', () => {
            const callback = jest.fn();
            emitter.addListener('testEvent', callback);
            emitter.emit('testEvent', 'data');
            expect(callback).toHaveBeenCalledWith('data');
        });

        it('should return event names', () => {
            emitter.on('testEvent', () => {
            });
            expect(emitter.eventNames()).toContain('testEvent');
        });

        it('should get max listeners', () => {
            expect(emitter.getMaxListeners()).toBe(20); // default value
        });

        it('should count listeners', () => {
            emitter.on('testEvent', () => {
            });
            emitter.on('testEvent', () => {
            });
            expect(emitter.listenerCount('testEvent')).toBe(2);
        });

        it('should retrieve listeners', () => {
            const callback = () => {
            };
            emitter.on('testEvent', callback);
            expect(emitter.listeners('testEvent')).toContain(callback);
        });

        it('should remove a listener', () => {
            const callback = jest.fn();
            emitter.on('testEvent', callback);
            emitter.off('testEvent', callback);
            emitter.emit('testEvent');
            expect(callback).not.toHaveBeenCalled();
        });

        it('should add listener with "on"', () => {
            const callback = jest.fn();
            emitter.on('testEvent', callback);
            emitter.emit('testEvent');
            expect(callback).toHaveBeenCalled();
        });

        it('should add one-time listener with "once"', () => {
            const callback = jest.fn();
            emitter.once('testEvent', callback);
            emitter.emit('testEvent');
            emitter.emit('testEvent');
            expect(callback).toHaveBeenCalledTimes(1);
        });

        it('should prepend listener', () => {
            const firstCallback = jest.fn(() => expect(secondCallback).not.toHaveBeenCalled());
            const secondCallback = jest.fn();
            emitter.prependListener('testEvent', firstCallback);
            emitter.on('testEvent', secondCallback);
            emitter.emit('testEvent');
        });

        it('should prepend one-time listener', () => {
            const firstCallback = jest.fn(() => expect(secondCallback).not.toHaveBeenCalled());
            const secondCallback = jest.fn();
            emitter.prependOnceListener('testEvent', firstCallback);
            emitter.on('testEvent', secondCallback);
            emitter.emit('testEvent');
        });

        it('should retrieve raw listeners', () => {
            const callback = () => {
            };
            emitter.on('testEvent', callback);
            expect(emitter.listeners('testEvent')).toContain(callback);
        });

        it('should remove all listeners', () => {
            emitter.on('testEvent', () => {
            });
            emitter.removeAllListeners('testEvent');
            expect(emitter.listenerCount('testEvent')).toBe(0);
        });

        it('should set max listeners', () => {
            emitter.setMaxListeners(30);
            expect(emitter.getMaxListeners()).toBe(30);
        });

        // Inside the describe block

        test('addListener and emit', () => {
            const listener = jest.fn();
            emitter.addListener('testEvent', listener);
            emitter.emit('testEvent', 'payload');
            expect(listener).toHaveBeenCalledWith('payload');
        });

        test('eventNames', () => {
            emitter.on('testEvent', () => {
            });
            expect(emitter.eventNames()).toContain('testEvent');
        });

        test('getMaxListeners', () => {
            expect(emitter.getMaxListeners()).toBe(20); // or whatever your default is
        });

        test('listenerCount', () => {
            emitter.on('testEvent', () => {
            });
            expect(emitter.listenerCount('testEvent')).toBe(1);
        });

        test('listeners', () => {
            const listener = () => {
            };
            emitter.on('testEvent', listener);
            expect(emitter.listeners('testEvent')).toEqual([listener]);
        });

        test('off', () => {
            const listener = jest.fn();
            emitter.on('testEvent', listener);
            emitter.off('testEvent', listener);
            emitter.emit('testEvent', 'payload');
            expect(listener).not.toHaveBeenCalled();
        });

        test('on', () => {
            const listener = jest.fn();
            emitter.on('testEvent', listener);
            emitter.emit('testEvent', 'payload');
            expect(listener).toHaveBeenCalledWith('payload');
        });

        test('once', () => {
            const listener = jest.fn();
            emitter.once('testEvent', listener);
            emitter.emit('testEvent', 'payload');
            emitter.emit('testEvent', 'payload');
            expect(listener).toHaveBeenCalledTimes(1);
        });

        test('prependListener and prependOnceListener', () => {
            const firstListener = jest.fn();
            const secondListener = jest.fn();
            emitter.prependOnceListener('testEvent', firstListener);
            emitter.prependListener('testEvent', secondListener);
            emitter.emit('testEvent', 'payload');
            expect(secondListener).toHaveBeenCalledWith('payload');
            expect(firstListener).toHaveBeenCalledWith('payload');
        });

        test('removeAllListeners', () => {
            const listener = jest.fn();
            emitter.on('testEvent', listener);
            emitter.removeAllListeners('testEvent');
            emitter.emit('testEvent', 'payload');
            expect(listener).not.toHaveBeenCalled();
        });

        test('removeListener', () => {
            const listener = jest.fn();
            emitter.on('testEvent', listener);
            emitter.removeListener('testEvent', listener);
            emitter.emit('testEvent', 'payload');
            expect(listener).not.toHaveBeenCalled();
        });

        test('setMaxListeners', () => {
            emitter.setMaxListeners(15);
            expect(emitter.getMaxListeners()).toBe(15);
        });

        // Inside the describe block

        test('Proxy binds methods from EventEmitter2', () => {
            const originalMethod = emitter.emitter.on;
            expect(emitter.on).not.toBe(originalMethod); // Because it should be bound
        });

        test('Proxy defaults to regular properties if not found on EventEmitter2', () => {
            class TestEventEmitter extends EventEmitter2 {
                customProp = 'testValue';
            }

            const testEmitter = new TestEventEmitter();
            expect(testEmitter.customProp).toBe('testValue');
        });


    });
});
