export interface U8AddResult {
  readonly sum: number;
  readonly carry: number;
}

/** Unsigned 8-bit add with carry into 9-bit sum (sum 0..511). */
export function addU8WithCarry(a: number, b: number, carryIn: number): U8AddResult {
  const sum = a + b + (carryIn & 1);

  return {
    sum: sum & 0xff,
    carry: sum > 0xff ? 1 : 0,
  };
}
