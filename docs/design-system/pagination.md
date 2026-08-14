---
title: Pagination
---

# Pagination

Page navigation + page size on every list · Implemented by `BasePagination.vue`, LibraryBar footer

## When to use / when not
Every paged entity list (library, relation panels, picker results). Not for
short fixed lists (<1 page).

## Anatomy
List footer row: page-size dropdown-select left ("25 per pagina"), pager right —
‹ · numbered pages (current = accent fill, white numeral; ellipsis for gaps) ·
›, 12px text, 5px-radius page buttons. The count chip in the list header stays
the single source of the total.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | current page filled | — |
| edges | ‹/› disabled at first/last | position |
| loading page | rows skeleton, pager stays interactive-looking but locked | page click |
| size change | returns to page 1 | select |

<StoryEmbed id="base-basepagination--default" />

## Behaviour & keyboard
Page buttons are real buttons; ←/→ within the pager group move focus, Enter
activates. Page state lives in the URL (deep-linkable, back-button works).

## Accessibility
`<nav aria-label="Paginering">`; current page `aria-current="page"`;
page-size select labelled "Resultaten per pagina".

## Content & i18n
"{n} per pagina" / "{n} per page" · pages are bare numerals.

## Do & don't
Do keep the pager at the list footer only. Don't use infinite scroll on data
screens; don't reset filters on page change.

## Related
[Entity list element](./entity-list-element) · [Selection action bar](./selection-action-bar)
