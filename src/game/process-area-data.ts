import { decodeAreaData } from './decode-area-data.js';
import { incAreaObjectOffset } from './inc-area-object-offset.js';
import type { GameRam } from './types.js';

export function processAreaData(ram: GameRam): void {
  outer: while (true) {
    for (let slot = 2; slot >= 0; slot--) {
      ram.objectOffset = slot;
      ram.behindAreaParserFlag = 0;

      const baseOffset = ram.areaDataOffset;
      const byte0 = ram.areaObjectBytes[baseOffset];

      if (byte0 === 0xfd) {
        const decoded = decodeAreaData(ram, slot);

        if (decoded === 'levelEnd') {
          return;
        }

        finishSlotLength(ram, slot);
        continue;
      }

      const lengthSlot = ram.areaObjectLengthSlots[slot];

      if ((lengthSlot & 0x80) === 0) {
        const decoded = decodeAreaData(ram, slot);

        if (decoded === 'levelEnd') {
          return;
        }

        finishSlotLength(ram, slot);
        continue;
      }

      const byte1 = ram.areaObjectBytes[baseOffset + 1];

      if ((byte1 & 0x80) !== 0) {
        if (ram.areaObjectPageSel === 0) {
          ram.areaObjectPageSel = 1;
          ram.areaObjectPageLoc++;
        }
      }

      const row = byte0 & 0x0f;

      if (row === 0x0d) {
        const second = ram.areaObjectBytes[baseOffset + 1];

        if ((second & 0x40) === 0) {
          if (ram.areaObjectPageSel === 0) {
            ram.areaObjectPageLoc = second & 0x1f;
            ram.areaObjectPageSel = 1;
            incAreaObjectOffset(ram);
            finishSlotLength(ram, slot);
            continue;
          }
        }
      }

      if (row === 0x0e && ram.backloadingFlag !== 0) {
        const decoded = decodeAreaData(ram, slot);

        if (decoded === 'levelEnd') {
          return;
        }

        finishSlotLength(ram, slot);
        continue;
      }

      if (ram.areaObjectPageLoc < ram.currentPageLoc) {
        ram.behindAreaParserFlag = 1;
        incAreaObjectOffset(ram);
        finishSlotLength(ram, slot);
        continue;
      }

      const decoded = decodeAreaData(ram, slot);

      if (decoded === 'levelEnd') {
        return;
      }

      finishSlotLength(ram, slot);
    }

    if (ram.behindAreaParserFlag !== 0 || ram.backloadingFlag !== 0) {
      continue outer;
    }

    break;
  }
}

function finishSlotLength(ram: GameRam, slot: number): void {
  const len = ram.areaObjectLengthSlots[slot];

  if ((len & 0x80) === 0) {
    ram.areaObjectLengthSlots[slot] = (len - 1) & 0xff;
  }
}
