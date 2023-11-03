export default function proxyWithFeatures(target: any, options?: any) {

    const shouldProxyMethod = (methodName?: string): boolean => {
        if (typeof options === 'undefined') {
            options = {}
        }
        const {methodFilter} = options;
        if (typeof methodFilter === 'string') {
            return methodName!.startsWith(methodFilter);
        } else if (methodFilter instanceof RegExp) {
            return methodFilter.test(methodName || '');
        } else if (Array.isArray(methodFilter)) {
            return methodFilter.some(prefix => methodName!.startsWith(prefix));
        }
        return false;
    };

    const handler = {
        get: (obj, prop: string) => {
            const originalFunction = obj[prop];
            if (typeof originalFunction === 'function' && shouldProxyMethod(prop)) {
                return async (...args: any[]) => {
                    let result;
                    let startTime, endTime;

                    if (options.trackTiming) {
                        startTime = new Date().toISOString();
                    }

                    try {
                        result = await originalFunction.apply(obj, args);

                        if (options.emitEvents) {
                            const hyphenated = prop.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
                            obj.emit(`${obj.name}:${hyphenated}:success`, ...args);
                        }

                        if (options.trackTiming) {
                            endTime = new Date().toISOString();
                            const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
                            if (options.debug) {
                                console.log(`Method ${prop} took ${duration}ms`);
                            }
                        }

                        return result;
                    } catch (error) {
                        if (options.catchError && options.emitEvents) {
                            const hyphenated = prop.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
                            obj.emit(`${obj.name}:${hyphenated}:failure`, error, ...args);
                        }

                        if (options.debug) {
                            console.log(`Error in method ${prop}`, error);
                        }

                        throw error;
                    }
                };
            }
            return originalFunction;
        }
    }

    return new Proxy(target, handler);
}
