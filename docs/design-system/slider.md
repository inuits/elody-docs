---
title: Slider
---

# Slider

Picks a range between two numbers, by dragging two handles along a track or
typing the ends.

<StoryEmbed id="base-baserangeslider--default" />

## When to use

- Filtering on a numeric range, such as a year or a size, where both ends
  matter. It is the input of the range filter in the filter panel.

## When not to use

- **An exact value people already know:** use a [text input](./text-input)
  with a number type.
- **A date or a date range:** use a [date picker](./date-picker).
- **A wide scale:** the slider draws one tick per whole number, so a
  scale of more than a few dozen steps turns its tick labels into a blur.

## Anatomy

1. **Track:** a thin rounded bar in neutral grey.
2. **Fill:** the part between the two handles, in `--color-accent-normal`.
3. **Handles:** two small white circles with a soft shadow. There is no value
   bubble above a handle.
4. **Tick scale:** a tick for every whole number from the minimum to the
   maximum; every second tick is labelled with its number.
5. **From and To fields:** two number inputs under the scale, labelled
   _From:_ and _To:_. They follow the handles, and typing in them moves the
   handles.
6. **Error line:** a red message under a field when the two values cross.

## Variants

There is one variant. Values move in whole steps of 1. The slider sends its
new value when the handle is released (or after each key press), not while it is being dragged.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | grey track, accent fill, white handles | — |
| Focus | a grey ring around the handle | keyboard |
| Dragging | the handle and fill follow the pointer | drag |
| Invalid range | the field keeps the typed value, the handles stay where they were, and a red line says _'From' cannot be greater than 'to'_ or _'To' cannot be less than 'from'_ | typing a From above To, or a To below From |

<StoryEmbed id="base-baserangeslider--input-error" />

Moving a handle clears the error. An empty field counts as 0. Sliders have no
disabled state.

## Keyboard & accessibility

| Key | On a handle |
|---|---|
| Tab | moves to the next handle, then to the From and To fields |
| ← / ↓ | one step down |
| → / ↑ | one step up |
| Page Down / Page Up | five steps down or up |
| Home / End | to the lowest or highest value the handle can take |

- Each handle is a `role="slider"` with `aria-valuemin`, `aria-valuemax`,
  `aria-valuenow` and `aria-valuetext`. In a range, each handle's limits stop
  at the other handle.
- The handles have no accessible name: a screen reader announces only the
  value.
- The _From:_ and _To:_ texts are not linked to their fields, so the fields
  have no accessible name either.
- The error line is plain text; it is not announced when it appears.
- The focus ring on a handle is grey, not the platform focus colour.

## Content

- The _From:_ and _To:_ labels are fixed English text and are not
  translated.
- Error messages come from `filters.rangeFilterFromInputError` and
  `filters.rangeFilterToInputError`.
- Choose a minimum and maximum that give a short scale; the scale has no
  setting for a larger step.

## Related

[Text input](./text-input) · [Date picker](./date-picker) ·
[Colour](./colour) · [Accessibility](./accessibility)
