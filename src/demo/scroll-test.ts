import { chrTiles } from '../data/chr-tiles.js';
import { masterPalette } from '../data/master-palette.js';
import { overworldGroundPalette } from '../data/palettes.js';
import { createCamera } from '../engine/camera/create-camera.js';
import { updateCameraFromInput } from '../engine/camera/update-camera-from-input.js';
import type { JoypadBitMask } from '../engine/input.js';
import { bakePaletteVariants } from '../engine/ppu/bake-palette-variants.js';
import { buildChrSheet } from '../engine/ppu/build-chr-sheet.js';
import type { HudState } from '../engine/ppu/draw-hud-overlay.js';
import { drawHudOverlay } from '../engine/ppu/draw-hud-overlay.js';
import { METATILE_PX, TILE_SLOTS } from '../engine/ppu/types.js';
import { startTilePixelBuilder } from '../engine/ppu/utils/start-tile-pixel-builder.js';
import { buildDemoMetatileTable } from './utils/build-demo-metatile-table.js';
import { drawDemoWorld } from './utils/draw-demo-world.js';

const VIEWPORT_W_PX = 256;
const DEMO_LEVEL_WIDTH_MT = 32;
const DEMO_LEVEL_HEIGHT_MT = 15;

/**
 * Hand-authored 1-1 fragment, 32 metatiles wide × 15 tall (= one screen tall,
 * two screens wide). Row-major, indexed by `row * width + col`. Metatile IDs
 * match `buildDemoMetatileTable` ordering. Throwaway data; deleted with the
 * rest of `src/demo/` when the level-parser slice ships.
 */
const demoLevelMetatiles = new Uint8Array([
  // row 0
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 1
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 2
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 3
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 4
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 5
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 6
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 7
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 8
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 9
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 10: clouds
  0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 11: hill
  0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 12: floating bricks / question block / pipe top / coin
  0, 0, 0, 0, 0, 0, 3, 4, 3, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 12, 0, 0, 0, 0, 0, 3, 4, 3, 0, 0, 0,
  // row 13: bushes / pipe body
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // row 14: ground
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
]);

export interface DemoBundle {
  readonly tick: (joypad: JoypadBitMask) => void;
  readonly paint: (ctx: CanvasRenderingContext2D) => void;
}

/**
 * Wire up the rendering primitives slice's runnable demo: scroll a
 * hand-authored 1-1 fragment with D-pad, HUD pinned on top.
 */
export function runScrollTest(): DemoBundle {
  const chrTilesWithDebugSlot = [...chrTiles];

  chrTilesWithDebugSlot[TILE_SLOTS - 1] = startTilePixelBuilder().row(0, '33333333').rect(2, 2, 5, 5, 2).build();

  const chrSheet = buildChrSheet(chrTilesWithDebugSlot);
  const baked = bakePaletteVariants(chrSheet, masterPalette, overworldGroundPalette);
  const metatileTable = buildDemoMetatileTable();
  const camera = createCamera();
  const worldWidthPx = DEMO_LEVEL_WIDTH_MT * METATILE_PX;

  const hudState: HudState = {
    playerName: 'MARIO',
    score: 0,
    coins: 0,
    worldLabel: '1-1',
    time: 400,
  };

  function tick(joypad: JoypadBitMask): void {
    updateCameraFromInput(camera, joypad, worldWidthPx, VIEWPORT_W_PX);
  }

  function paint(ctx: CanvasRenderingContext2D): void {
    drawDemoWorld(ctx, baked, metatileTable, demoLevelMetatiles, DEMO_LEVEL_WIDTH_MT, DEMO_LEVEL_HEIGHT_MT, camera.scrollXPx, VIEWPORT_W_PX);
    drawHudOverlay(ctx, hudState);
  }

  return { tick, paint };
}
