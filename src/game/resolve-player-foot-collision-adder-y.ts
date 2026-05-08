import { blockBufferAdderData } from '../data/block-buffer-collision-adders.js';
import type { GameRam } from './types.js';

function selectBlockBufferAdderDataIndex(ram: GameRam): number {
  if (ram.crouchingFlag !== 0) {
    return 2;
  }

  if (ram.marioSizeCode === 1) {
    return 2;
  }

  if (ram.swimmingFlag !== 0) {
    return 1;
  }

  return 0;
}

export function resolvePlayerBlockBufferEbValue(ram: GameRam): number {
  return blockBufferAdderData[selectBlockBufferAdderDataIndex(ram)];
}

export function resolvePlayerFootCollisionAdderIndices(ram: GameRam): { leftY: number; rightY: number } {
  const eb = resolvePlayerBlockBufferEbValue(ram);

  return { leftY: eb + 1, rightY: eb + 2 };
}

/**
 * @deprecated Use {@link resolvePlayerFootCollisionAdderIndices}.leftY instead.
 */
export function resolvePlayerFootCollisionAdderY(ram: GameRam): number {
  return resolvePlayerBlockBufferEbValue(ram) + 1;
}
