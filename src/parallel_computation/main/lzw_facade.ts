import { ImageDescriptor } from 'src/parsing/gif/image_descriptor';
import { GIF } from '../../parsing/gif/parser';
import { InMessages, LZWInitOutMessage, LZWUncompressOutMessage, OutMessages } from '../protocol';
import LZWParallel from '../worker/lzw_parallel.ts?url';
import { createLZWWorkerFacade } from './lzw_worker_facade';

let lzwWorker = new Worker(LZWParallel, { type: 'module' });

let workerFacade = createLZWWorkerFacade<OutMessages, InMessages>(lzwWorker);

let gifToId = new Map<GIF, number>();
let gifToOut = new Map<BufferId, Uint8Array<ArrayBuffer>>();
let bufferIdToGif = new Map<BufferId, GIF>();

export type BufferId = number & { readonly __tag: unique symbol };
let bufferId = 0;

function lzwParallelFacade() {

    return ({
        allocateBuffer(gif: GIF): BufferId {
            if (!gifToId.has(gif)) {
                throw new Error('Cannot allocate buffer for uninit gif');
            }

            let id: BufferId = bufferId++ as BufferId;

            gifToOut.set(id, new Uint8Array(gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight));
            bufferIdToGif.set(id, gif);

            return id;
        },

        freeBuffer(bufferId: BufferId): void {
            gifToOut.delete(bufferId);
            bufferIdToGif.delete(bufferId);
        },

        async init(gif: GIF) {
            if (gifToId.has(gif)) {
                return;
            }

            const buffer = new Uint8Array(gif.buffer.length);

            for (let i = 0; i < gif.buffer.length; i++) {
                buffer[i] = gif.buffer[i];
            }

            const r: LZWInitOutMessage = await workerFacade.send({ type: 'init', props: { gif: buffer.buffer, screenWidth: gif.screenDescriptor.screenWidth, screenHeight: gif.screenDescriptor.screenHeight } }, [buffer.buffer]);

            gifToId.set(gif, r.props.id);
        },

        // TODO: add clear buffers as well
        async freeGif(gif: GIF): Promise<void> {
            let id = gifToId.get(gif);
            await workerFacade.send({ type: 'free', props: { id } });

            gifToId.delete(gif);
        },

        async uncompress(gif: GIF, image: ImageDescriptor, bufferId: BufferId): Promise<Uint8Array> {
            let id = gifToId.get(gif);

            let buffer = gifToOut.get(bufferId);
            let _gif = bufferIdToGif.get(bufferId);

            if (buffer === undefined) {
                return Promise.reject(new Error('Cannot found buffer by buffer id'));
            }

            if (_gif !== gif) {
                return Promise.reject(new Error('Buffer id is not associated with gif'));
            }

            const r: LZWUncompressOutMessage = await workerFacade.send({ type: 'uncompress', props: { id, startPointer: image.startPointer, compressedDataSize: image.compressedData.length, data: buffer.buffer } }, [buffer.buffer]);
            const result = new Uint8Array(r.props.data);

            gifToOut.set(bufferId, result);

            return result;
        }
    });
}

export const LZWParallelFacade = lzwParallelFacade();
