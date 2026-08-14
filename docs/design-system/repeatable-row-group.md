---
title: Repeatable row group
---

# Repeatable row group

N identical rows with add/remove/reorder · Implemented by `EntityElementWindowPanel.vue` (repeatable panels)

## When to use / when not
Multi-valued fields (auteurs, identificatoren). Not for one-off groups or
single values.

## Anatomy
Rows zebra'd with `--color-surface-repeat-row`; each row = value(s) + hover
actions (edit pencil, remove cross, drag handle ⠿ left). Below the rows an
add pill: "+ Voeg {type} toe".

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | zebra rows | — |
| row hover | row-hover fill, actions appear | pointer |
| row editing | that row swaps to inline editor | click |
| dragging | row lifts with overlay shadow | drag handle |
| removed | row disappears; toast with Ongedaan maken | remove |
| empty | add pill only, 45%-opacity hint | no rows |

<StoryEmbed id="entityelements-entityelementwindowpanel--repeatable" todo />

## Behaviour & keyboard
Each row edits/saves alone (per-field principle). Remove executes immediately —
undo via toast, no confirm. Reorder: drag, or focus handle + ↑/↓.

## Accessibility
The group is a `role="list"`; rows `role="listitem"`. Row actions carry
accessible names with the row value ("Verwijder auteur Jan Wolkers"). Reorder
announces position via `aria-live` ("Rij 2 van 5").

## Content & i18n
Add: "+ Voeg auteur toe" / "+ Add author". Undo toast: "Auteur verwijderd —
Ongedaan maken" / "Author removed — Undo".

## Do & don't
Do keep row content one line. Don't confirm removals; don't hide the add pill
when rows exist.

## Round 2 — table input merged
Multi-column editable mini-tables (`tableInputFields/*`) are a **variant of
this component**, not a separate one: each row = cells per the field-grid
(text/number inputs, relation autocomplete in a cell), a column-header row
(11.5px labels), add-row pill below, per-row remove; the row remains the edit/
save/validation scope. Cells follow [inputs](./inputs-and-tooltips) rules.

## Related
[Group form card](./group-form-card) · [Feedback & undo](./feedback)
