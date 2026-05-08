/**
 * Mirrors `GetAreaType` from the reference — packs bits 5–6 of the area pointer into 0..3.
 */
export function getAreaTypeFromAreaPointer(areaPointer: number): number {
  let accumulator = areaPointer & 0x60;
  let carry = 0;

  carry = (accumulator & 0x80) !== 0 ? 1 : 0;
  accumulator = (accumulator << 1) & 0xff;

  for (let i = 0; i < 3; i++) {
    const nextCarry = (accumulator & 0x80) !== 0 ? 1 : 0;

    accumulator = ((accumulator << 1) | carry) & 0xff;
    carry = nextCarry;
  }

  return accumulator;
}
