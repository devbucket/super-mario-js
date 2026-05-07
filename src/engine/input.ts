/**
 * NES controller serial read order: bit 0 clocks out first (A), … bit 7 = Right.
 * Same layout as the disassembly’s `JoypadBitMask` when latched from $4016/$4017.
 */
export const JoypadBit = {
  A: 1 << 0,
  B: 1 << 1,
  Select: 1 << 2,
  Start: 1 << 3,
  Up: 1 << 4,
  Down: 1 << 5,
  Left: 1 << 6,
  Right: 1 << 7,
} as const;

export type JoypadBitMask = number;

let held: JoypadBitMask = 0;

function setBit(mask: JoypadBitMask, on: boolean): void {
  if (on) {
    held |= mask;
  } else {
    held &= ~mask;
  }
}

function codeToMask(code: string): JoypadBitMask | null {
  switch (code) {
    case 'KeyZ':
    case 'Space':
      return JoypadBit.A;
    case 'KeyX':
      return JoypadBit.B;
    case 'ShiftLeft':
    case 'ShiftRight':
      return JoypadBit.Select;
    case 'Enter':
      return JoypadBit.Start;
    case 'ArrowUp':
      return JoypadBit.Up;
    case 'ArrowDown':
      return JoypadBit.Down;
    case 'ArrowLeft':
      return JoypadBit.Left;
    case 'ArrowRight':
      return JoypadBit.Right;
    default:
      return null;
  }
}

function onKeyDown(ev: KeyboardEvent): void {
  const mask = codeToMask(ev.code);

  if (mask === null) {
    return;
  }

  ev.preventDefault();
  setBit(mask, true);
}

function onKeyUp(ev: KeyboardEvent): void {
  const mask = codeToMask(ev.code);

  if (mask === null) {
    return;
  }

  ev.preventDefault();
  setBit(mask, false);
}

/** Latch-style: call once per logical tick; returns held buttons for this frame. */
export function getJoypadSnapshot(): JoypadBitMask {
  return held;
}

export function attachKeyboardInput(): () => void {
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', onBlur);

  return (): void => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', onBlur);
  };
}

function onBlur(): void {
  held = 0;
}

export function formatJoypadHex(mask: JoypadBitMask): string {
  const u = mask & 0xff;

  return `0x${u.toString(16).padStart(2, '0').toUpperCase()}`;
}

export function formatJoypadBinary(mask: JoypadBitMask): string {
  const u = mask & 0xff;

  return u.toString(2).padStart(8, '0');
}
