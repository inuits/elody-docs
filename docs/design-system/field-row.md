---
title: Field row
---

# Field row

One metadata field: label above value, editable in place · Implemented by `MetadataWrapper.vue`

## When to use / when not
Every single-valued metadata field on a detail screen. Not for interdependent
fields (use the [group form card](./group-form-card)) and not for repeating
values (use the [repeatable row group](./repeatable-row-group)).

## Anatomy
Label (11.5px bold, field-label blue) over value (13px, secondary ink). The
value carries a dashed underline (`--color-border-dashed`) when editable. Empty
non-required values render at 45% opacity with placeholder copy. A pencil glyph
appears on hover, right-aligned.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | dashed underline under value | — |
| hover | accent wash fill + pencil | pointer |
| focus | 2px teal ring on the value | keyboard |
| editing | swaps to [inline editor](./inline-editor) | click/Enter |
| saving | 14px spinner right of value | commit |
| saved | green check, fades after 2s | success |
| error | red underline + message below, `role="alert"` | validation |
| empty | 45% opacity, "Geen waarde" | no value |
| read-only | no underline, no hover | permissions |

<StoryEmbed id="metadata-metadatawrapper--read-only" />

## Behaviour & keyboard
Click or Enter starts editing. **Edit scope = save scope = validation scope**:
the row saves alone, validates alone, never opens siblings. Tab moves between
rows; editing traps focus in the editor until save/cancel.

## Accessibility
The editable value is a button: role `button`, accessible name = "{label},
bewerken". Error message linked via `aria-describedby`; `role="alert"` on
appearance. Focus returns to the value after save/cancel.

## Content & i18n
Empty: "Geen waarde" / "No value". Error pattern: "{Label} is verplicht" /
"{Label} is required". Labels are nouns, sentence case, no colon.

## Do & don't
Do keep labels under two words where possible. Don't open a modal for one
field; don't validate other rows on save; don't hide empty required fields.

## Round 2 — label adornments & value types
Label line adornments, in order after the label: required `*` (danger ink);
"één van verplicht" group marker (`◦` + tooltip naming the group); help
tooltip (?); locale selector (11px chip per language, active bold); virtual-
keyboard trigger ⌨ (fields that need diacritics). Value-type renderings:
boolean = "Ja"/"Nee" with check/dash glyph (never a bare checkbox as display);
image values = 48px thumb, click opens viewer; URL = link ink + external
glyph, HTML values render sanitised; coordinates = text pair + "Toon op
kaart" link. Values gain a copy affordance (⧉ on hover, "Gekopieerd" status);
one-line truncation always pairs with the full-value tooltip. After a save an
**inline undo chip** ("Ongedaan maken", pill, commit-teal outline) sits next
to the value **until the next action** — it replaces the undo-toast for saves.
A failed save never renders on the closed row: the editor stays open. Scope
notes render as 11px muted microcopy in the block/row footer. A panel header
flashes the saved check for 2s after any row inside saves.

## Related
[Inline editor](./inline-editor) · [Group form card](./group-form-card) · [Per-field editing](./per-field-editing)
