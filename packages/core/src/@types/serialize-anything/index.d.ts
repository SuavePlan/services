declare module 'serialize-anything' {
    /**
     * serialize the input
     * @param {*} item - the item to serialize
     * @param [options]
     * @param {number} options.maxDepth - maximum object depth
     * @param {boolean} options.pretty - pretty output
     * @return {string}
     */
    export function serialize(item: any, options?: any): string;

    /**
     * deserialize test that was created from serialize
     * @param {string} jsonData - the test to deserialize
     * @param {function} [getCustomObject] - `SerAny.customObject`
     * @return {*} - the deserialized object
     */
    export function deserialize(jsonData: string, getCustomObject?: (...args: any[]) => any): any;
}
