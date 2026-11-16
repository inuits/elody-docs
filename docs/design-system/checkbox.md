---
title: Checkbox
---

# Checkbox

Turns one option on or off, or selects an item in a list.

<StoryEmbed id="base-baseinputcheckbox--default" />

## When to use

- Selecting items in a list for a bulk action.
- An option that is on or off and takes effect when the form or action is
  submitted: _Include in export_.
- Several options in a filter, where any combination is allowed.

## When not to use

- **Exactly one of several options:** use a dropdown.
- **A setting that applies straight away:** use a toggle.

## Anatomy

1. **Hit area:** the clickable square around the box, `--checkbox-hit-area`
   (the touch-target minimum, `--touch-target-min`). Dense lists such as
   filter options use the compact size, `--checkbox-hit-area-compact`.
2. **Box:** rounded, `--border-width-control` neutral border. Checked, it fills
   with the commit colour and shows a white check.
3. **Label (optional):** a real `<label>`; clicking it toggles the box.

## Variants

| Variant | Where |
|---|---|
| Default | forms, list rows |
| Compact | dense option lists, such as filters |
| Without label | list rows and table headers, where the column or row says what is selected |

## States

| State | What you see | Trigger |
|---|---|---|
| Unchecked | empty box, neutral border | — |
| Checked | commit fill with a white check | click, Space |
| Partial | commit fill with a dash | some, not all, items below it are selected |
| Focus | focus ring around the box | keyboard |
| Disabled | muted grey box and label, no pointer; a checked box shows a grey check | option unavailable |
| Required | checked and locked, with a warning icon after the label | the item must be included |
| Limit reached | unchecked boxes are disabled | the selection limit of a bulk action is reached |

<StoryEmbed id="base-baseinputcheckbox--states" />

## Keyboard & accessibility

- It is a native `<input type="checkbox">`: Tab reaches it, Space toggles it.
- With a visible label, the label is linked to the box and names it.
- **Without a visible label it needs an `aria-label`**, such as _Select row_.
- A partial selection is exposed as the native indeterminate state.
- A required box is disabled, and its warning icon carries the tooltip
  _This checkbox is required_.

## Content

- Labels describe the option, not the action: _Include in export_, not
  _Click to include_.
- Keep labels short and positive; avoid negatives such as _Don't include_.

## Related

[Button](./button) · [Colour](./colour) · [Accessibility](./accessibility)
