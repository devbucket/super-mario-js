import type { AreaPalette, MasterPalette } from '../types.js';
import { SHEET_PX_W, SUB_PALETTE_COUNT } from '../types.js';

/**
 * Like `recolourTileRow`, but uses sprite sub-palettes (`AreaPalette.sprite`).
 */
export function recolourSpriteTileRow(
  sourceRgba: Uint8ClampedArray,
  destRgba: Uint8ClampedArray,
  sourceYRow: number,
  destYRow: number,
  areaPalette: AreaPalette,
  masterPalette: MasterPalette,
): void {
  const sourceRowStart = sourceYRow * SHEET_PX_W * 4;
  const bakedRowWidthPx = SHEET_PX_W * SUB_PALETTE_COUNT;
  const destRowStart = destYRow * bakedRowWidthPx * 4;

  for (let p = 0; p < SUB_PALETTE_COUNT; p++) {
    const sub = areaPalette.sprite[p];
    const subRowStart = destRowStart + p * SHEET_PX_W * 4;

    for (let x = 0; x < SHEET_PX_W; x++) {
      const grey = sourceRgba[sourceRowStart + x * 4];
      const paletteIndex = Math.round(grey / 85);
      const o = subRowStart + x * 4;

      if (paletteIndex === 0) {
        destRgba[o + 0] = 0;
        destRgba[o + 1] = 0;
        destRgba[o + 2] = 0;
        destRgba[o + 3] = 0;
        continue;
      }

      const masterIndex = sub[paletteIndex];
      const [r, g, b] = masterPalette[masterIndex];

      destRgba[o + 0] = r;
      destRgba[o + 1] = g;
      destRgba[o + 2] = b;
      destRgba[o + 3] = 255;
    }
  }
}
