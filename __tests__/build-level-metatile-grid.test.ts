import { describe, expect, it } from 'vitest';
import { loadAreaIntoRam } from '../src/demo/load-area-into-ram.js';
import { buildLevelMetatileGrid } from '../src/game/build-level-metatile-grid.js';
import { createGameRam } from '../src/game/create-game-ram.js';

const GROUND_METATILE = 0x54;
const QUESTION_BLOCK_COIN = 0xc0;
const QUESTION_BLOCK_POWERUP = 0xc1;
const BRICK = 0x51;
const PIPE_TOP_LEFT = 0x12;
const PIPE_TOP_RIGHT = 0x13;
const PIPE_SHAFT_LEFT = 0x14;
const PIPE_SHAFT_RIGHT = 0x15;

function cell(grid: Uint8Array, widthColumns: number, row: number, col: number): number {
  return grid[row * widthColumns + col];
}

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

  it('places the world 1-1 ground row at rows 11 and 12', () => {
    const ram = createGameRam();

    loadAreaIntoRam(ram, 0, 0);
    const widthColumns = 32;
    const grid = buildLevelMetatileGrid(ram, widthColumns);

    for (let col = 0; col < widthColumns; col++) {
      expect(cell(grid, widthColumns, 11, col)).toBe(GROUND_METATILE);
      expect(cell(grid, widthColumns, 12, col)).toBe(GROUND_METATILE);
    }
  });

  it('reproduces the famous block sequence on the first screen of world 1-1', () => {
    const ram = createGameRam();

    loadAreaIntoRam(ram, 0, 0);
    const widthColumns = 32;
    const grid = buildLevelMetatileGrid(ram, widthColumns);

    expect(cell(grid, widthColumns, 7, 16)).toBe(QUESTION_BLOCK_COIN);
    expect(cell(grid, widthColumns, 7, 20)).toBe(BRICK);
    expect(cell(grid, widthColumns, 7, 21)).toBe(QUESTION_BLOCK_POWERUP);
    expect(cell(grid, widthColumns, 7, 22)).toBe(BRICK);
    expect(cell(grid, widthColumns, 7, 23)).toBe(QUESTION_BLOCK_COIN);
    expect(cell(grid, widthColumns, 7, 24)).toBe(BRICK);

    expect(cell(grid, widthColumns, 3, 22)).toBe(QUESTION_BLOCK_COIN);
  });

  it('renders the first decoration pipe of world 1-1 across two columns', () => {
    const ram = createGameRam();

    loadAreaIntoRam(ram, 0, 0);
    const widthColumns = 32;
    const grid = buildLevelMetatileGrid(ram, widthColumns);

    expect(cell(grid, widthColumns, 9, 28)).toBe(PIPE_TOP_LEFT);
    expect(cell(grid, widthColumns, 10, 28)).toBe(PIPE_SHAFT_LEFT);
    expect(cell(grid, widthColumns, 9, 29)).toBe(PIPE_TOP_RIGHT);
    expect(cell(grid, widthColumns, 10, 29)).toBe(PIPE_SHAFT_RIGHT);
  });
});
