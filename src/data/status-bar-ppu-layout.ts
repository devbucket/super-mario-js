const TILE_PX = 8;

/** Nametable 0 base; status bar gameplay transfers use high byte `0x20`. */
const NAME_TABLE_0 = 0x2000;
const STATUS_BAR_PPU_HIGH = 0x20;

function gameplayAddrToOffset(lowByte: number): number {
  const ppuAddr = (STATUS_BAR_PPU_HIGH << 8) | (lowByte & 0xff);

  return ppuAddr - NAME_TABLE_0;
}

function offsetToColumn(offset: number): number {
  return offset & 31;
}

function offsetToRow(offset: number): number {
  return (offset >>> 5) & 31;
}

function columnToXPx(column: number): number {
  return column * TILE_PX;
}

function rowToYPx(row: number): number {
  return row * TILE_PX;
}

/** First “MARIO” name-table tile (`$2043`). */
const MARIO_LABEL_OFFSET = gameplayAddrToOffset(0x43);

/** First “WORLD … TIME” tile on row 2 (`$2052`). */
const WORLD_TIME_LABEL_OFFSET = gameplayAddrToOffset(0x52);

/** First score digit tile (`$2062`, `StatusBarData` player score row). */
const SCORE_VALUE_OFFSET = gameplayAddrToOffset(0x62);

/** Coin icon / × row (`$2068` buffer in game text). */
const COIN_ICON_ROW_OFFSET = gameplayAddrToOffset(0x68);

/** Coin count digits (`$206d`, `StatusBarData`). */
const COIN_DIGIT_OFFSET = gameplayAddrToOffset(0x6d);

/** Game timer digits (`$207a`, `StatusBarData`). */
const TIMER_DIGIT_OFFSET = gameplayAddrToOffset(0x7a);

/** “TIME” word starts near column 24 on the same row as “WORLD”. */
const TIME_LABEL_COLUMN = 24;

export const statusBarMarioLabelXPx = columnToXPx(offsetToColumn(MARIO_LABEL_OFFSET));
export const statusBarMarioLabelYPx = rowToYPx(offsetToRow(MARIO_LABEL_OFFSET));

export const statusBarWorldLabelXPx = columnToXPx(offsetToColumn(WORLD_TIME_LABEL_OFFSET));
export const statusBarWorldLabelYPx = rowToYPx(offsetToRow(WORLD_TIME_LABEL_OFFSET));

export const statusBarTimeLabelXPx = columnToXPx(TIME_LABEL_COLUMN);
export const statusBarTimeLabelYPx = statusBarWorldLabelYPx;

export const statusBarValueRowYPx = rowToYPx(offsetToRow(SCORE_VALUE_OFFSET));

export const statusBarScoreStartXPx = columnToXPx(offsetToColumn(SCORE_VALUE_OFFSET));
export const statusBarCoinIconXPx = columnToXPx(offsetToColumn(COIN_ICON_ROW_OFFSET));
export const statusBarCoinDigitsStartXPx = columnToXPx(offsetToColumn(COIN_DIGIT_OFFSET));
export const statusBarTimerStartXPx = columnToXPx(offsetToColumn(TIMER_DIGIT_OFFSET));

/** World / area digits sit under “WORLD”, starting column 20 on the value row. */
export const statusBarWorldValueStartColumn = 20;
export const statusBarWorldValueStartXPx = columnToXPx(statusBarWorldValueStartColumn);
