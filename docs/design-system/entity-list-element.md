---
title: Entity list element
---

# Entity list element

The list of records a query returns, shown as a list, a grid of cards or a
table.

<StoryEmbed id="library-viewmodes-viewmodeslist--default" height="260px" />

## When to use

- Any set of records that comes from a query: the main library, the relations
  in a detail panel, search results.
- People need to scan, sort, select or open records.

## When not to use

- **Fields of one record:** use label and value rows in a
  [panel](./panel-and-block-shells).
- **Choosing records for a field:** use the [entity picker](./entity-picker),
  which shows this list inside a modal.

## Anatomy

1. **Results band:** `--color-surface-panel-header`, `--list-band-pad`, with a
   hairline below. It holds the count chip, the [pager](./pagination), page
   size, sort, search and the view switch, and wraps when narrow.
2. **Count chip:** _1,258 results_, bold, on `--color-surface`
   (`--radius-chip`, `--chip-padding`, `--text-chip`). Above the count limit
   it reads _1,000+ results_ and is a button that loads the exact count.
3. **View switch:** icon buttons (`--view-switch-size`) in one capsule; the
   active one has an accent wash. In grid mode a second switch,
   _Large | Compact_, sets the card size.
4. **Selection bar:** the [selection action bar](./selection-action-bar), on
   its own row.
5. **Column header row:** labels in `--text-label`, bold,
   `--color-text-field-label`, `--list-header-height` high, with a _Select
   page_ [checkbox](./checkbox) and _Actions_ on the right. It stays on top
   while the list scrolls.
6. **Row:** a [checkbox](./checkbox), a thumbnail, the fields and the row
   actions; `--list-row-pad`, `--text-table`, a `--color-border-faint`
   hairline below. In list and grid mode the first field is the title: bold,
   `--color-text-link`, with a dashed underline in `--color-border-dashed`;
   the other values are in `--color-text-secondary`.
7. **Preview eye (optional):** opens the [preview panel](./preview-panel)
   for that row.

<StoryEmbed id="library-resultcountchip--states" height="200px" />

## Variants

| Variant | Layout | Where |
|---|---|---|
| List | one row per record, fields side by side | default for most lists |
| Grid | cards with square media on top, title and fields below | media-heavy lists |
| Grid, compact | cards with media and title only, in narrower columns | scanning many images |
| Table | fixed columns under a header row; can be grouped by a field | comparing values across records |

<StoryEmbed id="library-viewmodes-viewmodeslist--grid" height="462px" />
<StoryEmbed id="library-viewmodes-viewmodestable--default" height="260px" />

- **List** shows the column header row only when every row on the page has
  the same fields; otherwise each value keeps its own label.
- **Grid** cards are at least `--grid-card-min-width` wide (compact:
  `--grid-card-min-width-compact`), `--grid-gap` apart, with a
  `--color-border-subtle` border, `--radius-card` corners and no shadow. A card
  without an image shows the file-type icon on `--color-surface-muted`. The
  checkbox sits on the image's top-left corner. Titles wrap to two lines, other
  values wrap to two lines and then cut off; the full value is in a tooltip.
  The card size is remembered per browser.
- **Small screens** (below 48rem) get two control rows: search, then filters,
  one sort button and the view switch. Sort options open as a bottom sheet. The
  column header row is replaced by a row with _Select page_, the count and the
  selection actions.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | white row, hairline below | — |
| Hover | `--color-surface-row-hover` fill; text keeps its colour, no underline | pointer |
| Selected | `--color-accent-wash` and `--shadow-accent-row`; in a grid, the wash and a `--color-accent` border | checkbox |
| Preview open | a `--list-row-preview-border` accent border on the left, no wash; the eye is pressed (grid: accent border) | the row's eye |
| Last previewed | the same left border, eye not pressed | the preview closed, if the list keeps the last row marked |
| New | a small accent dot before the row, text in semibold | record added since the last visit |
| Seen | the title in `--color-text-secondary` | record visited before, if the list tracks seen records |
| Disabled | grey row, no checkbox, not clickable | record not available here |
| Loading | skeleton rows on the first load; rows pulse while a new page loads | fetching |
| Empty | _No results found_, or _No results match your filters_ with a tip | no records |

<StoryEmbed id="library-viewmodes-listitem--states" height="580px" />

A table row shows the same states:

<StoryEmbed id="library-viewmodes-tableviewrow--states" height="560px" />

The checkbox owns the wash and the open preview owns the left border, so a row
can show both without one hiding the other.

## Keyboard & accessibility

- Tab reaches each row's link (when the list opens records), its checkbox,
  the preview eye and the row actions, in that order. In a grid card the order
  is checkbox, title, eye, actions. Space toggles a checkbox; Enter on a link
  opens the record.
- The count chip sits in a `role="status"` region, so a new total is announced.
- The view switch is a `role="group"` named _View_; each button has
  `aria-pressed` and a name such as _List view_ or _Grid view_.
- The _Select page_ checkbox ticks when the whole page is selected, shows a
  partial state when some rows are, and clears the page when unticked.
- The column header row is hidden from screen readers; each value keeps its
  label for them, visually hidden.
- The preview eye is a toggle button named _Open preview_ or _Close preview_.
- A grid card's image has the record's title as its `alt` text.

## Content

- Column labels are short nouns in sentence case: _Title_, _Author_.
- The first field is the title; keep it the field people recognise a record by.
- Translation keys: `library.result-count`, `library.view-modes.*`,
  `library.grid-size.*`, `search.noresult`, `search.noresult-nofilters`,
  `search.tip`.

## Related

[Selection action bar](./selection-action-bar) ·
[Preview panel](./preview-panel) · [Pagination](./pagination) ·
[Checkbox](./checkbox) · [Filter panel](./filter-panel)
