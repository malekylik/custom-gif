export enum LZWWorkerMessageType {
  ready = 'ready',
  setId = 'set_id',
  idSetted = 'id_setted',
  saveGif = 'save_gif',
  gifSaved = 'gif_saved',
  uncompress = 'uncompress',
  uncompressDone = 'uncompressDone',
}

export type LZWWorkerMessageReady = {
  type: LZWWorkerMessageType.ready;
}

export type LZWWorkerMessageSaveGif = {
  type: LZWWorkerMessageType.saveGif;
  id: string;
  gif: ArrayBuffer;
}

export type LZWWorkerMessageSetId = {
  type: LZWWorkerMessageType.setId;
  id: string;
}

export type LZWWorkerMessageIdSetted = {
  type: LZWWorkerMessageType.idSetted;
  id: string;
}

export type LZWWorkerMessageGifSaved = {
  type: LZWWorkerMessageType.gifSaved;
  id: string;
}

export type LZWWorkerMessageUncompress = {
  type: LZWWorkerMessageType.uncompress;
  gifId: string;
  pointer: number;
  size: number;
  out: ArrayBuffer;
}

export type LZWWorkerMessageUncompressDone = {
  type: LZWWorkerMessageType.uncompressDone;
  gifId: string;
  out: ArrayBuffer;
}

export type LZWWorkerMessage = LZWWorkerMessageReady
  | LZWWorkerMessageSetId
  | LZWWorkerMessageIdSetted
  | LZWWorkerMessageSaveGif
  | LZWWorkerMessageGifSaved
  | LZWWorkerMessageUncompress
  | LZWWorkerMessageUncompressDone;

