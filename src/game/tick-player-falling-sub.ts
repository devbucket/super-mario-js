import { tickPlayerAirMovement } from './tick-player-air-movement.js';
import type { GameRam } from './types.js';

/** Falling-only vertical force selection (`FallingSub`). */
export function tickPlayerFallingSub(ram: GameRam): void {
  ram.verticalForce = ram.verticalForceDown;
  tickPlayerAirMovement(ram);
}
