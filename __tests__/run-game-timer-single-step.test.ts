import { describe, expect, it } from 'vitest';
import { displayByteGameTimerStart } from '../src/data/status-bar-display-digit-layout.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { runGameTimer } from '../src/game/run-game-timer.js';

describe('runGameTimer single BCD step', () => {
  it('subtracts exactly one from the combined timer display per fire', () => {
    const ram = createGameRam();

    ram.operMode = 1;
    ram.gameEngineSubroutine = 8;
    ram.playerYHighPos = 1;
    ram.timerControl = 0;
    ram.gameTimerCtrlTimer = 0;
    ram.displayDigitBytes[displayByteGameTimerStart] = 4;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 1;

    runGameTimer(ram, {
      onTimeRunningOutRequested(): void {
        /* not used */
      },
    });

    expect(ram.displayDigitBytes[displayByteGameTimerStart]).toBe(4);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 1]).toBe(0);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 2]).toBe(0);
  });
});
