# Architectural Decision Records

This folder holds short markdown files, one per non-obvious technical decision, so future-us doesn't re-litigate them.

## Format

Each ADR is named `NNNN-kebab-case-title.md` and follows this template:

```markdown
# ADR-NNNN: <title>

- **Status:** Proposed | Accepted | Superseded by ADR-XXXX
- **Date:** YYYY-MM-DD

## Decision

What we do, in one or two sentences.

## Consequences

What this commits us to. What becomes easier or harder downstream.
```

## Index

- [ADR-0001: Port the disassembly into TypeScript](./0001-port-the-disassembly.md)
- [ADR-0002: Procedural / module-oriented TypeScript (not FP, not OOP)](./0002-procedural-typescript.md)
- [ADR-0003: Modern naming, structural fidelity to the disassembly](./0003-modern-naming-structural-fidelity.md)
