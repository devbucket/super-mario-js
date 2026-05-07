import { SHEET_PX_W, TILE_PX } from '../types.js';

const GREYS_PER_INDEX: readonly number[] = [0, 85, 170, 255];

/**
 * Stamp one decoded tile (64 palette-index bytes) into `image` at the given
 * pixel-space slot origin, using the four staging greys.
 */
export function writeTileIntoSheet(image: ImageData, pixels: Uint8Array, slotXPx: number, slotYPx: number): void {
  for (let y = 0; y < TILE_PX; y++) {
    for (let x = 0; x < TILE_PX; x++) {
      const paletteIndex = pixels[y * TILE_PX + x];
      const grey = GREYS_PER_INDEX[paletteIndex];
      const o = ((slotYPx + y) * SHEET_PX_W + (slotXPx + x)) * 4;

      image.data[o + 0] = grey;
      image.data[o + 1] = grey;
      image.data[o + 2] = grey;
      image.data[o + 3] = 255;
    }
  }
}
