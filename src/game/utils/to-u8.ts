/** Clamp to unsigned byte for RAM-shaped fields. */
export function toU8(value: number): number {
  return value & 0xff;
}
