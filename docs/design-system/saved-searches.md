---
title: Saved searches
---

# Saved searches

Save the filters of a list under a name and apply them again later.

<StoryEmbed id="filters-filtersbase--saved-searches-menu" height="460px" />

## When to use

- People filter the same list the same way again and again: _Awaiting
  review_, _Recently edited by me_.
- A filter set is worth keeping and finding back by name.

## When not to use

- **A filter every user needs on a list:** make it a default filter of that
  list instead.
- **One-off filtering:** just use the [filter panel](./filter-panel).

## Anatomy

Saved searches have three parts:

1. **Saved searches menu:** a labelled [overflow menu](./overflow-menu) at the
   top of the filter panel, under _Clear all_ and _Apply filter(s)_. It holds
   the actions, the searches used last on this list and _All saved searches_.
2. **All saved searches:** a dialog that slides in from the right with a full
   list of saved searches: filters, result count, sorting and one selectable
   row at a time, confirmed with _Confirm selection_.
3. **Applied chip:** while the filter panel is closed, the applied search
   shows beside the _Filters_ button as a chip (`--chip-padding`,
   `--radius-chip`) with its title, a dot when it has changed and a ✕.

The menu only shows to signed-in users, on lists where saved searches are
turned on.

## Variants

| Menu item | What it does | Available |
|---|---|---|
| _Save changes_ | stores the current filters in the applied search | a search is applied |
| _Save as new_ | opens a form to save the current filters as a new search | filters are active or a search is applied |
| _Edit label_ | opens the applied search's own page | a search is applied |
| _Delete_ | asks for confirmation, then deletes the applied search | a search is applied |
| Recent searches | applies that search; the applied one is highlighted | up to five, per list |
| _All saved searches_ | opens the dialog with every saved search | always |

<StoryEmbed id="modals-savedsearches--picker" height="480px" />

## States

| State | What you see | Trigger |
|---|---|---|
| None applied | the menu's first four items are disabled, unless filters are active (_Save as new_) | — |
| Applied | the search's filters are set and the list updates; highlighted in the menu; chip beside _Filters_ when the panel is closed | picking a search |
| Modified | a dot after the chip's title | changing the filters after applying a search |
| Removed | chip gone, all filters cleared | ✕ on the chip, or deleting the search |

<StoryEmbed id="filters-filterstoggle--states" height="260px" />

Applying a search replaces the current filters and applies them at once.
_Save changes_ and _Delete_ confirm with a notification.

## Keyboard & accessibility

- The menu follows the [overflow menu](./overflow-menu): Enter, Space or ↓
  opens it, ↑ and ↓ move, Escape closes it. Disabled items stay focusable and
  are marked `aria-disabled`.
- The chip is a button named _Saved search: {name}, remove_. The modified dot
  is hidden from assistive technology.
- The dialog follows the [modal](./modal); its rows use the list's
  [checkboxes](./checkbox).

## Content

- Name a search after what it finds, not after who made it: _Fantasy without
  a cover image_.
- Translation keys: `saved-searches.*`.

## Related

[Filter panel](./filter-panel) · [Overflow menu](./overflow-menu) ·
[Modal](./modal) · [Chip & badge](./chip-and-badge)
