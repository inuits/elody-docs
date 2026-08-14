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

## How to read these pages

Each page: definition + implementing Vue component(s) → when (not) to use →
anatomy → state table → live embed → behaviour & keyboard → accessibility →
NL/EN copy → do & don't → related. Copy examples are bilingual; prose is
English. "Open — see brief" marks gaps deliberately left open (iconography
final set, empty-state art, data-viz colours, dark mode).

## Source artifacts

- [tokens.css](/design-system/tokens.css) — the Tailwind 4 `@theme` block every
  role token resolves to; the single source for colours, type, spacing, radii,
  elevation, motion and focus.
- [Component manifest](./manifest) — design-system component → specimen → docs
  page → Vue component → story ID; the contract the code is audited against.
- Specimens (self-contained HTML, every state side by side):
  [Foundations](/design-system/specimens/Foundations.dc.html) ·
  [Fields & editing](/design-system/specimens/Components%20-%20Fields%20-%20Editing.dc.html) ·
  [Lists & actions](/design-system/specimens/Components%20-%20Lists%20-%20Actions.dc.html) ·
  [Filters & modals](/design-system/specimens/Components%20-%20Filters%20-%20Modals.dc.html) ·
  [Viewers](/design-system/specimens/Viewers.dc.html) ·
  [Patterns](/design-system/specimens/Patterns.dc.html)
