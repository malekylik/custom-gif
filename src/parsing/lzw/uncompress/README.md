uncompress routines comparison:

JS:
1) uncompress_base - slowest version, except debug one. The same as debug, but doesn't use JS object, instead manage memory with pointers; (4.20)
2) uncompress_suffix - uses 4 bytes for each Table entry, has the same speed as uncompress_base version;
3) uncompress_clz - uses clz to check how many bytes was cosumed, faster by 12% compared to previous (3.70)
4) uncompress - main version and the fastest, by 11% compared to uncompress_clz and by 22% compared to base (3.30)

WASM:
1) uncompress_wasm_code_clz - WASM version of uncompress_clz (uses WASM clz instruction)
2) uncompress_wasm_code - WASM version of uncompress, faster by 34% compared to JS version

JS version - time to uncomprase all frames of a sample gif - 3.50 ms
WASM version - time to uncomprase all frames of a sample gif - 2.30 ms

Note: tests was done by using Ryzen 5 1600 with memory frequency 2666 MHz
