---
title: Entity list element
---

# Entity list element

The query-driven result list: table, list and grid view modes · Implemented by `BaseLibrary.vue`, `ViewModesList.vue`, `ListItem.vue`, `TableViewRow.vue`

## When to use / when not
Every collection of entities a query returns — main library, relation panels,
picker results. Not for static key/value data (use a column list).

## Anatomy
Header: title + count chip, view-mode switch (table/list/grid), sort. Table
mode: checkbox · metadata columns · actions (112px) · optional preview eye
(26px). List mode: thumbnail · title (link-blue, bold) · badges · secondary
line. Grid: thumbnail cards. Row title navigates; entity badge tones per
[Foundations](./foundations).

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | 12.5px cells, faint hairlines | — |
| row hover | row-hover fill, actions visible | pointer |
| selected | accent wash + accent row shadow, checkbox checked | checkbox |
| preview open | container splits 40/60→25/75 by width; table collapses to its **first** metadata column | eye / row |
| loading | skeleton rows | fetch |
| empty | text-only line — art is Open, see brief | 0 results |

<StoryEmbed id="library-viewmodes-tableviewrow--default" />

## Behaviour & keyboard
Checkbox selection feeds the [selection action bar](./selection-action-bar).
Preview split matches the responsive-grid container tiers: <500px stacks,
500/630/830/1024px → 40/60, 35/65, 30/70, 25/75. Arrow keys move the row
cursor; Space toggles selection; Enter opens.

## Accessibility
Table mode is a real `<table>` (or `role="table"`); the count chip is
`role="status"`. Row checkboxes named by the row title. The preview eye:
"Toon voorbeeld van {titel}".

## Content & i18n
Count chip: "1.204 resultaten" / "1,204 results". Column headers are nouns,
sentence case.

## Do & don't
Do collapse columns rather than truncate the title. Don't show more than one
primary action per row; don't reshuffle badge tones per view mode.

## Related
[Preview panel](./preview-panel) · [Selection action bar](./selection-action-bar) · [Filter panel](./filter-panel)
