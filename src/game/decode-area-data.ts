import { incAreaObjectOffset } from './inc-area-object-offset.js';
import { runAreaObjectJumpEngine } from './run-area-object-jump-engine.js';
import type { GameRam } from './types.js';

export type DecodeAreaDataResult = 'levelEnd' | 'leave' | 'handled';

export function decodeAreaData(ram: GameRam, slot: number): DecodeAreaDataResult {
  let dataIndex: number;

  if ((ram.areaObjectLengthSlots[slot] & 0x80) !== 0) {
    dataIndex = ram.areaDataOffset;
  } else {
    dataIndex = ram.areaObjectOffsetBuffer[slot];
  }

  const byte0 = ram.areaObjectBytes[dataIndex];

  if (byte0 === 0xfd) {
    return 'levelEnd';
  }

  const row = byte0 & 0x0f;

  let addend = 0;

  if (row === 0x0f) {
    addend = 0x10;
  } else if (row === 0x0c) {
    addend = 0x08;
  }

  ram.areaObjectDecoderAddend = addend;

  if (row === 0x0e) {
    ram.areaObjectDecoderAddend = 0;
    ram.scratchObjectBits = 0x2e;

    return normObj(ram, slot);
  }

  if (row === 0x0d) {
    ram.areaObjectDecoderAddend = 0x22;
    const byte1 = ram.areaObjectBytes[dataIndex + 1];

    if ((byte1 & 0x40) === 0) {
      return 'leave';
    }

    const masked = byte1 & 0x7f;

    if (masked === 0x4b) {
      ram.loopCommand++;
    }

    ram.scratchObjectBits = masked & 0x3f;

    return normObj(ram, slot);
  }

  if (row < 0x0c) {
    const byte1 = ram.areaObjectBytes[dataIndex + 1];
    const largeBits = byte1 & 0x70;

    if (largeBits === 0) {
      ram.areaObjectDecoderAddend = 0x16;
      ram.scratchObjectBits = byte1 & 0x0f;

      return normObj(ram, slot);
    }

    let stored = largeBits;

    if (stored === 0x70 && (byte1 & 0x08) !== 0) {
      stored = 0;
    }

    ram.scratchObjectBits = stored >> 4;

    return normObj(ram, slot);
  }

  const byte1Special = ram.areaObjectBytes[dataIndex + 1];

  ram.scratchObjectBits = (byte1Special & 0x70) >> 4;

  return normObj(ram, slot);
}

function normObj(ram: GameRam, slot: number): DecodeAreaDataResult {
  const lengthSlot = ram.areaObjectLengthSlots[slot];

  if ((lengthSlot & 0x80) === 0) {
    runDecodedHandler(ram);

    return 'handled';
  }

  if (ram.areaObjectPageLoc === ram.currentPageLoc) {
    return initRearPath(ram, slot);
  }

  const reload = ram.areaObjectBytes[ram.areaDataOffset];

  if ((reload & 0x0f) !== 0x0e) {
    return 'leave';
  }

  if (ram.backloadingFlag === 0) {
    return 'leave';
  }

  storeAndIncOffset(ram, slot);
  runDecodedHandler(ram);

  return 'handled';
}

function initRearPath(ram: GameRam, slot: number): DecodeAreaDataResult {
  if (ram.backloadingFlag !== 0) {
    ram.backloadingFlag = 0;
    ram.behindAreaParserFlag = 0;
    ram.objectOffset = 0;

    return 'leave';
  }

  const columnBits = (ram.areaObjectBytes[ram.areaDataOffset] >> 4) & 0x0f;

  if (columnBits !== ram.currentColumnPos) {
    return 'leave';
  }

  storeAndIncOffset(ram, slot);
  runDecodedHandler(ram);

  return 'handled';
}

function storeAndIncOffset(ram: GameRam, slot: number): void {
  ram.areaObjectOffsetBuffer[slot] = ram.areaDataOffset;
  incAreaObjectOffset(ram);
}

function runDecodedHandler(ram: GameRam): void {
  const index = ram.scratchObjectBits + ram.areaObjectDecoderAddend;

  runAreaObjectJumpEngine(ram, index);
}
