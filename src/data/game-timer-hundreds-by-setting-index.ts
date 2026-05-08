/**
 * Hundreds digit (BCD 0–9) for the level clock, keyed by the two-bit timer
 * field from the area header after the same rotation as `getAreaDataAddrs`.
 * Index 0 is unused padding; indices 1–3 are the selectable limits.
 */
export const gameTimerHundredsBySettingIndex = new Uint8Array([0x20, 0x04, 0x03, 0x02]);
