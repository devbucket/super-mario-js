import { skyBackdropTileIndex } from '../../data/demo-tile-slots.js';
import type { MetatileTable } from '../../engine/ppu/types.js';

const sky = skyBackdropTileIndex;

/**
 * The 13 metatiles used by the throwaway 1-1 fragment in `scroll-test.ts`.
 * Real metatile tables (`BrickMetatiles`, `SolidBlockMetatiles`, etc.)
 * port verbatim from the disassembly in the level-data slice; this stand-in
 * goes away then.
 *
 * Each `tileIndices` tuple is top-left, top-right, bottom-left, bottom-right
 * CHR slots, matching `draw-metatile.ts`.
 */
export function buildDemoMetatileTable(): MetatileTable {
  return [
    {
      tileIndices: [sky, sky, sky, sky],
      subPaletteIndex: 0,
    },
    {
      tileIndices: [0x82, 0x84, 0x83, 0x85],
      subPaletteIndex: 1,
    },
    {
      tileIndices: [0x82, 0x84, 0x83, 0x85],
      subPaletteIndex: 1,
    },
    {
      tileIndices: [0x47, 0x47, 0x47, 0x47],
      subPaletteIndex: 1,
    },
    {
      tileIndices: [0x53, 0x54, 0x55, 0x56],
      subPaletteIndex: 3,
    },
    {
      tileIndices: [0x60, 0x62, 0x64, 0x66],
      subPaletteIndex: 0,
    },
    {
      tileIndices: [0x68, 0x26, 0x69, 0x6a],
      subPaletteIndex: 0,
    },
    {
      tileIndices: [0x24, 0x24, 0x24, 0x35],
      subPaletteIndex: 2,
    },
    {
      tileIndices: [0x36, 0x37, 0x25, 0x25],
      subPaletteIndex: 2,
    },
    {
      tileIndices: [0x24, 0x30, 0x30, 0x26],
      subPaletteIndex: 0,
    },
    {
      tileIndices: [0x33, 0x26, 0x24, 0x33],
      subPaletteIndex: 0,
    },
    {
      tileIndices: [0x36, 0x37, 0x25, 0x25],
      subPaletteIndex: 0,
    },
    {
      tileIndices: [0xa5, 0xa6, 0xa7, 0xa8],
      subPaletteIndex: 3,
    },
  ];
}
