---
title: Hierarchy list
---

# Hierarchy list

A panel on a detail page that lists the record's parents, from the top level
down to the nearest one.

<StoryEmbed id="entityelements-entityelementhierarchylistviewer--default" height="340px" />

## When to use

- Records that sit in a fixed chain of parents, such as an inscription in a
  point, a site, an area and a region. People see where the record belongs
  and open any level.
- The parents have a location: the same panel shows them on a map.

## When not to use

- **Children or other relations of a record:** use an
  [entity list element](./entity-list-element) in a panel.
- **Picking a folder to import from:** that is the
  [folder tree](./folder-tree), an expandable tree of folders. The hierarchy
  list is a flat list of one record's parents, not a tree.

## Anatomy

1. **Panel:** an element panel from the
   [panel and block shells](./panel-and-block-shells): a
   `--color-surface-panel-header` header band with the title in
   `--text-panel-title`, `--color-text-panel-header`, and a
   `--panel-body-pad` body.
2. **Results band:** the count, _4 results_, and the view switch when the
   parents allow more than one [view mode](./view-modes). There are no
   filters, search, sort or pager.
3. **Rows:** one row per parent, the top level first and the nearest parent
   last. The record itself is not in the list. Rows are the list rows of the
   [entity list element](./entity-list-element), without checkboxes: the
   whole row is a link that opens that parent, with the first field styled as
   the link, and the preview eye opens the [preview panel](./preview-panel).

## Variants

| Variant | What you see | Where |
|---|---|---|
| List | the parents as list rows | default |
| Shorter chain | only the levels that could be read, up to the first one that could not | a parent is missing or not readable |
| Map | all parents on a [map](./map-viewer), fitted to their areas, with a pin on the configured level | the parents allow the map view |

<StoryEmbed id="entityelements-entityelementhierarchylistviewer--shorter-chain" height="260px" />
<StoryEmbed id="entityelements-entityelementhierarchylistviewer--map" height="520px" />

The panel reads the chain one level at a time: the record's nearest parent
first, then that parent's parent, and so on. It stops at the first level it
cannot read, so the list never skips a level.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | an accent ring spinner (`--color-accent-light` track, `--color-commit` edge) centred in a tall empty body | the parents are being read |
| Loaded | the parents as rows | every level read, or the chain stopped |
| Empty | _No results match your filters_, centred | the record has no parent, or the nearest one could not be read |

<StoryEmbed id="entityelements-entityelementhierarchylistviewer--states" height="600px" />

A failed read looks the same as a missing parent: the list shows the levels
read before it, or the empty text.

## Keyboard & accessibility

- Tab reaches the view switch, then each row and its preview eye, in order.
  Enter on a row opens that parent.
- The count sits in a `role="status"` region.
- The list is a flat list, not a tree: there are no tree roles and nothing to
  expand or collapse inside the panel.
- The loading spinner is hidden from screen readers.

## Content

- Name the panel after what the chain is: _Hierarchy_, _Location_.
- Each row's first field is the name people know the parent by; add the level
  (_Region_, _Site_) as a field so the rows read top-down.

## Related

[Entity list element](./entity-list-element) ·
[Panel & block shells](./panel-and-block-shells) ·
[View modes](./view-modes) · [Map viewer](./map-viewer) ·
[Preview panel](./preview-panel) · [Folder tree](./folder-tree)
