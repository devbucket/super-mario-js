import type { Camera } from '../engine/camera/types.js';
import { getPlayerWorldXPx } from './get-player-world-x-px.js';
import type { GameRam } from './types.js';

export function updateCameraScrollFromPlayerWorldX(camera: Camera, ram: GameRam, worldWidthPx: number, viewportWidthPx: number): void {
  const playerWorldX = getPlayerWorldXPx(ram);
  const halfViewport = Math.floor(viewportWidthPx / 2);
  let scroll = playerWorldX - halfViewport;

  const maxScroll = Math.max(0, worldWidthPx - viewportWidthPx);

  if (scroll < 0) {
    scroll = 0;
  }

  if (scroll > maxScroll) {
    scroll = maxScroll;
  }

  camera.scrollXPx = scroll;
}
