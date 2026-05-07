/**
 * Hand-authored placeholder CHR tiles (per ADR-0004).
 *
 * Each tile is an 8-row string grid. Each char is a palette index '0'..'3'.
 * '0' is the area's backdrop; '1'..'3' are the three other colours of the
 * sub-palette chosen at draw time.
 *
 * Tile slot ordering (the index in `chrTiles`) is the value passed to the
 * tile renderer. `TileSlot` gives every authored tile a readable name.
 */

export type TilePixels = readonly [string, string, string, string, string, string, string, string];

export const TileSlot = {
  emptySky: 0,
  groundTop: 1,
  groundFill: 2,
  brick: 3,
  qBlockTopLeft: 4,
  qBlockTopRight: 5,
  qBlockBottomLeft: 6,
  qBlockBottomRight: 7,
  pipeTopLeft: 8,
  pipeTopRight: 9,
  pipeBodyLeft: 10,
  pipeBodyRight: 11,
  cloudLeft: 12,
  cloudMiddle: 13,
  cloudRight: 14,
  hillLeft: 15,
  hillMiddle: 16,
  hillRight: 17,
  coin: 18,
  bush: 19,
} as const;

const emptySky: TilePixels = ['00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000', '00000000'];

const groundTop: TilePixels = ['33333333', '31112111', '21111121', '11211111', '11111121', '21121111', '11111111', '13111121'];

const groundFill: TilePixels = ['11111121', '21111111', '11211111', '11111111', '11212111', '11111111', '11111121', '12111111'];

const brick: TilePixels = ['33333333', '31111121', '31111121', '31111121', '33333333', '12111113', '12111113', '12111113'];

const qBlockTopLeft: TilePixels = ['33333333', '32222222', '32222222', '32222232', '32222322', '32222322', '32223222', '32232222'];

const qBlockTopRight: TilePixels = ['33333333', '22222223', '22222223', '23322223', '22322223', '22322223', '22232223', '22223223'];

const qBlockBottomLeft: TilePixels = ['32322222', '32232222', '32222322', '32222232', '32222222', '32222232', '32222222', '33333333'];

const qBlockBottomRight: TilePixels = ['22223223', '22322223', '23222223', '22322223', '23222223', '22222223', '22222223', '33333333'];

const pipeTopLeft: TilePixels = ['33333333', '31222222', '31222111', '31221111', '31221121', '31221121', '31221121', '31221121'];

const pipeTopRight: TilePixels = ['33333333', '22222213', '11122213', '11111213', '12111213', '12111213', '12111213', '12111213'];

const pipeBodyLeft: TilePixels = ['31221121', '31221121', '31221121', '31221121', '31221121', '31221121', '31221121', '31221121'];

const pipeBodyRight: TilePixels = ['12111213', '12111213', '12111213', '12111213', '12111213', '12111213', '12111213', '12111213'];

const cloudLeft: TilePixels = ['00000033', '00003322', '00033322', '00333222', '03322222', '03322221', '03322221', '03322221'];

const cloudMiddle: TilePixels = ['33333333', '22222222', '22222222', '22222222', '22222222', '22222221', '22221111', '11111111'];

const cloudRight: TilePixels = ['33000000', '22330000', '22233000', '22223300', '22222330', '12222330', '11122330', '11111330'];

const hillLeft: TilePixels = ['00000003', '00000033', '00000033', '00000332', '00000332', '00003322', '00003222', '00033221'];

const hillMiddle: TilePixels = ['33333333', '22222222', '22222122', '22221122', '22211112', '22111111', '21111111', '11111111'];

const hillRight: TilePixels = ['30000000', '33000000', '33000000', '23300000', '23300000', '22330000', '22230000', '12233000'];

const coin: TilePixels = ['00033000', '00322300', '03223230', '03223230', '03223230', '03223230', '00322300', '00033000'];

const bush: TilePixels = ['00033000', '03322300', '33322230', '32222223', '33222233', '03333230', '03323230', '00000000'];

export const chrTiles: readonly TilePixels[] = [
  emptySky,
  groundTop,
  groundFill,
  brick,
  qBlockTopLeft,
  qBlockTopRight,
  qBlockBottomLeft,
  qBlockBottomRight,
  pipeTopLeft,
  pipeTopRight,
  pipeBodyLeft,
  pipeBodyRight,
  cloudLeft,
  cloudMiddle,
  cloudRight,
  hillLeft,
  hillMiddle,
  hillRight,
  coin,
  bush,
];
