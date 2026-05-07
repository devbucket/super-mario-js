# ADR-0002: Procedural / module-oriented TypeScript (not FP, not OOP)

- **Status:** Accepted
- **Date:** 2026-05-07

## Context

The disassembly we port from (per [ADR-0001](0001-port-the-disassembly.md)) is procedural 6502 assembly: subroutines mutate shared memory (zero page, `$0200–$07FF`) and operate over fixed slot arrays (e.g. the 5-slot enemy pool). When converting this to TypeScript, two natural paradigms compete:

- **Pure functional programming.** Pass an immutable world snapshot through a pipeline of pure functions every frame, return a new snapshot.
- **Classic object-oriented programming.** Model entities (Mario, Goomba, Koopa, ...) as classes with inheritance, expose `tick()` / `render()` methods, manage them in collections.

Both fight the source material. FP fights it because the simulation is fundamentally about shared mutable state. OOP fights it because the asm has no objects — wrapping a Goomba in a class invents architecture the original didn't have.

## Decision

Neither. We write **procedural / module-oriented TypeScript**.

- Modules export functions that operate on a shared `RAM` module.
- Data shapes are plain `interface`s with no methods (information holders).
- Enemies live in a fixed-size slot array, not a `Set<Enemy>`.
- The disassembly's labelled jump tables port as TypeScript arrays of functions, not as polymorphic dispatch on a class.
- SOLID applies only at engine edges where dependency inversion has a real test/mock payoff (input, audio, canvas).

## Consequences

- Structural 1:1 porting from the asm stays possible — routines look like the source (per [ADR-0003](0003-modern-naming-structural-fidelity.md), with modern names).
- No premature `Entity` / `Component` framework. `CONTEXT.md` § Pitfalls is enforced in code shape, not just in prose.
- `interface`s describe data, never behaviour. Classes are reserved for engine-edge adapters (`AudioWorkletNode` host, canvas wrapper, input source).
- One function per file (per `.cursor/rules/file-layout.mdc`) is a natural fit for procedural modules and supports routine-level navigation.
- Tests target pure functions over `RAM` snapshots and pure data parsers, matching `CONTEXT.md`'s "tests for parsers and physics only".
