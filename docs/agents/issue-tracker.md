# Issue tracker: TODO.md

Issues and work items for this repo live as checklist entries in **`TODO.md`** at the repo root. This is a solo project; there's no GitHub Issues workflow, no `.scratch/`, no external tracker.

## Conventions

- One vertical slice per item — tick when the game still runs *and* the slice's promised behaviour is visible on screen.
- Items are grouped under `##` section headings (e.g. `## Foundations`, `## Mario`, `## Collision`). Add new sections as the project grows.
- Legend (already documented at the top of `TODO.md`):
  - `[ ]` todo
  - `[~]` in progress
  - `[x]` done
- Keep each item to a single line where possible. If an item needs more detail, add a sub-bullet underneath rather than expanding the headline.

## When a skill says "publish to the issue tracker"

Append a new `[ ]` line to the appropriate section in `TODO.md`. Create a new section if no existing one fits. Don't create separate files — `TODO.md` is the single source of truth.

If a skill (e.g. `to-issues`) wants to write a multi-issue plan, render it as a contiguous block of `[ ]` lines under one section, in the order they should be tackled.

## When a skill says "fetch the relevant ticket"

Read `TODO.md` and locate the matching line. The user will normally reference an item by its text or by line number.

## Triage state

The five canonical triage roles (see `triage-labels.md`) aren't actively used here. If a skill insists on recording triage state, prepend an inline tag in square brackets to the item, e.g.:

```
- [ ] [needs-info] Port `JumpEngine` dispatch tables for area objects
```

Remove the tag once the state no longer applies.
