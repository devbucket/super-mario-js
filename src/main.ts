import { createLevelPipelineDemo, listAreaCountForWorld } from './demo/scroll-test.js';
import { attachCanvasResize } from './engine/canvas-host.js';
import { attachKeyboardInput, getJoypadSnapshot } from './engine/input.js';
import { startGameLoop } from './engine/loop.js';

const root = document.querySelector<HTMLElement>('#game-root');
const canvas = document.querySelector<HTMLCanvasElement>('#game');
const worldSelect = document.querySelector<HTMLSelectElement>('#debug-world');
const areaSelect = document.querySelector<HTMLSelectElement>('#debug-area');

if (root === null || canvas === null) {
  throw new Error('Missing #game-root or #game');
}

if (worldSelect === null || areaSelect === null) {
  throw new Error('Missing #debug-world or #debug-area');
}

const worldMenu = worldSelect;
const areaMenu = areaSelect;

const ctx = canvas.getContext('2d');

if (ctx === null) {
  throw new Error('2D context not available');
}

const canvasEl = canvas;
const ctx2d = ctx;

ctx2d.imageSmoothingEnabled = false;

function populateWorldSelect(menu: HTMLSelectElement): void {
  menu.innerHTML = '';

  for (let world = 0; world < 8; world++) {
    const option = document.createElement('option');

    option.value = String(world);
    option.textContent = `World ${world + 1}`;
    menu.append(option);
  }
}

function populateAreaSelect(menu: HTMLSelectElement, worldNumber: number): void {
  menu.innerHTML = '';
  const count = listAreaCountForWorld(worldNumber);

  for (let area = 0; area < count; area++) {
    const option = document.createElement('option');

    option.value = String(area);
    option.textContent = `Area ${area + 1}`;
    menu.append(option);
  }
}

populateWorldSelect(worldMenu);
populateAreaSelect(areaMenu, 0);

let demo = createLevelPipelineDemo({ worldNumber: 0, areaNumber: 0 });

function rebuildDemo(): void {
  const worldNumber = Number.parseInt(worldMenu.value, 10);
  const areaNumber = Number.parseInt(areaMenu.value, 10);

  demo = createLevelPipelineDemo({ worldNumber, areaNumber });
}

worldMenu.addEventListener('change', () => {
  const worldNumber = Number.parseInt(worldMenu.value, 10);

  populateAreaSelect(areaMenu, worldNumber);
  rebuildDemo();
});

areaMenu.addEventListener('change', rebuildDemo);

const detachResize = attachCanvasResize(canvasEl, root);
const detachInput = attachKeyboardInput();

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
