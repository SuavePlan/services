// Container.test.ts
import 'reflect-metadata';
import {Container as TypeDiContainer, Service, Token} from 'typedi';
import Container from '../src/index';
import EventEmitter from "../src/emitter/EventEmitter";
import AbstractEmitter from "../src/emitter";

@Service('event.default')
export class DefaultEventService {
    // your class functionality
    emit(event: string) {
        return `Default event emitted: ${event}`;
    }
}

@Service('event.emittery')
export class EmitteryEventService {
    // your class functionality
    emit(event: string) {
        return `Emittery event emitted: ${event}`;
    }
}

describe('Container', () => {

    afterEach(() => {
        // Reset the TypeDI container after each test to ensure isolation
        TypeDiContainer.reset();
		Container.set('event', EventEmitter);
    });

    test('should fetch the default service', () => {
        const defaultEvent = Container.get<AbstractEmitter>('event');
        expect(defaultEvent.emit('Hello')).toBe('Default event emitted: Hello');
    });

    test('should fetch the specific service using dot notation', () => {
        const emitteryEvent = Container.get('event.emittery');
        expect(emitteryEvent.emit('Goodbye')).toBe('Emittery event emitted: Goodbye');
    });

    test('should throw an error if service is not found', () => {
        expect(() => {
            Container.get('nonexistent');
        }).toThrowError('Service not found: nonexistent');
    });

    @Service()
    class TestService {
    }

    @Service('Test.default')
    class TestDefaultService {
    }

    const token = new Token<TestService>('TEST_SERVICE');

    @Service(token)
    class TokenTestService {
    }

    it('should fetch service by string token', () => {
        const instance = Container.get('Test.default');
        expect(instance).toBeInstanceOf(TestDefaultService);
    });

    it('should fetch default service if no service is found by the provided name and there is no dot notation', () => {
        const instance = Container.get('Test');
        expect(instance).toBeInstanceOf(TestDefaultService);
    });

    it('should throw error if no service is found', () => {
        expect(() => Container.get('NonExistent')).toThrowError('Service not found: NonExistent');
    });

    it('should fetch service by Token', () => {
        const instance = Container.get(token);
        expect(instance).toBeInstanceOf(TokenTestService);
    });

    it('should retrieve a service for a class', () => {
        @Service()
        class DummyClassService {
        }

        Container.set('dcs', new DummyClassService());

        const instance = Container.get('dcs');
        expect(instance).toBeInstanceOf(DummyClassService);
    });

    it('should throw for a non-class function', () => {
        function dummyFunction() {
        }

        expect(() => Container.get(dummyFunction)).toThrowError('Service not found: dummyFunction');
    });

});

