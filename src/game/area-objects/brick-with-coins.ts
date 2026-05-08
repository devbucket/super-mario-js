import type { GameRam } from '../types.js';
import { brickWithItem } from './brick-with-item.js';

export function brickWithCoins(ram: GameRam): void {
  brickWithItem(ram);
}
