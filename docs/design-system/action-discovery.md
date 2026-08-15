---
title: Action discovery
---

# Action discovery

Labelled actions, never a bare ⋮ · Implemented by `ContextMenuActionsShell.vue`

## When to use / when not
Every place an entity or panel offers actions. The pattern exists because
cataloguers could not find actions hidden behind unlabelled glyph triggers.

## Anatomy
Decision ladder: 1 action → labelled button · 1 primary + n → [split
button](./split-button) · n secondary → [overflow menu](./overflow-menu) with a
**labelled** trigger · bulk → [selection action bar](./selection-action-bar).
Shape follows the pill/rectangle rule; destructive items sit last in menus,
danger ink, and follow [undo-over-confirm](./feedback).

## States
| State | Visual cue | Trigger |
|---|---|---|
| discoverable | label always visible | — |
| unavailable | disabled with reason (tooltip/title) | permissions |
| destructive | danger ink, last position | menu |

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--split-button" />

## Behaviour & keyboard
Menus follow the menu-button pattern (see split button). Disabled items stay
in the menu with their reason — removal hides capability.

## Accessibility
Triggers name their scope ("Meer acties voor {titel}"). Disabled reasoned
items keep `aria-disabled` (focusable, explained) rather than `disabled`.

## Content & i18n
Verb-first labels; the trigger noun matches its scope: "Acties" (panel),
"Open record ▾" (row).

## Do & don't
Do show disabled-with-reason. Never a bare ⋮, never icon-only overflow
triggers, never a destructive default.

## Related
[Split button](./split-button) · [Overflow menu](./overflow-menu) · [Feedback & undo](./feedback)
