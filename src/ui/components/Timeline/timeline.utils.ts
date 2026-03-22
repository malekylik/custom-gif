export type ScrollRenderData = {
  currentFrame: number;
  // number of frames to skip from beginning to draw first thumbnail frame
  frameStartOffset: number;
  // current frame position - sroll position (in px)
  normilizedStartPadding: number;
  thumbnailFrames: number[];
}

export function getCurrentVisibleFrame(position: number, frameWidth: number): number {
  return (position / frameWidth) | 0;
}

// TODO: chekc for ezgif.com-webp-to-gif-converter seems like calculate incorectlly
export function getNextThumbnailFrames(currentFrame: number, offset: number, numberOfNextFrames: number): number[] {
  let firstThubnailFrames = Math.floor(currentFrame / offset) * offset;

  if (firstThubnailFrames < currentFrame) {
    firstThubnailFrames += offset;
  }

  let frames: number[] = [];

  for (let i = 0; i < numberOfNextFrames; i++) {
    frames.push(firstThubnailFrames + i * offset);
  }

  return frames;
}
