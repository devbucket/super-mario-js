import type { GameRam } from '../types.js';
import { noopAreaObject } from './noop-area-object.js';

const styleHandlers = [noopAreaObject, noopAreaObject, noopAreaObject] as const;

export function areaStyleObject(ram: GameRam): void {
  const index = ram.areaStyle % styleHandlers.length;

  styleHandlers[index]();
}
