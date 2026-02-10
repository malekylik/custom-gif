import { Mat3 } from "./mat3";

export class Vec1 {
    private buffer: Float32Array;

    constructor (size: number) {
        this.buffer = new Float32Array(size);
    }

    getBuffer(): Float32Array {
        return this.buffer;
    }
}

export function mat3ToVec1(m: Mat3): Vec1 {
    const v = new Vec1(9);

    m.getBuffer().forEach((_, i) => {
        v.getBuffer()[i] = m.getBuffer()[i];
    });

    return v;
}
