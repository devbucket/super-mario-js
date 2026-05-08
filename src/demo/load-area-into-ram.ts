import { findAreaPointer } from '../game/find-area-pointer.js';
import { getAreaDataAddrs } from '../game/get-area-data-addrs.js';
import type { GameRam } from '../game/types.js';

export function loadAreaIntoRam(ram: GameRam, worldNumber: number, areaNumber: number): void {
  ram.worldNumber = worldNumber;
  ram.areaNumber = areaNumber;
  findAreaPointer(ram);
  getAreaDataAddrs(ram);
}
