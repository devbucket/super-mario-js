export interface HudState {
  readonly playerName: string;
  readonly score: number;
  readonly coins: number;
  readonly worldLabel: string;
  readonly time: number;
}

const HUD_FONT = '8px "Press Start 2P", monospace';
const HUD_COLOR = '#ffffff';

const TOP_LABEL_Y_PX = 16;
const TOP_VALUE_Y_PX = 26;

const COLUMN_PLAYER_X_PX = 24;
const COLUMN_COINS_X_PX = 88;
const COLUMN_WORLD_X_PX = 152;
const COLUMN_TIME_X_PX = 208;

/**
 * Placeholder HUD using a pixel-style web font. Real digit rendering with
 * the asm's digit table lands in the HUD slice; this overlay is good
 * enough to verify that HUD-on-top-of-scrolling-world wiring works.
 */
export function drawHudOverlay(ctx: CanvasRenderingContext2D, hudState: HudState): void {
  ctx.save();
  ctx.font = HUD_FONT;
  ctx.fillStyle = HUD_COLOR;
  ctx.textBaseline = 'top';

  ctx.fillText(hudState.playerName, COLUMN_PLAYER_X_PX, TOP_LABEL_Y_PX);
  ctx.fillText(`x${hudState.coins.toString().padStart(2, '0')}`, COLUMN_COINS_X_PX, TOP_LABEL_Y_PX);
  ctx.fillText('WORLD', COLUMN_WORLD_X_PX, TOP_LABEL_Y_PX);
  ctx.fillText('TIME', COLUMN_TIME_X_PX, TOP_LABEL_Y_PX);

  ctx.fillText(hudState.score.toString().padStart(6, '0'), COLUMN_PLAYER_X_PX, TOP_VALUE_Y_PX);
  ctx.fillText(hudState.worldLabel, COLUMN_WORLD_X_PX + 4, TOP_VALUE_Y_PX);
  ctx.fillText(hudState.time.toString().padStart(3, '0'), COLUMN_TIME_X_PX + 4, TOP_VALUE_Y_PX);

  ctx.restore();
}
