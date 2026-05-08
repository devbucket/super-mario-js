/** Ports `ChkInvisibleMTiles` zero-flag behaviour for hidden coin / 1-up blocks. */
export function isHiddenInteractiveMetatile(metatile: number): boolean {
  const m = metatile & 0xff;

  return m === 0x5f || m === 0x60;
}
