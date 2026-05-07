import type { TilePixels } from '../../../data/chr-tiles.js';

const ZERO_CHAR_CODE = '0'.charCodeAt(0);
const TILE_PX = 8;

/**
 * Convert a tile's 8-line string grid into a 64-byte palette-index buffer
 * laid out row-major. Chars '0'..'3' map to indices 0..3.
 */
export function decodeTileStrings(rows: TilePixels): Uint8Array {
  const out = new Uint8Array(TILE_PX * TILE_PX);

  for (let y = 0; y < TILE_PX; y++) {
    const row = rows[y];

    for (let x = 0; x < TILE_PX; x++) {
      out[y * TILE_PX + x] = row.charCodeAt(x) - ZERO_CHAR_CODE;
    }
  }

  return out;
}
