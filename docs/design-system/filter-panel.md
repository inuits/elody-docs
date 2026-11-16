---
title: Filter panel
---

# Filter panel

A pane beside a list where people narrow the results with filters.

<StoryEmbed id="filters-filtersbase--default" height="460px" />

## When to use

- A list whose entity type has filters, such as the library or the list of
  [saved searches](./saved-searches).

## When not to use

- **Searching on one term across the list:** use the list's search.
- **Choosing a value for a field:** use a [dropdown](./dropdown) or the
  [entity picker](./entity-picker).

## Anatomy

1. **Filters button:** in the list band, a secondary-style button with a
   funnel, _Filters_ and a count chip when filters are active. It opens and
   closes the pane.
2. **Pane:** a `--filter-pane-width` column at the left of the results panel.
   Its top row is level with the list band (`--list-band-pad`) and holds the
   _Filters_ button while the pane is open. The rest scrolls.
3. **Actions:** _Clear all_ (secondary, ✕) and _Apply filter(s)_ (primary,
   full width), then the [saved searches](./saved-searches) menu where saved
   searches are on, then an _Add filter_ [autocomplete](./autocomplete) for
   filters that are not shown by default.
4. **Section:** one per filter. The header shows the filter's name, an
   optional help icon with a [tooltip](./tooltip) and a chevron (⌄ closed,
   ⌃ open).
5. **Matcher:** inside an open section. With more than one way to match, the
   mode (_contains text_, _is exactly_, …) sits as a prefix inside the input
   box. Checkbox lists, two-field ranges and sliders stack under the mode
   instead.
6. **Clear filter:** a small link under an active section.

## Variants

| Variant | Where | Looks like |
|---|---|---|
| Pane | from 48rem up | a column beside the results |
| Sheet | below 48rem | a sheet from the bottom over a dimmed page (`--sheet-radius`); tapping the dimmed page closes it |

| Filter type | Default matcher |
|---|---|
| Text | _contains text_ |
| Selection | _is any of_, with suggestions |
| Date, number, yes/no | _is exactly_ |

A filter's configuration can change its default matcher, limit which matchers
it offers and rename them.

## States

| State | What you see | Trigger |
|---|---|---|
| Closed section | chevron ⌄, matcher hidden | — |
| Open section | chevron ⌃, matcher below the header | clicking the header, Enter or Space |
| Active section | header in `--color-accent-light` with `--color-accent-ink`; _Clear filter_ link; count on the _Filters_ button | the filter has a value |
| Pane open | _Filters_ button with an accent border | clicking _Filters_ |
| Paused | filters hidden; opening them ends the search | a simple search is running |

<StoryEmbed id="filters-filtersbase--active" height="460px" />
<StoryEmbed id="filters-filterstoggle--states" height="260px" />

**Filters apply on _Apply filter(s)_ or Enter, not on every keystroke.** Typing
or ticking only makes a section active. Clearing is lighter: _Clear filter_
clears one filter and applies at once, and _Clear all_ clears every filter,
closes all sections, removes an applied saved search and applies at once.

A section opens by itself when its filter becomes active. Changing a
section's matcher clears its value.

## Keyboard & accessibility

- Enter anywhere in the pane applies the filters.
- Section headers are focusable, with `role="button"` and `aria-expanded`;
  Enter or Space opens or closes them.
- The pane is a `complementary` landmark named _Filters_.
- The _Filters_ button has `aria-expanded` and `aria-controls` pointing at the
  pane. Its name includes the count: _Filters, 2 active_. The count chip itself
  is hidden from assistive technology.
- The matcher's mode is a [dropdown](./dropdown) and follows its keys.

## Content

- Filter names are nouns from the data: _Title_, _Year of publication_.
- Matcher modes read as the middle of a sentence: _Title_ _contains text_
  _dragon_.
- Translation keys: `filters.*`, with the modes in `filters.matcher-labels.*`.

## Related

[Saved searches](./saved-searches) · [Autocomplete](./autocomplete) ·
[Dropdown](./dropdown) · [Checkbox](./checkbox) · [Button](./button)
