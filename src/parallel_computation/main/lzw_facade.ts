import { ImageDescriptor } from 'src/parsing/gif/image_descriptor';
import { GIF } from '../../parsing/gif/parser';
import { InMessages, LZWInitOutMessage, LZWUncompressOutMessage, OutMessages } from '../protocol';
import LZWParallel from '../worker/lzw_parallel.ts?url';
import { createLZWWorkerFacade } from './lzw_worker_facade';

let lzwWorker = new Worker(LZWParallel, { type: 'module' });
let lzwWorkerTimeline = new Worker(LZWParallel, { type: 'module' });

let workerFacade = createLZWWorkerFacade<OutMessages, InMessages>(lzwWorker);
let workerTimelineFacade = createLZWWorkerFacade<OutMessages, InMessages>(lzwWorkerTimeline);

let gifToId = new Map<GIF, number>();
let gifToIdTimline = new Map<GIF, number>();

let currentBufferSize: number = 0;

let lzwBuffer: Uint8Array = new Uint8Array(currentBufferSize);
let timelineBuffer: Uint8Array = new Uint8Array(currentBufferSize);


export type BufferId = number & { readonly __tag: unique symbol };

export enum LZWThread {
    main = 0,
    timeline = 1,
}

function lzwParallelFacade() {

    return ({
        async init(gif: GIF) {
            if (gifToId.has(gif)) {
                return;
            }

            const buffer = new Uint8Array(gif.buffer.length);

            for (let i = 0; i < gif.buffer.length; i++) {
                buffer[i] = gif.buffer[i];
            }

            const lzwBuffer = new Uint8Array(gif.buffer.length);

            for (let i = 0; i < gif.buffer.length; i++) {
                lzwBuffer[i] = gif.buffer[i];
            }

            const r = await Promise.all([
                workerFacade.send({ type: 'init', props: { gif: buffer.buffer, screenWidth: gif.screenDescriptor.screenWidth, screenHeight: gif.screenDescriptor.screenHeight } }, [buffer.buffer]),
                workerTimelineFacade.send({ type: 'init', props: { gif: lzwBuffer.buffer, screenWidth: gif.screenDescriptor.screenWidth, screenHeight: gif.screenDescriptor.screenHeight } }, [lzwBuffer.buffer]),
            ]) as LZWInitOutMessage[];

            gifToId.set(gif, r[0].props.id);
            gifToIdTimline.set(gif, r[1].props.id);

            let maxPossibleGifFrameSize = gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight;
            if (currentBufferSize < maxPossibleGifFrameSize) {
                currentBufferSize = maxPossibleGifFrameSize;
            }
        },

        async freeGif(gif: GIF): Promise<void> {
            let id = gifToId.get(gif);
            await Promise.all([
                workerFacade.send({ type: 'free', props: { id } }),
                workerTimelineFacade.send({ type: 'free', props: { id } }),
            ]);

            gifToId.delete(gif);
            gifToIdTimline.delete(gif);
        },

        async uncompress(gif: GIF, image: ImageDescriptor, thread: LZWThread): Promise<Uint8Array> {
            let id = LZWThread.main === thread ? gifToId.get(gif) : gifToIdTimline.get(gif);
            let buffer = LZWThread.main === thread ? lzwBuffer : timelineBuffer;
            
            if (buffer.length < currentBufferSize) {
                if (LZWThread.main === thread) {
                    lzwBuffer = new Uint8Array(currentBufferSize);
                    buffer = lzwBuffer;
                } else {
                    timelineBuffer = new Uint8Array(currentBufferSize);
                    buffer = timelineBuffer;
                }
            }

            const facade = LZWThread.main === thread ? workerFacade : workerTimelineFacade;

            const r: LZWUncompressOutMessage = await facade.send({ type: 'uncompress', props: { id, startPointer: image.startPointer, compressedDataSize: image.compressedData.length, data: buffer.buffer } }, [buffer.buffer]);
            const result = new Uint8Array(r.props.data);

            if (buffer.length < currentBufferSize) {
                if (LZWThread.main === thread) {
                    lzwBuffer = new Uint8Array(currentBufferSize);
                } else {
                    timelineBuffer = new Uint8Array(currentBufferSize);
                }
            } else {
                if (LZWThread.main === thread) {
                    lzwBuffer = result;
                } else {
                    timelineBuffer = result;
                }
            }

            return result;
        }
    });
}

export const LZWParallelFacade = lzwParallelFacade();
