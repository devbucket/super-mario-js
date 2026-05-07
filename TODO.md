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
- [x] NES master palette as a TS constant
- [x] Tile renderer: draw an 8×8 tile by index + palette
- [x] Metatile renderer: draw a 16×16 metatile from the metatile table
- [x] Camera with horizontal scroll
- [x] HUD overlay layer (score, coins, world, time) — placeholder digits OK

## Level data pipeline

- [ ] Port `WorldAddrOffsets` / `AreaAddrOffsets` / `World*Areas` tables
- [ ] Port `L_GroundArea*` / `L_CastleArea*` / `L_UndergroundArea*` / `L_WaterArea*` as `Uint8Array` literals
- [ ] Port `E_GroundArea*` etc. as `Uint8Array` literals
- [ ] Port `BackSceneryMetatiles`, `BrickMetatiles`, `SolidBlockMetatiles`, `CastleMetatiles`, `TerrainRenderBits`
- [ ] Port `GetAreaDataAddrs` (header parsing)
- [ ] Port `AreaParserCore` + `ProcessAreaData` + `DecodeAreaData` + `RenderUnderPart`
- [ ] Port the `JumpEngine` dispatch tables for area objects
- [ ] **Milestone:** scroll through level 1-1 with authentic geometry (no Mario yet)

## Mario

- [ ] Subpixel position type and helpers (`{ x, xSub }`, add-with-carry)
- [ ] Port `Player_*` RAM slots into the `RAM` module
- [ ] Port `FrictionAdder*`, `MaximumLeftSpeed`, `MaximumRightSpeed`, `RunningSpeed`, `VerticalForce*`
- [ ] Walking + running on a flat plane
- [ ] Jumping with NES-faithful arc
- [ ] Mario sprite animation (idle / walk / run / jump / skid)
- [ ] Crouching (big Mario)
- [ ] Facing direction & skid frame

## Collision

- [ ] Block buffer (`Block_Buffer_1`, `Block_Buffer_2`) layout
- [ ] Port `GetBlockBufferAddr`
- [ ] Port `BlockBufferCollision` for player
- [ ] Mario lands on solid blocks
- [ ] Mario bumps `?` blocks and bricks from below
- [ ] Side collision with walls
- [ ] **Milestone:** Mario can run, jump, and traverse 1-1 from start to flagpole geometry

## HUD & status

- [ ] Score / coin / world / time digit rendering using the asm's digit table
- [ ] Game timer countdown
- [ ] Hurry-up music trigger at 100s

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

## Done = all 32 levels playable end-to-end with NES-faithful feel.
