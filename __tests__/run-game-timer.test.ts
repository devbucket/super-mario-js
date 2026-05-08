import { describe, expect, it } from 'vitest';
import { displayByteGameTimerStart } from '../src/data/status-bar-display-digit-layout.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { GAME_TIMER_CTRL_RELOAD_FRAMES, runGameTimer } from '../src/game/run-game-timer.js';

function baseRamForGameTimer(): ReturnType<typeof createGameRam> {
  const ram = createGameRam();

  ram.operMode = 1;
  ram.gameEngineSubroutine = 8;
  ram.playerYHighPos = 1;
  ram.timerControl = 0;
  ram.gameTimerCtrlTimer = 0;

  return ram;
}

describe('runGameTimer', () => {
  it('does nothing in title oper mode', () => {
    const ram = baseRamForGameTimer();

    ram.operMode = 0;
    ram.displayDigitBytes[displayByteGameTimerStart] = 1;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 0;

    let calls = 0;

    runGameTimer(ram, { onTimeRunningOutRequested: () => (calls += 1) });

    expect(calls).toBe(0);
    expect(ram.gameTimerCtrlTimer).toBe(0);
  });

  it('does nothing when the engine subroutine is below eight', () => {
    const ram = baseRamForGameTimer();

    ram.gameEngineSubroutine = 7;

    let calls = 0;

    runGameTimer(ram, { onTimeRunningOutRequested: () => (calls += 1) });

    expect(calls).toBe(0);
  });

  it('does nothing when the player is below the screen band', () => {
    const ram = baseRamForGameTimer();

    ram.playerYHighPos = 2;

    let calls = 0;

    runGameTimer(ram, { onTimeRunningOutRequested: () => (calls += 1) });

    expect(calls).toBe(0);
  });

  it('does nothing while the game timer control countdown is active', () => {
    const ram = baseRamForGameTimer();

    ram.gameTimerCtrlTimer = 1;

    let calls = 0;

    runGameTimer(ram, { onTimeRunningOutRequested: () => (calls += 1) });

    expect(calls).toBe(0);
  });

  it('sets the expired flag when the timer reads zero', () => {
    const ram = baseRamForGameTimer();

    ram.displayDigitBytes[displayByteGameTimerStart] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 0;

    runGameTimer(ram, {
      onTimeRunningOutRequested(): void {
        /* no-op for time-up path */
      },
    });

    expect(ram.gameTimerExpiredFlag).toBe(1);
    expect(ram.playerStatus).toBe(0);
  });

  it('fires hurry callback once at one hundred and reloads the control timer', () => {
    const ram = baseRamForGameTimer();

    ram.displayDigitBytes[displayByteGameTimerStart] = 1;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 0;

    let calls = 0;

    runGameTimer(ram, { onTimeRunningOutRequested: () => (calls += 1) });

    expect(calls).toBe(1);
    expect(ram.gameTimerCtrlTimer).toBe(GAME_TIMER_CTRL_RELOAD_FRAMES);
  });

  it('does not fire hurry when the timer is one hundred one', () => {
    const ram = baseRamForGameTimer();

    ram.displayDigitBytes[displayByteGameTimerStart] = 1;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 1;

    let calls = 0;

    runGameTimer(ram, { onTimeRunningOutRequested: () => (calls += 1) });

    expect(calls).toBe(0);
    expect(ram.gameTimerCtrlTimer).toBe(GAME_TIMER_CTRL_RELOAD_FRAMES);
  });
});
