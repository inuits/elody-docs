---
title: Primitives
---

# Primitives

Buttons, checkbox, chips, icon, spinner · Implemented by `BaseButton.vue`, `BaseCheckbox.vue`, `CustomIcon.vue`, `SpinnerLoader.vue`

## When to use / when not
Every clickable in the system is one of these. Never restyle a native button
ad hoc; never use a pill shape for an immediate-effect action.

## Anatomy
**Button** (rect, 5–6px): label, optional 12–14px leading icon; primary =
accent fill/white text, secondary = white/border, ghost = borderless, danger =
red. **IconButton**: square, icon-only, requires `aria-label`. **AddButton**
(pill, 14px): "+ label", dashed low-emphasis variant (4px). **Checkbox**: 1.5px
border, commit-teal check. **Pill/relation chip**: `#6DBBDE` fill, white text —
means "clicking navigates". **Spinner**: .8s rotation, commit teal.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | per variant | — |
| hover | darker fill / wash; accent shadow on primary | pointer |
| focus | 2px teal ring | keyboard |
| active | scale(.97) | press |
| disabled | disabled ink, no pointer | prop |
| loading | spinner replaces icon, label stays | async |

<StoryEmbed id="base-basebutton--variants" />
<StoryEmbed id="components-spinnerloader--default" />

## Behaviour & keyboard
Space/Enter activate; checkbox toggles on Space. Buttons keep their width
while loading (no layout shift).

## Accessibility
IconButton: `aria-label` mandatory. Checkbox: real `<input type="checkbox">`
with visible label or `aria-label`. Spinner inside a live region announces via
its container, not itself. Skeleton loaders exist code-side
(`ListItemSkeleton.vue`, `EntityDetailSkeleton.vue`) — not re-specified here.

## Content & i18n
Verbs on buttons, sentence case: "Bewaar" / "Save", "Annuleer" / "Cancel",
"Voeg persoon toe" / "Add person", "Open record" / "Open record".

## Do & don't
Do pair icon + label on primary actions. Don't ship a bare ⋮; don't put two
primary buttons in one row; don't shrink hit targets under 44px on tablet.

## Related
[Split button](./split-button) · [Foundations](./foundations)
