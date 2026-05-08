/**
 * Returns the BG sub-palette index (0–3) for one 8×8 tile inside a 32×32px
 * attribute region described by a single PPU attribute byte.
 *
 * @param attrByte — PPU attribute byte (four 2-bit fields: TL, TR, BL, BR).
 * @param tileColMod4 — Tile column within the 4-tile-wide attribute cell (`tileCol & 3`).
 * @param tileRowMod4 — Tile row within the 4-tile-tall attribute cell (`tileRow & 3`).
 */
export function resolveNesAttributeSubPalette(attrByte: number, tileColMod4: number, tileRowMod4: number): number {
  const quadrant = (tileRowMod4 >= 2 ? 2 : 0) + (tileColMod4 >= 2 ? 1 : 0);

  return (attrByte >> (quadrant * 2)) & 3;
}
