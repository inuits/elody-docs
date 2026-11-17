---
title: Chip & badge
---

# Chip & badge

Short labelled values: a status, an entity type or a linked entity.

<StoryEmbed id="metadata-metadataformatterpill--chips" />

## When to use

- **Chip:** a short status or category value, such as _Concept_ or
  _Published_.
- **Badge:** the type of the current record as a short code, such as _M_ for
  a manifestation, before its title in the breadcrumb.
- **Relation chip:** a value that is another entity, such as a person linked
  to a record.

## When not to use

- **Actions:** a chip never changes anything by itself. Use a
  [button](./button).
- **Long text:** chips hold one or two words. Longer values stay plain text.
- **Meaning by colour alone:** a chip always has text; a badge always has its
  code as text.

## Anatomy

1. **Container:** `--radius-chip` corners, `--chip-padding`.
2. **Icon (optional):** before the label; it can spin, for a status that is
   in progress.
3. **Label:** `--text-chip`, bold.

A **badge** is a short code, centred, at least as wide as it is high
(`--badge-size`, `--badge-padding-x`, `--text-badge`).

A **nested chip** is a relation chip with small value chips inside, such as an
organisation with the person's functions.

## Variants

| Variant | Colour | Where it comes from |
|---|---|---|
| Status chip | a tone, or colours from the client's configuration | the value's raw (untranslated) key in the pill configuration |
| Type badge | `--color-chip-relation-bg` / `-text` | the record's type code, in the breadcrumb |
| Relation chip | `--color-chip-relation-bg` / `-text`, the same on every client | relation fields |
| Value chip | `--color-chip-value-bg` / `-text`, derived from the client accent | selected values in dropdowns and tag inputs |

The breadcrumb shows the type badge before the current record's title:

<StoryEmbed id="components-breadcrumb--type-badge" height="120px" />

**Configuring colours.** A client's pill configuration sets a value's colours,
either as explicit colours or as one of three tones
(`--color-badge-tone{1,2,3}-{bg,text}`) plus a subtype tone. There is no
fourth tone. A value without configuration is shown as plain text. The same
configuration can turn a value into a letter badge (`shape: "badge"` with a
`letter`). The examples below show what such a configuration produces; they
are not part of any client's setup.

<StoryEmbed id="metadata-metadataformatterpill--badges" />

A **large** size exists for column headings when records are compared side by
side (`--text-chip-lg`, `--chip-padding-lg`).

## States

Chips and badges are static: they have no hover, focus or pressed state of
their own. When a relation chip links to its entity, the surrounding field
makes it clickable and shows the pointer and hover colour.

## Keyboard & accessibility

- A badge is `role="img"` with its value as the `aria-label`. For the type
  badge in the breadcrumb that is the code itself, such as _M_. A configured
  letter badge is named by the value's translated name.
- Nested value chips have a `title` naming the field they come from.
- Every tone and chip colour pair meets 4.5:1 contrast. See
  [Accessibility](./accessibility).

## Content

- One or two words, sentence case: _Concept_, _In review_.
- A configured letter badge uses the first letter of the value unless the
  configuration sets another one; keep letters unique within a client.
- Values are configured by their raw key, so a translated label never
  changes which colour a value gets.

## Related

[Colour](./colour) · [Client theming](./client-theming) · [Button](./button)
