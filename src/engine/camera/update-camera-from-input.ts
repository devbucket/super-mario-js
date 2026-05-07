import type { JoypadBitMask } from '../input.js';
import { JoypadBit } from '../input.js';
import type { Camera } from './types.js';

const SCROLL_PX_PER_FRAME = 2;

/**
 * Per-frame camera update for the demo: D-pad left/right scrolls horizontally.
 * Clamped against the world's pixel width and the viewport width.
 *
 * Deleted in the Mario slice once the camera follows the player.
 */
export function updateCameraFromInput(camera: Camera, joypad: JoypadBitMask, worldWidthPx: number, viewportWidthPx: number): void {
  const maxScrollXPx = Math.max(0, worldWidthPx - viewportWidthPx);

  if ((joypad & JoypadBit.Left) !== 0) {
    camera.scrollXPx = Math.max(0, camera.scrollXPx - SCROLL_PX_PER_FRAME);
  }

  if ((joypad & JoypadBit.Right) !== 0) {
    camera.scrollXPx = Math.min(maxScrollXPx, camera.scrollXPx + SCROLL_PX_PER_FRAME);
  }
}
