import { blockBufferXAdder } from '../data/block-buffer-collision-adders.js';
import { METATILE_PX } from '../engine/ppu/types.js';
import { blockBufferCollision, probeWorldXPx } from './block-buffer-collision.js';
import { impedePlayerMove } from './impede-player-move.js';
import { isClimbableMetatile } from './is-climbable-metatile.js';
import { isHiddenInteractiveMetatile } from './is-hidden-interactive-metatile.js';
import { isSolidMetatile } from './is-solid-metatile.js';
import { resolvePlayerBlockBufferEbValue, resolvePlayerFootCollisionAdderIndices } from './resolve-player-foot-collision-adder-y.js';
import type { GameRam } from './types.js';
import { readSignedByte } from './utils/signed-byte.js';

export interface PlayerBgCollisionContext {
  readonly levelGrid: Uint8Array;
  readonly levelGridWidthColumns: number;
  readonly levelGridHeightRows: number;
}

function playerBgUpperExtentPx(ram: GameRam): number {
  if (ram.marioSizeCode === 1) {
    return 0x10;
  }

  if (ram.crouchingFlag !== 0) {
    return 0x10;
  }

  return 0x20;
}

function worldMetatileColumnFromProbe(playerXPx: number, playerPageLoc: number, xAdder: number): number {
  const probe = probeWorldXPx(playerXPx, playerPageLoc, xAdder);

  return Math.floor(probe / METATILE_PX);
}

function gridRowFromVerticalBufferOffset(verticalBufferOffset: number): number {
  return Math.min(12, Math.max(0, Math.floor(verticalBufferOffset / 16)));
}

function applyHeadBumpToGrid(ctx: PlayerBgCollisionContext, worldColumn: number, row: number, previousMetatile: number): void {
  if (worldColumn < 0 || worldColumn >= ctx.levelGridWidthColumns) {
    return;
  }

  if (row < 0 || row >= ctx.levelGridHeightRows) {
    return;
  }

  const paletteBits = previousMetatile & 0xc0;

  ctx.levelGrid[row * ctx.levelGridWidthColumns + worldColumn] = paletteBits | 0x23;
}

