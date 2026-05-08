const SOLID_UPPER_EXT = [0x10, 0x61, 0x88, 0xc4];

/** Ports `CheckForSolidMTiles` / `GetMTileAttrib` threshold compare. */
export function isSolidMetatile(metatile: number): boolean {
  const idx = (metatile >>> 6) & 3;

  return (metatile & 0xff) >= SOLID_UPPER_EXT[idx];
}
