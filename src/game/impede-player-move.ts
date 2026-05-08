import type { GameRam } from './types.js';

/**
 * Ports `ImpedePlayerMove`. Clears one directional collision bit: `0` = right (joypad bit 0),
 * `1` = left (joypad bit 1), matching `savedJoypadBits` layout.
 */
export function impedePlayerMove(ram: GameRam, joypadDirectionBitToClear: 0 | 1): void {
  ram.sideCollisionTimer = 0x10;
  ram.playerXSpeed = 0;

  const mask = joypadDirectionBitToClear === 0 ? 0xfe : 0xfd;

  ram.playerCollisionBits &= mask & 0xff;
}
