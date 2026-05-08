import { areaObjectHandlers } from './area-object-handlers-data.js';
import type { GameRam } from './types.js';

export function runAreaObjectJumpEngine(ram: GameRam, handlerIndex: number): void {
  const handler = areaObjectHandlers[handlerIndex];

  if (handler === undefined) {
    throw new Error(`Area object jump index out of range: ${handlerIndex}`);
  }

  handler(ram);
}
