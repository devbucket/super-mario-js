# TODO — super-mario-js

Progress tracker. One vertical slice per item. Tick when the game still runs *and* the slice's promised behaviour is visible on screen.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

## Foundations

- [x] Vite + TypeScript skeleton, `index.html`, `npm run dev` works
- [x] Canvas mounted at NES native 256×240, integer-scaled to fill viewport
- [x] Fixed-step 60 fps game loop with frame counter overlay
- [x] Keyboard input → `JoypadBitMask` (A, B, Select, Start, D-pad)

## Rendering primitives

- [x] Hand-author placeholder CHR tiles in `src/data/chr-tiles.ts` (per ADR-0004; ROM-derived CHR deferred)
- [x] Transcribe full CHR-ROM from cartridge (512 tiles / both pattern tables) via `scripts/extract-chr-from-rom.ts` (per ADR-0004 Update)
- [x] Remap `TileSlot` named indices to the actual SMB CHR slots so the demo stops looking garbled
- [x] Functional tile builder (`tile().row().rect().build()`) for tiles we author ourselves later (debug overlays, custom HUD glyphs)
- [x] NES master palette as a TS constant
- [x] Tile renderer: draw an 8×8 BG tile by bank-relative index + sub-palette (`drawBgTile`)
- [x] Metatile renderer: draw a 16×16 metatile from the metatile table
- [x] Camera with horizontal scroll
- [x] HUD overlay layer (score, coins, world, time) — placeholder digits OK

## Level data pipeline

- [x] Port `WorldAddrOffsets` / `AreaAddrOffsets` / `World*Areas` tables (`src/data/extracted/world-area-pointers.ts`)
- [x] Port `L_GroundArea*` / `L_CastleArea*` / `L_UndergroundArea*` / `L_WaterArea*` as `Uint8Array` literals (`src/data/extracted/levels.ts`)
- [x] Port `E_GroundArea*` etc. as `Uint8Array` literals (`src/data/extracted/enemies.ts`)
- [x] Port `BackSceneryMetatiles`, `BrickMetatiles`, `SolidBlockMetatiles`, `CastleMetatiles`, `TerrainRenderBits` (`src/data/extracted/metatile-dictionaries.ts`)
- [x] Port `GetAreaDataAddrs` (header parsing) (`src/game/get-area-data-addrs.ts`)
- [x] Port `AreaParserCore` + `ProcessAreaData` + `DecodeAreaData` + `RenderUnderPart`
- [x] Port the `JumpEngine` dispatch tables for area objects (`src/game/area-object-handlers-data.ts`, `run-area-object-jump-engine.ts`)
- [x] **Milestone:** scroll through level 1-1 with authentic geometry (no Mario yet) (`src/demo/scroll-test.ts`, `build-level-metatile-grid.ts`)

## Mario

- [x] Subpixel position type and helpers (`{ x, xSub }`, add-with-carry)
- [x] Port `Player_*` RAM slots into the `RAM` module
- [x] Port `FrictionAdder*`, `MaximumLeftSpeed`, `MaximumRightSpeed`, `RunningSpeed`, `VerticalForce*`
- [x] Walking + running on a flat plane
- [x] Jumping with NES-faithful arc
- [x] Mario sprite animation (idle / walk / run / jump / skid)
- [x] Crouching (big Mario)
- [x] Facing direction & skid frame

## Collision

- [x] Block buffer (`Block_Buffer_1`, `Block_Buffer_2`) layout
- [x] Port `GetBlockBufferAddr`
- [x] Port `BlockBufferCollision` for player
- [x] Mario lands on solid blocks
- [x] Mario bumps `?` blocks and bricks from below
- [x] Side collision with walls
- [x] **Milestone:** Mario can run, jump, and traverse 1-1 from start to flagpole geometry

## HUD & status

- [x] Score / coin / world / time digit rendering using the asm's digit table
- [x] Game timer countdown
- [x] Hurry-up music trigger at 100s

## Enemies (one at a time)

- [ ] 5-slot enemy pool (`FindEmptyEnemySlot`)
- [ ] Enemy sprite rendering & flicker shuffling
- [ ] Goomba (walk + stomp + squish frame)
- [ ] Green Koopa Troopa (shell)
- [ ] Red Koopa Troopa (ledge-aware)
- [ ] Piranha Plant
- [ ] Lakitu + Spiny
- [ ] Bullet Bill + cannons
- [ ] Cheep-Cheep (water + jumping)
- [ ] Bloober
- [ ] Hammer Bro
- [ ] Buzzy Beetle
- [ ] Podoboo
- [ ] Bowser + flames + axe + bridge collapse

## Powerups & items

- [ ] Mushroom (super)
- [ ] Fire flower (transforms Mario, enables fireballs)
- [ ] Starman (invincibility + palette cycle)
- [ ] 1-up mushroom
- [ ] Coin (block-spawned + level coins)
- [ ] Fireball (Mario's, with bounce)
- [ ] Floatey score numbers ("100", "200", "1-UP", …)

## Level mechanics

- [ ] Vertical pipes (down warps)
- [ ] Horizontal pipes (entry / exit)
- [ ] Vines & cloud bonus areas
- [ ] Underwater swim physics
- [ ] Flagpole + slide + score
- [ ] Castle + axe + bridge collapse
- [ ] Princess / mushroom-retainer end screen
- [ ] Warp zone text & scroll lock
- [ ] Loop levels (e.g. 4-4)

## Game modes

- [ ] Title screen + demo playback
- [ ] Mode dispatcher (`OperMode_Task`)
- [ ] Level intro screen ("WORLD 1-1 / Mario × 3")
- [ ] Death sequence + life loss
- [ ] Game over
- [ ] Continue (Start+A on title)
- [ ] 2-player alternation (Mario / Luigi)

## Audio

- [ ] Web Audio APU module: 2 pulse + triangle + noise
- [ ] SFX: jump, coin, stomp, bump, kick, fireball
- [ ] SFX: pipe, powerup-grow, powerup-grab, 1-up, vine-grow, flagpole, blast, brick-shatter
- [ ] Port `MusicData` / `MusicHeaderData`
- [ ] Music: overworld
- [ ] Music: underground
- [ ] Music: underwater
- [ ] Music: castle
- [ ] Music: starman
- [ ] Music: hurry-up variants
- [ ] Music: game-over, death, victory, world-clear

## Polish

- [ ] Pause (Start mid-game, freeze tick)
- [ ] Sprite-shuffling flicker on >8 sprites/scanline
- [ ] Loading screen / preload assets
- [ ] Fullscreen toggle

## Done = all 32 levels playable end-to-end with NES-faithful feel
