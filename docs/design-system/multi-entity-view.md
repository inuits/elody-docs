---
title: Multi-entity view
---

# Multi-entity view

Several related records side by side, one column each, so you can read and
edit them together (for example a work, its expression and a manifestation).

<StoryEmbed id="views-multientityview--default" :width="1100" height="380px" />

## When to use

- Records that only make sense together, such as the levels of a
  work–expression–manifestation chain. A client opens the view with a link
  action on a record's page.
- Correcting a value on one record while you check the related ones.

## When not to use

- **One record:** use its detail page.
- **Two versions of the same record:** use the [history diff](./history-diff).
- **Many records of one type:** use a list, such as an
  [entity list element](./entity-list-element).

## Anatomy

1. **The page,** in `--color-background-normal`, in the same shell as a detail
   page. The breadcrumbs come from the route's configuration, for the
   record the view was opened from.
2. **Columns,** one per record, in the order the route's query returns them.
   They share the width equally. Each is a card in `--color-neutral-0`.
3. **Column header,** in `--color-neutral-10` with a `--color-neutral-100`
   line under it. It stays on top while the column scrolls.
   - The record's type as a large [chip](./chip-and-badge)
     (`--text-chip-lg`, `--chip-padding-lg`), coloured by the client's pill
     configuration. Without a type chip the header shows the translated type
     name, large and bold in `--color-text-light`.
   - The heading links to the record's detail page.
   - In the right half of the header, an _Edit metadata_ [button](./button)
     when the record's type turns on the page-wide edit mode (see Variants).
4. **The record's panels,** the same [panels](./panel-and-block-shells) and
   [field rows](./field-row) as on its detail page, built from the record's own
   view configuration. Each column scrolls on its own.

**On small screens** (below 1024px) the columns stack from top to bottom and
share the height of the page; each one still scrolls on its own. A record's
own panels stack below 768px, as on its detail page.

<StoryEmbed id="views-multientityview--default" height="560px" />

## Variants

| Variant | What changes | When |
|---|---|---|
| Per-field editing — the default | every editable value opens in place and saves on its own | always, unless the type turns on the page-wide edit mode |
| Page-wide edit mode | an _Edit metadata_ button in that column's header | the record's type has `hasEditMetadataButton` in the route's page config |

Each column follows its own record: its type decides the edit mode, and its
`canUpdate` decides whether its fields are editable. A column you may not
update shows plain values and no button.

<StoryEmbed id="views-multientityview--page-wide-edit" :width="1100" height="330px" />

In the page-wide edit mode, _Edit metadata_ switches that column's rows to
their form inputs and the header to _Save_ and _Cancel_. _Save_ is disabled
while a field has an error. _Cancel_ asks in a [confirm dialog](./modal)
before it drops the changes. The heading is not a link while you edit.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | a spinner in the middle of the page | the records are being fetched |
| Loaded | one column per record | the query returned records |
| No results | _No data found to display._ in the middle of the page, in `--color-text-light` | the query returned no records, or failed |
| Editing a field | the field's [inline editor](./inline-editor) in its column; the other columns stay as they are | a click on an editable value |
| Saved | only the edited column reloads with the new value | a save in a column worked |

<StoryEmbed id="views-multientityview--states" :width="1100" height="300px" />

<StoryEmbed id="views-multientityview--editing" :width="1100" height="380px" />

Editing follows [per-field editing](./per-field-editing): one value is open at
a time across all columns, and a save sends only that record's field.

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab | moves through the columns from left to right (top to bottom on small screens): heading link, header button, then the column's editable values |
| Enter | on a heading: opens that record's detail page |
| Enter / Space | on a value or button: the [field row](./field-row) and [button](./button) keys apply |

- The heading link and the buttons show the focus ring.
- The header buttons have a visible label as well as an icon.

## Content

- The type chip carries the label the client configures per type, such
  as a type letter.
- Translation keys: `multi-entity.no-results`,
  `entity-translations.{type}`, `metadata.labels.edit-metadata`,
  `bulk-operations.save`, `bulk-operations.cancel`, `confirm.discard-edit.*`.

## Related

[Per-field editing](./per-field-editing) · [Field row](./field-row) ·
[Chip & badge](./chip-and-badge) · [Panel & block shells](./panel-and-block-shells) ·
[History diff](./history-diff)
