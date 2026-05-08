const CLIMB_UPPER_EXT = [0x24, 0x6d, 0x8a, 0xc6];

/** Ports `CheckForClimbMTiles`. */
export function isClimbableMetatile(metatile: number): boolean {
  const idx = (metatile >>> 6) & 3;

  return (metatile & 0xff) >= CLIMB_UPPER_EXT[idx];
}
