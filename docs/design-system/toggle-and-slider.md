---
title: Toggle & slider
---

# Toggle & slider

Toggle group and range slider primitives · Implemented by the toggle/slider primitives

## When to use / when not
Toggle group: 2–4 mutually exclusive short options (view modes, Ja/Nee where
a checkbox reads wrong). Slider: bounded numeric ranges (zoom, opacity) —
never for precise data entry (use a number input).

## Anatomy
**Toggle group**: one 5px-radius capsule, segments with 1px inner dividers;
active segment `--color-surface-sunken` + strong ink; 11.5px bold labels.
**Slider**: 4px track (`--color-surface-sunken`), commit-teal filled portion,
14px round thumb with 1px border; value bubble (tooltip style) on drag/focus.

## States
| State | Visual cue | Trigger |
|---|---|---|
| active segment | sunken fill | click |
| segment focus | teal ring on segment | keyboard |
| disabled segment | disabled ink | prop |
| thumb drag | bubble shows value | pointer |
| slider disabled | muted track+thumb | prop |

<StoryEmbed id="base-basetogglegroup--view-modes" />

## Behaviour & keyboard
Toggle group: ←/→ move selection (radio pattern), selection is immediate
(state, not data — data-bearing choices go through editors). Slider: arrows
step, PageUp/Down big-step, Home/End bounds.

## Accessibility
Toggle group `role="radiogroup"` with labelled radios; slider
`role="slider"` with `aria-valuemin/max/now` and a text value
(`aria-valuetext` where units matter).

## Content & i18n
Segment labels one word where possible ("Tabel", "Lijst", "Grid").

## Do & don't
Do use the group for view modes. Don't use a toggle group for >4 options
(dropdown); don't make a slider the only way to enter a number.

## Related
[Inputs & tooltips](./inputs-and-tooltips) · [Entity list element](./entity-list-element)
