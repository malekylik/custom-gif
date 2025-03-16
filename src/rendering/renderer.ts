export type RendererGifDescriptor = {
  id: number;
};

export interface Renderer {
  setFrame(descriptor: RendererGifDescriptor, frame: number): void;

  autoplayStart(descriptor: RendererGifDescriptor): boolean;

  autoplayEnd(descriptor: RendererGifDescriptor): void;
}
