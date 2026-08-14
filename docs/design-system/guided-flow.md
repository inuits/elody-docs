---
title: Guided flow
---

# Guided flow

Stepped record creation with per-step cards and a created-so-far list · Implemented by `RepetitiveFlow`, `StepModal.vue`, `StepField.vue`, `Overview.vue`

## When to use / when not
Multi-entity creation (work → expression → manifestation) and repetitive
imports. Not for editing existing records.

## Anatomy
Modal (10px radius) with [wizard steps](./navigation) on top — entity-type
steps carry their badge tone. Body: one **step card** per step
(`--color-surface-group-form`, 8px radius) holding that step's fields
(dynamic-form rules); right rail: **created-so-far list** — compact rows with
badge + title, newest on top, check on saved rows. Footer: "Vorige" ghost ·
"Volgende" primary · final step "Bewaar en sluit" commit.

## States
| State | Visual cue | Trigger |
|---|---|---|
| step active | filled step indicator, card visible | position |
| step valid | check on the step dot | Volgende |
| step errors | danger dot on step, per-field messages | validate |
| saving step | spinner on Volgende/Bewaar | commit |
| created row | badge + title + check in the rail | step saved |
| resume | first invalid step focused | reopen |

<StoryEmbed id="repetitiveform-stepmodal--step" todo />

## Behaviour & keyboard
"Volgende" validates the current step only. Steps already passed are clickable
to revisit; future steps are not. Escape asks nothing when pristine, keeps the
modal when dirty. Each saved step is undoable from the created-so-far row
(inline undo chip, until next action).

## Accessibility
Modal `role="dialog"` named by the flow; steps `aria-current="step"`; the
created-so-far list is a `role="log"` (additions announced politely).

## Content & i18n
"Vorige" / "Back" · "Volgende" / "Next" · "Bewaar en sluit" / "Save and
close" · rail heading "Aangemaakt in deze sessie" / "Created this session".

## Do & don't
Do keep one card per step. Don't allow skipping ahead; don't lose entered data
on step errors; don't hide the created-so-far rail on wide screens.

## Related
[Dynamic form](./dynamic-form) · [Navigation chrome](./navigation) · [Modal](./modal)
