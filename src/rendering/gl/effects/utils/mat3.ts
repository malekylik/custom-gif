export class Mat3 {
    private buffer: Float32Array;

    constructor () {
        this.buffer = new Float32Array(9);
    }

    getBuffer(): Float32Array {
        return this.buffer;
    }
}

const initMat = (initValue: number[][]): Mat3 => {
    const m = new Mat3();

    let lengthI = Math.min(3, initValue.length);
    for (let i = 0; i < lengthI; i++) {
        let lengthJ = Math.min(3, initValue[i].length);
        for (let j = 0; j < lengthJ; j++) {
            m.getBuffer()[i * lengthI + j] = initValue[i][j];
        }
    }

    return m;
}

export const getEdgeDetectionFilter = () => {
    return initMat([
        [-1, -1, -1], // Bottom row
        [-1, 8, -1], // Middle row
        [-1, -1, -1], // Top row
    ]);
}
