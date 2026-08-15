---
title: Inline editor
---

# Inline editor

The in-place input a field row swaps to · Implemented by `InlineFieldEditor.vue`

## When to use / when not
Rendered by a field row (or group card) when editing starts — never mounted
standalone, never in a modal.

## Anatomy
Input matching the field type (text, textarea, select, date, autocomplete
picker), 13px value size, 5px radius, commit ("Bewaar", teal, rect) and cancel
("Annuleer", ghost) actions inline right. Select options render at 12.5px.

## States
| State | Visual cue | Trigger |
|---|---|---|
| editing | white input, teal focus ring | open |
| dirty | Bewaar enabled | change |
| pristine | Bewaar disabled | open |
| saving | Bewaar shows spinner, inputs locked | commit |
| error | red border + message, `role="alert"`, value preserved | reject |
| select open | overlay listbox, 10px radius, overlay shadow | click/Alt+↓ |

<StoryEmbed id="metadata-inlinefieldeditor--editing" />

## Behaviour & keyboard
Enter commits (textarea: Ctrl+Enter), Escape cancels and restores the previous
value, Tab cycles input → Bewaar → Annuleer. Clicking outside asks nothing:
pristine closes, dirty stays open (no silent discard, no confirm modal).

## Accessibility
Input labelled by the row label (`aria-labelledby`). Listbox follows the
combobox pattern (`role="combobox"` + `aria-expanded`). Save errors announce
via `role="alert"`; the saved state announces "Opgeslagen" via `role="status"`.

## Content & i18n
"Bewaar" / "Save" · "Annuleer" / "Cancel" · saved: "Opgeslagen" / "Saved" ·
generic failure: "Opslaan mislukt, probeer opnieuw" / "Saving failed, try again".

## Do & don't
Do preserve the user's input on error. Don't auto-save on blur; don't move the
commit buttons under the field on wide screens.

## Round 2 — commit model & new inline types
Commit model everywhere: **pick-then-Bewaar**. Choosing in a select, date
picker or autocomplete marks the editor dirty; nothing saves until Bewaar.
The select editor is the custom [dropdown select](./dropdown-select) overlay —
native `<select>` is deprecated in edit surfaces. Non-required selects open
with a "—" (Geen waarde) option. Under every open editor a keyboard-hint line
renders: "Enter bewaart · Esc annuleert" (11px, muted). New inline editors
(the legacy whole-form path is deprecated): **textarea** (grows to 6 rows,
Ctrl+Enter commits), **relation picker** (the [autocomplete tag
input](./autocomplete-tag-input) inline; the modal picker remains reachable
via a "Blader…" link under the popup), **multilingual** (locale chips above
one input; each locale keeps its own value; dirty locales marked with a dot).

## Related
[Field row](./field-row) · [Group form card](./group-form-card)
