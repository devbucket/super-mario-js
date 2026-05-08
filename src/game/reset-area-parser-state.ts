import type { GameRam } from './types.js';

export function resetAreaParserState(ram: GameRam): void {
  ram.areaDataOffset = 2;
  ram.areaObjectPageLoc = 0;
  ram.areaObjectPageSel = 0;
  ram.areaObjectLengthSlots.set([0xff, 0xff, 0xff]);
  ram.areaObjectOffsetBuffer.fill(0);
  ram.metatileBuffer.fill(0);
  ram.behindAreaParserFlag = 0;
  ram.loopCommand = 0;
}
