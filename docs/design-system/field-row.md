---
title: Field row
---

# Field row

One metadata field on a detail page: its label above its value, editable in
place.

<StoryEmbed id="metadata-metadatawrapper--default" />

## When to use

- Every single-valued metadata field on a detail page or in a preview.
- Relation fields (a single or multiple relation, or a table of relations)
  that are stored on the entity itself.

## When not to use

- **A field with several values that belong together per entry**, such as
  ISBN numbers with their edition: use a
  [repeatable row group](./repeatable-row-group).
- **A form that creates a new entity:** fields there are plain inputs, such as
  a [text input](./text-input) or a [dropdown](./dropdown).

## Anatomy

1. **Label:** `--text-label`, bold, in `--color-text-field-label`. The space
   under it is `--field-label-gap`, so the hover wash and the focus ring clear
   it.
2. **Label adornments (optional),** in this order after the label:
   - a required `*` in `--color-danger`, or a `◦` when one of several fields
     is required;
   - a help icon `?` with a [tooltip](./tooltip), or one that opens an info
     panel;
   - a language picker for multilingual fields.
3. **Value:** `--text-value` in `--color-text-secondary`. Every value row is at
   least `--field-value-min-height` high, so rows line up whatever the type.
4. **Editable cue:** when the value can be edited in place, a dashed underline
   in `--color-border-dashed` sits under the text, and a pencil in
   `--color-text-subtle` follows the value. On hover a wash in
   `--color-surface-editable-hover` fills the value, `--field-value-pad-x`
   wider than the text on both sides.
5. **Copy button (optional):** for fields configured to be copied, a small icon
   button after the value (`--button-sm-padding-icon`, `--color-text-subtle`,
   `--color-accent-wash` on hover).

## Variants

| Value type | What you see |
|---|---|
| Text, number, date | the value as text |
| URL | a link in link ink with an external-link icon; it opens in a new tab |
| Checkbox | _Yes_ with a check in `--color-success`, or _No_ with a cross in the value colour |
| Colour | a swatch followed by the hex value |
| Dropdown, relation | the chosen options as [chips](./chip-and-badge); a relation chip links to its entity |
| Image | the image itself, small |
| Formatted text | sanitised HTML |
| Copy | the value with a copy button after it |

<StoryEmbed id="metadata-metadatawrapper--value-types" height="400px" />

Chip values and tables have no dashed underline: their shape already marks
them. A value that is cut off after a set number of lines shows its full text
in a tooltip.

## States

| State | What you see | Trigger |
|---|---|---|
| Editable | dashed underline and pencil | the field can be edited in place |
| Hover | wash behind the value | pointer |
| Focus | focus ring around the value | keyboard |
| Editing | the [inline editor](./inline-editor) replaces the value | click, Enter or Space |
| Saved | a check in `--color-success` replaces the pencil for 2 seconds; the block header shows the same check | the save worked |
| Empty | _No value_ at `--opacity-empty`, no underline | no value |
| Read-only | the plain value: no underline, pencil or wash | the field or the entity can't be edited by this user |
| Locked | the plain value with a lock icon on the right; its tooltip says why | the field is locked on this entity |

<StoryEmbed id="metadata-metadatawrapper--states" height="340px" />

<StoryEmbed id="metadata-metadatawrapper--editing" />

A value is editable in place only when all of these hold:

- the field type has an inline editor: text, number, date, textarea,
  checkbox, colour, dropdown, or a relation stored on the entity;
- the field is not read-only, locked or masked;
- the user may update the entity;
- the page is not in its page-wide edit mode. In that mode every row shows
  its form input instead.

## Keyboard & accessibility

| Key | On an editable value |
|---|---|
| Tab | moves to the value |
| Enter / Space | opens the inline editor |

- An editable value is `role="button"` and named _{label}, edit_.
- A link, a relation chip or the copy button inside the value keeps its own
  click and keys. Enter and Space open the editor only when the value itself
  has focus.
- The pencil and the saved check are decorative (`aria-hidden`). A successful
  save is announced as _Saved_ through a `role="status"` region.
- The one-of-required `◦` has an accessible name.
- The copy button is a real `<button>` named _Copy_. After copying, its icon
  turns into a check and _Copied_ shows next to it for 2 seconds, in a
  `role="status"` region. A copy that fails shows an error notification.

## Content

- Labels are nouns in sentence case, without a colon: _Title_, _Inventory
  number_.
- Keep labels short; the value carries the detail.
- Translation keys: `metadata.labels.no-value`, `inline-edit.edit-field`,
  `copy-to-clipboard.copy` and `copy-to-clipboard.copied`.

## Related

[Inline editor](./inline-editor) · [Repeatable row group](./repeatable-row-group) · [Text input](./text-input) · [Tooltip](./tooltip) · [Chip & badge](./chip-and-badge)
