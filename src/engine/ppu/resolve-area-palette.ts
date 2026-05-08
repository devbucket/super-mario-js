import type { AreaPalette, SubPalette } from './types.js';

/**
 * Replace slot 0 of every BG sub-palette with the supplied universal backdrop.
 *
 * On real hardware the PPU mirrors the universal backdrop (`$3F00`) at slot 0
 * of every sub-palette; raw `AreaPalette` data carries the asm's `$0f`
 * placeholder there. The demo runs this transform after looking up the
 * area-type's backdrop in `areaBackdropColors`, then feeds the result to
 * `bakePaletteVariants`.
 */
export function resolveAreaPalette(rawPalette: AreaPalette, universalBackdrop: number): AreaPalette {
  const [sub0, sub1, sub2, sub3] = rawPalette.background;

  const resolved: readonly [SubPalette, SubPalette, SubPalette, SubPalette] = [
    [universalBackdrop, sub0[1], sub0[2], sub0[3]],
    [universalBackdrop, sub1[1], sub1[2], sub1[3]],
    [universalBackdrop, sub2[1], sub2[2], sub2[3]],
    [universalBackdrop, sub3[1], sub3[2], sub3[3]],
  ];

  return { background: resolved };
}
