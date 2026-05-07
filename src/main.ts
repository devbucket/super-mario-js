import { attachCanvasResize } from './engine/canvas-host.js';
import { attachKeyboardInput, formatJoypadBinary, formatJoypadHex, getJoypadSnapshot } from './engine/input.js';
import { startGameLoop } from './engine/loop.js';

const root = document.querySelector<HTMLElement>('#game-root');
const canvas = document.querySelector<HTMLCanvasElement>('#game');

if (root === null || canvas === null) {
  throw new Error('Missing #game-root or #game');
}

const ctx = canvas.getContext('2d');

if (ctx === null) {
  throw new Error('2D context not available');
}

const canvasEl = canvas;
const ctx2d = ctx;

const detachResize = attachCanvasResize(canvasEl, root);
const detachInput = attachKeyboardInput();

let displaySimFrame = 0;
let displayJoypad = 0;

function paint(): void {
  ctx2d.fillStyle = '#1a1a2e';
  ctx2d.fillRect(0, 0, canvasEl.width, canvasEl.height);

  ctx2d.fillStyle = '#eaeaea';
  ctx2d.font = '8px monospace';
  ctx2d.textBaseline = 'top';
  ctx2d.fillText(`frame ${displaySimFrame}`, 4, 4);
  ctx2d.fillText(`joypad ${formatJoypadHex(displayJoypad)} ${formatJoypadBinary(displayJoypad)}`, 4, 14);
}

const detachLoop = startGameLoop(({ frameIndex }) => {
  displayJoypad = getJoypadSnapshot();
  displaySimFrame = frameIndex;
}, paint);

window.addEventListener('beforeunload', () => {
  detachResize();
  detachInput();
  detachLoop();
});
