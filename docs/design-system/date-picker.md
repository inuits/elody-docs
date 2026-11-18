---
title: Date picker
---

# Date picker

Lets people type a date, or a date and time, or pick it from a calendar.

<StoryEmbed id="base-basedatepicker--open" title="Date picker with its calendar open" height="440px" />

## When to use

- Every date field in forms and inline editors: _Date of birth_,
  _Publication date_.
- A moment that needs a time as well: use the date and time variant.

## When not to use

- **A year on its own, or a number of days:** use a number
  [text input](./text-input).
- **A vague or partial date** such as _around 1900_: use a
  [text input](./text-input).

## Anatomy

1. **Field:** the same border, `--radius-input` corners, `--text-input` size
   and `--control-height` as a text input, with the border one step darker on
   hover (`--color-input-border-hover`). It shows the date as dd/mm/yyyy.
2. **Calendar icon:** at the start of the field, in `--color-text-secondary`.
3. **Clear button:** a ✕ at the end of the field when it has a value.
4. **Calendar:** opens under the field. A header with previous and next
   month buttons, and the month and year, which open a list of months or
   years when clicked.
5. **Day grid:** seven columns, starting on Monday. Days of the next and
   previous month are greyed out. Today has a thin ring and the chosen day is
   filled, both in `--color-commit`.
6. **Time (date and time only):** a clock button under the grid opens hours
   and minutes.

## Variants

| Variant | Shows | Format |
|---|---|---|
| Date | a calendar | dd/mm/yyyy |
| Date and time | a calendar with a clock button for the time | dd/mm/yyyy hh:mm, in the viewer's time zone |

## States

| State | What you see | Trigger |
|---|---|---|
| Empty | calendar icon and the placeholder _Select date_ | no value |
| Filled | the formatted date and a ✕ | a value |
| Hover | border one step darker | pointer |
| Focus | focus ring around the field | click or Tab |
| Open | calendar under the field, on the month of the value | click, or typing in the field |
| Disabled | grey fill; the calendar does not open | the field is unavailable |

<StoryEmbed id="base-basedatepicker--states" title="Date picker states" />

Picking a day fills the field and closes the calendar straight away. Typing
works as well: Enter, Tab or leaving the field takes the typed date. Text that
isn't a valid date doesn't change the value.

Picking only changes the field. The form or inline editor around it saves the
change.

## Keyboard & accessibility

| Key | In the field | In the calendar |
|---|---|---|
| Typing | opens the calendar and enters the date | — |
| Enter | takes the typed date | picks the focused day, or presses the focused button |
| Space | — | picks the focused day |
| Tab | takes the typed date and moves on | moves through the header buttons, then the days |
| Escape | closes the calendar | closes the calendar |

- The calendar is a `role="dialog"`; the days are a `role="grid"` and the
  chosen day has `aria-selected="true"`.
- The header buttons are named _Previous month_, _Next month_,
  _Open months overlay_ and _Open years overlay_; the clock button is
  _Open time picker_, and the ✕ is _Clear value_.
## Content

- Labels are nouns: _Date of birth_, _Publication date_.
- Write dates as dd/mm/yyyy, and times on the 24-hour clock: _18/08/2026
  14:30_.
- The placeholder is _Select date_.

## Related

[Text input](./text-input) · [Dropdown](./dropdown) ·
[Content](./content) · [Accessibility](./accessibility)
