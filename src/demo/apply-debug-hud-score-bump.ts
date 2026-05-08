import { runDigitsMathRoutine } from '../game/run-digits-math-routine.js';
import type { GameRam } from '../game/types.js';

const MARIO_SCORE_MATH_START_Y = 0x0b;

export function applyDebugHudScoreBump(ram: GameRam): void {
  ram.digitModifierScratch[5] = 2;
  runDigitsMathRoutine(ram, MARIO_SCORE_MATH_START_Y);
}
