---
title: Group form card
---

# Group form card

One-gesture, in-place editing of an interdependent field group · Implemented by `EntityElementWindowPanel.vue`, `useBlockEditor.ts`

## When to use / when not
Fields that only make sense together (e.g. uitgever + plaats + jaar). Not for
independent fields (field rows) and not for lists of identical rows
(repeatable row group).

## Anatomy
Resting: the group's rows tinted `--color-accent-tint` to signal cohesion.
Editing: the whole group lifts into a card (`--color-surface-group-form`, 8px
radius, 1px panel border) with all inputs open and **one** Bewaar/Annuleer pair
bottom-right.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | group tint behind rows | — |
| hover | wash + pencil on any member | pointer |
| editing | card lifts, all inputs active | click any member |
| saving | one spinner on Bewaar, all inputs locked | commit |
| error | per-field messages + summary, group stays open | validation |

<StoryEmbed id="entityelements-entityelementwindowpanel--group-editing" />

## Behaviour & keyboard
**One gesture**: clicking any member value opens the entire group — the click
target's input receives focus. The group saves and validates as one unit.
Escape cancels the whole group; Enter in the last input commits.

## Accessibility
The card is a `role="group"` labelled by the block heading. Error summary gets
focus on failed save; per-field errors linked `aria-describedby`.

## Content & i18n
Same commit copy as the inline editor. Group validation: "Controleer de
gemarkeerde velden" / "Check the highlighted fields".

## Do & don't
Do keep groups small (2–5 fields). Don't nest groups; don't offer per-field
save inside an open group.

## Related
[Field row](./field-row) · [Per-field editing](./per-field-editing)
