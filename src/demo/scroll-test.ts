import { chrTiles } from '../data/chr-tiles.js';
import { areaAddrOffsets, worldAddrOffsets } from '../data/extracted/world-area-pointers.js';
import { masterPalette } from '../data/master-palette.js';
import { overworldGroundPalette } from '../data/palettes.js';
import { createCamera } from '../engine/camera/create-camera.js';
import { updateCameraFromInput } from '../engine/camera/update-camera-from-input.js';
import type { JoypadBitMask } from '../engine/input.js';
import { bakePaletteVariants } from '../engine/ppu/bake-palette-variants.js';
import { buildChrSheet } from '../engine/ppu/build-chr-sheet.js';
import type { HudState } from '../engine/ppu/draw-hud-overlay.js';
import { drawHudOverlay } from '../engine/ppu/draw-hud-overlay.js';
import { drawWorldGridFromBufferBytes } from '../engine/ppu/draw-world-grid-from-buffer-bytes.js';
import { METATILE_PX, TILE_SLOTS } from '../engine/ppu/types.js';
import { startTilePixelBuilder } from '../engine/ppu/utils/start-tile-pixel-builder.js';
import { buildLevelMetatileGrid } from '../game/build-level-metatile-grid.js';
import { createGameRam } from '../game/create-game-ram.js';
import { loadAreaIntoRam } from './load-area-into-ram.js';

const VIEWPORT_W_PX = 256;
/** Enough horizontal columns for early worlds; extend when parser smoke-tests wider levels. */
const LEVEL_GRID_COLUMNS = 240;
const LEVEL_GRID_ROWS = 13;

export interface DemoBundle {
  readonly tick: (joypad: JoypadBitMask) => void;
  readonly paint: (ctx: CanvasRenderingContext2D) => void;
}

export function listAreaCountForWorld(worldNumber: number): number {
  if (worldNumber >= 7) {
    return areaAddrOffsets.length - worldAddrOffsets[7];
  }

  return worldAddrOffsets[worldNumber + 1] - worldAddrOffsets[worldNumber];
}

export interface LevelPipelineDemoConfig {
  readonly worldNumber: number;
  readonly areaNumber: number;
}

export function createLevelPipelineDemo(config: LevelPipelineDemoConfig): DemoBundle {
  const chrTilesWithDebugSlot = [...chrTiles];

  chrTilesWithDebugSlot[TILE_SLOTS - 1] = startTilePixelBuilder().row(0, '33333333').rect(2, 2, 5, 5, 2).build();

  const chrSheet = buildChrSheet(chrTilesWithDebugSlot);
  const baked = bakePaletteVariants(chrSheet, masterPalette, overworldGroundPalette);

  const ram = createGameRam();

  loadAreaIntoRam(ram, config.worldNumber, config.areaNumber);
  const grid = buildLevelMetatileGrid(ram, LEVEL_GRID_COLUMNS);

  const camera = createCamera();
  const worldWidthPx = LEVEL_GRID_COLUMNS * METATILE_PX;

  const hudState: HudState = {
    playerName: 'MARIO',
    score: 0,
    coins: 0,
    worldLabel: `W${config.worldNumber + 1}-${config.areaNumber + 1}`,
    time: 400,
  };

  function tick(joypad: JoypadBitMask): void {
    updateCameraFromInput(camera, joypad, worldWidthPx, VIEWPORT_W_PX);
  }

  function paint(ctx: CanvasRenderingContext2D): void {
    drawWorldGridFromBufferBytes(ctx, baked, grid, LEVEL_GRID_COLUMNS, LEVEL_GRID_ROWS, camera.scrollXPx, VIEWPORT_W_PX);
    drawHudOverlay(ctx, hudState);
  }

  return { tick, paint };
}

/** @deprecated Use {@link createLevelPipelineDemo}. */
export function runScrollTest(): DemoBundle {
  return createLevelPipelineDemo({ worldNumber: 0, areaNumber: 0 });
}
