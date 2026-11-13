---
title: Elody design system
---

# Elody design system

The shared visual language and interaction patterns of the Elody interface.
Each page describes one component or pattern: when to use it, how it looks
and behaves in every state, and how it stays accessible. Live examples come
from the Elody Storybook.

## The seven interaction principles

1. **Edit scope = save scope = validation scope.** A field edits, saves and
   validates alone; a group edits, saves and validates as one card. No third mode.
2. **One gesture opens a group.** Clicking any value in an interdependent group
   opens the whole group in place — never a navigation, never a modal.
3. **Labelled actions, never a bare ⋮.** The primary action is a labelled split
   button; overflow triggers carry a label too.
4. **Undo over confirm.** Destructive-ish actions execute immediately and offer
   *Ongedaan maken* (Undo) in a toast; confirmation modals are reserved for true loss.
5. **Shape encodes role.** Pills start something (add, search, navigate chrome —
   always safe); rectangles execute something immediately (save, open).
6. **Two elevation levels.** Cards have a 1px border and no shadow; only
   overlays float.
7. **Structural accessibility.** Roles, accessible names, focus order and
   `role="alert"|"status"` are part of the component contract, not a pass after.

## How to read these pages

Each page: definition → when (not) to use →
anatomy → state table → live embed → behaviour & keyboard → accessibility →
NL/EN copy → do & don't → related. Copy examples are bilingual; prose is
English.
