---
title: Filter panel
---

# Filter panel

The 250px query-driven filter rail · Implemented by `FiltersBase.vue`, `FiltersListItem*.vue`, matcher components

## When to use / when not
Beside every library list whose query declares filters. Not for in-page search
within a panel (use the picker's search pill).

## Anatomy
250px column of **FilterSection**s (11.5px bold label, chevron, active-count
chip), each holding a matcher: **TextFilter** (matcher select: bevat / begint
met / is exact / …), **CheckboxListFilter** (options + counts), date/number
matchers. Bottom: **FilterActionBar** — "Pas toe" (commit rect) + "Wis alles".

## States
| State | Visual cue | Trigger |
|---|---|---|
| collapsed | chevron right, count chip if active | click header |
| expanded | matcher visible | click header |
| active | count chip on section + filled values | applied |
| dirty | Pas toe enabled | edit |
| loading counts | inline spinner per option | fetch |

<StoryEmbed id="filters-filtersbase--expanded" />

## Behaviour & keyboard
Filters apply on "Pas toe", never on keystroke. Sections toggle with
Enter/Space; matcher selects follow combobox keys. "Wis alles" resets and
applies immediately (undo via toast).

## Accessibility
Rail is `role="complementary"` "Filters". Section headers are buttons with
`aria-expanded`; count chips `role="status"`. Option counts are part of the
checkbox accessible name ("BOEK, 812 resultaten").

## Content & i18n
Matchers: "bevat" / "contains", "begint met" / "starts with", "is exact" /
"is exactly". Actions: "Pas toe" / "Apply", "Wis alles" / "Clear all".

## Do & don't
Do keep sections in query order. Don't auto-apply on checkbox click; don't
hide active filters in collapsed sections without the count chip.

## Round 2 — rail chrome & semantics
Each active section gets a "Wis filter" link (11.5px) that clears AND applies
immediately (undo via toast) — clearing is consequence-light, unlike applying.
Rail header chrome: applied saved-search title chip (with modified dot), a
global "N actief" count chip, an add-filter autocomplete (search across
available filters; picked filter's section expands), and the saved-searches
menu (⌄). Option loading uses **option-shaped skeletons** (3 rows), not
per-option spinners. Section chevrons: **⌄ closed · ⌃ open**. Action copy
(decision): "Pas toe" / "Wis alles".

## Related
[Entity list element](./entity-list-element) · [Entity picker](./entity-picker)
