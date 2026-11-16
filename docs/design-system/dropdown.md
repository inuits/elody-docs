---
title: Dropdown
---

# Dropdown

Picks one or more values from a fixed list.

<StoryEmbed id="components-advanceddropdown--default" />

## When to use

- Any choice from a closed list in forms, inline editors, filters and
  toolbars: _Status_, _Language_, _Sort by_.
- Several values from the same list: use the multi-select.

## When not to use

- **Links to other records, or a list too long to load at once:** use an
  [autocomplete](./autocomplete).
- **Free text or numbers:** use a [text input](./text-input).
- **An option that is on or off:** use a [checkbox](./checkbox) or a
  [toggle](./toggle).
- **Actions:** a dropdown holds values, not commands. Use an
  [overflow menu](./overflow-menu) or a [split button](./split-button).

## Anatomy

1. **Field:** input-shaped, `--radius-input` corners, `--control-height`
   high, value in `--text-value`. It shows the value, or a placeholder in
   `--color-text-placeholder`.
2. **Clear button (optional):** a ✕ when the dropdown can be cleared and has
   a value.
3. **Chevron:** points down when closed and up when open; a spinner replaces
   it while options load.
4. **List:** a card under the field, `--radius-card`, `--shadow-overlay`,
   `--color-border-subtle` border. Options are set in `--text-table`; the
   hovered or keyboard-focused option gets `--color-accent-wash`.
5. **Option:** an optional icon, then the label. The selected option in a
   single select shows a check; in a multi-select every option has a
   checkbox.
6. **Search (long lists):** with more than ten options, you can type in the
   field to filter the list.

## Variants

| Variant | Where | Looks |
|---|---|---|
| Bordered | every dropdown that stands on its own — use this by default | `--color-border-default` border |
| Light border | dense panels | `--color-border-subtle` border |
| Borderless | inside another control | no border |
| Multi-select | several values from one list | checkboxes; the field shows _{n} selected_; the list stays open while you pick |
| Label in value | compact toolbars | the field reads _Sort: Title_ instead of only the value |

<StoryEmbed id="components-advanceddropdown--multi-search" title="Search, multi-select, light border and disabled" height="380px" />

A dropdown that is not required starts its list with **_— No value_**, in
placeholder ink. Picking it clears the field. Required dropdowns have neither
this option nor the ✕.

Options stay in the order they are configured. A list of up to 20 options
makes the field as wide as its longest option.

## States

| State | What you see | Trigger |
|---|---|---|
| Closed | value or placeholder, chevron down | — |
| Hover | border darkens (`--color-border-dashed`) | pointer, bordered variant |
| Open | list under the field; the field keeps the focus ring | click, Space |
| Searching | the list narrows as you type | typing, lists of more than ten options |
| Selected | a check (single) or a ticked checkbox (multi) on the option | pick |
| Loading | spinner in the field; the open list shows three grey placeholder rows | options are being fetched |
| Empty | the list says _No options_ | no options available |
| Disabled | `--color-surface-muted` fill; it does not open | the field is unavailable |

<StoryEmbed id="components-advanceddropdown--states" title="Dropdown states" height="380px" />

Picking a value only changes the field. The form or inline editor around it
saves the change.

## Keyboard & accessibility

| Key | Closed | Open |
|---|---|---|
| Space | opens the list | picks the focused option (when nothing is typed) |
| Typing | opens the list and filters it (long lists) | filters the list (long lists) |
| ↓ / ↑ | — | next / previous option (wraps) |
| Enter | — | picks the focused option |
| Backspace | — | with nothing typed: removes the last value of a multi-select |
| Escape | — | closes the list without a change |
| Tab | moves on | closes the list and moves on |

A single select closes after a pick; a multi-select stays open. A click
outside the list closes it.

- The field is a `role="combobox"` with `aria-expanded`, `aria-haspopup` and
  `aria-controls` pointing to the list.
- The list is a `role="listbox"` (`aria-multiselectable` for a
  multi-select); each option is a `role="option"` with `aria-selected`.
- The checkboxes in a multi-select are decorative and hidden from screen
  readers; the selection is announced through `aria-selected`.
- While options load, the dropdown has `aria-busy="true"` and the
  placeholder rows are hidden from screen readers.
## Content

- The label names the value, as a noun: _Status_, _Language_.
- The placeholder asks for a choice: _Choose a status_.
- Option labels are short, in sentence case, and don't repeat the label:
  _Draft_, not _Status draft_.
- Fixed texts: _No value_, _{n} selected_, _No options_.

## Related

[Autocomplete](./autocomplete) · [Text input](./text-input) ·
[Checkbox](./checkbox) · [Overflow menu](./overflow-menu) ·
[Loading](./loading) · [Accessibility](./accessibility)
