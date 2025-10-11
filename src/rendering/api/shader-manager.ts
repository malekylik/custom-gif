import { GLProgram } from "../gl/gl_api/program";

export interface ShaderManager {
    getProgram(programId: number): /** TODO: abstract */ GLProgram;
}

export enum ShaderPromgramId {
    ScreenDrawer = 0,
    FlipDrawer = 1,
    CopyDrawer = 2,
    MixDrawer = 3,

    GifAlpha = 10,
    GifFrame = 11,

    BlackAndWhite = 100,
    Mandess = 101,
    Darking = 102,
}
