import { gameTimerHundredsBySettingIndex } from '../data/game-timer-hundreds-by-setting-index.js';
import { displayByteGameTimerStart } from '../data/status-bar-display-digit-layout.js';
import type { GameRam } from './types.js';

export function initGameTimerFromAreaHeader(ram: GameRam): void {
  if (ram.gameTimerSetting === 0) {
    return;
  }

  if (ram.fetchNewGameTimerFlag === 0) {
    return;
  }

  const tableIndex = Math.min(ram.gameTimerSetting, 3);
  const hundredsDigit = gameTimerHundredsBySettingIndex[tableIndex] & 0xff;

  ram.displayDigitBytes[displayByteGameTimerStart] = hundredsDigit;
  ram.displayDigitBytes[displayByteGameTimerStart + 2] = 1;
  ram.displayDigitBytes[displayByteGameTimerStart + 1] = 0;

  ram.fetchNewGameTimerFlag = 0;
}
