import { createGLResourceManager, GLResourceManager } from './gl_api/gl-resource-manager';

const glResources: Map<string, { resouceManager: GLResourceManager }> = new Map();

export function initGLSystem(gl: WebGL2RenderingContext, systemName: string): void {
    glResources.set(
        systemName,
        { resouceManager: createGLResourceManager(gl, systemName) }
    );
}

export function getGLSystem(systemName: string) {
    return glResources.get(systemName);
}
