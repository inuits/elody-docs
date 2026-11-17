---
title: History diff
---

# History diff

Two versions of a record side by side, read-only, with what changed between
them marked in red and green.

<StoryEmbed id="history-historycomparison--default" :width="1100" height="380px" />

## When to use

- Checking what changed on a record, and who changed it: open the history
  page with _View history_ in the page header.
- Comparing any two saved versions, including the current one.

## When not to use

- **Editing or restoring a value:** the diff is read-only. Edit the record
  itself, in its [field rows](./field-row).
- **Unsaved changes in an open form:** the history only holds saved
  versions.

## Anatomy

1. **Entry point:** a secondary, small [button](./button) _View history_ with
   a history icon in the page header. It shows when the client turns it on.
2. **Two columns,** one per version, each with a header that stays on top
   while you scroll:
   - a [dropdown](./dropdown) to pick the version. Each option reads
     _Version {n} ({date})_, followed by _· {author}_ when known. Only the
     left dropdown offers _Current version (Version {n})_;
   - _Edited by {author} on {date}_ under it, in `--text-label`,
     `--color-text-muted`.
3. **The record's panels,** read-only, in the same order on both sides, so
   the same field sits at the same height. The id field and fields
   configured as hidden in history are left out.
4. **Diff marks** on what changed:
   - **A changed field value** becomes a [chip](./chip-and-badge): red on the
     older version, green on the newer. Unchanged values stay plain text.
   - **Relations** are chips: added in `--color-diff-new` on
     `--color-diff-new-bg`, removed in `--color-diff-old` on
     `--color-diff-old-bg`, unchanged in the neutral chip colours. Each
     column shows only its own side: the newer version shows what was added,
     the older one what was removed.
   - **A changed rich-text field** gets a `--color-diff-new-border` border on
     `--color-diff-new-bg` on the newer side, and the `-old` pair on the older
     side.

<StoryEmbed id="history-relationdifflist--states" height="200px" />

Red and green follow the dates, not the columns: whichever version is older
is red, wherever you put it. By default the current version is on the left
and the version before it on the right.

## Variants

| Change | Older version | Newer version |
|---|---|---|
| Field value | value as a red chip | value as a green chip |
| Relation added | — | green chip |
| Relation removed | red chip | — |
| Related record renamed | red chip with the old name · _renamed_ | green chip with the new name · _renamed_ |
| Rich text | red border and tint | green border and tint |
| Unchanged | plain value, neutral chips, default border | the same |

The chip colours of changed field values come from the client's pill
configuration (`modified` for the older value, `added` for the newer).

Repeated groups of fields are compared entry by entry, by position: only the
fields that differ in an entry are marked.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | a spinner under the column header | a version is being fetched |
| Compared | both columns with diff marks | both versions loaded |
| No history | _This item has no history yet._ in the right column | no saved versions exist for the record |
| No earlier version | _There are no earlier versions yet._ in the right column | the record has only its current version |
| Version failed | _This version could not be loaded._ in that column | fetching one version fails |
| History failed | _The history could not be loaded. Please try again later._ above both columns | fetching the version list fails |

<StoryEmbed id="history-historycomparison--states" :width="1100" height="740px" />

Messages sit in a bordered box in body text. When the
client hides empty fields, a field that is empty in a version is left out of
that column.

## Keyboard & accessibility

| Key | On a version dropdown |
|---|---|
| Tab | moves to the dropdown |
| Enter / Space | opens it; the [dropdown](./dropdown) keys apply |

- Everything below the headers is read-only and has no controls of its own.
- An added or removed relation chip carries hidden text, _added_ or
  _removed_, so screen readers don't rely on its colour. A renamed relation
  shows _renamed_.
- A changed field value is a chip where the unchanged value is plain text,
  so the change shows without colour. Which side is older is told by the
  dropdown and the _Edited by_ line.
- The diff text colours are the ink variants of danger and success, which
  reach 4.5:1 on their tints.

## Content

- Version labels count up from the oldest version: _Version 1_ is the
  first save.
- Translation keys: `history.view-history`, `history.current-version`,
  `history.current-version-number`, `history.version-label`,
  `history.version-label-undated`, `history.edited-by`, `history.added`,
  `history.removed`, `history.renamed`, `history.no-items`,
  `history.no-history`, `history.no-previous-versions`,
  `history.version-load-error`, `history.versions-load-error`.

## Related

[Field row](./field-row) · [Chip & badge](./chip-and-badge) ·
[Dropdown](./dropdown) · [Panel & block shells](./panel-and-block-shells) ·
[Comments](./comments)
