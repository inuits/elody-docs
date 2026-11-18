---
title: Entity picker
---

# Entity picker

A dialog with a list of entities to choose from, to link them to the entity
you are working on.

<StoryEmbed id="modals-entitypicker--default" :width="800" height="560px" />

## When to use

- Linking existing records to the one you have open: _Add existing assets_
  on an asset's list or media block.
- Choosing records in a step of a [guided flow](./guided-flow).
- People need filters, sorting or a preview to find the right records.

## When not to use

- **A fixed list of values:** use a [dropdown](./dropdown).
- **Creating a new record:** use a [dynamic form](./dynamic-form).
- **Setting one relation field while you edit it:** the field's
  [autocomplete](./autocomplete) and its quick search are enough (see
  [Quick search from a relation field](#quick-search-from-a-relation-field)).

## Anatomy

1. **Dialog:** a wide [modal](./modal), titled by the action that opened it:
   _Add existing {type}_.
2. **List bar:** the _Filters_ button, the result count and the sort controls.
   _Filters_ opens the [filter panel](./filter-panel) beside the list.
3. **Selection bar:** the number selected and _Confirm selection_ (commit).
   The button is disabled until something is selected.
4. **List:** [list rows](./entity-list-element) with a checkbox, a thumbnail,
   the title and the configured columns. The header checkbox selects the page.
   When the type has a [preview](./preview-panel), the eye opens it.
5. **Highlight chip (optional):** a label on rows the flow marks as current,
   with `--chip-padding` and `--color-accent-wash`.

## Variants

| Variant | Where | Behaviour |
|---|---|---|
| Filters | default | _Filters_ button and filter panel; the list follows the filters |
| Search | configured per field or step | a search bar above the list instead of filters |
| Links on confirm | form dialog, e.g. _Add existing assets_ | _Confirm selection_ saves the links, closes the dialog and refreshes the list |
| Hands back on confirm | [guided flow](./guided-flow) step | _Confirm selection_ hands the selection to the flow and clears it; nothing is saved yet |

<StoryEmbed id="modals-entitypicker--filters-open" :width="800" height="560px" />

<StoryEmbed id="modals-entitypicker--search-mode" :width="800" height="560px" />

In search mode the search runs as you type, 250 ms after the last key, or at
once on Enter. It searches the metadata fields the configuration names. In
search mode the picker is `--entity-picker-height` tall in a modal and
`--entity-picker-drawer-height` in a drawer.

## States

| State | What you see | Trigger |
|---|---|---|
| Nothing selected | _Confirm selection_ disabled | opening |
| Selected | checked rows with a wash, _Selection: {n}_, _Confirm selection_ enabled | checking rows |
| Already linked | the row is greyed out and has no checkbox | the entity is already linked to the open entity |
| Limit reached | the other rows' checkboxes are disabled | the configured maximum is selected |
| No results | _No results match your filters_ with a tip; in search mode _No results found_ | nothing matches |

<StoryEmbed id="modals-entitypicker--selected" :width="800" height="560px" />

<StoryEmbed id="modals-entitypicker--already-linked" :width="800" height="560px" />

After _Confirm selection_ in a form dialog:

1. Open edits on the entity are saved first. If they have errors, the dialog
   closes and a warning says _Saving failed_.
2. The selected entities are linked, or they replace the existing links of
   that type when the action is set to replace.
3. The dialog closes, the new rows show in the list at once and the change is
   saved.
4. A notification confirms the save and the list reloads. If the save fails,
   the dialog opens again.

## Keyboard & accessibility

- The dialog follows the [modal](./modal): focus starts on the close button,
  Escape closes it, and the title names it.
- Tab moves through the list bar, the selection bar and the rows. Space
  checks a row's checkbox.
- Rows that are already linked have no checkbox, so they are skipped.
- The selection count is `role="status"`, so a new count is announced.
- The search bar is labelled _Search_.

## Content

- Title the dialog by the action: _Add existing assets_, not _Entity picker_.
- Keep the highlight label short: one or two words.
- Translation keys: `bulk-operations.add-existing-relation`,
  `bulk-operations.confirm-selection`.

## Quick search from a relation field

While you edit a relation field, _Browse…_ under the field opens a smaller
search dialog. It searches the field's type and puts the chosen entities in
the field, which saves like any other inline edit.

<StoryEmbed id="modals-relationpicker--multiple" :width="800" height="560px" />

1. **Header:** the title _Choose {type}_, a count chip _Results: {n}_
   (`--chip-padding`) and the close button.
2. **Search pill:** search icon, input and, while results load, a spinner.
3. **Results:** a fixed-height area (`--relation-picker-results-height`), so
   the dialog keeps its size while you type. A selected row has
   `--color-accent-wash` and a check in `--color-commit`.
4. **Footer (multiple only):** _Cancel_ and _Add_, padded with
   `--modal-footer-pad`.

From 48rem up the dialog is `--relation-picker-width` wide. For a
single-select field, choosing a row picks it and closes the dialog; there is
no footer. The search runs as you type, 250 ms after the last key, and lists
the first page of results. When nothing matches and the field allows new
entities, _Create '{query}'_ closes the dialog and starts the field's own
create flow.

<StoryEmbed id="modals-relationpicker--no-results" :width="800" height="560px" />

| Key | In the search pill | On a row |
|---|---|---|
| ↓ | first row | next row |
| ↑ | — | previous row; from the first row back to the search pill |
| Enter / Space | — | chooses the row |
| Escape | closes the dialog | closes the dialog |

Focus starts in the search pill. The results are a `listbox`
(`aria-multiselectable` when multiple), each row an `option` with
`aria-selected`. Keys: `inline-edit.browse`, `inline-edit.browse-title`,
`inline-edit.picker-*`.

## Related

[Modal](./modal) · [Filter panel](./filter-panel) ·
[Entity list element](./entity-list-element) · [Selection action bar](./selection-action-bar) ·
[Autocomplete](./autocomplete) · [Guided flow](./guided-flow)
