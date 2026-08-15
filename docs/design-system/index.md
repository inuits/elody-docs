---
title: elody design system
---

# elody design system

Working reference for the elody per-field-editing redesign, validated with Open
Vlacc cataloguers. Every token, size and duration was lifted from the product
code (`inuits-dams-pwa`) or the redesign prototypes — nothing here is
decorative. Pages embed live Storybook stories via `<StoryEmbed>`; IDs marked
in STORYBOOK_TODO.md do not exist yet.

## The seven interaction principles

1. **Edit scope = save scope = validation scope.** A field edits, saves and
   validates alone; a group edits, saves and validates as one card. No third mode.
2. **One gesture opens a group.** Clicking any value in an interdependent group
   opens the whole group in place — never a navigation, never a modal.
3. **Labelled actions, never a bare ⋮.** The primary action is a labelled split
   button; overflow triggers carry a label too.
4. **Undo over confirm.** Destructive-ish actions execute immediately and offer
   *Ongedaan maken* in a toast; confirmation modals are reserved for true loss.
5. **Shape encodes role.** Pills start something (add, search, navigate chrome —
   always safe); rectangles execute something immediately (save, open).
6. **Two elevation levels.** Cards have a 1px border and no shadow; only
   overlays float.
7. **Structural accessibility.** Roles, accessible names, focus order and
   `role="alert"|"status"` are part of the component contract, not a pass after.

## Implementing this in the codebase

Follow `IMPLEMENTATION.md` in the handoff root: phased plan (tokens →
primitives → fields → lists → filters → viewers → flows → Storybook), with a
definition of done per component and the list of deprecations to retire. For
the migration itself — PR-sized work packages, Storybook as the system's home,
and the screen-level refresh pass — use `MIGRATION_PLAN.md`.

## How to read these pages

Each page: definition + implementing Vue component(s) → when (not) to use →
anatomy → state table → live embed → behaviour & keyboard → accessibility →
NL/EN copy → do & don't → related. Copy examples are bilingual; prose is
English. "Open — see brief" marks gaps deliberately left open (iconography
final set, empty-state art, data-viz colours, dark mode).
