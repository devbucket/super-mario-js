# super-mario-js — Project Context

## What we're building

A browser-playable clone of the original NES **Super Mario Bros.** that looks, sounds, and *feels* identical to the 1985 cartridge — implemented in **plain TypeScript**, compiled and served by **Vite**, rendered to an **HTML5 2D Canvas**. No game framework, no React, no engine.

The reference is the [SMBDIS.ASM disassembly by doppelganger](https://gist.github.com/1wErt3r/4048722) — a fully commented dump of the original 6502 ROM, including every constant, every routine, and every level/enemy data table. We treat that file as our **structural and behavioural specification**: routines port to TypeScript functions in the same order, data tables port to `Uint8Array` literals, and physics constants are copied verbatim. Identifiers are modernised, not transcribed (see [ADR-0003](docs/adr/0003-modern-naming-structural-fidelity.md)).

This is a **personal / educational project**. We are not concerned with copyright or distribution; the goal is to learn how the NES works by faithfully recreating one of its most important games.

## Our approach

We port the disassembly into idiomatic, modern TypeScript. The disassembly is our **structural and behavioural specification**: routine boundaries become TS functions in the same order, data tables (`.db` / `.dw`) become `Uint8Array` literals or readonly tuples, and physics constants are copied verbatim. A hand-rolled Canvas renderer mimics the PPU's tile/metatile/sprite/palette/scroll model. A small Web Audio module synthesises the APU. **Identifiers, however, are modernised** — see [ADR-0003](docs/adr/0003-modern-naming-structural-fidelity.md). We transcribe behaviour, we do not redesign it; we modernise vocabulary, we do not preserve 6502 conventions.

## The mental model: what an NES game actually is

The "NES feel" is not just visuals — it's a specific architecture. To behave identically we need TypeScript analogs of each of these subsystems:

| NES subsystem | What it does | TS equivalent |
|---|---|---|
| **6502 CPU @ ~1.79 MHz** | Runs the game logic on the PPU's NMI at 60.0988 Hz | `requestAnimationFrame` + fixed-step accumulator at 60 fps |
| **2 KB internal RAM** | Holds all variables (zero page `$00–$FF` and `$0200–$07FF`) | A `RAM` module wrapping a typed-object state — we are *not* using a literal `Uint8Array(0x800)`. The layout of variables mirrors the asm internally for behavioural fidelity, but exported names are modern TypeScript (no asm symbols or addresses, per [ADR-0003](docs/adr/0003-modern-naming-structural-fidelity.md)) |
| **PPU (graphics)** | 256×240 output, two 32×30 nametables, 64 sprites, 4+4 four-colour palettes, scroll registers, sprite-0 hit | Canvas 2D tile/sprite renderer with a camera and a fixed HUD layer |
| **APU (audio)** | 2 pulse, 1 triangle, 1 noise, 1 DMC | Web Audio: two `OscillatorNode`s in `'square'`, one `'triangle'`, an LFSR-driven worklet for noise |
| **Controller** | 8 button bits | `keydown`/`keyup` mapped to a bitmask matching the asm's `JoypadBitMask` |

## Frame model

NES games are not delta-time. Every routine runs **exactly once per NMI**. We replicate that:

- One logical tick = one frame at 60 fps.
- Game state mutates only inside `tick()`; rendering reads state and never writes it.
- We use a **fixed-step accumulator** so the simulation is deterministic regardless of monitor refresh rate.
- All animation/cooldowns are **frame counters**, ported directly from the asm's `Timers` block at `$0780+` (`PlayerAnimTimer`, `JumpSwimTimer`, `EnemyFrameTimer`, …).
- We target 60.0000 Hz; NTSC's true 60.0988 Hz is close enough for a faithful clone.

## The non-obvious "exact feel" requirements

These are the things that, if skipped or approximated, make the clone feel "almost Mario but wrong." The disassembly tells us exactly how to do them.

### Subpixel physics (the big one)

Mario's position is **16-bit fixed-point**: a high byte (pixel) and a low byte (1/256th of a pixel). Movement adds a "force" to the low byte and *carries* into the high byte. The asm symbols below are reference only — they appear here in this domain doc to ground the explanation, but **never appear in our TypeScript code** (per [ADR-0003](docs/adr/0003-modern-naming-structural-fidelity.md)). The TS equivalents use modern names (e.g. `playerXPosition`, `subpixelXForce`).

```
Player_X_Position    = $86      ; integer pixel X
Player_X_MoveForce   = $0705    ; fractional X
Player_Y_MoveForce   = $0433    ; fractional Y
VerticalForce        = $0709
VerticalForceDown    = $070a
FrictionAdderHigh    = $0701
FrictionAdderLow     = $0702
MaximumLeftSpeed     = $0450
MaximumRightSpeed    = $0456
RunningSpeed         = $0703
```

In TypeScript we model this as `{ x: number; xSub: number }` with `xSub` in `0..255`, and we must **never** multiply velocity by `dt`. Without subpixel math the jump arc and acceleration curves are wrong even when integer speeds match.

### Frame-locked behaviour

- No `velocity += g * dt`.
- Animation frames advance via timer countdown, not wall-clock interpolation.
- Random behaviour comes from the asm's `PseudoRandomBitReg` shift-register — port it; do not use `Math.random`. Same seed in same situation = same outcome.

### Sprite-0 hit (status bar pinning)

On the NES, the score/coin/time HUD at the top stays fixed while the level scrolls because sprite 0 (a coin pixel) sits on scanline ~31 — when the PPU reaches it mid-frame, the game changes the scroll register. **We do not need to emulate sprite-0 hit.** We render the HUD as an unscrolled overlay drawn after the world. We only need to know it exists when reading the asm's `Sprite0HitDetectFlag` references.

### Sprite flicker / shuffling

NES can render only 8 sprites per scanline. SMB shuffles sprite priorities each frame so excess sprites flicker rather than disappear (`SprShuffleAmt`, `ShufAmtLoop`). For full authenticity we replicate it; if it gets in the way, we can drop it. **Default: replicate**, because a non-flickering Mario looks "off" to people who grew up with the cartridge.

## Data we lift verbatim from the disassembly

The biggest shortcut: **every level and enemy layout is in the file**. We do not redesign anything — we transcribe.

- **Level geometry**: `L_GroundArea1`…`L_CastleArea6` — each `.db` byte sequence encodes objects (page + row, then type/length).
- **Enemies**: `E_GroundArea1`…`E_WaterArea3` — same encoding.
- **World→area mapping**: `WorldAddrOffsets`, `AreaAddrOffsets`, `World1Areas`…`World8Areas`.
- **Header byte format**: parsed by `GetAreaDataAddrs` (terrain control, scenery, time, entrance, etc.).
- **Metatile dictionaries**: `BackSceneryMetatiles`, `BrickMetatiles`, `SolidBlockMetatiles`, `CastleMetatiles`, `TerrainRenderBits`, `BlockBuffLowBounds`.
- **Object decoder dispatch table**: the giant `.dw` table after `RunAObj` (large objects, special rows 12/13/14/15, small objects, row 13 with d6 set, row 14).
- **Music sequences and SFX**: `MusicData`, `MusicHeaderData`, `Squ1_*` / `Squ2_*` / `Tri_*` / `Noise_*` buffers, the `Sfx_*` bitmask constants.
- **Palettes**: `WaterPaletteData`, `GroundPaletteData`, `UndergroundPaletteData`, `CastlePaletteData`, etc.

These all become `Uint8Array` literals or readonly tuples in `src/data/`. Routines that read them (`AreaParserCore`, `ProcessAreaData`, `DecodeAreaData`, `RenderUnderPart`, `RunGoomba`, `MusicCore`, …) are ported byte-for-byte.

## Graphics — the one piece not in the disassembly

The disassembly is logic + data. **Tile pixel art lives in the CHR ROM** (8 KB, not present in the `.asm` file). Per [ADR-0004](docs/adr/0004-chr-tiles-in-source-with-runtime-palette-baking.md), CHR tiles are **transcribed once from the original cartridge's CHR-ROM and committed in-source as 8-line string grids** in `src/data/chr-tiles.ts`. Each row is `"01230123"` style; chars `0`–`3` denote palette indices 0–3. A boot-time decoder composes the tiles into one greyscale offscreen canvas — the input to the palette-baking step described below. The runtime never reads a ROM; the regen script at `scripts/extract-chr-from-rom.ts` is dev-only (default input `docs/data/smb.nes`) and not part of the bundle.

(This is a personal project; copyright is not in scope.)

### Rendering pipeline vocabulary

These are the terms we use across the renderer. They roughly mirror the PPU's pattern-table + palette-latch model.

- **Master palette** — the 64-entry RGB table baked into the NES PPU. Lives at `src/data/master-palette.ts`.
- **Sub-palette** — four indices into the master palette. The PPU has eight (4 background, 4 sprite); per area, we configure them up-front.
- **Area palette** — the four background sub-palettes used while a given area (overworld, underground, castle, …) is active. Lives at `src/data/palettes.ts`.
- **CHR sheet** — the source greyscale offscreen canvas of all 256 tile slots, filled with four greys (`0 / 85 / 170 / 255`).
- **Baked CHR sheet** — every CHR slot × every sub-palette pre-rendered to one larger offscreen canvas. Re-baked on area-palette change. Per-frame tile draws are pure `drawImage` blits from this sheet.
- **Demo tile indices** — until the level-data slice ports real metatile tables, the scroll demo uses hand-picked CHR slot numbers (and 2×2 tile tuples) that match the cartridge layout. Those names and numbers live in `src/data/demo-tile-slots.ts` and `src/demo/utils/build-demo-metatile-table.ts`, not in generated `chr-tiles.ts`.

## Audio approach

We synthesise audio with Web Audio: two `OscillatorNode`s in `'square'` (with periodic duty changes for pulses 1 & 2), one `'triangle'`, and an LFSR-driven `AudioWorkletNode` for noise. We port `MusicCore` and the `Sfx_*` routines on top. Music sequences and SFX bitmasks come straight from the disassembly's `MusicData`, `MusicHeaderData`, and `Sfx_*` tables.

## Project layout

```
super-mario-js/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── CONTEXT.md          ← this file
├── TODO.md             ← progress tracker
├── docs/
│   └── adr/            ← Architectural Decision Records
├── public/
│   └── assets/
│       ├── chr.png     ← extracted tile sheet (8×8 tiles, 16 wide)
│       └── sfx/        ← optional pre-rendered audio
└── src/
    ├── main.ts             ← bootstraps engine, game loop
    ├── engine/
    │   ├── loop.ts         ← fixed 60 fps tick
    │   ├── input.ts        ← keyboard → JoypadBitMask
    │   ├── ppu.ts          ← tile + sprite renderer
    │   ├── camera.ts       ← scroll registers
    │   └── apu.ts          ← Web Audio synth
    ├── game/
    │   ├── ram.ts          ← RAM-shaped state object
    │   ├── timers.ts       ← Timer block at $0780
    │   ├── physics.ts      ← subpixel position math
    │   ├── player.ts       ← PlayerCtrlRoutine, jump, swim, run
    │   ├── enemies/        ← one file per enemy or a dispatch switch
    │   ├── blocks.ts       ← brick / ?-block / coin
    │   ├── collision.ts    ← block buffer + bounding box
    │   ├── area-parser.ts  ← AreaParserCore et al.
    │   ├── modes.ts        ← Title / Game / Victory / GameOver
    │   └── hud.ts          ← status bar
    └── data/
        ├── constants.ts    ← Sfx_*, music bitmasks, enemy IDs
        ├── palettes.ts
        ├── metatiles.ts
        ├── levels.ts       ← L_GroundArea*, L_CastleArea*, …
        ├── enemies.ts      ← E_GroundArea*, …
        └── music.ts
```

## Build order — vertical slices, not horizontal layers

We build a runnable game at every milestone. We do **not** try to port the entire asm before seeing pixels.

1. Vite skeleton + canvas + 60 fps loop showing a frame counter.
2. Tile renderer: load `chr.png`, render a static metatile screen.
3. Camera/scroll: scroll the rendered screen horizontally with `←/→`.
4. Area parser: port `AreaParserCore` + `DecodeAreaData`, feed it `L_GroundArea6` (level 1-1). When level 1-1 scrolls authentically, the hardest data work is done.
5. Mario sprite + subpixel physics: walk/run/jump on a flat plane. Tune until jump arc visually matches NES gameplay.
6. Block buffer collision: port `BlockBufferCollision` and `GetBlockBufferAddr`. Mario stands on blocks, hits bricks, bumps `?` blocks.
7. HUD/status bar: score, coin, world, time digits using the same digit table the asm uses.
8. First enemy: Goomba (`RunGoomba`) — walking + stomp.
9. Powerups: mushroom, fire flower, fireballs (`PowerUpObject`, `Fireball*`).
10. More enemies: Koopa, Piranha Plant, Lakitu, Bowser. Each is an isolated routine.
11. Pipes / warps / vines / flagpole: state transitions handled in `OperMode_Task`.
12. Audio: SFX first (jump, coin, stomp), then music.
13. Title / Game Over / continue / 2-player switching.

Each step ships a runnable game.

## Pitfalls — things to *not* do

These are mistakes that look correct in isolation but quietly break the "it feels like Mario" goal.

### Physics & timing

- **Don't use delta-time physics.** Fixed 60 fps tick, period. `velocity += g * dt` will produce wrong jump arcs even if you tune g.
- **Don't skip subpixel positioning.** Movement quantises visibly and acceleration is wrong.
- **Don't use `Math.random`.** Port `PseudoRandomBitReg`; some game behaviour depends on its predictable cadence.
- **Don't normalise diagonal speed.** Mario doesn't move on a vector; X and Y are independent.
- **Don't tune jump physics by feel.** Copy the constants. If it feels wrong, the bug is somewhere else.

### Architecture

- **Don't sprinkle global mutable state across files.** Encapsulate in a `RAM` module so port mistakes are localised. **Comments do not reference asm addresses or symbols** (per [ADR-0003](docs/adr/0003-modern-naming-structural-fidelity.md)); the `RAM` module exports modern names like `subpixelXForce`.
- **Don't refactor the asm's structure prematurely.** Port routines 1:1 first, *then* clean up. Premature abstraction will make it impossible to compare behaviour against the source spec.
- **Don't write generic "Entity" or "Component" abstractions.** SMB's enemies are state machines with hand-tuned exceptions. A 5-slot fixed enemy pool (`FindEmptyEnemySlot`) is required by parts of the game logic — keep it. See [ADR-0002](docs/adr/0002-procedural-typescript.md) for the procedural / module-oriented stance this project commits to.
- **Don't try to make rendering generic.** It's tiles + sprites. That's it. A "scene graph" is overkill.

### Rendering

- **Don't blit one tile per `drawImage` call without caching.** Pre-render the visible nametable to an offscreen canvas and only update the column entering from the right edge as Mario walks.
- **Don't forget Y-down + page bytes.** `Player_Y_HighPos` tracks which "page" Mario is on (because $00–$F0 is one screen tall *only on a specific page*). Replicate page logic for vertical pipes / down-warps / pits.
- **Don't draw the HUD inside the world transform.** It's an overlay — drawn after the camera-translated world, untransformed.

### Data porting

- **Don't hand-edit level tables.** Transcribe verbatim. If 1-1 looks wrong, 99% of bugs are in the *parser*, not the data.
- **Port the `JumpEngine` table pattern as a TS array of functions.** `jsr JumpEngine` followed by a `.dw` list = `[fn1, fn2, …][index]()`. Resist the urge to "clean it up" with a switch.
- **The block buffer is 2× 16×13 bytes.** It's the level's collision world. Many routines index it directly — keep the layout, don't replace with a smarter data structure.

### Audio

- **Don't try to make audio "sound better."** No reverb, no anti-aliased oscillators. The NES sounds the way it does because of square waves and aliasing.
- **Drive audio from the same 60 fps tick** as the rest of the game. If music drifts relative to gameplay, players notice.

### Workflow

- **Don't build all 32 levels before getting Goomba right.** Vertical slices.
- **Don't add features that the original doesn't have.** "Wall jump would be cool" — no. The goal is `=`, not `+`.
- **Don't write tests for the renderer.** Write tests for parsers and physics only — those are pure functions over data.

## Out of scope (explicitly)

- Multiplayer over network.
- Mobile / touch controls.
- Modding / level editor.
- Lost Levels content (different ROM, different physics).
- Save states.

If we want any of these, they go behind the milestone where the base game is fully playable.

## Decision log

Detailed technical decisions live as ADRs (Architectural Decision Records) in `docs/adr/`. Each ADR is a single short markdown file capturing one decision and its consequences. We add one whenever we make a non-obvious technical choice that future-us would otherwise re-litigate.
