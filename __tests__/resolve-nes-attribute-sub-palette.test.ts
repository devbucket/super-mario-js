import { describe, expect, it } from 'vitest';
import { listStatusBarCoinStripSubPaletteIndices } from '../src/engine/ppu/utils/list-status-bar-coin-strip-sub-palette-indices.js';
import { resolveNesAttributeSubPalette } from '../src/engine/ppu/utils/resolve-nes-attribute-sub-palette.js';

describe('resolveNesAttributeSubPalette', () => {
  it('maps quadrants for a typical status-bar override byte', () => {
    const attr = 0xea;

    expect(resolveNesAttributeSubPalette(attr, 0, 0)).toBe(2);
    expect(resolveNesAttributeSubPalette(attr, 3, 0)).toBe(2);
    expect(resolveNesAttributeSubPalette(attr, 0, 3)).toBe(2);
    expect(resolveNesAttributeSubPalette(attr, 3, 3)).toBe(3);
  });

  it('maps the bulk default attribute pattern used beside the coin cell', () => {
    const attr = 0xaa;

    expect(resolveNesAttributeSubPalette(attr, 0, 3)).toBe(2);
  });
});

describe('listStatusBarCoinStripSubPaletteIndices', () => {
  it('matches nametable attribute layout for the five-tile coin strip', () => {
    expect([...listStatusBarCoinStripSubPaletteIndices()]).toEqual([2, 2, 3, 3, 2]);
  });
});
