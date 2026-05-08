import { describe, expect, it } from 'vitest';

import { addU8WithCarry } from '../src/game/utils/add-u8-with-carry.js';

describe('addU8WithCarry', () => {
  it('adds without carry', () => {
    expect(addU8WithCarry(10, 20, 0)).toEqual({ sum: 30, carry: 0 });
  });

  it('overflows to carry', () => {
    expect(addU8WithCarry(0xff, 0x01, 0)).toEqual({ sum: 0, carry: 1 });
  });

  it('includes carry in', () => {
    expect(addU8WithCarry(0xff, 0, 1)).toEqual({ sum: 0, carry: 1 });
  });
});
