/**
 * Resolves which half-buffer and column offset correspond to the byte fed to
 * `GetBlockBufferAddr` in the reference (`columnByte`: ring slot 0–31).
 *
 * Each logical bank is stored as its own 208-byte array; high nybble selects bank,
 * low nybble selects column 0–15 within that bank (same layout as
 * `writeMetatileColumnToBlockBuffers`).
 */

export interface BlockBufferAddrResult {
  /** 0 = first 16-column bank (`blockBuffer1`), 1 = second (`blockBuffer2`). */
  bufferIndex: 0 | 1;
  /** Starting byte offset 0–15 for this column within that bank (row stride is 16). */
  columnStartOffset: number;
}

export function getBlockBufferAddr(columnByte: number): BlockBufferAddrResult {
  const low = columnByte & 0xff;
  const highNybble = (low >>> 4) & 0x0f;
  /** Reference only exposes two decode slots; gameplay keeps high nybble to 0 or 1. */
  const bufferIndex: 0 | 1 = highNybble === 0 ? 0 : 1;

  return {
    bufferIndex,
    columnStartOffset: low & 0x0f,
  };
}
