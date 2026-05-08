import { describe, expect, it } from 'vitest';
import { createCamera } from '../src/engine/camera/create-camera.js';
import { JoypadBit } from '../src/engine/input.js';
import { METATILE_PX } from '../src/engine/ppu/types.js';
import { buildLevelMetatileGrid } from '../src/game/build-level-metatile-grid.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { findAreaPointer } from '../src/game/find-area-pointer.js';
import { getAreaDataAddrs } from '../src/game/get-area-data-addrs.js';
import { tickPlayer } from '../src/game/tick-player.js';

const VIEWPORT_W_PX = 256;
const COLS = 240;
const ROWS = 13;
const TOTAL_FRAMES = 80;
const JUMP_PRESS_FRAME = 5;

describe('player foot landing on overworld terrain', () => {
  it('mario lands back on the floor after a jump in W1-1 (no fall-through)', () => {
    const ram = createGameRam();

    ram.worldNumber = 0;
    ram.areaNumber = 0;
    findAreaPointer(ram);
    getAreaDataAddrs(ram);
    const grid = buildLevelMetatileGrid(ram, COLS);
    const camera = createCamera();

    for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
      const joypad = frame >= JUMP_PRESS_FRAME ? JoypadBit.A : 0;

      tickPlayer(ram, {
        joypad,
        camera,
        worldWidthPx: COLS * METATILE_PX,
        viewportWidthPx: VIEWPORT_W_PX,
        levelGrid: grid,
        levelGridWidthColumns: COLS,
        levelGridHeightRows: ROWS,
      });
    }

    expect(ram.playerYHighPos).toBe(1);
    expect(ram.playerState).toBe(0);
    expect(ram.playerYPx & 0x0f).toBe(0);
  });
});
