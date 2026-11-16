---
title: Overflow menu
---

# Overflow menu

A labelled _Actions_ trigger that holds the actions of a panel, page or row.

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--overflow-menu-open" />

## When to use

- A panel, page header or selection has several actions and none of them is
  clearly the main one.
- A list row needs actions without taking room from its columns.

## When not to use

- **One action is used far more than the rest:** use a
  [split button](./split-button).
- **Only one action:** show it as a plain button.

## Anatomy

1. **Trigger:** a small secondary button with the label _Actions_ and a
   chevron. A menu with one subject can use a more specific label, such as
   _Saved searches_.
2. **Menu:** the same menu as the split button: optional icon
   (`--menu-icon-size`) and label per item (`--menu-item-padding`,
   `--menu-item-gap`), at least `--menu-min-width` wide. Destructive items use
   `--color-danger-ink` and sit last.

## Variants

| Variant | Where | Trigger |
|---|---|---|
| Labelled | panels, page headers, toolbars | _Actions_ ▾ or a specific label |
| Row | list rows | ⋮ under the list's _Actions_ column header |
| Sheet | screens below 48rem | ⋮; the menu opens as a bottom sheet |

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--custom-trigger-label" />
<StoryEmbed id="contextmenuactions-contextmenuactionsshell--in-list-row" />

**Outside a list row the trigger is never a bare ⋮.** The label is what tells
people there are actions at all. The row is the one exception: the column
header names the ⋮, and repeating _Actions_ on every row would crowd the list.

On a small screen there is no room for the label, so the trigger is a ⋮ and the
menu opens as a sheet along the bottom of the screen, over a dimmed page. From a
list row, the sheet shows the record's thumbnail and title on top and _Open
preview_ as its first item.

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--small-screen-sheet" />

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | secondary button, chevron points down | — |
| Hover | hover fill | pointer |
| Focus | focus ring | keyboard |
| Open | chevron points up, menu under the trigger | click, Enter, Space or ↓ |
| Disabled item | item in disabled ink with a help icon; its tooltip says why | the action does not apply |

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--disabled-item" />

The menu opens under the trigger, aligned to its left edge. Near the right edge
of the window it aligns to the trigger's right edge, and near the bottom it
opens upwards.

## Keyboard & accessibility

| Key | On the trigger | In the menu |
|---|---|---|
| Enter / Space | opens or closes the menu | runs the focused item |
| ↓ | opens the menu (labelled trigger) | next item (wraps) |
| ↑ | — | previous item (wraps) |
| Home / End | — | first / last item |
| Escape | — | closes the menu, focus back on the trigger |
| Tab | — | closes the menu, focus back on the trigger |

When the menu opens, focus moves to its first item. A click outside the menu or
a scroll closes it without running anything.

- The trigger has `aria-haspopup="menu"` and `aria-expanded`.
- The labelled trigger is named by its label; when it knows what it acts on,
  its name becomes _Actions for {title}_.
- The ⋮ trigger has no visible text, so it always has an accessible name:
  _Actions for {title}_, the specific label, or _Actions_.
- The menu is a `role="menu"` with `role="menuitem"` items; a disabled item has
  `aria-disabled="true"`.

## Content

- Use _Actions_ unless the menu has one clear subject; then name it
  (_Saved searches_).
- Menu items start with a verb: _Duplicate_, _Export_, _Delete_.
- Whether an item is destructive comes from the action's configuration
  (`tone: Danger`), not from its label. The menu then colours it and moves it
  to the end.
- Translation keys: `contextMenu.actions` and `contextMenu.actions-for`.

## Related

[Split button](./split-button) · [Accessibility](./accessibility)
