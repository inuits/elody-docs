---
title: Inputs & tooltips
---

# Inputs & tooltips

The text/number/textarea primitives + tooltip · Implemented by the base input components

## When to use / when not
Every raw input in editors, forms and filters. Tooltips: supplementary info
only — never the sole carrier of required information.

## Anatomy
**Input**: 5px radius, 1px `--color-border-default`, 13px value ink, 5/8px
padding, placeholder `--color-text-placeholder`; number inputs right-align,
no spinners; textarea min 3 rows, resizes vertically only. Focus: 2px commit-
teal ring, 1px offset — the one focus treatment everywhere. **Copy
affordance**: a ⧉ glyph appears on value hover (fields with copyable values);
click copies + flashes "Gekopieerd" (`role="status"`). **Truncation**: one-line
values ellipsize; hover (and focus) shows the full value in a tooltip.
**Tooltip**: inverted surface, white 11.5px text, 6px radius, 300ms delay,
never interactive content.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | border-default | — |
| hover | border darkens one step | pointer |
| focus | teal ring | keyboard/click |
| error | danger border + message below | validation |
| disabled | muted surface, disabled ink | prop |
| read-only | no border, plain value | prop |

<StoryEmbed id="base-baseinputtextnumberdatetime--text" />

## Behaviour & keyboard
Standard editing keys; Escape inside an editor bubbles to cancel. Tooltip
shows on hover AND focus, hides on Escape.

## Accessibility
Inputs always labelled (visible label or aria-label); error via
`aria-describedby` + `aria-invalid`; tooltip `role="tooltip"` linked via
`aria-describedby`; copy button named "Kopieer {label}".

## Content & i18n
"Gekopieerd" / "Copied" · placeholders are examples, not instructions
("bv. 1958").

## Do & don't
Do reuse this ring for every focusable. Don't put actions in tooltips; don't
truncate without the tooltip escape hatch.

## Related
[Inline editor](./inline-editor) · [Dropdown select](./dropdown-select) · [Foundations](./foundations)
