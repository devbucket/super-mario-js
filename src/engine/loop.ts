export const SIM_HZ = 60;
export const SIM_DT_MS = 1000 / SIM_HZ;
/** After tab sleep / breakpoint, never run more than this many ticks in one rAF. */
/** Capped at one so the level clock cannot advance multiple times per display frame. */
export const MAX_STEPS_PER_FRAME = 1;

/**
 * If we fall far behind wall clock, discard excess accumulator so we do not spiral.
 * Keep one frame of slack so slight jitter still converges.
 */
const MAX_ACCUMULATOR_MS = SIM_DT_MS * MAX_STEPS_PER_FRAME * 2;

export type TickFn = (ctx: { frameIndex: number }) => void;
export type PaintFn = () => void;

/** Runs fixed-step `onTick` (capped), then `onPaint` once per display frame. */
export function startGameLoop(onTick: TickFn, onPaint: PaintFn): () => void {
  let last = performance.now();
  let accumulator = 0;
  let frameIndex = 0;
  let raf = 0;

  const frame = (now: number): void => {
    const dt = now - last;

    last = now;
    accumulator += dt;

    if (accumulator > MAX_ACCUMULATOR_MS) {
      accumulator = SIM_DT_MS;
    }

    let steps = 0;

    while (accumulator >= SIM_DT_MS && steps < MAX_STEPS_PER_FRAME) {
      onTick({ frameIndex });
      frameIndex += 1;
      accumulator -= SIM_DT_MS;
      steps += 1;
    }

    onPaint();

    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);

  return (): void => {
    cancelAnimationFrame(raf);
  };
}
