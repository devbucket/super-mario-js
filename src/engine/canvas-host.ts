const NES_W = 256;
const NES_H = 240;

/**
 * Keep backing store at native NES resolution; scale only via CSS so pixels stay crisp.
 * Integer scale, letterboxed inside `root` (max scale that fits).
 *
 * When the canvas sits inside a clipping wrapper (e.g. `#game-viewport` with `overflow:
 * hidden`), the top {@link OVERSCAN_TOP_PX} buffer rows are hidden so the layout matches
 * a cropped TV picture without changing simulation coordinates.
 */
export function attachCanvasResize(canvas: HTMLCanvasElement, root: HTMLElement): () => void {
  canvas.width = NES_W;
  canvas.height = NES_H;

  const apply = (): void => {
    const rect = root.getBoundingClientRect();
    const scale = Math.max(1, Math.floor(Math.min(rect.width / NES_W, rect.height / NES_H)));

    canvas.style.width = `${NES_W * scale}px`;
    canvas.style.height = `${NES_H * scale}px`;

    const viewport = canvas.parentElement;

    if (viewport instanceof HTMLElement && viewport !== root) {
      viewport.style.width = `${NES_W * scale}px`;
      viewport.style.height = `${NES_H * scale}px`;
    }
  };

  apply();
  const ro = new ResizeObserver(apply);

  ro.observe(root);
  window.addEventListener('resize', apply);

  return (): void => {
    ro.disconnect();
    window.removeEventListener('resize', apply);
    canvas.style.marginTop = '';
    const viewport = canvas.parentElement;

    if (viewport instanceof HTMLElement && viewport !== root) {
      viewport.style.width = '';
      viewport.style.height = '';
    }
  };
}
