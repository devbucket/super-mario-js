import { alterAreaAttributes } from './area-objects/alter-area-attributes.js';
import { areaStyleObject } from './area-objects/area-style-object.js';
import { brickWithCoins } from './area-objects/brick-with-coins.js';
import { brickWithItem } from './area-objects/brick-with-item.js';
import { columnOfBricks } from './area-objects/column-of-bricks.js';
import { columnOfSolidBlocks } from './area-objects/column-of-solid-blocks.js';
import { emptyBlock } from './area-objects/empty-block.js';
import { flagpoleObject } from './area-objects/flagpole-object.js';
import { hiddenOneUpBlock } from './area-objects/hidden-one-up-block.js';
import { holeEmpty } from './area-objects/hole-empty.js';
import { loopCommandEnd } from './area-objects/loop-command-end.js';
import { noopAreaObject } from './area-objects/noop-area-object.js';
import { questionBlock } from './area-objects/question-block.js';
import { questionBlockRowHigh } from './area-objects/question-block-row-high.js';
import { questionBlockRowLow } from './area-objects/question-block-row-low.js';
import { rowOfBricks } from './area-objects/row-of-bricks.js';
import { rowOfCoins } from './area-objects/row-of-coins.js';
import { rowOfSolidBlocks } from './area-objects/row-of-solid-blocks.js';
import { verticalPipe } from './area-objects/vertical-pipe.js';
import { waterPipe } from './area-objects/water-pipe.js';
import type { GameRam } from './types.js';

/**
 * Order mirrors the SMBDIS area-object jump table 1:1:
 * - 0..7   large objects on rows 0-11 (d6-d4 set)
 * - 8..15  special row 12 objects
 * - 16..21 special row 15 objects
 * - 22..33 small objects on rows 0-11 (d6-d4 clear)
 * - 34..45 row 13 objects (d6 set)
 * - 46     row 14 object (AlterAreaAttributes)
 */
export const areaObjectHandlers: readonly ((ram: GameRam) => void)[] = [
  verticalPipe,
  areaStyleObject,
  rowOfBricks,
  rowOfSolidBlocks,
  rowOfCoins,
  columnOfBricks,
  columnOfSolidBlocks,
  verticalPipe,
  holeEmpty,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  questionBlockRowHigh,
  questionBlockRowLow,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  questionBlock,
  questionBlock,
  questionBlock,
  hiddenOneUpBlock,
  brickWithItem,
  brickWithItem,
  brickWithItem,
  brickWithCoins,
  brickWithItem,
  waterPipe,
  emptyBlock,
  noopAreaObject,
  noopAreaObject,
  flagpoleObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  noopAreaObject,
  loopCommandEnd,
  alterAreaAttributes,
];
