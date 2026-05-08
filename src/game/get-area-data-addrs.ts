import { areaDataHighOffsets, enemyAddrHighOffsets } from '../data/extracted/world-area-pointers.js';
import { areaObjectStreamsByTableIndex } from './list-area-object-streams-by-table-index.js';
import { enemyObjectStreamsByTableIndex } from './list-enemy-object-streams-by-table-index.js';
import type { GameRam } from './types.js';
import { getAreaTypeFromAreaPointer } from './utils/get-area-type-from-area-pointer.js';

function rotateHighTwoBitsThreeTimes(value: number): number {
  let accumulator = value & 0xc0;
  let carry = 0;

  for (let i = 0; i < 3; i++) {
    const nextCarry = (accumulator & 0x80) !== 0 ? 1 : 0;

    accumulator = ((accumulator << 1) | carry) & 0xff;
    carry = nextCarry;
  }

  return accumulator & 0xff;
}

export function getAreaDataAddrs(ram: GameRam): void {
  ram.areaType = getAreaTypeFromAreaPointer(ram.areaPointer);
  ram.areaAddrsLowOffset = ram.areaPointer & 0x1f;

  const enemyTableIndex = enemyAddrHighOffsets[ram.areaType] + ram.areaAddrsLowOffset;

  ram.enemyObjectBytes = enemyObjectStreamsByTableIndex[enemyTableIndex];

  const areaTableIndex = areaDataHighOffsets[ram.areaType] + ram.areaAddrsLowOffset;

  ram.areaObjectBytes = areaObjectStreamsByTableIndex[areaTableIndex];

  const header0 = ram.areaObjectBytes[0];
  const lowerThree = header0 & 0x07;

  if (lowerThree >= 4) {
    ram.backgroundColorCtrl = lowerThree;
    ram.foregroundScenery = 0;
  } else {
    ram.foregroundScenery = lowerThree;
    ram.backgroundColorCtrl = 0;
  }

  ram.playerEntranceCtrl = (header0 >> 3) & 0x07;
  ram.gameTimerSetting = rotateHighTwoBitsThreeTimes(header0);

  const header1 = ram.areaObjectBytes[1];

  ram.terrainControl = header1 & 0x0f;
  ram.backgroundScenery = (header1 >> 4) & 0x03;

  const shiftedStyle = rotateHighTwoBitsThreeTimes(header1);

  if (shiftedStyle === 3) {
    ram.cloudTypeOverride = shiftedStyle;
    ram.areaStyle = 0;
  } else {
    ram.cloudTypeOverride = 0;
    ram.areaStyle = shiftedStyle;
  }

  ram.areaDataOffset = 2;
}
