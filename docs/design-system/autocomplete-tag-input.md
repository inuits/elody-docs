---
title: Autocomplete tag input
---

# Autocomplete tag input

Removable value chips + async search — the relation gesture · Implemented by `BaseInputAutocomplete.vue` (+ relation/metadata variants)

## When to use / when not
Authors, subjects, publishers — any multi-valued relation edited in place. The
modal [entity picker](./entity-picker) remains for deliberate browsing; this is
the fast path.

## Anatomy
Input-styled container (5px radius) holding: value chips (relation blue
`#6DBBDE`, white text, ✕ per chip) + a text cursor. Popup as the dropdown's:
async results with title + badges + secondary line; bottom row "Maak nieuw:
'{query}'" when config allows creation.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | chips + placeholder | — |
| typing | popup opens after debounce | ≥2 chars |
| loading | option-shaped skeletons | async |
| results | rows with badges | response |
| empty | "Geen resultaten" + Maak nieuw | 0 hits |
| chip focus | chip ring, ✕ prominent | ←/→ |
| disabled | muted container, chips not removable | prop |

<StoryEmbed id="base-baseinputautocomplete--with-tags" />

## Behaviour & keyboard
Enter adds the highlighted result as a chip; Backspace in empty input focuses
the last chip, second Backspace removes it; chips never reorder on their own.
Adding/removing chips marks the editor dirty — **Bewaar commits**.

## Accessibility
Container `role="combobox"`; chips are buttons "Verwijder {waarde}"; result
list `role="listbox"`. Creation row announces "Nieuw item aanmaken".

## Content & i18n
"Maak nieuw: '{query}'" / "Create new: '{query}'" · "Geen resultaten" /
"No results".

## Do & don't
Do show entity badges in results. Don't fire creation without the picker's
confirm step when the type needs required fields; don't remove chips on save
failure (editor stays open).

## Related
[Entity picker](./entity-picker) · [Repeatable row group](./repeatable-row-group) · [Dropdown select](./dropdown-select)
