import { FactoryResult } from "src/parsing/lzw/factory/uncompress_factory";
import { createLZWFuncFromWasm } from "../../parsing/lzw/factory/uncompress_factory_wasm";
import { createLZWWorkerFacade } from "../main/lzw_worker_facade";
import { InMessages, OutMessages } from "../protocol";

let workerFacade = createLZWWorkerFacade<InMessages, OutMessages>(self);

const map = new Map<number, FactoryResult>();
let id = 0;

function copyBuffer(buf: Uint8Array, to: Uint8Array<ArrayBuffer>): Uint8Array<ArrayBuffer> {
    for (let i = 0; i < buf.length; i++) {
        to[i] = buf[i];
    }

    return to;
}

workerFacade.on(async (e) => {
    if (e.type === 'init') {
        const lzw_uncompress = await createLZWFuncFromWasm({ buffer: new Uint8Array(e.props.gif), screenDescriptor: { screenWidth: e.props.screenWidth, screenHeight: e.props.screenHeight } });
        const currentId = id++;
        map.set(currentId, lzw_uncompress);
        workerFacade.reply({ type: 'init', props: { id: currentId } }, e);
    }

    if (e.type === 'free') {
        map.delete(e.props.id);

        console.log('worker map', map);

        workerFacade.reply({ type: 'free', props: undefined }, e);
    }

    if (e.type === 'uncompress') {
        const uncompress = map.get(e.props.id);

        if (uncompress === undefined) {
            console.warn('cannot find lzw algo by id', e.props.id);

            return;
        }

        uncompress.lzw_uncompress({ startPointer: e.props.startPointer, compressedDataSize: e.props.compressedDataSize });
        const result = copyBuffer(uncompress.out, new Uint8Array(e.props.data));

        workerFacade.reply({ type: 'uncompress', props: { data: result.buffer } }, e, [result.buffer]);
    }
});
