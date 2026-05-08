/** Byte offset into `GameRam.displayDigitBytes` for the six top-score digits. */
export const displayByteTopScoreStart = 0;

/** Byte offset for the current on-screen player's six score digits (high → low). */
export const displayBytePlayerScoreStart = 6;

/** First byte offset for the on-screen player's two coin digits (BCD). */
export const displayByteCoinOnScreenStart = 0x17;

/** First byte offset for the three game-timer digits (hundreds → ones). */
export const displayByteGameTimerStart = 0x21;

export const statusBarSpaceTileIndex = 0x24;

export const statusBarHyphenTileIndex = 0x28;

export const displayDigitBytesLength = 0x24;
