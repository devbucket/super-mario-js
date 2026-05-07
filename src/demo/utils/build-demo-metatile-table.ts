import { TileSlot } from '../../data/chr-tiles.js';
import type { MetatileTable } from '../../engine/ppu/types.js';

/**
 * The 13 metatiles used by the throwaway 1-1 fragment in `scroll-test.ts`.
 * Real metatile tables (`BrickMetatiles`, `SolidBlockMetatiles`, etc.)
 * port verbatim from the disassembly in the level-data slice; this stand-in
 * goes away then.
 */
export function buildDemoMetatileTable(): MetatileTable {
  return [
    // 0: sky
    {
      tileIndices: [TileSlot.emptySky, TileSlot.emptySky, TileSlot.emptySky, TileSlot.emptySky],
      subPaletteIndex: 0,
    },
    // 1: ground (top + fill)
    {
      tileIndices: [TileSlot.groundTop, TileSlot.groundTop, TileSlot.groundFill, TileSlot.groundFill],
      subPaletteIndex: 1,
    },
    // 2: ground fill
    {
      tileIndices: [TileSlot.groundFill, TileSlot.groundFill, TileSlot.groundFill, TileSlot.groundFill],
      subPaletteIndex: 1,
    },
    // 3: brick
    {
      tileIndices: [TileSlot.brick, TileSlot.brick, TileSlot.brick, TileSlot.brick],
      subPaletteIndex: 1,
    },
    // 4: question block
    {
      tileIndices: [TileSlot.qBlockTopLeft, TileSlot.qBlockTopRight, TileSlot.qBlockBottomLeft, TileSlot.qBlockBottomRight],
      subPaletteIndex: 2,
    },
    // 5: pipe top
    {
      tileIndices: [TileSlot.pipeTopLeft, TileSlot.pipeTopRight, TileSlot.pipeBodyLeft, TileSlot.pipeBodyRight],
      subPaletteIndex: 3,
    },
    // 6: pipe body
    {
      tileIndices: [TileSlot.pipeBodyLeft, TileSlot.pipeBodyRight, TileSlot.pipeBodyLeft, TileSlot.pipeBodyRight],
      subPaletteIndex: 3,
    },
    // 7: cloud left half
    {
      tileIndices: [TileSlot.cloudLeft, TileSlot.cloudMiddle, TileSlot.emptySky, TileSlot.emptySky],
      subPaletteIndex: 0,
    },
    // 8: cloud right half
    {
      tileIndices: [TileSlot.cloudMiddle, TileSlot.cloudRight, TileSlot.emptySky, TileSlot.emptySky],
      subPaletteIndex: 0,
    },
    // 9: hill left half
    {
      tileIndices: [TileSlot.hillLeft, TileSlot.hillMiddle, TileSlot.hillMiddle, TileSlot.hillMiddle],
      subPaletteIndex: 0,
    },
    // 10: hill right half
    {
      tileIndices: [TileSlot.hillMiddle, TileSlot.hillRight, TileSlot.hillMiddle, TileSlot.hillMiddle],
      subPaletteIndex: 0,
    },
    // 11: bush
    {
      tileIndices: [TileSlot.bush, TileSlot.bush, TileSlot.bush, TileSlot.bush],
      subPaletteIndex: 0,
    },
    // 12: coin
    {
      tileIndices: [TileSlot.coin, TileSlot.coin, TileSlot.coin, TileSlot.coin],
      subPaletteIndex: 2,
    },
  ];
}
