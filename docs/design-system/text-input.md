---
title: Text input
---

# Text input

Lets people type a short text, a number or a longer note.

<StoryEmbed id="base-baseinputtext--default" />

## When to use

- Free text and numbers in forms, inline editors and filters: _Title_,
  _Year_, _Description_.
- A longer note: use the multi-line field.
- A colour value: use the colour variant, which pairs a swatch with the hex
  code.

## When not to use

- **A choice from a fixed list:** use a [dropdown](./dropdown).
- **Links to other records or several tags:** use an
  [autocomplete](./autocomplete).
- **A date or a date and time:** use a [date picker](./date-picker).
- **An option that is on or off:** use a [checkbox](./checkbox) or a
  [toggle](./toggle).

## Anatomy

1. **Field:** `--radius-input` corners, `--input-padding`, at least
   `--control-height` high, the same height as the dropdown, date picker and
   autocomplete. The value is set in `--text-input`.
2. **Border:** `--color-border-default`, one step darker on hover
   (`--color-input-border-hover`).
3. **Placeholder (optional):** `--color-text-placeholder`.
4. **Error message (optional):** below the field, `--text-hint` in
   `--color-danger`.

The label is not part of the input. It comes from the surrounding form or
field row.

## Variants

| Variant | Where | Looks |
|---|---|---|
| Bordered | every field that stands on its own — use this by default | white with a border |
| Borderless | inside another control, such as a filter | white, no border |
| Tinted | a field on a tinted surface | `--color-accent-tint`, no border |
| Number | numeric values | right-aligned, no spinner buttons |
| Compact | a value inside a chip, such as a page number on a relation | `--control-height-compact`, `--input-padding-compact`, label-size text |
| Multi-line | longer notes | at least three rows (`--textarea-min-height`); drag the corner to make it taller |
| Growing multi-line | long values that should show in full | grows with its content; it never scrolls and has no resize handle |
| Colour | colour values | a swatch that opens the browser's colour picker, next to a field with the hex code; both stay in sync |

<StoryEmbed id="base-baseinputcolor--default" />

In an inline editor, a multi-line field grows with its content up to six rows
(`--textarea-max-height`) and then scrolls.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | white field, default border | — |
| Hover | border one step darker | pointer |
| Focus | `--focus-ring-width` ring in `--color-focus-ring` | click or Tab |
| Placeholder | example text in placeholder ink | empty field with a placeholder |
| Error | `--color-danger` border, message below the field | the value is invalid |
| Read-only | no border and no fill; the value reads as plain text | the value can be seen but not changed |
| Disabled | `--color-surface-muted` fill, `--color-text-disabled` ink, subtle border | the field is unavailable |

<StoryEmbed id="base-baseinputtext--states" title="Text input styles and states" height="500px" />

Leading and trailing spaces are removed from a text value. A number field
that holds something that isn't a number reports an invalid value, so the form
can show an error instead of keeping the old number.

## Keyboard & accessibility

- It is a native `<input>` or `<textarea>`: Tab reaches it and all the usual
  editing keys work.
- **Every field needs a name:** a visible label linked to it, or an
  `aria-label` such as _Title_ when there is no visible label.
- **Errors are linked to the field.** The message is a `role="alert"`, so it
  is announced when it appears; it is connected to the field with
  `aria-describedby`, and the field gets `aria-invalid="true"`.
- A hint or an error shown elsewhere can be linked as well; it stays linked
  next to the field's own message.
- In the colour variant, the hex field is a normal text field, so the value
  can always be typed instead of picked.

## Content

- Labels are nouns, in sentence case and without a colon: _Title_,
  _Date of birth_.
- A placeholder is an example, not an instruction: _e.g. 1958_, not
  _Enter a year_. It never replaces the label.
- Error messages say what is wrong and how to fix it: _Title is required_,
  _ISBN is not valid_.

## Related

[Dropdown](./dropdown) · [Autocomplete](./autocomplete) ·
[Date picker](./date-picker) · [Tooltip](./tooltip) · [Content](./content) ·
[Accessibility](./accessibility)
