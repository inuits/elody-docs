---
title: Split button
---

# Split button

One primary action and its alternatives, joined in one labelled control.

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--split-button" />

## When to use

- An entity or a selection has **exactly one** action people use most, plus a few
  related ones: _Open record_ ▾ with _Duplicate_, _Export_, _Delete_.
- The primary action should be one click away and the rest should still be
  findable under the same control.

## When not to use

- **Only one action:** use a plain button.
- **No clear primary action:** use the labelled _Actions_ menu on its own
  (the overflow menu).
- **More than one promoted action:** show them as separate buttons followed by
  the _Actions_ menu. The split button only forms when there is one promoted action.

<StoryEmbed id="contextmenuactions-contextmenuactionsshell--promoted-and-menu" />

## Anatomy

1. **Primary segment:** a small primary button with a verb label. It runs its
   action straight away.
2. **Chevron segment:** a small primary button that only opens the menu. A
   divider (`--split-button-divider`) separates it from the primary segment;
   `--split-button-chevron-padding-x` sets its width.
3. **Menu:** opens under the chevron. Items have an optional icon
   (`--menu-icon-size`) and a label (`--menu-item-padding`, `--menu-item-gap`).
   Destructive items use `--color-danger-ink` and always sit last.

Both segments share one capsule: the inner corners are square, the outer
corners keep `--radius-button`.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | accent fill, chevron points down | — |
| Hover | each segment shows its own hover fill | pointer |
| Focus | focus ring on the focused segment | keyboard |
| Open | chevron points up and takes `--color-accent-hover`; menu under the chevron | click or ↓ on the chevron |
| Disabled item | item in disabled ink with a help icon; its tooltip says why | the action does not apply |
| Small screen (< 48rem) | the menu opens as a bottom sheet | viewport width |

The menu opens under the chevron, aligned to its left edge. Near the right edge
of the window it aligns to the chevron's right edge, and near the bottom it
opens upwards.

## Keyboard & accessibility

| Key | On the chevron | In the menu |
|---|---|---|
| Tab | moves from the primary segment to the chevron | closes the menu, focus back on the chevron |
| Enter / Space | opens or closes the menu | runs the focused item |
| ↓ | opens the menu, focus on the first item | next item (wraps) |
| ↑ | — | previous item (wraps) |
| Home / End | — | first / last item |
| Escape | — | closes the menu, focus back on the chevron |

A click outside the menu or a scroll closes it without running anything.

- The two segments sit in a `role="group"`.
- The primary segment is named by its label.
- The chevron is named _More actions for {title}_ when it knows what it acts
  on, otherwise _More actions_. It has `aria-haspopup="menu"` and
  `aria-expanded`.
- The menu is a `role="menu"` with `role="menuitem"` items; a disabled item has
  `aria-disabled="true"`.

## Content

- The primary label is a short verb phrase: _Open record_, _Save_.
- Menu items start with a verb: _Duplicate_, _Export_, _Delete_.
- Whether an item is destructive comes from the action's configuration
  (`tone: Danger`), not from its label. The menu then colours it and moves it
  to the end.
- Keep the menu short.
- Translation keys for the chevron: `contextMenu.more-actions` and
  `contextMenu.more-actions-for`.

## Related

[Colour](./colour) · [Spacing, shape & motion](./spacing-shape-motion) ·
[Accessibility](./accessibility)
