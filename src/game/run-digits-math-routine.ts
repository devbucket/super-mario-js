import type { GameRam } from './types.js';

const TITLE_OPER_MODE = 0;

/**
 * Multi-digit BCD add/subtract used for score, coins, and the level clock.
 * `displayDigitBaseIndexY` is the lowest-index digit cell touched (same as Y
 * entering the reference routine).
 */
export function runDigitsMathRoutine(ram: GameRam, displayDigitBaseIndexY: number): void {
  if (ram.operMode === TITLE_OPER_MODE) {
    ram.digitModifierScratch.fill(0);

    return;
  }

  let y = displayDigitBaseIndexY;

  for (let x = 5; x >= 0; x -= 1) {
    const modifier = ram.digitModifierScratch[x + 1] & 0xff;
    const cell = ram.displayDigitBytes[y] & 0xff;
    let sum = (modifier + cell) & 0xff;

    if ((sum & 0x80) !== 0) {
      ram.digitModifierScratch[x] = (ram.digitModifierScratch[x] - 1) & 0xff;
      sum = 9;
    } else if (sum >= 10) {
      ram.digitModifierScratch[x] = (ram.digitModifierScratch[x] + 1) & 0xff;
      sum = (sum - 10) & 0xff;
    }

    ram.displayDigitBytes[y] = sum;
    y -= 1;
  }

  ram.digitModifierScratch.fill(0);
}
