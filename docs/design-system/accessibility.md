---
title: Accessibility
---

# Accessibility

Elody aims for WCAG level AA. Accessibility is part of every component, and
Storybook's accessibility panel checks each story with axe.

## Focus
- One focus style everywhere: a ring in `--color-focus-ring`, shown when you
  navigate with the keyboard (`:focus-visible`). Components never remove or
  restyle it.
- Focus follows reading order. Overlays move focus inside when they open and
  return it to their trigger when they close.

## Names and roles
- Every interactive element has an accessible name: a visible label, or an
  `aria-label` on icon-only controls.
- Use native elements (`<button>`, `<a>`, `<input>`) and add ARIA roles only
  where no native element exists, such as comboboxes and listboxes.
- Errors are announced with `role="alert"`, confirmations and counts with
  `role="status"`.
- An input links its error message with `aria-describedby` and marks itself
  `aria-invalid`.
- A tooltip is never the only place important information appears.

## Contrast
Text reaches **4.5:1** against its background, and large text and other
interface elements reach 3:1.

| Pair | Ratio |
|---|---|
| Body text on a surface | 12.2:1 |
| Field label or link on a surface | 6.5:1 |
| Entity badge text on its tone | 5.1:1 or more |
| Text on a relation chip | 5.7:1 |

Placeholder text is lighter on purpose, so a placeholder is only ever an
example, never the label. A [client theme](./client-theming) must meet the
same ratios.

## Colour is never the only signal
Badges carry a label, statuses carry text and errors carry a message.

## Touch
Interactive elements are at least `--touch-target-min` on tablet widths.

## Related
[Colour](./colour) · [Content & language](./content)
