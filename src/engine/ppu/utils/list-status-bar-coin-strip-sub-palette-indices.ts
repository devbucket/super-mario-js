import { statusBarAttrByteCols8To11, statusBarAttrByteCols12To15 } from '../../../data/status-bar-nametable-attr-defaults.js';
import { statusBarCoinIconXPx, statusBarValueRowYPx } from '../../../data/status-bar-ppu-layout.js';
import { TILE_PX } from '../types.js';
import { resolveNesAttributeSubPalette } from './resolve-nes-attribute-sub-palette.js';

const COIN_STRIP_TILE_COUNT = 5;

/**
 * BG sub-palette index per coin-strip tile, derived from nametable attribute
 * bytes for columns 8–15 and the value row tile row.
 */
export function listStatusBarCoinStripSubPaletteIndices(): readonly number[] {
  const startCol = Math.floor(statusBarCoinIconXPx / TILE_PX);
  const tileRowMod4 = Math.floor(statusBarValueRowYPx / TILE_PX) & 3;
  const out: number[] = [];

  for (let stripIndex = 0; stripIndex < COIN_STRIP_TILE_COUNT; stripIndex += 1) {
    const tileCol = startCol + stripIndex;
    const attrByte = tileCol < 12 ? statusBarAttrByteCols8To11 : statusBarAttrByteCols12To15;
    const tileColMod4 = tileCol & 3;

    out.push(resolveNesAttributeSubPalette(attrByte, tileColMod4, tileRowMod4));
  }

  return out;
}
