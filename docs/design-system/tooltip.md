---
title: Tooltip
---

# Tooltip

A short line of extra text that appears next to a control on hover and focus.

<StoryEmbed id="base-basetooltip--shown" />

## When to use

- The full value of a truncated text.
- The name of an icon-only control, such as an item in the navigation rail.
- Why a control is disabled. See [Button](./button).
- A one-line hint next to a field label.

## When not to use

- **Information people must have:** put it on the screen. A tooltip is never
  the only place it appears.
- **Links, buttons or inputs:** a tooltip cannot hold anything interactive.
  Use an [overflow menu](./overflow-menu) for actions.
- **Help longer than a sentence or two:** use the info panel, described under
  [Variants](#variants).

## Anatomy

1. **Surface:** `--color-surface-inverted`, `--radius-tooltip` corners, no
   shadow and no arrow.
2. **Text:** white, `--text-tooltip`, with `--tooltip-padding` around it. It
   wraps at a maximum width.

The tooltip sits beside its trigger, on the side with the most room, and fades
in and out. Over an open dialog it shows inside the dialog, above its content.

## Variants

| Variant | Delay | Where |
|---|---|---|
| Default | short delay before it shows | hints, disabled reasons, truncated values |
| No delay | shows straight away | the navigation rail, where it is the only visible name of an icon |
| Info panel | opens on click | longer help for a field |

**Info panel.** Help that does not fit in a tooltip opens in a panel that
floats over the page near the bottom of the screen. Its header has a title and
a close button; the body scrolls and can hold paragraphs, bold text and lists
from the field's configuration. A field label shows a help icon that opens it,
unless the field is locked. Only one panel is open at a time: opening another
replaces it. The page behind stays usable.

<StoryEmbed id="base-baseinfopanel--default" />

## States

| State | What you see | Trigger |
|---|---|---|
| Hidden | nothing | — |
| Waiting | still nothing; leaving now cancels it | pointer enters the trigger, or the trigger gets focus |
| Shown | the tooltip next to the trigger | the delay has passed |
| Hidden again | the tooltip fades out | pointer leaves, focus leaves, or Escape |

<StoryEmbed id="base-basetooltip--states" />

A tooltip without text never shows.

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab | focuses the trigger; the tooltip shows after the delay |
| Escape | hides the tooltip; focus stays on the trigger |
| Tab / Shift+Tab away | hides the tooltip |

- The tooltip is `role="tooltip"` with its own id. The trigger points to it
  with `aria-describedby`, so screen readers read it after the trigger's name.
- **The trigger must be focusable**, such as a button. Otherwise keyboard users
  never see the tooltip.
- A tooltip describes; it does not name. An icon-only trigger still needs its
  own `aria-label`.
- The info panel is a non-modal `role="dialog"`. Focus does not move into it
  and Escape does not close it; its close button does.

## Content

- One short sentence or phrase, in sentence case, without a full stop when it
  is a phrase: _Fields marked with a star are required_.
- Plain text only. The tooltip sets the size and colour; do not style the text.
- A disabled reason says what to do: _Select at least one item first_.
- For a truncated value, repeat the full value exactly.

## Related

[Button](./button) · [Overflow menu](./overflow-menu) ·
[Accessibility](./accessibility) · [Content](./content)
