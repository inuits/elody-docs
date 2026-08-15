---
title: Selection action bar
---

# Selection action bar

Bulk actions on the current selection · Implemented by BulkOperations components

## When to use / when not
Appears with any list selection; disabled-resting otherwise. Not for
single-row actions (row actions / split button).

## Anatomy
Bar above the list: selection count ("Selectie: 2"), bulk action buttons
(rect, secondary; destructive ones danger ink), clear-selection link.

## States
| State | Visual cue | Trigger |
|---|---|---|
| none selected | buttons disabled, count hidden | — |
| n selected | count chip live, buttons enabled | checkboxes |
| cross-page | note "op andere pagina's" | pagination |
| running | progress per operation, bar locked | bulk action |

<StoryEmbed id="bulkoperations-selectionactionbar--default" />

## Behaviour & keyboard
Count updates live (`role="status"`). Destructive bulk actions follow
undo-over-confirm where reversible; a confirm modal only for true loss.

## Accessibility
Bar is `role="toolbar"` labelled "Acties op selectie". Buttons carry the count
in their accessible name ("Verwijder 2 records").

## Content & i18n
"Selectie: {n}" / "Selected: {n}" · "Wis selectie" / "Clear selection".

## Do & don't
Do keep it visible (not floating over rows). Don't offer more than ~5 bulk
actions; overflow the rest.

## Round 2 — extras
The bar may embed compact [pagination](./pagination) right-aligned. A
"Selecteer pagina" link selects the visible page; with a capped count
("500+"), clicking the count reveals the exact total (spinner + tooltip
"telling kan even duren"). **Confirm-selection mode** (picker contexts): the
bar's commit becomes "Bevestig selectie ({n})". When empty AND the list has
no selectable context, the bar collapses to nothing rather than rendering
disabled chrome (collapsed-empty variant).

## Related
[Entity list element](./entity-list-element) · [Feedback & undo](./feedback)
