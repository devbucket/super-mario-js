import { describe, expect, it } from 'vitest';
import { displayByteGameTimerStart, displayBytePlayerScoreStart } from '../src/data/status-bar-display-digit-layout.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { runDigitsMathRoutine } from '../src/game/run-digits-math-routine.js';

describe('runDigitsMathRoutine', () => {
  it('clears modifiers without changing digits in title oper mode', () => {
    const ram = createGameRam();

    ram.operMode = 0;
    ram.displayDigitBytes.fill(9);
    ram.digitModifierScratch.fill(7);

    runDigitsMathRoutine(ram, 0x0b);

    expect(ram.displayDigitBytes.every((b) => b === 9)).toBe(true);
    expect(ram.digitModifierScratch.every((b) => b === 0)).toBe(true);
  });

  it('adds one to the lowest score digit when only the lowest modifier is set', () => {
    const ram = createGameRam();

    ram.operMode = 1;
    ram.displayDigitBytes[displayBytePlayerScoreStart + 5] = 5;
    ram.digitModifierScratch[6] = 1;

    runDigitsMathRoutine(ram, 0x0b);

    expect(ram.displayDigitBytes[displayBytePlayerScoreStart + 5]).toBe(6);
    expect(ram.digitModifierScratch.every((b) => b === 0)).toBe(true);
  });

  it('carries into the next score digit when the lowest digit rolls past nine', () => {
    const ram = createGameRam();

    ram.operMode = 1;
    ram.displayDigitBytes[displayBytePlayerScoreStart + 4] = 1;
    ram.displayDigitBytes[displayBytePlayerScoreStart + 5] = 9;
    ram.digitModifierScratch[6] = 1;

    runDigitsMathRoutine(ram, 0x0b);

    expect(ram.displayDigitBytes[displayBytePlayerScoreStart + 5]).toBe(0);
    expect(ram.displayDigitBytes[displayBytePlayerScoreStart + 4]).toBe(2);
  });

  it('subtracts one from the timer ones digit when the last modifier is ff', () => {
    const ram = createGameRam();

    ram.operMode = 1;
    ram.displayDigitBytes[displayByteGameTimerStart] = 3;
    ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;
    ram.displayDigitBytes[displayByteGameTimerStart + 2] = 1;
    ram.digitModifierScratch[6] = 0xff;

    runDigitsMathRoutine(ram, 0x23);

    expect(ram.displayDigitBytes[displayByteGameTimerStart + 2]).toBe(0);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 1]).toBe(0);
    expect(ram.displayDigitBytes[displayByteGameTimerStart]).toBe(3);
  });
});
