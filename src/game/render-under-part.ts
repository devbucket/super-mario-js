import type { GameRam } from './types.js';

export function renderUnderPart(ram: GameRam, startRow: number, metatileValue: number, heightCounterInitial: number): void {
  let row = startRow;
  let heightCounter = heightCounterInitial;

  while (true) {
    const existing = ram.metatileBuffer[row];
    let shouldDraw = false;

    if (existing === 0) {
      shouldDraw = true;
    } else if (existing === 0x17 || existing === 0x1a) {
      shouldDraw = false;
    } else if (existing === 0xc0) {
      shouldDraw = true;
    } else if (existing >= 0xc0) {
      shouldDraw = false;
    } else if (existing !== 0x54) {
      shouldDraw = true;
    } else if (metatileValue === 0x50) {
      shouldDraw = false;
    } else {
      shouldDraw = true;
    }

    if (shouldDraw) {
      ram.metatileBuffer[row] = metatileValue;
    }

    row++;

    if (row >= 0x0d) {
      return;
    }

    heightCounter--;

    if (heightCounter < 0) {
      return;
    }
  }
}
