const NES_W = 256;
const NES_H = 240;

/**
 * Keep backing store at native NES resolution; scale only via CSS so pixels stay crisp.
 * Integer scale, letterboxed inside `root` (max scale that fits).
 */
export function attachCanvasResize(canvas: HTMLCanvasElement, root: HTMLElement): () => void {
  canvas.width = NES_W;
  canvas.height = NES_H;

  const apply = (): void => {
    const rect = root.getBoundingClientRect();
    const scale = Math.max(1, Math.floor(Math.min(rect.width / NES_W, rect.height / NES_H)));

    canvas.style.width = `${NES_W * scale}px`;
    canvas.style.height = `${NES_H * scale}px`;
  };

  apply();
  const ro = new ResizeObserver(apply);

  ro.observe(root);
  window.addEventListener('resize', apply);

  return (): void => {
    ro.disconnect();
    window.removeEventListener('resize', apply);
  };
}
