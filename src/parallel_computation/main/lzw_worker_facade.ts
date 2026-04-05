import { addIdToMessage, ParallelComputationMessage } from '../protocol';

let pendingMessage = new Map<number, (...args: unknown[]) => void>();

export function createLZWWorkerFacade<inM extends ParallelComputationMessage, outM extends ParallelComputationMessage>(communicatable: Pick<Worker, 'addEventListener'> & Pick<Worker, 'postMessage'>) {
    communicatable.addEventListener('message', (e) => {
        const data = e.data;

        // it's incoming message
        if (!pendingMessage.has(data.id)) {
            listeners.forEach(l => l(e.data));
            return;
        }

        pendingMessage.get(data.id)(data);
        pendingMessage.delete(data.id);
    });

    let listeners: Array<(e: inM) => void> = [];

    return ({
        send<T extends Omit<outM, 'id'>, U>(message: T, transfarable?: Transferable[]): Promise<U> {
            const sendableMessage = addIdToMessage(message);

            if (pendingMessage.has(sendableMessage.id)) {
                pendingMessage.delete(sendableMessage.id);
            }

            if (transfarable) {
                communicatable.postMessage(sendableMessage, transfarable);
            } else {
                communicatable.postMessage(sendableMessage);
            }

            let resolve = (v: U) => {};
            let p = new Promise<U>((r) => {
                resolve = r;
            });

            pendingMessage.set(sendableMessage.id, resolve);

            return p;
        },

        reply<T extends Omit<outM, 'id'>>(message: T, to: inM, transfarable?: Transferable[]): void {
            const sendableMessage = addIdToMessage(message, to.id);

            if (transfarable) {
                communicatable.postMessage(sendableMessage, transfarable);
            } else {
                communicatable.postMessage(sendableMessage);
            }
        },

        on(l: (e: inM) => void): void {
            listeners.push(l);
        }
    });
}
