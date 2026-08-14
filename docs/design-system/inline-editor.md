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

<StoryEmbed id="metadata-inlinefieldeditor--resting" />

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

## Related
[Field row](./field-row) · [Group form card](./group-form-card)
