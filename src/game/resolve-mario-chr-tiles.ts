import {
  marioBigCrouchTiles,
  marioBigJumpTiles,
  marioBigStandTiles,
  marioSmallJumpTiles,
  marioSmallSkidTiles,
  marioSmallStandTiles,
  marioSmallWalk1Tiles,
  marioSmallWalk2Tiles,
  marioSmallWalk3Tiles,
} from '../data/mario-chr-frame-tiles.js';
import type { GameRam } from './types.js';

const skipTileMarker = 0xfc;

function pickSmallWalkFrame(ram: GameRam): readonly [number, number, number, number] {
  const frames = [marioSmallWalk1Tiles, marioSmallWalk2Tiles, marioSmallWalk3Tiles] as const;

  return frames[ram.playerAnimFrame % 3];
}

/** Resolve four CHR indices for Mario's current 16×16 sprite. */
export function resolveMarioChrTiles(ram: GameRam): readonly number[] {
  const isBig = ram.marioSizeCode === 0;

  if (isBig && ram.crouchingFlag !== 0) {
    return [...marioBigCrouchTiles];
  }

  if (isBig && (ram.playerState === 1 || ram.playerState === 2)) {
    return [...marioBigJumpTiles];
  }

  if (isBig) {
    return [...marioBigStandTiles];
  }

  if (ram.playerState === 1 || ram.playerState === 2) {
    return [...marioSmallJumpTiles];
  }

  const isSkidding = ram.playerFacingDir !== ram.playerMovingDir && ram.playerXSpeedAbsolute >= 0x0b && ram.playerState === 0;

  if (isSkidding) {
    return [...marioSmallSkidTiles];
  }

  if (ram.playerState === 0 && ram.playerXSpeedAbsolute === 0) {
    return [...marioSmallStandTiles];
  }

  return [...pickSmallWalkFrame(ram)];
}

export function shouldSkipMarioChrTile(tileIndex: number): boolean {
  return tileIndex === skipTileMarker;
}
