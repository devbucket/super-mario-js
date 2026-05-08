import { describe, expect, it } from 'vitest';
import { loadAreaIntoRam } from '../src/demo/load-area-into-ram.js';
import { buildLevelMetatileGrid } from '../src/game/build-level-metatile-grid.js';
import { createGameRam } from '../src/game/create-game-ram.js';

describe('buildLevelMetatileGrid', () => {
  it('produces a deterministic grid for world 1-1', () => {
    const ram = createGameRam();

    loadAreaIntoRam(ram, 0, 0);
    const grid = buildLevelMetatileGrid(ram, 16);

    expect(grid.length).toBe(16 * 13);
    expect(grid).toEqual(grid.slice());
  });

  it('writes the parsed column into the block buffers', () => {
    const ram = createGameRam();

    loadAreaIntoRam(ram, 0, 0);
    buildLevelMetatileGrid(ram, 16);

    expect(ram.blockBuffer1.length).toBe(16 * 13);
    expect(ram.blockBuffer2.length).toBe(16 * 13);
  });
});
