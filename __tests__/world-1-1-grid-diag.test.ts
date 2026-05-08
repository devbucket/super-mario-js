import { describe, expect, it } from 'vitest';
import { loadAreaIntoRam } from '../src/demo/load-area-into-ram.js';
import { buildLevelMetatileGrid } from '../src/game/build-level-metatile-grid.js';
import { createGameRam } from '../src/game/create-game-ram.js';

const HEIGHT = 13;

function dumpFirstColumns(grid: Uint8Array, widthColumns: number, columns: number): string {
  const lines: string[] = [];

  for (let row = 0; row < HEIGHT; row++) {
    const cells: string[] = [];

    for (let col = 0; col < columns; col++) {
      cells.push(grid[row * widthColumns + col].toString(16).padStart(2, '0'));
    }

    lines.push(`r${row.toString().padStart(2, '0')}: ${cells.join(' ')}`);
  }

  return lines.join('\n');
}

describe('world 1-1 metatile grid (diagnostic)', () => {
  it('renders ground rows 11-12 with the ground metatile across the first screen', () => {
    const ram = createGameRam();

    loadAreaIntoRam(ram, 0, 0);
    const widthColumns = 32;
    const grid = buildLevelMetatileGrid(ram, widthColumns);

    const dump = dumpFirstColumns(grid, widthColumns, widthColumns);
    const groundRow11 = grid.slice(11 * widthColumns, 11 * widthColumns + widthColumns);
    const groundRow12 = grid.slice(12 * widthColumns, 12 * widthColumns + widthColumns);

    expect(
      `\n${dump}\n--- row 11 unique = ${[...new Set(groundRow11)].map((v) => v.toString(16)).join(',')}\n--- row 12 unique = ${[...new Set(groundRow12)].map((v) => v.toString(16)).join(',')}`,
    ).toMatchInlineSnapshot(`
      "
      r00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 80 81 82 00 00 00 00 00 00 00 00 00 00
      r01: 00 00 00 00 00 00 00 00 80 81 82 00 00 00 00 00 00 00 00 83 84 85 00 00 00 00 00 80 81 81 81 82
      r02: 00 00 00 00 00 00 00 00 83 84 85 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 83 84 84 84 85
      r03: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00 00 00
      r04: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
      r05: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
      r06: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
      r07: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 c0 00 00 00 51 c1 51 c0 51 00 00 00 00 00 00 00
      r08: 00 00 07 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
      r09: 00 05 06 08 00 00 00 00 00 00 00 00 00 00 00 00 00 07 00 00 00 00 00 00 00 00 00 00 12 13 00 00
      r10: 05 06 0a 09 08 00 00 00 00 00 00 02 03 03 03 04 05 06 08 00 00 00 00 02 03 04 00 00 14 15 00 00
      r11: 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54
      r12: 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54 54
      --- row 11 unique = 54
      --- row 12 unique = 54"
    `);
  });
});
