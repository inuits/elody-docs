---
title: Autocomplete
---

# Autocomplete

Finds values by typing and shows each chosen value as a chip in the field.

<StoryEmbed id="base-baseinputautocomplete--tags" />

## When to use

- Links to other records: the people, places or subjects of a record.
- Tags or keywords, where a field holds several values.
- Lists that are too long to scan, where typing a few letters is faster.

## When not to use

- **A short, fixed list:** use a [dropdown](./dropdown).
- **Free text:** use a [text input](./text-input).
- **A status or category that is only shown:** use a
  [chip](./chip-and-badge) without a field.

## Anatomy

1. **Field:** `--radius-input` corners, `--color-border-default` border, at
   least `--control-height` high. It grows in height when the chips need more
   than one line.
2. **Chips:** one per value, `--radius-chip` corners, bold `--text-label`.
   Chosen values are value chips (`--color-chip-value-bg` /
   `--color-chip-value-text`, from the client accent); links to records are
   relation chips (`--color-chip-relation-bg` / `--color-chip-relation-text`).
3. **Remove button:** a ✕ at the end of each chip, while the field can be
   edited.
4. **Search:** after the chips; typing filters the list.
5. **Chevron:** opens the list; a spinner shows next to it while results
   load.
6. **List:** a card under the field, `--radius-card`, `--shadow-overlay`. Each
   option shows its label and, when there is one, extra details in muted
   text (such as a person's dates). The focused option gets
   `--color-accent-wash`.

## Variants

| Variant | Where | Looks |
|---|---|---|
| Multiple — the default | tags, relations | any number of chips |
| Single | one linked value | one chip; the search disappears once a value is chosen and comes back when it is removed |
| Create option | fields that allow new values | typing something that is not in the list offers it as an option, such as _Create: "poetry"_ |
| Chip with a value box | relations that carry a detail, such as a page number | a compact [text input](./text-input) inside each chip |
| Borderless | inside another control, such as a filter | no border |
| Read-only | values that can be seen but not changed | chips only: no border, no ✕, no search |
| Plain text | read-only values that read better as text | the values as plain text, without chips |

<StoryEmbed id="base-baseinputautocomplete--create-option" title="Create option: the typed value is offered as a new value" />

Picking the create option hands the typed value to the screen, which then
adds it, for example by creating a new record.

When a read-only relation chip links to its record, it shows a pointer and
changes colour on hover; clicking it opens the record.

## States

| State | What you see | Trigger |
|---|---|---|
| Empty | placeholder | no values yet |
| With values | a chip per value | values chosen |
| Hover | border darkens (`--color-border-dashed`) | pointer |
| Focus | focus ring around the whole field (`--color-focus-ring`) | click or Tab into the search |
| Open | list under the field; chosen values are left out of it | click, typing, ↓ |
| Long list | below the options: _Start typing to find more options_ | 20 options or more and nothing typed |
| No matches | the list says so | typed text matches no option |
| Loading | spinner in the field | results are being fetched |
| Disabled | `--color-surface-muted` fill; chips without ✕ | the field is unavailable |
| Read-only | chips on their own | see Variants |

<StoryEmbed id="base-baseinputautocomplete--states" title="Autocomplete states" />

By default, typing matches every word you type, in any order and ignoring case: _fic
hist_ finds _historical fiction_.

Choosing or removing a value only changes the field. The form or inline
editor around it saves the change.

## Keyboard & accessibility

| Key | In the search |
|---|---|
| ↓ / ↑ | opens the list; next / previous option |
| Enter | picks the focused option |
| Backspace | with nothing typed: removes the last chip |
| Escape | closes the list |
| Tab | moves on |

Tab stops on each chip's ✕ before it reaches the search.

- The search is a `role="combobox"` with `aria-expanded` and
  `aria-controls`; the list is a `role="listbox"` with `role="option"` items
  that carry `aria-selected`.
- Each ✕ is a `role="button"` named _Remove {value}_, such as
  _Remove fantasy_.
- The search field announces the chosen values.
## Content

- The label names what the values are, as a plural noun where it holds
  several: _Genres_, _Creators_.
- The placeholder says what to search for: _Search for a genre…_
- Fixed texts: _Remove {value}_, _Start typing to find more options_.
- The create option quotes the typed text: _Create: "poetry"_.

## Related

[Chip & badge](./chip-and-badge) · [Dropdown](./dropdown) ·
[Text input](./text-input) · [Loading](./loading) ·
[Accessibility](./accessibility)
