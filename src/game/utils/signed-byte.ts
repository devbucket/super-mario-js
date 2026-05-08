/** Signed 8-bit in a 0..255 storage slot. */
export function readSignedByte(stored: number): number {
  const u = stored & 0xff;

  return u >= 0x80 ? u - 0x100 : u;
}

/** Write signed int to 0..255 byte. */
export function writeSignedByte(value: number): number {
  return ((value % 256) + 256) % 256;
}
