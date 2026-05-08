import { tickPlayerClimbingSub } from './tick-player-climbing-sub.js';
import { tickPlayerFallingSub } from './tick-player-falling-sub.js';
import { tickPlayerJumpSwimSub } from './tick-player-jump-swim-sub.js';
import { tickPlayerOnGroundSub } from './tick-player-on-ground-sub.js';
import type { GameRam } from './types.js';

const movementSubs: readonly ((ram: GameRam) => void)[] = [tickPlayerOnGroundSub, tickPlayerJumpSwimSub, tickPlayerFallingSub, tickPlayerClimbingSub];

/** Player movement `JumpEngine` dispatch (`MoveSubs`). */
export function runPlayerMovementJumpEngine(ram: GameRam): void {
  movementSubs[ram.playerState & 3](ram);
}
