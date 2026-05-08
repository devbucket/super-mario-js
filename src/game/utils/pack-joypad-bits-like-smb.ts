import type { JoypadBitMask } from '../../engine/input.js';
import { JoypadBit } from '../../engine/input.js';

/**
 * Pack keyboard-derived bits into the layout SMB's ReadJoypads stores:
 * - bits 7–6 → extracted as "A/B pool" for jump & run masks
 * - bits 3–2 → up/down (extract mask %1100)
 * - bits 1–0 → left/right (extract mask %11)
 */
export function packJoypadBitsLikeSmb(savedJoypadBits: JoypadBitMask): number {
  let packed = 0;

  if ((savedJoypadBits & JoypadBit.A) !== 0) {
    packed |= 0x80;
  }

  if ((savedJoypadBits & JoypadBit.B) !== 0) {
    packed |= 0x40;
  }

  if ((savedJoypadBits & JoypadBit.Select) !== 0) {
    packed |= 0x20;
  }

  if ((savedJoypadBits & JoypadBit.Start) !== 0) {
    packed |= 0x10;
  }

  if ((savedJoypadBits & JoypadBit.Up) !== 0) {
    packed |= 0x08;
  }

  if ((savedJoypadBits & JoypadBit.Down) !== 0) {
    packed |= 0x04;
  }

  if ((savedJoypadBits & JoypadBit.Left) !== 0) {
    packed |= 0x02;
  }

  if ((savedJoypadBits & JoypadBit.Right) !== 0) {
    packed |= 0x01;
  }

  return packed & 0xff;
}
