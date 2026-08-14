---
title: Overflow menu
---

# Overflow menu

Labelled trigger for secondary actions without a primary · Implemented by `ContextMenuActionsShell.vue`

## When to use / when not
When actions are all secondary (panel corner, toolbar end). If one action
dominates, use a [split button](./split-button).

## Anatomy
Trigger: ghost rect button, label + chevron (e.g. "Acties ▾") — never an
unlabelled glyph. Menu identical to the split button's.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | ghost | — |
| hover | muted fill | pointer |
| open | sunken trigger, menu | click |
| focus | teal ring | keyboard |

<StoryEmbed id="components-contextmenuactionsshell--overflow-only" />

## Behaviour & keyboard
Same menu interaction as the split button; trigger toggles.

## Accessibility
Trigger: `aria-haspopup="menu"`, `aria-expanded`, name = its visible label
(+ context: "Acties voor {panel}").

## Content & i18n
"Acties" / "Actions" as default label; specific where space allows
("Paneel-acties").

## Do & don't
Do order by frequency, destructive last. Don't mix navigation and mutation in
one menu without a separator.

## Related
[Split button](./split-button) · [Action discovery](./action-discovery)
