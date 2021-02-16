export interface Renderer {
  setFrame(frame: number): void;

  autoplayStart(): boolean;

  autoplayEnd(): void;
}
