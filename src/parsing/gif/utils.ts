export function findEndOfSubData(buffer: ArrayBuffer, start: number) {
  const HEAP8 = new Uint8Array(buffer);

  while (HEAP8[start] && start < HEAP8.byteLength) {
    const chunkLength = HEAP8[start];

    start += chunkLength + 1;
  }

  return start + 1;
}
