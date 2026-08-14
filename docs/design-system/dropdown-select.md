---
title: Dropdown select
---

# Dropdown select

The overlay listbox behind every select · Implemented by `AdvancedDropdown.vue`

## When to use / when not
Every enum/closed-list choice in edit, filter and chrome surfaces — the custom
overlay replaces native `<select>` everywhere (round-2 decision). Not for
relations (use the [autocomplete tag input](./autocomplete-tag-input)).

## Anatomy
Trigger: input-styled field (5px radius) with value + ⌄. Popup: 8px radius,
overlay shadow, max ~7 rows then scroll; **search-in-list** pill on top when
>10 options; options 12.5px with hover wash; multi-select renders checkboxes;
non-required single-selects start with a "—" (Geen waarde) option; a clear
affordance (✕) sits in the trigger when a value is set. Inline-label variant:
label sits inside the trigger left, 11.5px field-label blue.

## States
| State | Visual cue | Trigger |
|---|---|---|
| closed | value + ⌄ | — |
| open | popup, trigger keeps focus ring | click/Alt+↓ |
| searching | filtered rows, match not highlighted-only (count line) | typing |
| multi selected | checkboxes + count in trigger ("3 gekozen") | click rows |
| loading | option-shaped skeletons (3 rows) | async options |
| empty | "Geen opties" line | 0 matches |
| cleared | placeholder returns | ✕ |

<StoryEmbed id="base-advanceddropdown--multiple" />

## Behaviour & keyboard
Combobox pattern: Alt+↓/Enter opens, ↑↓ move, Enter picks, Escape closes
without change. **Picking never saves** — commit is the editor's Bewaar
(pick-then-Bewaar decision). Multi-select keeps the popup open.

## Accessibility
`role="combobox"` + `aria-expanded`; popup `role="listbox"`
(`aria-multiselectable` when multi); search labelled "Zoek in opties";
skeletons are `aria-hidden`, the listbox gets `aria-busy`.

## Content & i18n
"Geen waarde" / "No value" (the — option) · "Zoek…" / "Search…" ·
"{n} gekozen" / "{n} selected" · "Geen opties" / "No options".

## Do & don't
Do keep option order from config. Don't auto-save on choose; don't drop the
"—" option from non-required selects; don't use native `<select>` in edit
surfaces.

## Related
[Inline editor](./inline-editor) · [Autocomplete tag input](./autocomplete-tag-input)
