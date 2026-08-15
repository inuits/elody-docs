---
title: History diff
---

# History diff

Side-by-side version compare · Implemented by `HistoryDiffPreview.vue`

## When to use / when not
Comparing two versions from the audit trail. Extends [AuditEntry](./feedback) —
the trail row's "Vergelijk" action opens it. Not for live conflict resolution.

## Anatomy
Two columns under one panel shell: version headers (eyebrow style: actor +
timestamp), then field rows aligned by label; unchanged rows muted ink,
changed rows carry the audit mark-up — old value struck `--color-text-muted`,
new value plain — with a per-row changed tint (`--color-accent-tint`). A
"Toon alleen wijzigingen" toggle sits in the panel header.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | aligned columns | open |
| changed row | tint + strike→new | diff |
| only-changes | unchanged rows collapsed | toggle |
| loading | field-row skeletons both columns | fetch |
| identical | "Geen verschillen" line | empty diff |

<StoryEmbed id="components-historydiffpreview--two-column" />

## Behaviour & keyboard
The toggle is a real switch; rows are read-only (restoring a version is a
labelled action in the panel header, undo-over-confirm applies).

## Accessibility
Columns are one table (`role="table"`) with version column headers — never
two visually-aligned lists; changes announced in cell text (strike is not the
only signal: "was {oud}, nu {nieuw}").

## Content & i18n
"Vergelijk" / "Compare" · "Toon alleen wijzigingen" / "Show changes only" ·
"Geen verschillen" / "No differences" · "Herstel deze versie" / "Restore this
version".

## Do & don't
Do align rows by field label. Don't colour-only-mark changes; don't allow
editing inside the diff.

## Related
[Feedback & undo](./feedback) · [Panel & block shells](./panel-and-block-shells)
