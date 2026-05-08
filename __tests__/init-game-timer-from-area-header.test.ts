import { describe, expect, it } from 'vitest';
import { displayByteGameTimerStart } from '../src/data/status-bar-display-digit-layout.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { findAreaPointer } from '../src/game/find-area-pointer.js';
import { getAreaDataAddrs } from '../src/game/get-area-data-addrs.js';
import { initGameTimerFromAreaHeader } from '../src/game/init-game-timer-from-area-header.js';

describe('initGameTimerFromAreaHeader', () => {
  it('loads the world 1-1 header timer digits when the fetch flag is set', () => {
    const ram = createGameRam();

    ram.worldNumber = 0;
    ram.areaNumber = 0;
    findAreaPointer(ram);
    getAreaDataAddrs(ram);
    ram.fetchNewGameTimerFlag = 1;

    initGameTimerFromAreaHeader(ram);

    expect(ram.displayDigitBytes[displayByteGameTimerStart]).toBe(4);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 1]).toBe(0);
    expect(ram.displayDigitBytes[displayByteGameTimerStart + 2]).toBe(1);
    expect(ram.fetchNewGameTimerFlag).toBe(0);
  });
});
