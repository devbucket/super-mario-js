import { describe, expect, it } from 'vitest';
import { getBlockBufferAddr } from '../src/game/get-block-buffer-addr.js';

describe('getBlockBufferAddr', () => {
  it('maps slot 0–15 to buffer 0 with column = low nybble', () => {
    expect(getBlockBufferAddr(0x03)).toEqual({ bufferIndex: 0, columnStartOffset: 3 });
    expect(getBlockBufferAddr(0x0f)).toEqual({ bufferIndex: 0, columnStartOffset: 0x0f });
  });

  it('maps slot 16–31 to buffer 1 with column = low nybble', () => {
    expect(getBlockBufferAddr(0x12)).toEqual({ bufferIndex: 1, columnStartOffset: 2 });
    expect(getBlockBufferAddr(0x1f)).toEqual({ bufferIndex: 1, columnStartOffset: 0x0f });
  });

  it('treats any non-zero high nybble as second bank (same as reference table width 2)', () => {
    expect(getBlockBufferAddr(0xf5)).toEqual({ bufferIndex: 1, columnStartOffset: 5 });
  });
});
