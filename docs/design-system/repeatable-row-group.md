---
title: Repeatable row group
---

# Repeatable row group

A block that repeats the same fields for every entry in a list, such as each
ISBN with its edition.

<StoryEmbed id="entityelements-entityelementwindowpanel--repeatable" height="400px" />

## When to use

- A field that holds a list of entries, where each entry has one or more
  values that belong together: ISBN numbers, EAN codes.

## When not to use

- **A single value:** use a [field row](./field-row).
- **A list of related entities:** use a relation field, which edits with an
  [autocomplete](./autocomplete).

## Anatomy

1. **Block header:** the block's label, bold, and on the right an _Add more_
   pill (`--radius-pill`, `--button-sm-padding`, `--text-button-sm`,
   `--color-text-light`, `--color-accent-wash` on hover).
2. **Row:** one entry. Each field in it is a [field row](./field-row) and
   keeps its full width. Rows are rounded (`--radius-input`); every second row
   is striped with `--color-surface-repeat-row`, and a hovered row fills with
   `--color-surface-row-hover`.
3. **Row header:** the block label and the row number (_ISBN 2_) in
   `--text-label` and `--color-text-secondary`, with a ghost trash button,
   centred between two rules in `--color-border-default`. The rules also
   separate the rows.

## Variants

| Variant | What you see | When |
|---|---|---|
| Editable | _Add more_ pill, a row header with a trash button above every row | the user may update the entity |
| Single empty row | one row of empty fields, no row header | the list has no entries yet |
| Read-only | rows separated by a rule, no pill and no trash buttons | the user can't update the entity, or the block isn't editable |

<StoryEmbed id="entityelements-entityelementwindowpanel--repeatable-empty" height="220px" />
<StoryEmbed id="entityelements-entityelementwindowpanel--repeatable-read-only" height="390px" />

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | striped rows | — |
| Row hover | row fill | pointer |
| Field editing | that field's [inline editor](./inline-editor) replaces its value | click the value |
| New row | an empty row at the bottom; focus on its first field | _Add more_ |
| Remove saved row | a confirmation dialog, then the row is gone | the trash button of a saved row |
| Remove new row | the row is gone, no confirmation | the trash button of a row that isn't saved yet |

<StoryEmbed id="entityelements-entityelementwindowpanel--repeatable-new-row" height="400px" />

How rows save:

- Each field edits and saves on its own, like any field row. Saving stores the
  block's whole list with that one value changed.
- A new row exists only on screen until one of its fields is saved. You can
  add several new rows before saving any of them.
- Saved rows stay on top, in their stored order. A new row that is saved moves
  up to right after them.
- Removing a saved row asks first, then saves the list without it.
- Rows can't be reordered.
- A multilingual field in a row stays read-only.

## Keyboard & accessibility

- The rows are a `role="list"`; each row is a `role="listitem"`.
- _Add more_ is a real `<button>`. After adding a row, focus moves to the
  first field of the new row; Enter opens it.
- The trash button is named after the row's first filled value, _Remove row:
  978-90-209-1234-5_, or else after the row, _Remove row: ISBN 2_.
- The rules beside the row header are decorative (`aria-hidden`).
- The confirmation is a [modal](./modal) with _Cancel_ and a danger
  _Remove_ button.

## Content

- The row header is the block label and the row number: _ISBN 2_.
- Confirmation: _Remove this row?_, _Its values are deleted when you
  confirm._, _Remove_ and _Cancel_.
- Translation keys: `actions.labels.add-more`, `inline-edit.remove-row` and
  `inline-edit.remove-row-confirm.*`.

## Related

[Field row](./field-row) · [Inline editor](./inline-editor) · [Modal](./modal) · [Button](./button)
