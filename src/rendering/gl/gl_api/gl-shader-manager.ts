import { ShaderManager, ShaderPromgramId } from '../../api/shader-manager';
import { GLProgram } from './program';
import { createFragmentGLShader, createVertexGLShader, deleteShader } from './shader';

import MainVertText from '../shader_assets/main.vert';
import MadnessVertText from '../shader_assets/madness.vert';

import TextureFragText from '../shader_assets/texture.frag';
import BlackAndWhiteFragText from '../shader_assets/blanckWhiteTexture.frag';
import MixTextureFragText from '../shader_assets/mixTextures.frag';
import TextureAlpha from '../shader_assets/textureAlpha.frag';
import TextureWithPalleteFragText from '../shader_assets/textureWithPallete.frag';
import MadnessEffectText from '../shader_assets/madness.frag';
import DarkingEffectText from '../shader_assets/darking.frag';
import ConvolutionMatrixText from '../shader_assets/convolutionMatrix.frag';

export interface GLShaderManager extends ShaderManager {
    dispose(): void;
}

export function createGLShaderManager(gl: WebGL2RenderingContext, id: string): GLShaderManager {
    /**
     * Thinking about deleting that are not in use anymore
     * Probably ref_couting will work
     */
    let shaders: Map<number, GLProgram> = new Map();

    return {
        getProgram(programId) {
            if (shaders.has(programId)) {
                return shaders.get(programId);
            }

            let { vertText, fragText } = getProgramText(programId);

            if (vertText === '' || fragText === '') {
                console.warn(id, '- Unknown program id -', ShaderPromgramId[programId]);
                const { vertText: _vertText, fragText: _fragText } = getDefaultProgramText();

                vertText = _vertText;
                fragText = _fragText;
            }

            const vertShader = createVertexGLShader(gl, vertText);
            const fragBaseShader = createFragmentGLShader(gl, fragText);

            const program = new GLProgram(gl, vertShader, fragBaseShader);

            deleteShader(gl, vertShader);
            deleteShader(gl, fragBaseShader);

            if (!program.isProgramCreated()) {
                console.warn(id, '- Program fail -', ShaderPromgramId[programId]);
            }

            shaders.set(programId, program);

            return program;
        },

        dispose() {
            shaders.values().forEach(shader => shader.dispose(gl));
            shaders = null;
        },
    };

    function getProgramText(programId: number): { vertText: string; fragText: string; } {
        if (programId === ShaderPromgramId.ScreenDrawer || programId === ShaderPromgramId.CopyDrawer) {
            return { vertText: MainVertText, fragText: TextureFragText };
        }

        if (programId === ShaderPromgramId.FlipDrawer) {
            return { vertText: MainVertText, fragText: TextureFragText };
        }

        if (programId === ShaderPromgramId.MixDrawer) {
            return { vertText: MainVertText, fragText: MixTextureFragText };
        }

        if (programId === ShaderPromgramId.BlackAndWhite) {
            return { vertText: MainVertText, fragText: BlackAndWhiteFragText };
        }

        if (programId === ShaderPromgramId.GifAlpha) {
            return { vertText: MainVertText, fragText: TextureAlpha };
        }

        if (programId === ShaderPromgramId.GifFrame) {
            return { vertText: MainVertText, fragText: TextureWithPalleteFragText };
        }

        if (programId === ShaderPromgramId.Mandess) {
            return { vertText: MadnessVertText, fragText: MadnessEffectText };
        }

        if (programId === ShaderPromgramId.Darking) {
            return { vertText: MainVertText, fragText: DarkingEffectText };
        }

        if (programId === ShaderPromgramId.ConvolutionMatrix) {
            return { vertText: MainVertText, fragText: ConvolutionMatrixText };
        }

        if (programId === ShaderPromgramId.GifTimeline) {
            return { vertText: MainVertText, fragText: TextureFragText };
        }

        return { vertText: '', fragText: '' };
    }

    function getDefaultProgramText() {
        // TODO: use flip drawer as noop shader program, add unknown shader for debuging
        return { vertText: MainVertText, fragText: TextureFragText };
    }
}