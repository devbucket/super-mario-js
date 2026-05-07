import { describe, expect, it } from 'vitest';
import { startTilePixelBuilder } from '../src/engine/ppu/utils/start-tile-pixel-builder.js';

describe('startTilePixelBuilder', () => {
  it('fills a row and builds eight strings of length 8', () => {
    const tile = startTilePixelBuilder().row(0, '01230123').row(7, '33333333').build();

    expect(tile[0]).toBe('01230123');
    expect(tile[7]).toBe('33333333');
    expect(tile[1]).toBe('00000000');
  });

  it('paints an inclusive rectangle on top of prior pixels', () => {
    const tile = startTilePixelBuilder().row(3, '00000000').rect(2, 2, 5, 4, 2).build();

    expect(tile[2]?.slice(2, 6)).toBe('2222');
    expect(tile[4]?.slice(2, 6)).toBe('2222');
    expect(tile[2]?.slice(0, 2)).toBe('00');
  });

  it('normalizes inverted rectangle corners', () => {
    const tile = startTilePixelBuilder().rect(5, 5, 1, 1, 1).build();

    expect(tile[1]?.[1]).toBe('1');
    expect(tile[5]?.[5]).toBe('1');
  });

  it('rejects invalid row patterns', () => {
    expect(() => startTilePixelBuilder().row(0, '0123456')).toThrow(/length 8/);
    expect(() => startTilePixelBuilder().row(0, '0123456x')).toThrow(/Invalid palette index/);
  });

  it('rejects out-of-range row index and palette index', () => {
    expect(() => startTilePixelBuilder().row(8, '00000000')).toThrow(/row index/);
    expect(() => startTilePixelBuilder().rect(0, 0, 1, 1, 4)).toThrow(/Palette index/);
    expect(() => startTilePixelBuilder().rect(-1, 0, 1, 1, 0)).toThrow(/coordinates/);
  });
});
