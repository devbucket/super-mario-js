import { displayByteGameTimerStart } from '../data/status-bar-display-digit-layout.js';
import { runDigitsMathRoutine } from './run-digits-math-routine.js';
import type { GameRam } from './types.js';

const TITLE_OPER_MODE = 0;
const DEATH_ENGINE_SUBROUTINE = 0x0b;
const PLAYER_BELOW_SCREEN_Y_HIGH = 2;

/** Frames between game-clock BCD ticks once the control counter has reached zero. */
export const GAME_TIMER_CTRL_RELOAD_FRAMES = 0x18;
const TIMER_DIGIT_MATH_START_Y = 0x23;

export interface RunGameTimerDeps {
  readonly onTimeRunningOutRequested: () => void;
}

export function runGameTimer(ram: GameRam, deps: RunGameTimerDeps): void {
  if (ram.operMode === TITLE_OPER_MODE) {
    return;
  }

  if (ram.gameEngineSubroutine < 8 || ram.gameEngineSubroutine === DEATH_ENGINE_SUBROUTINE) {
    return;
  }

  if (ram.playerYHighPos >= PLAYER_BELOW_SCREEN_Y_HIGH) {
    return;
  }

  if (ram.gameTimerCtrlTimer !== 0) {
    return;
  }

  const t0 = ram.displayDigitBytes[displayByteGameTimerStart] & 0xff;
  const t1 = ram.displayDigitBytes[displayByteGameTimerStart + 1] & 0xff;
  const t2 = ram.displayDigitBytes[displayByteGameTimerStart + 2] & 0xff;

  if ((t0 | t1 | t2) === 0) {
    ram.playerStatus = 0;
    ram.gameTimerExpiredFlag = 1;

    return;
  }

  const atOneHundred = t0 === 1 && (t1 | t2) === 0;

  if (atOneHundred) {
    deps.onTimeRunningOutRequested();
  }

  ram.gameTimerCtrlTimer = GAME_TIMER_CTRL_RELOAD_FRAMES;
  ram.digitModifierScratch[6] = 0xff;
  runDigitsMathRoutine(ram, TIMER_DIGIT_MATH_START_Y);
}
