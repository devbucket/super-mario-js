# ADR-0003: Modern naming, structural fidelity to the disassembly

- **Status:** Accepted
- **Date:** 2026-05-07

## Context

The disassembly is the source we port from (per [ADR-0001](0001-port-the-disassembly.md)). When we transcribe it into TypeScript we have two questions to answer:

1. Do TypeScript identifiers carry asm names, addresses, or cross-references?
2. Does TypeScript structure mirror asm structure?

These can move independently. The disassembly's identifiers are 6502-flavoured and pre-modern (`Player_X_MoveForce`, `JumpEngine`, `RunGoomba`, `$0705`). Carrying them forward bridges debugging-against-spec but pollutes the codebase. Its *structure* — labelled subroutines, fixed slot pools, jump tables — is the behaviour itself; deviating from it risks subtle bugs and loses the diff against the spec.

## Decision

**Clean-break naming, structural fidelity.**

- **Identifiers and comments are pure modern TypeScript.** No asm symbols (`Player_X_MoveForce`, `JumpEngine`, `RunGoomba`), no addresses (`$0705`, `$86`), no register names (`a`, `xReg`, `yReg`) anywhere in `src/`. The TypeScript codebase reads as a self-contained modern application; the disassembly is not a participant in its vocabulary. Domain language is the game's language (player, jump, scroll, enemy, fireball, pipe).
- **Structure stays 1:1 with the asm.** Routine boundaries match labelled subroutines. Fixed slot pools (RAM zero-page layout, 5-slot enemy pool) are preserved. Jump tables port as TypeScript arrays of functions, not polymorphic dispatch (per [ADR-0002](0002-procedural-typescript.md)). Physics constants and data tables stay verbatim. We do not merge or split asm routines for "TS readability."

## Why

- Modern names make the TypeScript codebase pleasant to read in isolation, without requiring the reader to know 6502 assembly.
- Structural fidelity preserves behavioural correctness and keeps debugging against the spec tractable — you can map an asm routine to its TS file by counting subroutines in the same order, even without naming bridges.

## Trade-off accepted

No bridge between asm symbols and TypeScript code means debugging a behavioural bug requires mentally translating the asm's terms into our domain language each time. We judge the long-term codebase clarity worth this porting-phase cost. Tests over physics and parsers (per `CONTEXT.md`) catch most regressions before they need asm-level archaeology.

## Out of scope

A separate `docs/asm-mapping.md` bridge document is *not* part of this decision. If a future maintainer wants one, they can add it as a follow-up — it doesn't violate this ADR (it's docs, not code).

## Consequences

- `.cursor/rules/naming.mdc` enforces "no asm names in code".
- `.cursor/rules/code-style.mdc` § Comments forbids asm cross-references.
- `CONTEXT.md` is amended to reframe "specification" as structural and behavioural rather than naming.
- The `RAM` module's internal slot ordering may still mirror the asm's zero-page layout for behavioural fidelity, but its exported names are modern (`subpixelXForce`, not `Player_X_MoveForce`).
- Renaming everything later is expensive — this decision is hard to reverse, which is why it's captured here.
