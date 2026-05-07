import type { TilePixels } from '../../../data/chr-tiles.js';

/**
 * Turn a row-major 8×8 grid of palette indices 0..3 into `TilePixels` rows.
 */
export function freezeUint8TileGridToTilePixels(cells: Uint8Array): TilePixels {
  const rows: string[] = [];

  for (let y = 0; y < 8; y++) {
    let line = '';

    for (let x = 0; x < 8; x++) {
      line += String(cells[y * 8 + x]);
    }

    rows.push(line);
  }

  return rows as unknown as TilePixels;
}
