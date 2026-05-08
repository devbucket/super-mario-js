/** Small Mario 16×16 poses — CHR sprite bank indices (SMB `PlayerGraphicsTable`). */

export const marioSmallStandTiles: readonly [number, number, number, number] = [0x3a, 0x37, 0x4f, 0x4f];

export const marioSmallWalk1Tiles: readonly [number, number, number, number] = [0x32, 0x33, 0x34, 0x35];

export const marioSmallWalk2Tiles: readonly [number, number, number, number] = [0x36, 0x37, 0x38, 0x39];

export const marioSmallWalk3Tiles: readonly [number, number, number, number] = [0x3a, 0x37, 0x3b, 0x3c];

export const marioSmallSkidTiles: readonly [number, number, number, number] = [0x3d, 0x3e, 0x3f, 0x40];

export const marioSmallJumpTiles: readonly [number, number, number, number] = [0x32, 0x41, 0x42, 0x43];

/** Big Mario standing — middle 16×16 of SMB `PlayerGraphicsTable` row (`$4c/$4d` then `$4a/$4a`; right `$4a` is OAM-flipped on hardware). */
export const marioBigStandTiles: readonly [number, number, number, number] = [0x4c, 0x4d, 0x4a, 0x4a];

export const marioBigJumpTiles: readonly [number, number, number, number] = [0x24, 0x25, 0x26, 0x27];

/** Big Mario crouch (`PlayerGraphicsTable` crouching pose). */
export const marioBigCrouchTiles: readonly [number, number, number, number] = [0x2a, 0x2b, 0x5c, 0x5d];
