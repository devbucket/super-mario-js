import { runDigitsMathRoutine } from '../game/run-digits-math-routine.js';
import type { GameRam } from '../game/types.js';

const COIN_MATH_START_Y = 0x17;

export function applyDebugHudCoinAdd(ram: GameRam): void {
  ram.digitModifierScratch[6] = 1;
  runDigitsMathRoutine(ram, COIN_MATH_START_Y);
}
