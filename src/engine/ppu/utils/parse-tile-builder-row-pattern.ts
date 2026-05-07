/**
 * Parse an 8-character row where each char is a CHR palette index '0'..'3'.
 */
export function parseTileBuilderRowPattern(pattern: string): readonly number[] {
  if (pattern.length !== 8) {
    throw new Error('Tile row pattern must have length 8');
  }

  const values: number[] = [];

  for (let i = 0; i < 8; i++) {
    const char = pattern.charAt(i);

    if (char < '0' || char > '3') {
      throw new Error(`Invalid palette index in tile row pattern: ${char}`);
    }

    values.push(char.charCodeAt(0) - 48);
  }

  return values;
}
