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

  // --- Player (Mario) — field shape follows routine access order, modern names only.

  /** 1 = small, 0 = big (matches boot init). */
  marioSizeCode: number;
  /**
   * Provisional powerup tier for this slice: 0 = small, 1 = super (crouch/height only).
   * Collapses into `marioSizeCode` when applying size for physics/CHR.
   */
  marioPowerupTier: number;
  crouchingFlag: number;
  /** 0 = on ground, 1 = jump/swim, 2 = falling, 3 = climbing (climbing not used in this slice). */
  playerState: number;
  playerPageLoc: number;
  playerXPx: number;
  playerXSpeed: number;
  /** Fractional horizontal accumulator used with horizontal speed nybbles. */
  playerHorizontalMoveForce: number;
  playerXSpeedAbsolute: number;
  frictionAdderHigh: number;
  frictionAdderLow: number;
  maximumLeftSpeed: number;
  maximumRightSpeed: number;
  runningSpeed: number;
  runningTimer: number;
  playerFacingDir: number;
  playerMovingDir: number;
  playerYPx: number;
  playerYHighPos: number;
  playerYSpeed: number;
  playerYMoveForce: number;
  playerYMoveForceDummy: number;
  verticalForce: number;
  verticalForceDown: number;
  jumpSwimTimer: number;
  jumpOriginYPosition: number;
  jumpOriginYHighPos: number;
  diffToHaltJump: number;
  gameEngineSubroutine: number;
  /** Until collision runs, keep at 0xff so movement logic sees all directions. */
  playerCollisionBits: number;
  playerChangeSizeFlag: number;
  swimmingFlag: number;
  /** Non-zero skips background collision (`DisableCollisionDet`). */
  disableCollisionDetection: number;
  /** Countdown after bumping a block from below (`BlockBounceTimer`). */
  blockBounceTimer: number;
  /** Short timer after side collision (`SideCollisionTimer`). */
  sideCollisionTimer: number;
  jumpspringAnimCtrl: number;
  timerControl: number;
  playerAnimTimer: number;
  playerAnimTimerSet: number;
  playerAnimFrame: number;
  /** Packed like SMB `SavedJoypadBits` after `packJoypadBitsLikeSmb`. */
  savedJoypadBits: number;
  previousAbJoypadBits: number;
  /** `KeyP` toggles super for crouch/CHR debug (edge-detected in demo). */
  debugSuperToggleRequest: number;
}
