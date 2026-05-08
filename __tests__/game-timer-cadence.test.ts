import { describe, expect, it } from 'vitest';
import { displayByteGameTimerStart } from '../src/data/status-bar-display-digit-layout.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { GAME_TIMER_CTRL_RELOAD_FRAMES, runGameTimer } from '../src/game/run-game-timer.js';
import { tickGameTimerControl } from '../src/game/tick-game-timer-control.js';

function createRamWithGameTimerGatesOpen(): ReturnType<typeof createGameRam> {
  const ram = createGameRam();

  ram.operMode = 1;
  ram.gameEngineSubroutine = 8;
  ram.playerYHighPos = 1;
  ram.timerControl = 0;

  return ram;
}

function tickEngineThenTimerCountdown(ram: ReturnType<typeof createGameRam>): void {
  runGameTimer(ram, {
    onTimeRunningOutRequested(): void {
      /* not exercised in cadence tests */
    },
  });
  tickGameTimerControl(ram);
}

describe('game timer cadence', () => {
  it('waits a full reload countdown before the main timer routine can fire', () => {
    const ram = createRamWithGameTimerGatesOpen();

    ram.gameTimerCtrlTimer = GAME_TIMER_CTRL_RELOAD_FRAMES;
    ram.displayDigitBytes[displayByteGameTimerStart] = 4;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 2;

    let steps = 0;

    while (ram.gameTimerCtrlTimer > 0) {
      tickEngineThenTimerCountdown(ram);
      steps += 1;
      expect(steps).toBeLessThan(40);
    }

    expect(steps).toBe(GAME_TIMER_CTRL_RELOAD_FRAMES);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 2]).toBe(2);

    tickEngineThenTimerCountdown(ram);

    expect(ram.displayDigitBytes[displayByteGameTimerStart + 2]).not.toBe(2);
    expect(ram.gameTimerCtrlTimer).toBe(GAME_TIMER_CTRL_RELOAD_FRAMES - 1);
  });

  it('does not change timer digits on the first countdown tick after a reload', () => {
    const ram = createRamWithGameTimerGatesOpen();

    ram.gameTimerCtrlTimer = GAME_TIMER_CTRL_RELOAD_FRAMES;
    ram.displayDigitBytes[displayByteGameTimerStart] = 4;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 2;

    tickEngineThenTimerCountdown(ram);

    expect(ram.displayDigitBytes[displayByteGameTimerStart]).toBe(4);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 1]).toBe(0);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 2]).toBe(2);
    expect(ram.gameTimerCtrlTimer).toBe(GAME_TIMER_CTRL_RELOAD_FRAMES - 1);
  });
});
