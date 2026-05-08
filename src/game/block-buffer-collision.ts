import { blockBufferXAdder, blockBufferYAdder } from '../data/block-buffer-collision-adders.js';
import { getBlockBufferAddr } from './get-block-buffer-addr.js';

export interface BlockBufferCollisionParams {
  readonly blockBuffer1: Uint8Array;
  readonly blockBuffer2: Uint8Array;
  readonly sprObjectXPx: number;
  readonly sprObjectPageLoc: number;
  readonly sprObjectYPx: number;
  /** Index into `blockBufferXAdder` / `blockBufferYAdder` (routine entry sets `Y`). */
  readonly bufferAdderIndexY: number;
  /** `false` = head/feet (return vertical coord nybble); `true` = side (horizontal nybble). */
  readonly returnHorizontalNybble: boolean;
}

export interface BlockBufferCollisionResult {
  readonly metatileFromBuffer: number;
  /** `$04` equivalent: masked horizontal or vertical coordinate nybble. */
  readonly coordNybble: number;
  /** `$02` equivalent: offset added to column base for buffer indirect read. */
  readonly verticalBufferOffset: number;
}

/**
 * Ports `BlockBufferCollision` — reads metatile from block buffers after resolving address.
 */
export function blockBufferCollision(params: BlockBufferCollisionParams): BlockBufferCollisionResult {
  const xAdder = blockBufferXAdder[params.bufferAdderIndexY] ?? 0;
  const yAdder = blockBufferYAdder[params.bufferAdderIndexY] ?? 0;

  const columnByte = computeColumnByteForBlockBuffer(params.sprObjectXPx, params.sprObjectPageLoc, xAdder);
  const { bufferIndex, columnStartOffset } = getBlockBufferAddr(columnByte);
  const buffer = bufferIndex === 0 ? params.blockBuffer1 : params.blockBuffer2;

  let v = (params.sprObjectYPx + yAdder) & 0xff;

  v &= 0xf0;
  v = (v - 0x20) & 0xff;
  const verticalBufferOffset = v;
  const offset = columnStartOffset + verticalBufferOffset;
  const metatileFromBuffer = buffer[offset] ?? 0;

  let coordNybble: number;

  if (params.returnHorizontalNybble) {
    coordNybble = params.sprObjectXPx & 0x0f;
  } else {
    coordNybble = params.sprObjectYPx & 0x0f;
  }

  return { metatileFromBuffer, coordNybble, verticalBufferOffset };
}

/**
 * Ports the adc / ror / shift chain that feeds `GetBlockBufferAddr` from player X and page.
 */
export function computeColumnByteForBlockBuffer(playerXPx: number, playerPageLoc: number, xAdder: number): number {
  const sum = (playerXPx & 0xff) + (xAdder & 0xff);
  const low = sum & 0xff;
  const carryFromLow = sum > 255 ? 1 : 0;
  const pageSum = ((playerPageLoc & 0xff) + carryFromLow) & 0xff;
  const pageBit = pageSum & 1;
  let a = ((low >> 1) | (pageBit << 7)) & 0xff;

  for (let i = 0; i < 4; i++) {
    a = (a >> 1) & 0xff;
  }

  return a & 0xff;
}

/** Used by tests: 16-bit world X after adding the horizontal probe offset (6502-style wrap). */
export function probeWorldXPx(playerXPx: number, playerPageLoc: number, xAdder: number): number {
  const sum = (playerXPx & 0xff) + (xAdder & 0xff);
  const low = sum & 0xff;
  const carryFromLow = sum > 255 ? 1 : 0;

  const high = ((playerPageLoc & 0xff) + carryFromLow) & 0xff;

  return (high << 8) | low;
}
