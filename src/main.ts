import { runScrollTest } from './demo/scroll-test.js';
import { attachCanvasResize } from './engine/canvas-host.js';
import { attachKeyboardInput, getJoypadSnapshot } from './engine/input.js';
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

ctx2d.imageSmoothingEnabled = false;

const detachResize = attachCanvasResize(canvasEl, root);
const detachInput = attachKeyboardInput();
const demo = runScrollTest();

const detachLoop = startGameLoop(
  () => {
    demo.tick(getJoypadSnapshot());
  },
  () => {
    demo.paint(ctx2d);
  },
);

window.addEventListener('beforeunload', () => {
  detachResize();
  detachInput();
  detachLoop();
});
