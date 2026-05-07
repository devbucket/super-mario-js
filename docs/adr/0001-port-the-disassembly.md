# ADR-0001: Port the disassembly into TypeScript

- **Status:** Accepted
- **Date:** 2026-05-07

## Decision

We port the [SMBDIS.ASM disassembly](https://gist.github.com/1wErt3r/4048722) into idiomatic TypeScript. Routines become functions, `.db` / `.dw` data tables become `Uint8Array` literals or readonly tuples, and physics constants are copied verbatim. The PPU is approximated by a hand-rolled Canvas tile/sprite renderer; the APU is synthesised in Web Audio. The disassembly is our specification.

## Consequences

- We commit to a Canvas-based renderer that mimics the PPU's tile/metatile/sprite/palette/scroll model. We render whole frames; we do not implement the PPU's scanline pipeline.
- We commit to a Web Audio APU module that synthesises 2 pulse + triangle + noise channels. No pre-rendered audio for music.
- Asset extraction (CHR ROM → PNG sprite-sheet) is a one-time manual step, not a build dependency.
- Subpixel physics and a 60 fps fixed step are non-negotiable — they are the difference between "Mario clone" and "Mario."
- During the initial port we resist the urge to "clean up" the asm's structure. 1:1 first, refactor later, otherwise we lose the ability to diff our behaviour against the spec.
