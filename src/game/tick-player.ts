import type { Camera } from '../engine/camera/types.js';
import type { JoypadBitMask } from '../engine/input.js';
import { clampPlayerToWorldLeftEdge } from './clamp-player-to-world-left-edge.js';
import { decrementPlayerAuxTimers } from './decrement-player-aux-timers.js';
import { nullifyHorizontalWhenHoldingDownOnGround } from './nullify-horizontal-when-holding-down-on-ground.js';
import { playerBgCollision } from './player-bg-collision.js';
import { stubClampPlayerToFlatFloor } from './stub-clamp-player-to-flat-floor.js';
import { syncBlockBuffersFromGrid } from './sync-block-buffers-from-grid.js';
import { syncMarioSizeFromPowerupTier } from './sync-mario-size-from-powerup-tier.js';
import { tickPlayerMovementSubs } from './tick-player-movement-subs.js';
import type { GameRam } from './types.js';
import { updateCameraScrollFromPlayerWorldX } from './update-camera-scroll-from-player-world-x.js';
import { updatePlayerMovingDirectionFromSpeed } from './update-player-moving-direction-from-speed.js';
import { packJoypadBitsLikeSmb } from './utils/pack-joypad-bits-like-smb.js';

export interface TickPlayerContext {
  readonly joypad: JoypadBitMask;
  readonly camera: Camera;
  readonly worldWidthPx: number;
  readonly viewportWidthPx: number;
  /** When set, clamps Mario to this world Y when block collision is inactive. */
  readonly stubFloorYPx?: number | null;
  readonly levelGrid?: Uint8Array;
  readonly levelGridWidthColumns?: number;
  readonly levelGridHeightRows?: number;
}

/** Single-frame Mario simulation entry (`PlayerCtrlRoutine` subset). */
export function tickPlayer(ram: GameRam, ctx: TickPlayerContext): void {
  ram.savedJoypadBits = packJoypadBitsLikeSmb(ctx.joypad);

  syncMarioSizeFromPowerupTier(ram);
  nullifyHorizontalWhenHoldingDownOnGround(ram);

  tickPlayerMovementSubs(ram);

  clampPlayerToWorldLeftEdge(ram, {
    worldWidthPx: ctx.worldWidthPx,
    viewportWidthPx: ctx.viewportWidthPx,
  });

  updatePlayerMovingDirectionFromSpeed(ram);

  updateCameraScrollFromPlayerWorldX(ctx.camera, ram, ctx.worldWidthPx, ctx.viewportWidthPx);

  const grid = ctx.levelGrid;
  const gridW = ctx.levelGridWidthColumns;
  const gridH = ctx.levelGridHeightRows;

  if (grid !== undefined && gridW !== undefined && gridH !== undefined) {
    syncBlockBuffersFromGrid(ram, grid, gridW, ctx.camera.scrollXPx);
    playerBgCollision(ram, {
      levelGrid: grid,
      levelGridWidthColumns: gridW,
      levelGridHeightRows: gridH,
    });
  } else if (ctx.stubFloorYPx !== undefined && ctx.stubFloorYPx !== null) {
    stubClampPlayerToFlatFloor(ram, ctx.stubFloorYPx);
  }

  decrementPlayerAuxTimers(ram);

  if (ram.playerAnimTimer > 0) {
    ram.playerAnimTimer -= 1;
  }

  if (ram.playerAnimTimer === 0 && ram.playerAnimTimerSet > 0) {
    ram.playerAnimTimer = ram.playerAnimTimerSet;
    ram.playerAnimFrame = (ram.playerAnimFrame + 1) % 3;
  }

  ram.previousAbJoypadBits = ram.savedJoypadBits & 0xc0;
}
