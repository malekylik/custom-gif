import { ImageDescriptor } from 'src/parsing/gif/image_descriptor';
import { GIF, restoreGif } from '../../parsing/gif/parser';
import { InMessages, LZWInitOutMessage, LZWUncompressOutMessage, OutMessages } from '../protocol';
import LZWParallel from '../worker/lzw_parallel.ts?url';
import { createLZWWorkerFacade } from './lzw_worker_facade';

const MAX_BACKGROUND_WORKERS = 3;

type WorkerType = {
    worker: ReturnType<typeof createLZWWorkerFacade>;
    occupied: boolean;
    buffer: Uint8Array;
    priority: LZWThread;
    gifToId: Map<GIF, number>;
    jobs: ((w: WorkerType) => void)[];
};

let workers: WorkerType[] = [];

let gifToId = new Map<GIF, number>();

let currentBufferSize: number = 0;

export enum LZWThread {
    timeline = 0,
    main = 1,
}

function lzwParallelFacade() {
    workers.push({
        worker: createLZWWorkerFacade<OutMessages, InMessages>(new Worker(LZWParallel, { type: 'module' })),
        occupied: false,
        buffer: new Uint8Array(currentBufferSize),
        priority: LZWThread.main,
        gifToId: new Map(),

        jobs: [],
    });

    for (let i = 0; i < MAX_BACKGROUND_WORKERS; i++) {
        workers.push({
            worker: createLZWWorkerFacade<OutMessages, InMessages>(new Worker(LZWParallel, { type: 'module' })),
            occupied: false,
            buffer: new Uint8Array(currentBufferSize),
            priority: LZWThread.timeline,

            gifToId: new Map(),

            jobs: [],
        });
    }

    let jobs: ((w: WorkerType) => void)[] = [];

    return ({
        async init(gif: GIF): Promise<void> {
            if (gifToId.has(gif)) {
                return;
            }
            let gifBuffer = gif.buffer.buffer as ArrayBuffer;

            for (let w of workers) {
                if (w.occupied) {
                    await scheduleJob(w.jobs);
                }
                w.occupied = true;
                let r: LZWInitOutMessage = await w.worker.send({ type: 'init', props: { gif: gifBuffer, screenWidth: gif.screenDescriptor.screenWidth, screenHeight: gif.screenDescriptor.screenHeight } }, [gifBuffer]);

                freeWorker(w);

                w.gifToId.set(gif, r.props.id);

                gifBuffer = r.props.gif;
            }

            restoreGif(gif, gifBuffer);

            let maxPossibleGifFrameSize = gif.screenDescriptor.screenWidth * gif.screenDescriptor.screenHeight;
            if (currentBufferSize < maxPossibleGifFrameSize) {
                currentBufferSize = maxPossibleGifFrameSize;
            }
        },

        async freeGif(gif: GIF): Promise<void> {
            return Promise.all(workers.map(async w => {
                if (w.occupied) {
                    await scheduleJob(w.jobs);
                }

                let id = w.gifToId.get(gif);

                w.occupied = true;
                await w.worker.send({ type: 'free', props: { id: id } });

                w.gifToId.delete(gif);

                freeWorker(w);
            })).then();
        },

        // Add multiple thread for lzw
        async uncompress(gif: GIF, image: ImageDescriptor, thread: LZWThread): Promise<{ readBuffer: () => Uint8Array; [Symbol.dispose]: () => void; }> {
            const worker = await getNextWorker(thread);

            let id = worker.gifToId.get(gif);

            if (worker.buffer.length < currentBufferSize) {
                worker.buffer = new Uint8Array(currentBufferSize);
            }

            const workerBufferLength = worker.buffer.length;
            const r: LZWUncompressOutMessage = await worker.worker.send({ type: 'uncompress', props: { id, startPointer: image.startPointer, compressedDataSize: image.compressedData.length, data: worker.buffer.buffer } }, [worker.buffer.buffer]);
            const result = new Uint8Array(r.props.data);

            if (workerBufferLength < currentBufferSize) {
                worker.buffer = new Uint8Array(currentBufferSize);
            } else {
                worker.buffer = result;
            }

            return ({
                readBuffer(): Uint8Array {
                    freeWorker(worker);

                    return worker.buffer;
                },

                [Symbol.dispose]() {
                    freeWorker(worker)
                }
            });
        },

        getNumberOfFreeWorkers(priority: LZWThread): number {
            return workers.filter(w => isFreeWorker(w, priority)).length;
        }
    });

    async function getNextWorker(priority: LZWThread): Promise<WorkerType> {
        const freeWorkers = workers.filter(w => isFreeWorker(w, priority));

        if (freeWorkers.length > 0) {
            freeWorkers[0].occupied = true;
            return freeWorkers[0];
        }

        return scheduleJob(jobs);
    }

    function isFreeWorker(worker: WorkerType, priority: LZWThread): boolean {
        return !worker.occupied && worker.priority <= priority;
    }

    function scheduleJob(jobs: ((w: WorkerType) => void)[]): Promise<WorkerType> {
        let release = (w: WorkerType) => {};
        let job = new Promise<WorkerType>((r) => { release = r; });

        jobs.push(release);

        return job;
    }

    function freeWorker(worker: WorkerType): void {
        worker.occupied = false;

        if (worker.jobs.length > 0) {
            const job = worker.jobs[0];
            worker.jobs = worker.jobs.slice(1);
            job(worker);
        }

        if (jobs.length > 0) {
            const job = jobs[0];
            jobs = jobs.slice(1);
            job(worker);
        }
    }
}

export const LZWParallelFacade = lzwParallelFacade();
