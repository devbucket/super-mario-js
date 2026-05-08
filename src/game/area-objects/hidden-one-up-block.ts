import type { GameRam } from '../types.js';
import { brickWithItem } from './brick-with-item.js';

export function hiddenOneUpBlock(ram: GameRam): void {
  if (ram.hiddenOneUpFlag === 0) {
    return;
  }

  ram.hiddenOneUpFlag = 0;
  brickWithItem(ram);
}
