import { describe, expect, it } from 'vitest';
import { blockBufferXAdder } from '../src/data/block-buffer-collision-adders.js';
import { METATILE_PX } from '../src/engine/ppu/types.js';
import { blockBufferCollision, probeWorldXPx } from '../src/game/block-buffer-collision.js';
import { createGameRam } from '../src/game/create-game-ram.js';
import { resolvePlayerFootCollisionAdderIndices } from '../src/game/resolve-player-foot-collision-adder-y.js';
import { syncBlockBuffersFromGrid } from '../src/game/sync-block-buffers-from-grid.js';
import { filterMetatileByteForBlockBuffer } from '../src/game/utils/filter-metatile-byte-for-block-buffer.js';

const GRID_COLS = 64;
const GRID_ROWS = 13;
const FLOOR_ROW = 10;
const SOLID_MT = 0x69;

describe('syncBlockBuffersFromGrid', () => {
  it('fills buffers so left and right foot probes match filtered grid under probe world X', () => {
    const grid = new Uint8Array(GRID_COLS * GRID_ROWS);

    for (let col = 0; col < GRID_COLS; col++) {
      grid[FLOOR_ROW * GRID_COLS + col] = SOLID_MT;
    }

    const ram = createGameRam();

    ram.blockBuffer1.fill(0);
    ram.blockBuffer2.fill(0);

    ram.playerXPx = 48;
    ram.playerPageLoc = 0;
    ram.marioSizeCode = 1;
    ram.crouchingFlag = 0;
    ram.swimmingFlag = 0;

    const { leftY, rightY } = resolvePlayerFootCollisionAdderIndices(ram);
    const leftWorldX = probeWorldXPx(ram.playerXPx, ram.playerPageLoc, blockBufferXAdder[leftY] ?? 0);
    const rightWorldX = probeWorldXPx(ram.playerXPx, ram.playerPageLoc, blockBufferXAdder[rightY] ?? 0);
    const leftCol = Math.floor(leftWorldX / METATILE_PX);
    const rightCol = Math.floor(rightWorldX / METATILE_PX);

    const expectedLeft = filterMetatileByteForBlockBuffer(grid[FLOOR_ROW * GRID_COLS + leftCol]);
    const expectedRight = filterMetatileByteForBlockBuffer(grid[FLOOR_ROW * GRID_COLS + rightCol]);

    syncBlockBuffersFromGrid(ram, grid, GRID_COLS, 0);

    const leftFoot = blockBufferCollision({
      blockBuffer1: ram.blockBuffer1,
      blockBuffer2: ram.blockBuffer2,
      sprObjectXPx: ram.playerXPx,
      sprObjectPageLoc: ram.playerPageLoc,
      sprObjectYPx: 160,
      bufferAdderIndexY: leftY,
      returnHorizontalNybble: false,
    });

    const rightFoot = blockBufferCollision({
      blockBuffer1: ram.blockBuffer1,
      blockBuffer2: ram.blockBuffer2,
      sprObjectXPx: ram.playerXPx,
      sprObjectPageLoc: ram.playerPageLoc,
      sprObjectYPx: 160,
      bufferAdderIndexY: rightY,
      returnHorizontalNybble: false,
    });

    expect(leftFoot.metatileFromBuffer).toBe(expectedLeft);
    expect(rightFoot.metatileFromBuffer).toBe(expectedRight);
    expect(expectedLeft).toBeGreaterThan(0);
    expect(expectedRight).toBeGreaterThan(0);
  });
});
