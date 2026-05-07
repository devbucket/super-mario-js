# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the strings used in this repo.

> **Note:** This is a solo project tracked in `TODO.md`. The triage state machine is not actively used. The defaults below are recorded so that any skill referencing a role still has a string to use (rendered as an inline `[label]` tag on the relevant `TODO.md` line — see `issue-tracker.md`).

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.
