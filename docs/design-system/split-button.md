---
title: Split button
---

# Split button

Primary action + related actions, always labelled · Implemented by `ContextMenuActionsShell.vue`

## When to use / when not
Wherever an entity offers one primary action plus alternatives (Open record ▾).
Not when there is exactly one action (plain button) or no clear primary
([overflow menu](./overflow-menu)).

## Anatomy
Two segments sharing one 6px-radius capsule: labelled primary (accent fill,
white text) + chevron segment (1px divider). Menu: 8px radius, overlay shadow,
12.5px items with 14px icons; destructive item last, danger ink.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | accent fill | — |
| hover | accent-hover per segment | pointer |
| open | chevron segment pressed (sunken), menu below-right | click chevron |
| focus | teal ring per segment | keyboard |
| disabled item | disabled ink + reason as title/tooltip | permissions |

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--split-button" />

## Behaviour & keyboard
Primary fires immediately; chevron only opens the menu. Chevron: Enter/Space/
↓ opens, arrows cycle, Escape closes to the chevron. Menu closes on outside
click without firing.

## Accessibility
Two buttons: primary named by its label; chevron "Meer acties voor {titel}",
`aria-haspopup="menu"` + `aria-expanded`. Menu `role="menu"`/`menuitem`.

## Content & i18n
Primary is a verb: "Open record" · "Bewaar". Menu items verb-first:
"Dupliceer" / "Duplicate", "Verwijder" / "Delete" (last, red).

## Do & don't
Do keep the primary the statistically most-used action. **Never a bare ⋮** —
the label is the discovery mechanism. Don't exceed ~7 menu items.

## Round 2 — submenus & destructive marker
Menus may nest **one** submenu level (item with › opens right; ←/→ traverse;
never deeper). Config-driven menus mark destructive items with a schema flag
(`"tone": "danger"` on the action definition) — the renderer, not the label,
decides the danger ink and last-position sorting; never infer from the verb.

## Related
[Overflow menu](./overflow-menu) · [Action discovery](./action-discovery)
