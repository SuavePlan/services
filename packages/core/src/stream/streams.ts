export type StreamTypes = {
    ReadableStream: typeof globalThis.ReadableStream;
    WritableStream: typeof globalThis.WritableStream;
    TransformStream: typeof globalThis.TransformStream;
};

let streams: StreamTypes;

if (globalThis.ReadableStream && globalThis.WritableStream && globalThis.TransformStream) {
    streams = globalThis as unknown as StreamTypes;
} else {
    try {
        streams = await import("node:stream/web") as unknown as StreamTypes;
    } catch {
        streams = await import("web-streams-polyfill/es2018") as unknown as StreamTypes;
    }
}

export const {ReadableStream, WritableStream, TransformStream} = streams;
