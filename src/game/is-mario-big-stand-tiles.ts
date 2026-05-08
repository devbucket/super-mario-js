import { marioBigStandTiles } from '../data/mario-chr-frame-tiles.js';

/** True when `tiles` is the current big-Mario standing 2×2 layout. */
export function isMarioBigStandTiles(tiles: readonly number[]): boolean {
  return (
    tiles.length >= 4 &&
    tiles[0] === marioBigStandTiles[0] &&
    tiles[1] === marioBigStandTiles[1] &&
    tiles[2] === marioBigStandTiles[2] &&
    tiles[3] === marioBigStandTiles[3]
  );
}
