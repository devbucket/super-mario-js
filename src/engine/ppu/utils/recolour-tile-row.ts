import type { AreaPalette, MasterPalette } from '../types.js';
import { SHEET_PX_W, SUB_PALETTE_COUNT } from '../types.js';

/**
 * Recolour one scanline of the greyscale CHR sheet into all four sub-palette
 * variants of the baked sheet. The baked layout places sub-palettes
 * side-by-side, so a single source row produces four destination rows of
 * length `SHEET_PX_W` each.
 */
export function recolourTileRow(
  sourceRgba: Uint8ClampedArray,
  destRgba: Uint8ClampedArray,
  yRow: number,
  areaPalette: AreaPalette,
  masterPalette: MasterPalette,
): void {
  const sourceRowStart = yRow * SHEET_PX_W * 4;
  const bakedRowWidthPx = SHEET_PX_W * SUB_PALETTE_COUNT;
  const destRowStart = yRow * bakedRowWidthPx * 4;

  for (let p = 0; p < SUB_PALETTE_COUNT; p++) {
    const sub = areaPalette.background[p];
    const subRowStart = destRowStart + p * SHEET_PX_W * 4;

    for (let x = 0; x < SHEET_PX_W; x++) {
      const grey = sourceRgba[sourceRowStart + x * 4];
      const paletteIndex = Math.round(grey / 85);
      const masterIndex = sub[paletteIndex];
      const [r, g, b] = masterPalette[masterIndex];
      const o = subRowStart + x * 4;

      destRgba[o + 0] = r;
      destRgba[o + 1] = g;
      destRgba[o + 2] = b;
      destRgba[o + 3] = 255;
    }
  }
}
