---
title: Navigation chrome
---

# Navigation chrome

Breadcrumb, record stepper, nav rail, wizard steps · Implemented by the detail-view chrome components

## When to use / when not
Fixed chrome only — two fixed elements exist: the 52px nav rail and the
detail header (breadcrumb + stepper + actions). Nothing else is sticky.

## Anatomy
**Breadcrumb**: grey pill capsule (14px radius) with trail — entity badges +
titles, chevron separators; current item bold, ancestors are links.
**RecordStepper**: pill capsule "‹ 3 van 128 ›" — 22px icon buttons
(press scale .92), 11px count. **NavRail**: 52px white fixed left rail, icon
buttons with active accent wash. **WizardSteps**: numbered steps with badge
tones for entity-type steps, connector lines.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | grey capsules | — |
| link hover | accent ink | pointer |
| stepper at edge | that arrow disabled | first/last record |
| rail active | accent wash + accent glyph | current route |
| wizard current | filled step, bold label | position |

<StoryEmbed id="components-breadcrumbs--with-history" />

## Behaviour & keyboard
Stepper: ←/→ move records when the header has focus; disabled edges are
real disabled buttons. Breadcrumb links are plain links (middle-click works).

## Accessibility
Breadcrumb `<nav aria-label="Kruimelpad">` with `aria-current="page"`.
Stepper `role="group"` "Positie in de resultatenlijst"; count `role="status"`.
Rail `<nav aria-label="Hoofdnavigatie">` with labelled icon buttons.

## Content & i18n
"{n} van {total}" / "{n} of {total}" · rail tooltips are the destination
nouns ("Bibliotheek", "Import").

## Do & don't
Do keep capsules consequence-free (they only navigate). Don't add a third
fixed element; don't truncate the current breadcrumb item.

## Related
[Foundations](./foundations) · [Panel & block shells](./panel-and-block-shells)
