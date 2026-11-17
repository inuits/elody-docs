---
title: Entity picker
---

# Entity picker

A dialog to search for entities and pick them as the value of a relation field.

<StoryEmbed id="modals-entitypicker--single" :width="800" height="560px" />

## When to use

- Setting a relation, such as a publisher or a person, when the field's own
  dropdown is not enough to find the right entity.
- It opens from _Browse…_, the link under a relation field while you edit it.

## When not to use

- **A fixed list of values:** use a [dropdown](./dropdown).
- **Free text:** use a [text input](./text-input).
- **A short list you can type through:** the relation field's
  [autocomplete](./autocomplete) is enough.

## Anatomy

1. **Header:** the title _Choose {type}_, a count chip _Results: {n}_
   (`--chip-padding`) and the close button.
2. **Search pill:** search icon, input and, while results load, a spinner.
3. **Results:** a fixed-height area (`--relation-picker-results-height`), so
   the dialog keeps its size while you type. Each row shows a check when
   selected, the entity's label in bold and an optional secondary line.
4. **Footer (multiple only):** _Cancel_ (ghost) and _Add_ (commit), padded
   with `--modal-footer-pad`.

From 48rem up the dialog is `--relation-picker-width` wide. The body uses
`--modal-body-pad`.

## Variants

| Variant | Field | Behaviour |
|---|---|---|
| Single | single-select relation | choosing a row picks it and closes the dialog; no footer |
| Multiple | multi-select relation | rows toggle; _Add_ hands all selected entities to the field |

<StoryEmbed id="modals-entitypicker--multiple" :width="800" height="560px" />

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | spinner in the search pill | opening, typing |
| Results | rows, `--color-surface-row-hover` on hover | results arrive |
| Selected | `--color-accent-wash` row with a check in `--color-commit`; _Add_ enabled | choosing a row (multiple) |
| No results | _No results._ | nothing matches |
| Create | _Create '{query}'_ button after _No results._ | nothing matches, the field allows new entities and the query is not empty |

<StoryEmbed id="modals-entitypicker--no-results" :width="800" height="560px" />

The search runs as you type, 250 ms after the last key. Only the first page
of results is listed; the count chip shows how many entities match in total.

Picking does not save on its own: the entities are added to the field, which
saves like any other inline edit. _Create_ closes the picker first and then
starts the field's own create flow, so two dialogs never stack.

## Keyboard & accessibility

| Key | In the search pill | On a row |
|---|---|---|
| ↓ | first row | next row |
| ↑ | — | previous row; from the first row back to the search pill |
| Enter / Space | — | chooses the row |
| Escape | closes the dialog | closes the dialog |

- Focus lands in the search pill when the dialog opens.
- The dialog is named by its title. The search input is labelled with the
  same title.
- The results are a `listbox` (`aria-multiselectable` when multiple), each row
  an `option` with `aria-selected`.
- The count chip is `role="status"`, so a new count is announced.

## Content

- The title names the type in words, in lower case: _Choose company_.
- Translation keys: `inline-edit.browse`, `inline-edit.browse-title`,
  `inline-edit.picker-*` and `inline-edit.cancel`.

## Related

[Modal](./modal) · [Autocomplete](./autocomplete) · [Dropdown](./dropdown) ·
[Filter panel](./filter-panel)
