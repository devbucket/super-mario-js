/**
 * Verbatim tables from the movement physics block (jump forces, horizontal caps, friction).
 */

export const jumpVerticalForceByVariant = new Uint8Array([0x20, 0x20, 0x1e, 0x28, 0x28, 0x0d, 0x04]);

export const fallVerticalForceByVariant = new Uint8Array([0x70, 0x70, 0x60, 0x90, 0x90, 0x0a, 0x09]);

export const playerVerticalSpeedByVariant = new Uint8Array([0xfc, 0xfc, 0xfc, 0xfb, 0xfb, 0xfe, 0xff]);

export const jumpInitialVerticalMoveForceByVariant = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x00]);

export const maximumLeftSpeedByVariant = new Uint8Array([0xd8, 0xe8, 0xf0]);

export const maximumRightSpeedByVariant = new Uint8Array([0x28, 0x18, 0x10]);

/** Fourth entry used during pipe intro branches in the original routine. */
export const maximumRightSpeedPipeIntro = 0x0c;

export const frictionLowByteByVariant = new Uint8Array([0xe4, 0x98, 0xd0]);

export const playerAnimTimerByVariant = new Uint8Array([0x02, 0x04, 0x07]);

/** Running timer reload when B is held in runnable sections. */
export const runningTimerReload = 0x0a;
