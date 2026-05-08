import {
  displayByteCoinOnScreenStart,
  displayByteGameTimerStart,
  displayBytePlayerScoreStart,
  statusBarHyphenTileIndex,
  statusBarSpaceTileIndex,
} from '../../data/status-bar-display-digit-layout.js';
import {
  statusBarCoinDigitsStartXPx,
  statusBarCoinIconXPx,
  statusBarMarioLabelXPx,
  statusBarMarioLabelYPx,
  statusBarScoreStartXPx,
  statusBarTimeLabelXPx,
  statusBarTimeLabelYPx,
  statusBarTimerStartXPx,
  statusBarValueRowYPx,
  statusBarWorldLabelXPx,
  statusBarWorldLabelYPx,
  statusBarWorldValueStartXPx,
} from '../../data/status-bar-ppu-layout.js';
import type { GameRam } from '../../game/types.js';
import { drawBgTile } from './draw-bg-tile.js';
import type { BakedChrSheet } from './types.js';
import { NES_PLAYFIELD_ORIGIN_Y_PX } from './types.js';
import { listStatusBarCoinStripSubPaletteIndices } from './utils/list-status-bar-coin-strip-sub-palette-indices.js';

/** BG sub-palette for score, world, timer, and hyphen tiles in the status value row. */
const HUD_STATUS_SUB_PALETTE_INDEX = 2;

const HUD_FONT = '8px "Press Start 2P", monospace';
const HUD_COLOR = '#ffffff';

export interface DrawHudStatusBarDeps {
  readonly backdropRgb: readonly [number, number, number];
}

function digitTileIndex(digit: number): number {
  return digit & 0xff;
}

export function drawHudStatusBar(ctx: CanvasRenderingContext2D, baked: BakedChrSheet, ram: GameRam, deps: DrawHudStatusBarDeps): void {
  const [r, g, b] = deps.backdropRgb;

  ctx.save();
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 256, NES_PLAYFIELD_ORIGIN_Y_PX);
  ctx.font = HUD_FONT;
  ctx.fillStyle = HUD_COLOR;
  ctx.textBaseline = 'top';

  ctx.fillText('MARIO', statusBarMarioLabelXPx, statusBarMarioLabelYPx);
  ctx.fillText('WORLD', statusBarWorldLabelXPx, statusBarWorldLabelYPx);
  ctx.fillText('TIME', statusBarTimeLabelXPx, statusBarTimeLabelYPx);

  for (let digitSlot = 0; digitSlot < 6; digitSlot += 1) {
    const digitValue = ram.displayDigitBytes[displayBytePlayerScoreStart + digitSlot] & 0xff;
    const useSpace = digitSlot === 0 && digitValue === 0;
    const tileIndex = useSpace ? statusBarSpaceTileIndex : digitTileIndex(digitValue);
    const xPx = statusBarScoreStartXPx + digitSlot * baked.tilePx;

    drawBgTile(ctx, baked, tileIndex, HUD_STATUS_SUB_PALETTE_INDEX, xPx, statusBarValueRowYPx);
  }

  const coinStripTileIndices: readonly number[] = [0x00, 0x24, 0x24, 0x2e, 0x29];
  const coinStripSubPalettes = listStatusBarCoinStripSubPaletteIndices();

  for (let stripIndex = 0; stripIndex < coinStripTileIndices.length; stripIndex += 1) {
    const tileIndex = coinStripTileIndices[stripIndex] & 0xff;
    const xPx = statusBarCoinIconXPx + stripIndex * baked.tilePx;
    const subPaletteIndex = coinStripSubPalettes[stripIndex] ?? HUD_STATUS_SUB_PALETTE_INDEX;

    drawBgTile(ctx, baked, tileIndex, subPaletteIndex, xPx, statusBarValueRowYPx);
  }

  for (let digitSlot = 0; digitSlot < 2; digitSlot += 1) {
    const digitValue = ram.displayDigitBytes[displayByteCoinOnScreenStart + digitSlot] & 0xff;
    const xPx = statusBarCoinDigitsStartXPx + digitSlot * baked.tilePx;

    drawBgTile(ctx, baked, digitTileIndex(digitValue), HUD_STATUS_SUB_PALETTE_INDEX, xPx, statusBarValueRowYPx);
  }

  const worldDigit = ram.worldNumber + 1;
  const areaDigit = ram.areaNumber + 1;
  let worldX = statusBarWorldValueStartXPx;

  drawBgTile(ctx, baked, digitTileIndex(worldDigit), HUD_STATUS_SUB_PALETTE_INDEX, worldX, statusBarValueRowYPx);
  worldX += baked.tilePx;
  drawBgTile(ctx, baked, statusBarHyphenTileIndex, HUD_STATUS_SUB_PALETTE_INDEX, worldX, statusBarValueRowYPx);
  worldX += baked.tilePx;
  drawBgTile(ctx, baked, digitTileIndex(areaDigit), HUD_STATUS_SUB_PALETTE_INDEX, worldX, statusBarValueRowYPx);

  for (let digitSlot = 0; digitSlot < 3; digitSlot += 1) {
    const digitValue = ram.displayDigitBytes[displayByteGameTimerStart + digitSlot] & 0xff;
    const xPx = statusBarTimerStartXPx + digitSlot * baked.tilePx;

    drawBgTile(ctx, baked, digitTileIndex(digitValue), HUD_STATUS_SUB_PALETTE_INDEX, xPx, statusBarValueRowYPx);
  }

  ctx.restore();
}