/** Ports `PlayerBGCollision` for feet, head, and side probes against filled block buffers. */
export function playerBgCollision(ram: GameRam, ctx: PlayerBgCollisionContext): void {
  if (ram.disableCollisionDetection !== 0) {
    return;
  }

  if (ram.gameEngineSubroutine < 4 || ram.gameEngineSubroutine === 0x0b) {
    return;
  }

  if (ram.playerYHighPos !== 1) {
    return;
  }

  ram.playerCollisionBits = 0xff;

  if (ram.playerYPx >= 0xcf) {
    return;
  }

  const eb = resolvePlayerBlockBufferEbValue(ram);
  const headAdderY = eb;
  const { leftY, rightY } = resolvePlayerFootCollisionAdderIndices(ram);

  const upperExtent = playerBgUpperExtentPx(ram);

  if (ram.playerYPx >= upperExtent) {
    const headProbe = blockBufferCollision({
      blockBuffer1: ram.blockBuffer1,
      blockBuffer2: ram.blockBuffer2,
      sprObjectXPx: ram.playerXPx,
      sprObjectPageLoc: ram.playerPageLoc,
      sprObjectYPx: ram.playerYPx,
      bufferAdderIndexY: headAdderY,
      returnHorizontalNybble: false,
    });

    if (headProbe.metatileFromBuffer !== 0) {
      const vy = readSignedByte(ram.playerYSpeed);
      const movingUp = vy < 0;

      if (movingUp && headProbe.coordNybble >= 4 && !isHiddenInteractiveMetatile(headProbe.metatileFromBuffer)) {
        const mt = headProbe.metatileFromBuffer & 0xff;

        if (mt === 0x26 || isSolidMetatile(headProbe.metatileFromBuffer)) {
          ram.playerYSpeed = 0;
          ram.playerYMoveForce = 0;
        } else if (ram.areaType === 0) {
          ram.playerYSpeed = 0;
          ram.playerYMoveForce = 0;
        } else if (ram.blockBounceTimer !== 0) {
          ram.playerYSpeed = 0;
          ram.playerYMoveForce = 0;
        } else {
          const hxAdder = blockBufferXAdder[headAdderY] ?? 0;
          const worldColumn = worldMetatileColumnFromProbe(ram.playerXPx, ram.playerPageLoc, hxAdder);
          const row = gridRowFromVerticalBufferOffset(headProbe.verticalBufferOffset);

          applyHeadBumpToGrid(ctx, worldColumn, row, headProbe.metatileFromBuffer);
          ram.blockBounceTimer = 0x10;
          ram.playerYSpeed = 0;
          ram.playerYMoveForce = 0;
        }
      }
    }
  }

  const leftFoot = blockBufferCollision({
    blockBuffer1: ram.blockBuffer1,
    blockBuffer2: ram.blockBuffer2,
    sprObjectXPx: ram.playerXPx,
    sprObjectPageLoc: ram.playerPageLoc,
    sprObjectYPx: ram.playerYPx,
    bufferAdderIndexY: leftY,
    returnHorizontalNybble: false,
  });

  const rightFoot = blockBufferCollision({
    blockBuffer1: ram.blockBuffer1,
    blockBuffer2: ram.blockBuffer2,
    sprObjectXPx: ram.playerXPx,
    sprObjectPageLoc: ram.playerPageLoc,
    sprObjectYPx: ram.playerYPx,
    bufferAdderIndexY: rightY,
    returnHorizontalNybble: false,
  });

  const leftMt = leftFoot.metatileFromBuffer;
  const rightMt = rightFoot.metatileFromBuffer;

  if (leftMt === 0 && rightMt === 0) {
    runSideCollisionProbes(ram);

    return;
  }

  if (isHiddenInteractiveMetatile(leftMt) || isHiddenInteractiveMetatile(rightMt)) {
    runSideCollisionProbes(ram);

    return;
  }

  const vyDown = readSignedByte(ram.playerYSpeed);

  if (vyDown < 0) {
    runSideCollisionProbes(ram);

    return;
  }

  if (isClimbableMetatile(leftMt) || isClimbableMetatile(rightMt)) {
    runSideCollisionProbes(ram);

    return;
  }

  const coordNybble = leftMt !== 0 ? leftFoot.coordNybble : rightFoot.coordNybble;

  if (coordNybble >= 5) {
    if (ram.playerMovingDir === 1) {
      impedePlayerMove(ram, 0);
    } else {
      impedePlayerMove(ram, 1);
    }

    runSideCollisionProbes(ram);

    return;
  }

  ram.playerYPx &= 0xf0;
  ram.playerYSpeed = 0;
  ram.playerYMoveForce = 0;
  ram.playerYMoveForceDummy = 0;
  ram.playerState = 0;
  runSideCollisionProbes(ram);
}

function runSideCollisionProbes(ram: GameRam): void {
  const eb = resolvePlayerBlockBufferEbValue(ram);
  let yIdx = eb + 2;

  for (let pass = 0; pass < 2; pass++) {
    yIdx += 1;

    if (ram.playerYPx >= 0x20 && ram.playerYPx < 0xe4) {
      hitSideProbe(ram, yIdx);
    }

    yIdx += 1;

    if (ram.playerYPx >= 0x08 && ram.playerYPx < 0xd0) {
      hitSideProbe(ram, yIdx);
    }
  }
}

function hitSideProbe(ram: GameRam, bufferAdderIndexY: number): void {
  const side = blockBufferCollision({
    blockBuffer1: ram.blockBuffer1,
    blockBuffer2: ram.blockBuffer2,
    sprObjectXPx: ram.playerXPx,
    sprObjectPageLoc: ram.playerPageLoc,
    sprObjectYPx: ram.playerYPx,
    bufferAdderIndexY,
    returnHorizontalNybble: true,
  });

  const mt = side.metatileFromBuffer;

  if (mt === 0 || mt === 0x1c || mt === 0x6b) {
    return;
  }

  if (isHiddenInteractiveMetatile(mt)) {
    return;
  }

  if (isClimbableMetatile(mt)) {
    return;
  }

  const hx = blockBufferXAdder[bufferAdderIndexY] ?? 0;

  if (!isSolidMetatile(mt)) {
    return;
  }

  const probeWorldX = probeWorldXPx(ram.playerXPx, ram.playerPageLoc, hx);
  const bodyWorldX = probeWorldXPx(ram.playerXPx, ram.playerPageLoc, 0);

  if (probeWorldX < bodyWorldX) {
    impedePlayerMove(ram, 1);
  } else if (probeWorldX > bodyWorldX) {
    impedePlayerMove(ram, 0);
  }
}
