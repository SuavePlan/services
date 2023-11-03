export type MiddlewareConfig = {
    get?: ((obj: any, prop: PropertyKey, result: any) => any)[],
    set?: ((obj: any, prop: PropertyKey, value: any) => any)[],
    apply?: ((targetFn: Function, thisArg: any, argumentsList: any[], callResult: any) => any)[],
    has?: ((obj: any, prop: PropertyKey, hasProp: boolean) => any)[],
    deleteProperty?: ((obj: any, prop: PropertyKey, success: boolean) => any)[],
    ownKeys?: ((obj: any, keys: PropertyKey[]) => any)[],
    getOwnPropertyDescriptor?: ((obj: any, prop: PropertyKey, descriptor: PropertyDescriptor) => any)[],
    defineProperty?: ((obj: any, prop: PropertyKey, descriptor: PropertyDescriptor, success: boolean) => any)[],
    getPrototypeOf?: ((obj: any, proto: any) => any)[],
    setPrototypeOf?: ((obj: any, prototype: any, success: boolean) => any)[],
    isExtensible?: ((obj: any, extensible: boolean) => any)[],
    preventExtensions?: ((obj: any, success: boolean) => any)[],
};

export default function middleware(target: any, middleware: MiddlewareConfig = {}) {
    // Filter out empty keys from the middleware object
    const filteredMiddleware = Object.entries(middleware).reduce((acc, [key, value]) => {
        if (value && value.length > 0) {
            acc[key] = value;
        }
        return acc;
    }, {} as MiddlewareConfig);

    const handlerConfig = {
        get: function (obj, prop) {
            let result = obj[prop];

            if (filteredMiddleware.get) {
                filteredMiddleware.get.forEach(middleware => {
                    result = middleware(obj, prop, result);
                });
            }

            // If the result is a function, wrap it in its own proxy to intercept calls
            if (typeof result === 'function') {
                return new Proxy(result, {
                    apply: function (targetFn, thisArg, argumentsList) {
                        let callResult = Reflect.apply(targetFn, thisArg, argumentsList);
                        if (filteredMiddleware.apply) {
                            filteredMiddleware.apply.forEach(middleware => {
                                callResult = middleware(targetFn, thisArg, argumentsList, callResult);
                            });
                        }
                        return callResult;
                    }
                });
            }

            return result;
        },
        set: filteredMiddleware.set && function (obj, prop, value) {
            filteredMiddleware.set!.forEach(middleware => {
                value = middleware(obj, prop, value);
            });
            obj[prop] = value;
            return true;
        },
        has: filteredMiddleware.has && function (obj, prop) {
            let hasProp = prop in obj;
            filteredMiddleware.has!.forEach(middleware => {
                hasProp = middleware(obj, prop, hasProp);
            });
            return hasProp;
        },
        deleteProperty: filteredMiddleware.deleteProperty && function (obj, prop) {
            let success = delete obj[prop];
            filteredMiddleware.deleteProperty!.forEach(middleware => {
                success = middleware(obj, prop, success);
            });
            return success;
        },
        ownKeys: filteredMiddleware.ownKeys && function (obj) {
            let keys = Reflect.ownKeys(obj);
            filteredMiddleware.ownKeys!.forEach(middleware => {
                keys = middleware(obj, keys);
            });
            return keys;
        },
        getOwnPropertyDescriptor: filteredMiddleware.getOwnPropertyDescriptor && function (obj, prop) {
            let descriptor = Reflect.getOwnPropertyDescriptor(obj, prop);
            filteredMiddleware.getOwnPropertyDescriptor!.forEach(middleware => {
                descriptor = middleware(obj, prop, descriptor);
            });
            return descriptor;
        },
        defineProperty: filteredMiddleware.defineProperty && function (obj, prop, descriptor) {
            let success = Reflect.defineProperty(obj, prop, descriptor);
            filteredMiddleware.defineProperty!.forEach(middleware => {
                success = middleware(obj, prop, descriptor, success);
            });
            return success;
        },
        getPrototypeOf: filteredMiddleware.getPrototypeOf && function (obj) {
            let proto = Reflect.getPrototypeOf(obj);
            filteredMiddleware.getPrototypeOf!.forEach(middleware => {
                proto = middleware(obj, proto);
            });
            return proto;
        },
        setPrototypeOf: filteredMiddleware.setPrototypeOf && function (obj, prototype) {
            let success = Reflect.setPrototypeOf(obj, prototype);
            filteredMiddleware.setPrototypeOf!.forEach(middleware => {
                success = middleware(obj, prototype, success);
            });
            return success;
        },
        isExtensible: filteredMiddleware.isExtensible && function (obj) {
            let extensible = Reflect.isExtensible(obj);
            filteredMiddleware.isExtensible!.forEach(middleware => {
                extensible = middleware(obj, extensible);
            });
            return extensible;
        },
        preventExtensions: filteredMiddleware.preventExtensions && function (obj) {
            let success = Reflect.preventExtensions(obj);
            filteredMiddleware.preventExtensions!.forEach(middleware => {
                success = middleware(obj, success);
            });
            return success;
        }
    };

    return new Proxy(target, handlerConfig as ProxyHandler<MiddlewareConfig>);
}


export const timingMiddleware = (targetFn: Function, thisArg: any, argumentsList: any[], callResult: any): any => {
    const startTime = Date.now();
    const result = Reflect.apply(targetFn, thisArg, argumentsList);
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`[Diagnostic] targetFn.name: ${targetFn.name}`, callResult); // Diagnostic log
    console.log(`Method ${targetFn.name} took ${duration}ms`);
    return result;
};


export const debugMiddleware = (targetFn: Function, thisArg: any, argumentsList: any[], callResult: any): any => {
    try {
        return Reflect.apply(targetFn, thisArg, argumentsList);
    } catch (error) {
        console.log(`Error in method ${targetFn.name}`, error, callResult);
        throw error; // re-throw the error after logging
    }
};

export function createDecorator(middlewareFunctions: Function[]) {
    return {
        ClassDecorator: function (methods?: string[]) {
            return function (constructor: Function) {
                console.log('ClassDecorator applied'); // Diagnostic log
                const prototype = constructor.prototype;
                const keys = Object.getOwnPropertyNames(prototype);

                keys.forEach(key => {
                    const originalMethod = prototype[key];

                    if (typeof originalMethod === 'function' && (!methods || methods.includes(key))) {
                        console.log(`Applying middleware to method: ${key}`); // Diagnostic log
                        prototype[key] = middleware(originalMethod, {apply: middlewareFunctions});
                    }
                });
            };
        },
        MethodDecorator: function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
            console.log(`MethodDecorator applied to method: ${propertyKey}`); // Diagnostic log
            const originalMethod = descriptor.value;
            descriptor.value = middleware(originalMethod, {apply: middlewareFunctions});
            return descriptor;
        }
    };
}
