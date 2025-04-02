import { createGLResourceManager, GLResourceManager } from './gl_api/gl-resource-manager';

const glResources: Map<string, { reosuceManager: GLResourceManager }> = new Map();

export function initGLSystem(gl: WebGL2RenderingContext, systemName: string): void {
    glResources.set(
        systemName,
        { reosuceManager: createGLResourceManager(gl) }
    );
}

export function getGLSystem(systemName: string) {
    return glResources.get(systemName);
}
