import { findAreaPointer } from '../game/find-area-pointer.js';
import { getAreaDataAddrs } from '../game/get-area-data-addrs.js';
import { initGameTimerFromAreaHeader } from '../game/init-game-timer-from-area-header.js';
import { GAME_TIMER_CTRL_RELOAD_FRAMES } from '../game/run-game-timer.js';
import type { GameRam } from '../game/types.js';

export function loadAreaIntoRam(ram: GameRam, worldNumber: number, areaNumber: number): void {
  ram.worldNumber = worldNumber;
  ram.areaNumber = areaNumber;
  findAreaPointer(ram);
  getAreaDataAddrs(ram);
  ram.fetchNewGameTimerFlag = 1;
  ram.gameTimerExpiredFlag = 0;
  initGameTimerFromAreaHeader(ram);
  ram.gameTimerCtrlTimer = GAME_TIMER_CTRL_RELOAD_FRAMES;
}
