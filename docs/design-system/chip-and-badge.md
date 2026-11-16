---
title: Chip & badge
---

# Chip & badge

Short labelled values: a status, an entity type or a linked entity.

<StoryEmbed id="metadata-metadataformatterpill--chips" />

## When to use

- **Chip:** a short status or category value, such as _Concept_ or
  _Published_.
- **Badge:** an entity type shown as one letter (_W_, _E_, _M_) where space is
  tight, such as list rows.
- **Relation chip:** a value that is another entity, such as a person linked
  to a record.

## When not to use

- **Actions:** a chip never changes anything by itself. Use a
  [button](./button).
- **Long text:** chips hold one or two words. Longer values stay plain text.
- **Meaning by colour alone:** a chip always has text; a badge always has a
  letter and a full name for screen readers.

## Anatomy

1. **Container:** `--radius-chip` corners, `--chip-padding`.
2. **Icon (optional):** before the label; it can spin, for a status that is
   in progress.
3. **Label:** `--text-chip`, bold.

A **badge** is one letter, centred, at least as wide as it is high
(`--badge-size`, `--badge-padding-x`, `--text-badge`).

A **nested chip** is a relation chip with small value chips inside, such as an
organisation with the person's functions.

## Variants

| Variant | Colour | Where it comes from |
|---|---|---|
| Status chip | a tone, or colours from the client's configuration | the value's raw (untranslated) key in the pill configuration |
| Badge | a tone | a pill configuration with `shape: "badge"` and a `letter` |
| Relation chip | `--color-chip-relation-bg` / `-text`, the same on every client | relation fields |
| Value chip | `--color-chip-value-bg` / `-text`, derived from the client accent | selected values in dropdowns and tag inputs |

<StoryEmbed id="metadata-metadataformatterpill--badges" />

**Tones.** Status chips and badges take their colours from three tones
(`--color-badge-tone{1,2,3}-{bg,text}`) plus a subtype tone. Each client maps
its own values and entity types onto the tones, in configuration order. There
is no fourth tone. A value without configuration is shown as plain text.

A **large** size exists for column headings when records are compared side by
side (`--text-chip-lg`, `--chip-padding-lg`).

## States

Chips and badges are static: they have no hover, focus or pressed state of
their own. When a relation chip links to its entity, the surrounding field
makes it clickable and shows the pointer and hover colour.

## Keyboard & accessibility

- A badge is `role="img"` with the full, translated type name as its
  `aria-label`, so screen readers hear _Manifestation_, not _M_.
- Nested value chips have a `title` naming the field they come from.
- Every tone and chip colour pair meets 4.5:1 contrast. See
  [Accessibility](./accessibility).

## Content

- One or two words, sentence case: _Concept_, _In review_.
- Badges use the first letter of the type unless the configuration sets
  another one; keep letters unique within a client.
- Values are configured by their raw key, so a translated label never
  changes which colour a value gets.

## Related

[Colour](./colour) · [Client theming](./client-theming) · [Button](./button)
