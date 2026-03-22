export type ParallelComputationMessage = {
    id: number;
    type: string;
    props?: unknown;
};

export type LZWInitInMessage = {
    id: number;
    type: 'init';
    props: { gif: ArrayBuffer; screenWidth: number; screenHeight: number; };
};

export type LZWInitOutMessage = {
    id: number;
    type: 'init';
    props: { id: number; gif: ArrayBuffer; };
};

export type LZWFreeInMessage = {
    id: number;
    type: 'free';
    props: { id: number; };
};

export type LZWFreeOutMessage = {
    id: number;
    type: 'free';
};

export type LZWUncompressInMessage = {
    id: number;
    type: 'uncompress';
    props: { id: number; startPointer: number; compressedDataSize: number; data: ArrayBuffer };
};

export type LZWUncompressOutMessage = {
    id: number;
    type: 'uncompress';
    props: { data: ArrayBuffer; };
};

// export type InOutMessagesMap = {
//     'init': LZWInitOutMessage;
// }

// export type OutInMessagesMap = {
//     'init': LZWInitOutMessage;
// }

export type InMessages = LZWInitInMessage | LZWUncompressInMessage | LZWFreeInMessage;
export type OutMessages = LZWInitOutMessage | LZWUncompressOutMessage | LZWFreeOutMessage;

let messageId = 0;

export function addIdToMessage<T extends Record<string, unknown>>(message: T, id?: number): T & { id: number } {
    id ??= (messageId++) % 16777216;
    return { ...message, id };
}

