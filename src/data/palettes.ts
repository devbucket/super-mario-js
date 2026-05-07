import type { AreaPalette } from '../engine/ppu/types.js';

/**
 * Placeholder overworld-ground area palette.
 *
 * Four background sub-palettes, each four indices into the master palette.
 * Index 0 of every sub-palette is conventionally the shared backdrop
 * (NES sky blue `$22`).
 *
 * The numbers here are reasonable hand-picked approximations until the
 * level-data slice ports the asm's per-area palette tables verbatim.
 */
export const overworldGroundPalette: AreaPalette = {
  background: [
    [0x22, 0x29, 0x1a, 0x0f],
    [0x22, 0x36, 0x17, 0x0f],
    [0x22, 0x30, 0x27, 0x0f],
    [0x22, 0x29, 0x1a, 0x0f],
  ],
};
