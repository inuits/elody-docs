---
title: Inline editor
---

# Inline editor

The input a field row swaps to while one field is edited.

<StoryEmbed id="metadata-inlinefieldeditor--editing" />

## When to use

- It opens from a [field row](./field-row) when you click its value. It is
  never placed on its own and never in a modal.

## When not to use

- **Creating a new entity:** use the form's inputs, such as a
  [text input](./text-input) or a [dropdown](./dropdown).
- **Rich text:** that field has its own editor.

## Anatomy

1. **Input:** the input for the field type, bordered, as wide as the row. A
   checkbox is only as wide as its box. A textarea grows with its content up to
   `--textarea-max-height`.
2. **Save:** a square icon button with a check, commit style. With nothing
   changed it just closes the editor.
3. **Cancel:** a square icon button with a cross, secondary style.
4. **Error message (optional):** `--text-hint` in `--color-danger`, under the
   input.
5. **Keyboard hint:** `--text-hint` in `--color-text-muted`: _Enter saves ·
   Esc cancels_, or _Ctrl+Enter saves · Esc cancels_ for a textarea.

The buttons stay beside the input and never wrap under it, so an open dropdown
menu can't cover them.

## Variants

| Field type | Input |
|---|---|
| Text, number, date | [text input](./text-input) |
| Textarea | text input in textarea mode |
| Checkbox | [checkbox](./checkbox) |
| Colour | colour input: the native picker and a hex field in one box |
| Dropdown | [dropdown](./dropdown), with a clear button unless the field is required; multiple for multi-select fields |
| Coordinates | two number inputs, latitude and longitude |
| Relation | [autocomplete](./autocomplete), with a _Browse…_ link under it that opens the [entity picker](./entity-picker) |
| Relation table | the table with editable rows: add a row, change a cell, remove a row |

<StoryEmbed id="metadata-inlinefieldeditor--field-types" height="580px" />

## States

| State | What you see | Trigger |
|---|---|---|
| Editing | the input has focus | the editor opens |
| Saving | a spinner replaces both buttons; the input is disabled | Enter, the save button, or leaving a changed field |
| Error | danger border on the input, the message under it; the value is kept and the editor stays open | the value is invalid, or the save failed |
| Saved | the editor closes; the row shows its saved check and the _Entity successfully Updated_ notification shows | the save worked |

<StoryEmbed id="metadata-inlinefieldeditor--states" />

## Keyboard & accessibility

| Key | In the editor |
|---|---|
| Enter | saves; with nothing changed, closes |
| Ctrl+Enter / ⌘+Enter | saves a textarea (Enter adds a new line) |
| Escape | cancels and restores the previous value |
| Tab | moves through the input and the buttons; leaving the editor saves a changed value |

- While a dropdown menu is open, Enter picks an option and Escape closes the
  menu. They don't save or cancel.
- Picking an option or a date only changes the draft. The value saves when you
  press Enter, click save, or leave the field.
- **Leaving saves.** A click outside or focus moving away saves a changed
  value and closes an unchanged editor. Clicks in the editor's own menus,
  date picker and dialogs count as inside.
- **One field at a time.** Opening another field saves the changed one first.
  If that save fails, the changed field stays open with its error, and the
  other field does not open.
- When the editor opens, the input gets focus. After save or cancel, focus
  returns to the value, unless you already moved it on.
- The input is named after the field label. The buttons are named _Save
  {label}_ and _Cancel {label}_.
- The error message is `role="alert"`. On a text input, an error also sets
  `aria-invalid` and links the message with `aria-describedby`.
- Saving sends only this field and validates only this field.

## Content

- Error messages come from the field's validation and name the field,
  such as _Title is required_.
- A save the server refuses shows _Saving failed, try again_.
- Translation keys: `inline-edit.save`, `inline-edit.cancel`,
  `inline-edit.hint`, `inline-edit.hint-textarea`, `inline-edit.saved`,
  `inline-edit.save-failed` and `inline-edit.browse`.

## Related

[Field row](./field-row) · [Text input](./text-input) · [Dropdown](./dropdown) · [Autocomplete](./autocomplete) · [Entity picker](./entity-picker)
