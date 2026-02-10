import { createGLResourceManager, GLResourceManager } from './gl_api/gl-resource-manager';
import { createGLShaderManager, GLShaderManager } from './gl_api/gl-shader-manager';

const glResources: Map<string, { resouceManager: GLResourceManager; shaderManager: GLShaderManager }> = new Map();

export function initGLSystem(gl: WebGL2RenderingContext, systemName: string): void {
    glResources.set(
        systemName,
        { resouceManager: createGLResourceManager(gl, systemName), shaderManager: createGLShaderManager(gl, systemName) }
    );
}

// TODO: should dispose all system automatically
export function disposeGLSystem(systemName: string): void {
    glResources.delete(systemName);
}

export function getGLSystem(systemName: string) {
    return glResources.get(systemName);
}
