---
title: Selection action bar
---

# Selection action bar

The row of bulk actions above a list, acting on the items that are selected.

<StoryEmbed id="bulkoperations-selectionactionbar--selected" height="120px" />

## When to use

- A list where people select items to act on them together: edit, export,
  delete.
- A picker, where the selection is the answer: the bar then holds one
  _Confirm selection_ button.

## When not to use

- **An action on one item:** use the row's [split button](./split-button) or
  [overflow menu](./overflow-menu).
- **A list without selection:** a list with no actions on a selection has no
  checkboxes and no bar.

## Anatomy

1. **Selection count:** _Selection: 2_, in bold. With nothing selected it reads
   _Selection: nothing selected_ in muted ink.
2. **Off-page note (optional):** _3 selected on other pages_, with a
   _Clear selection_ link (`--text-label`, underlined). It shows only when
   selected items sit on other pages.
3. **Actions:** every bulk action is its own small secondary
   [button](./button), with its icon and a verb label. Destructive actions
   (`tone: Danger`) use `--color-danger-ink` and sit last. Actions that open a
   submenu stay behind a labelled _Actions_ [overflow menu](./overflow-menu).

The bar sits on its own row under the list's results band, inside the results
panel. It has no surface of its own; items are `--selection-bar-gap` apart in
`--text-ui` and wrap when the row is narrow. Selecting or clearing the whole
page is the list header's _Select page_ checkbox, not part of the bar.

## Variants

| Variant | Where | Actions |
|---|---|---|
| Default | lists in the main library and in detail panels | one button per action |
| Confirm selection | pickers | one commit [button](./button), _Confirm selection_ |
| Small screen | below 48rem | more than one action folds into a ⋮ menu that opens as a bottom sheet |

<StoryEmbed id="bulkoperations-selectionactionbar--confirm-selection" height="120px" />
<StoryEmbed id="bulkoperations-selectionactionbar--small-screen" height="300px" />

The page's own list (not a relation list or a search) moves its create action
out of the bar: it becomes a primary pill next to the page title. In a detail
panel, add actions move to the list's own header.

## States

| State | What you see | Trigger |
|---|---|---|
| Nothing selected | muted _Selection: nothing selected_; actions that need a selection are disabled, with a help icon and the reason in their tooltip | — |
| Items selected | bold _Selection: n_; those actions turn on | checkboxes in the list |
| Selection on other pages | _n selected on other pages_ and _Clear selection_ | paging after selecting |
| Action unavailable | the button stays visible but disabled; its tooltip says why | wrong selection size, wrong mode |
| Hidden | no bar at all | no selection and no actions to offer |

<StoryEmbed id="bulkoperations-selectionactionbar--states" height="320px" />

## Keyboard & accessibility

- The bar is a `role="toolbar"` named _Actions on selection_.
- The count is a `role="status"` region, so a screen reader hears each change.
- Every control is a real button, reachable with Tab. _Clear selection_ is a
  button too.
- An action that acts on the selection carries the count in its accessible
  name: _Delete (2 selected)_.
- A disabled action keeps its reason in a tooltip on its help icon.

## Content

- Action labels start with a verb: _Export to CSV_, _Bulk edit_, _Delete_.
- Whether an action is destructive comes from its configuration
  (`tone: Danger`), never from its label.
- Translation keys: `bulk-operations.selection-count`,
  `bulk-operations.nothing-selected`, `bulk-operations.selected-on-other-pages`,
  `bulk-operations.clear-selection`, `bulk-operations.action-for-selection`.

## Related

[Entity list element](./entity-list-element) · [Checkbox](./checkbox) ·
[Button](./button) · [Overflow menu](./overflow-menu)
· [Bulk edit](./bulk-edit) · [Merge entities](./merge-entities)
