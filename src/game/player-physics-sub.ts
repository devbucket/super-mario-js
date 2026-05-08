import { configurePlayerHorizontalPhysics } from './configure-player-horizontal-physics.js';
import { tryInitPlayerJump } from './try-init-player-jump.js';
import type { GameRam } from './types.js';

/** Jump detection + horizontal cap/friction setup (`PlayerPhysicsSub` core paths). */
export function playerPhysicsSub(ram: GameRam): void {
  if (ram.playerState === 3) {
    return;
  }

  tryInitPlayerJump(ram);
  configurePlayerHorizontalPhysics(ram);
}
