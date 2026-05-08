/**
 * Mutable simulation state for procedural SMB routines (area parser, objects).
 * Names follow CONTEXT.md — no disassembly symbols on fields.
 */

export interface GameRam {
  worldNumber: number;
  areaNumber: number;
  areaPointer: number;
  areaType: number;
  areaAddrsLowOffset: number;
  areaObjectBytes: Uint8Array;
  enemyObjectBytes: Uint8Array;
  areaDataOffset: number;
  metatileBuffer: Uint8Array;
  blockBuffer1: Uint8Array;
  blockBuffer2: Uint8Array;
  currentColumnPos: number;
  currentPageLoc: number;
  blockBufferColumnPos: number;
  backgroundScenery: number;
  foregroundScenery: number;
  terrainControl: number;
  cloudTypeOverride: number;
  areaStyle: number;
  backgroundColorCtrl: number;
  playerEntranceCtrl: number;
  gameTimerSetting: number;
  /** Three area-object slots; $ff means empty (matches init-dec pattern). */
  areaObjectLengthSlots: Uint8Array;
  areaObjectOffsetBuffer: Uint8Array;
  areaObjectPageLoc: number;
  areaObjectPageSel: number;
  behindAreaParserFlag: number;
  objectOffset: number;
  backloadingFlag: number;
  loopCommand: number;
  scratchObjectBits: number;
  /** Row index into the metatile column buffer (6502 $07). */
  objectRowIndex: number;
  /** Added to scratch bits to form the JumpEngine index before a handler runs. */
  areaObjectDecoderAddend: number;
  hiddenOneUpFlag: number;
  staircaseControl: number;
  mushroomLedgeHalfLengthSlots: Uint8Array;
  cannonOffset: number;
  whirlpoolOffset: number;
  enemyFlagSlots: Uint8Array;
  primaryHardMode: number;
  halfwayPage: number;
  /** Scratch for pipe height / column routines (6502 $06). */
  verticalObjectScratch: number;
}
