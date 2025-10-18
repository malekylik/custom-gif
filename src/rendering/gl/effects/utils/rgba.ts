export class RGBA extends Array {
    get r() {
        return this[0];
    }

    set r(v: number) {
        this[0] = v;
    }

    get g() {
        return this[1];
    }

    set g(v: number) {
        this[1] = v;
    }

    get b() {
        return this[2];
    }

    set b(v: number) {
        this[2] = v;
    }

    get a() {
        return this[3];
    }

    set a(v: number) {
        this[3] = v;
    }

    constructor () {
        super(4);

        this[0] = 0.0;
        this[1] = 0.0;
        this[2] = 0.0;
        this[3] = 1.0;
    }
}

export const BlackRGBA = new RGBA();

export const WhiteRGBA = new RGBA();

WhiteRGBA.r = 1.0;
WhiteRGBA.g = 1.0;
WhiteRGBA.b = 1.0;
WhiteRGBA.a = 1.0;
