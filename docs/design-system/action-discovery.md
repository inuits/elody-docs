---
title: Action discovery
---

# Action discovery

Where actions live and which control shows them, so people find every action
without hunting behind an unlabelled icon.

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--split-button-open" />

## When it applies

- Every place that offers actions on an entity: the detail page header, a
  panel on the detail page, a list row, a selection of list items, and an
  empty result list.
- Not for the save and cancel of a form or an editor: those belong to the
  form itself (see [Per-field editing](./per-field-editing) and
  [Dynamic form](./dynamic-form)).

## How it works

1. **Actions sit where their subject is.** The control then needs no extra
   words to say what it acts on.
   - The **detail page header** holds the record's actions, plus its _Delete_
     (a danger button), _History_ and, when configured, _Edit metadata_.
   - A **panel** holds the actions on that panel's entity in its header.
   - A **list row** holds the actions on that row: a ⋮ under the list's
     _Actions_ column header, next to its icon buttons such as preview.
   - A **selection** of list items gets its actions in the
     [selection action bar](./selection-action-bar). A list's create action
     moves next to the page title as a primary pill.
   - An **empty result** can offer actions under the _no results_ message,
     such as creating the missing entity.
2. **The configuration decides the control, by how many actions are
   promoted.** People get the same shape for the same situation everywhere.
   An action is promoted when its configuration sets `showAsButton` (for the
   actions on an empty result list: `primary`).

   | Promoted actions | Other actions | Control |
   |---|---|---|
   | none | one or more | labelled [overflow menu](./overflow-menu): _Actions_ ▾ |
   | one | none | a plain primary [button](./button) |
   | one | one or more | a [split button](./split-button): the promoted action plus a chevron for the rest |
   | more than one | any | the first is the split button's primary; the others lead its menu |

3. **One primary per subject.** Two primaries compete for the same click;
   further promoted actions move to the top of the menu instead.
4. **A trigger is never a bare ⋮,** except on a list row, where the column
   header names it, and on screens below 48rem, where every menu becomes a ⋮
   that opens as a bottom sheet. The ⋮ always keeps an accessible name.
5. **Selection actions are all visible.** In the selection action bar every
   action is its own button. Only actions that open a submenu stay behind an
   _Actions_ menu; on a small screen more than one action folds into a ⋮.
6. **Destructive actions are marked by configuration and go last.** The
   action's `tone: Danger` gives it `--color-danger-ink` and sorts it to the
   end of a menu or of the selection bar. The verb in the label is never used
   to guess.
7. **An action that does not apply now stays visible, disabled, with its
   reason.** This applies to selection actions: when the selection is empty,
   too small, too large or of mixed types, the button or menu item is
   disabled and its tooltip says what to do, such as _Select at least 2 items
   to use this action._ An action that never applies to this record is left
   out by its configuration (`hidden`, or a metadata condition).

## Components

| Component | Role in this pattern |
|---|---|
| [Button](./button) | a single promoted action; every selection action; disabled with a reason |
| [Split button](./split-button) | one promoted action with the rest under its chevron |
| [Overflow menu](./overflow-menu) | the labelled _Actions_ menu, the row ⋮ and the small-screen sheet |
| [Selection action bar](./selection-action-bar) | the actions on the selected items of a list |
| [Entity list element](./entity-list-element) | the list row that holds the row ⋮ and the _Actions_ column |
| [Panel & block shells](./panel-and-block-shells) | the panel header that holds a panel's actions |
| [Tooltip](./tooltip) | the reason on a disabled action |

## Keyboard & accessibility

- Every trigger is a real button reachable with Tab. Menus follow the menu
  button keys: ↓ opens, ↑ and ↓ move, Home and End jump, Escape closes and
  returns focus to the trigger. See [Overflow menu](./overflow-menu).
- A trigger that knows its subject says so: _Actions for {title}_, _More
  actions for {title}_. A row passes its first value as the title, a panel its
  heading.
- A disabled action with a reason stays focusable (`aria-disabled="true"`), so
  keyboard and screen-reader users can reach the reason.
- A selection action carries the count in its name: _Delete (2 selected)_.

## Content

- Labels start with a verb, in sentence case: _Open record_, _Export to CSV_,
  _Delete_.
- A menu with one clear subject names it instead of _Actions_: _Saved
  searches_.
- A disabled reason says what to do, not what is wrong.
- Translation keys: `contextMenu.actions`, `contextMenu.actions-for`,
  `contextMenu.more-actions`, `contextMenu.more-actions-for` and
  `tooltip.bulkOperations.*`.

## Related

[Split button](./split-button) · [Overflow menu](./overflow-menu) ·
[Selection action bar](./selection-action-bar) · [Button](./button) ·
[Feedback](./feedback)
