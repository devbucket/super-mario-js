import { BlockBuffLowBounds } from '../../data/extracted/metatile-dictionaries.js';

/** Same filtering as `writeMetatileColumnToBlockBuffers` — hide low metatiles per palette band. */
export function filterMetatileByteForBlockBuffer(value: number): number {
  let v = value & 0xff;
  const paletteBits = v & 0xc0;
  const paletteIndex = paletteBits >> 6;
  const bound = BlockBuffLowBounds[paletteIndex];

  if (v < bound) {
    v = 0;
  }

  return v;
}
