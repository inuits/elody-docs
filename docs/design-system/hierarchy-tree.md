---
title: Hierarchy & folder trees
---

# Hierarchy & folder trees

Tree blocks for record hierarchies and folder structures · Implemented by the hierarchy/folder tree blocks

## When to use / when not
Parent/child record structures (archief → reeks → stuk) and folder browsing
(import). Not for flat lists with one grouping level (grouped list).

## Anatomy
Rows 28px: ⌄/⌃ disclosure (12px hit area padded to 24px), entity badge or
folder glyph, title (12.5px, link ink for records), count chip right
(children). Depth indents 16px with a hairline guide. Selected row = accent
wash (checkbox rules apply where selection exists); the *open* record row =
3px accent border left, matching the preview-active cue.

## States
| State | Visual cue | Trigger |
|---|---|---|
| collapsed | ⌄, children hidden | — |
| expanded | ⌃, children indented | click/→ |
| lazy loading | skeleton child rows | expand |
| selected | wash | checkbox/click per surface |
| active | 3px accent left border | current record |
| empty branch | muted "Leeg" child line | 0 children |

<StoryEmbed id="entityelements-entityelementhierarchylistviewer--collapsed" />

## Behaviour & keyboard
Tree pattern: ↑↓ move, →/← expand/collapse, Enter opens the record. Expansion
state persists per session.

## Accessibility
`role="tree"`/`treeitem` with `aria-expanded` and `aria-level`; counts in
the item name ("Reeks A, 12 onderliggende").

## Content & i18n
"Leeg" / "Empty" · counts are bare numerals in the chip.

## Do & don't
Do lazy-load big branches. Don't mix selection and navigation on one click
target (checkbox selects, title navigates); don't exceed ~6 visible levels
without a "focus on this branch" action.

## Related
[Entity list element](./entity-list-element) · [Import browser](./import-browser) · [Navigation chrome](./navigation)
