import { GIF } from '../gif/parser';

export type GifEntity = {
  gif: GIF;
}

export function createGifEntity(gif: GIF): GifEntity {
  return ({
    gif
  });
}
