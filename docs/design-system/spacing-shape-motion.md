---
title: Spacing, shape & motion
---

# Spacing, shape & motion

## Spacing
Spacing is set per layout role rather than from a numeric scale. Rows are
tuned to the pixel to keep the interface dense, so use these tokens instead
of inventing new gaps.

| Token | Use |
|---|---|
| `--page-pad` | page edges |
| `--gutter-panels` | between panels |
| `--panel-header-pad` | panel header |
| `--panel-body-pad` | panel body |
| `--gutter-field-grid` | between fields |
| `--field-row-pad` | inside a field value |
| `--table-row-pad` | table and list rows |
| `--modal-body-pad`, `--modal-footer-pad` | modals |
| `--touch-target-min` | minimum hit target on tablets |

<StoryEmbed id="foundations-tokens--spacing-and-motion" title="Spacing tokens and the motion sample" height="620px" />

## Shape
The corner radius shows what an element does: a pill starts something safe, a
rectangle acts immediately (see [principles](./principles)).

| Token | Use |
|---|---|
| `--radius-chip` | chips, badges, add buttons |
| `--radius-input` | inputs, secondary buttons, dropdowns |
| `--radius-button` | primary and save buttons, menu items, tooltips |
| `--radius-card` | cards, panels |
| `--radius-overlay` | modals, popovers |
| `--radius-pill` | pills: safe, reversible actions |
| `--radius-round` | circles |

## Elevation
There are exactly two levels:

- **Cards and panels** have a 1px border and no shadow.
- **Overlays** float with a shadow: `--shadow-overlay` (menus, listboxes),
  `--shadow-popover`, `--shadow-modal` and `--shadow-toast`.

A card never gets a shadow.

<StoryEmbed id="foundations-tokens--shape-and-elevation" title="Radii and elevation" height="760px" />

## Motion
Motion is short and functional:

- one duration (`--transition-duration-ui`) and one easing (`--ease-ui`) for
  hover and state changes;
- a slight scale-down on press (`--scale-press`);
- no entrance animations on overlays, no bouncing or sliding.

## Related
[Principles](./principles) · [Colour](./colour)
