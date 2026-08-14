---
title: Date picker
---

# Date picker

Calendar popup for date, time and range · Implemented by `BaseDatePicker.vue`

## When to use / when not
Date-typed fields and filters. Typing remains primary — the popup assists; do
not force mouse-only entry.

## Anatomy
Input (5px radius) with formatted value + calendar glyph. Popup (8px radius,
overlay shadow): month header with ‹ › + month/year dropdown-selects, 7-column
day grid (11.5px, Mon-first, week numbers optional per config), today ringed,
selected day accent-filled; time variant adds hh:mm inputs below the grid;
range variant shows two months, span in accent wash.

## States
| State | Visual cue | Trigger |
|---|---|---|
| closed | formatted value (dd-mm-jjjj) | — |
| open | popup, current month | click glyph/Alt+↓ |
| today | 1px commit-teal ring | — |
| selected | accent fill, white numeral | pick |
| range pending | start filled, hover extends wash | first pick |
| invalid typed | error under input, popup stays | parse fail |
| disabled dates | disabled ink, not focusable | config min/max |

<StoryEmbed id="base-basedatepicker--date-only" />

## Behaviour & keyboard
Grid: arrows move by day, PageUp/Down by month, Enter picks, Escape closes.
Picking fills the input but **Bewaar commits** (pick-then-Bewaar). Typed input
parses on blur; both paths stay in sync.

## Accessibility
Popup `role="dialog"` "Kies datum"; grid `role="grid"` with day-name column
headers; selected day `aria-selected`; the input keeps its own label.

## Content & i18n
Format dd-mm-jjjj (NL) / locale-driven; "Vandaag" / "Today" quick link;
range: "Van … tot …" / "From … to …".

## Do & don't
Do keep typed entry first-class. Don't restyle the third-party widget ad hoc —
this spec replaces its raw styling; don't auto-save on pick.

## Related
[Dropdown select](./dropdown-select) · [Inline editor](./inline-editor) · [Filter panel](./filter-panel)
