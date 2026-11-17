---
title: View modes
---

# View modes

The ways one library can show its records (list, grid, table, map or
pipeline) and the switch people use to move between them.

<StoryEmbed id="library-baselibrary--view-switch" :width="800" height="380px" />

## When to use

- A list of records where people do different jobs with the same results:
  scanning titles, looking at images, comparing values, seeing where things
  are, following a flow.
- The record type allows more than one mode. With one allowed mode there is
  no switch.

## When not to use

- **The rows and cards themselves:** see the
  [entity list element](./entity-list-element).
- **One record on a map:** use the [map viewer](./map-viewer) in a panel.

## Anatomy

1. **View switch:** icon buttons (`--view-switch-size`) in one capsule with
   a `--color-border-default` border, `--radius-input` corners and a
   `--color-surface` fill. The active mode has `--color-accent-wash` behind
   a `--color-accent-ink` icon; the others are `--color-text-secondary` and
   get `--color-surface-row-hover` on hover. Each button has a tooltip with
   its name. The switch ends the results band, after search, page size and
   sort.
2. **Card size switch:** only in grid mode, right after the view switch. Two
   text buttons, _Large_ and _Compact_ (`--view-switch-text-pad`), in the
   same capsule style.
3. **Results area:** the chosen mode, under the band and the
   [selection action bar](./selection-action-bar).

The buttons appear in the order the record type lists its modes.

## Variants

| Mode | What it shows | When to use it | Pager |
|---|---|---|---|
| List | one row per record, fields side by side | the default for most lists | yes |
| Grid, large | cards with square media, the title and the fields | media-heavy lists | yes |
| Grid, compact | cards with media and the title only, more per row | scanning many images | yes |
| Table | fixed columns under a header row; can be grouped by a field | comparing values across records | yes, except when grouped |
| Map | the records as points, shapes or a heat map | records with a location | no: loads up to 1,000 records |
| Pipeline | the records as cards in a left-to-right flow, joined along their relations | records that feed each other, such as work, expression and manifestation | no: loads up to 1,000 records |

### List

<StoryEmbed id="library-baselibrary--list" :width="800" height="380px" />

The rows are described on the [entity list element](./entity-list-element)
page.

### Grid

<StoryEmbed id="library-baselibrary--grid" :width="800" height="920px" />
<StoryEmbed id="library-baselibrary--grid-compact" :width="800" height="580px" />

Large cards are at least `--grid-card-min-width` wide, compact cards
`--grid-card-min-width-compact`. Compact cards drop the fields and keep the
image and the title. On wide screens a _Select page_ row sits above the
cards.

### Table

<StoryEmbed id="library-baselibrary--table" :width="800" height="380px" />

The table needs every record on the page to have the same fields. When they
differ, the _Table view_ button is left out and the list shows instead. In
table mode the sort controls also offer _Group by_ when the list has group
options; a grouped table shows the records under a header per group, each
with its own _load more_, and hides the pager.

### Map

<StoryEmbed id="library-baselibrary--map" :width="800" height="500px" />

The record type sets the map kind: points, shapes (WKT) or a heat map, and
optionally the centre, zoom, a standard or satellite base map and an area
filter. The map loads up to 1,000 records (a heat map: all of them) instead
of one page; leaving the map goes back to pages of 20. The map itself is
described on the [map viewer](./map-viewer) page.

### Pipeline

<StoryEmbed id="library-baselibrary--pipeline" :width="800" height="560px" />

The record type names the relations that join the cards. A card links to
another only when both are in the results; cards without a relation stand
alone in the first column. Drag the canvas to move around; the _−_, _+_ and
_Fit_ buttons in the corner zoom. Nothing about the layout is saved. Pickers
never offer the pipeline.

## States

| State | What you see | Trigger |
|---|---|---|
| One mode | no view switch; the one mode shows | the record type allows one mode |
| Several modes | the view switch, the active mode in accent wash | the record type allows more than one |
| Remembered | the mode last chosen in any library opens | a list, grid, table or pipeline choice in this browser |
| Table not possible | no _Table view_ button; the list shows | records on the page have different fields |
| Grid | the card size switch next to the view switch | grid mode |
| Loading | skeleton rows; the map shows a spinner over the map; the pipeline shows grey card shapes | fetching |

Which mode opens:

1. If the record type allows one mode, that mode.
2. Otherwise the list, grid, table or pipeline last chosen in this browser,
   if this list allows it.
3. Otherwise the list, or the first mode in the switch when the list is not
   allowed.

The map is never remembered: it always opens from the switch. The card size
is remembered per browser, apart from the mode. The
[entity picker](./entity-picker) has the same switch, without the pipeline,
and does not remember a choice. The search window and the picker in a guided
flow step always open as a list.

## Keyboard & accessibility

- Tab reaches each button in the view switch, then the card size buttons.
  Enter or Space picks a mode.
- The view switch is a `role="group"` named _View_; each button has
  `aria-pressed` and a name such as _List view_ or _Map view_. The tooltip
  also opens on focus.
- The card size switch is a `role="group"` named _Card size_, with
  `aria-pressed` on _Large_ and _Compact_.
- In the pipeline, the zoom buttons are named _Zoom out_, _Zoom in_ and
  _Fit_.
- On narrow screens the band wraps; the switches stay last, after the sort
  controls. Below 48rem the column header rows of the list and the table are
  replaced by the small-screen row with _Select page_ and the count.

## Content

- Button names end in _view_: _List view_, _Grid view_, _Table view_,
  _Map view_, _Pipeline view_.
- Translation keys: `library.view-mode`, `library.view-modes.*`,
  `library.grid-size.*`, `library.group-by`, `pipeline.*`.

## Related

[Entity list element](./entity-list-element) ·
[Selection action bar](./selection-action-bar) ·
[Filter panel](./filter-panel) · [Map viewer](./map-viewer) ·
[Preview panel](./preview-panel) · [Entity picker](./entity-picker)
