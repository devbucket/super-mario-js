import type { TilePixels } from '../../../data/chr-tiles.js';
import { freezeUint8TileGridToTilePixels } from './freeze-uint8-tile-grid-to-tile-pixels.js';
import { parseTileBuilderRowPattern } from './parse-tile-builder-row-pattern.js';

export interface TilePixelBuilder {
  row(rowY: number, pattern: string): TilePixelBuilder;
  rect(x0: number, y0: number, x1: number, y1: number, paletteIndex: number): TilePixelBuilder;
  build(): TilePixels;
}

/**
 * Fluent helper for authoring an 8×8 `TilePixels` grid (debug overlays, HUD).
 */
export function startTilePixelBuilder(): TilePixelBuilder {
  const cells = new Uint8Array(64);

  return {
    row(rowY: number, pattern: string): TilePixelBuilder {
      if (rowY < 0 || rowY > 7) {
        throw new Error('Tile row index must be between 0 and 7');
      }

      const values = parseTileBuilderRowPattern(pattern);

      for (let x = 0; x < 8; x++) {
        cells[rowY * 8 + x] = values[x]!;
      }

      return this;
    },

    rect(x0: number, y0: number, x1: number, y1: number, paletteIndex: number): TilePixelBuilder {
      if (paletteIndex < 0 || paletteIndex > 3) {
        throw new Error('Palette index must be between 0 and 3');
      }

      for (const value of [x0, x1, y0, y1]) {
        if (value < 0 || value > 7) {
          throw new Error('Rectangle coordinates must be between 0 and 7');
        }
      }

      const left = Math.min(x0, x1);
      const right = Math.max(x0, x1);
      const top = Math.min(y0, y1);
      const bottom = Math.max(y0, y1);

      for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
          cells[y * 8 + x] = paletteIndex;
        }
      }

      return this;
    },

    build(): TilePixels {
      return freezeUint8TileGridToTilePixels(cells);
    },
  };
}

export { startTilePixelBuilder as tile };
