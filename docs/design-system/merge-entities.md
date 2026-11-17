---
title: Merge entities
---

# Merge entities

How people fold a duplicate record into the one that remains.

<StoryEmbed id="bulkoperations-mergemodal--default" :width="800" height="640px" />

## When it applies

- Two selected records in a list whose entity type offers _Merge_ in its
  [selection action bar](./selection-action-bar).
- The action is configured to need exactly two records of the same type.
  Otherwise it stays disabled and its tooltip says why: _Select exactly 2
  items to use this action._ or _The selected items are of a different type
  and cannot be merged._
- Not for changing many records: see [bulk edit](./bulk-edit).

## How it works

1. **First choose the record that remains.** Everything else follows from
   it. Under _Which record should remain?_ each record is a radio button with
   its title; the first selected record is chosen by default. The other record
   is deleted after the merge.
2. **A suggestion can point at the right record.** Picking the wrong survivor
   can bring the duplicate back on the next import. When the entity type
   configures a survivor suggestion, each record gets a hint: _Recommended_ in
   green, or a neutral reason such as _Identifier should be OST-1950-014_.
   The configuration can also select the recommended record by itself, and
   can require it: choosing the other record then disables _Merge_ and says
   why under the button.
3. **Only fields that differ are shown.** Equal values need no decision. The
   table lists the editable fields of the surviving record whose values
   differ between the two; two empty values count as equal. The `id` field and
   relation fields are not in the table. When nothing differs it reads _These
   records have no differing values._
4. **Each row keeps one value.** The table has a column per record, the
   survivor on the left, and a radio button on each value. The survivor's
   value is chosen until another is picked. Each column header links to that
   record's detail page in a new tab. Choosing another survivor swaps the
   columns and resets every choice, so no pick silently flips sides.
5. **Fields that identify a record are locked.** Two different identities
   cannot become one. When both records carry a different identity in such a
   field, its row is shaded, its radio buttons are disabled and a lock
   explains: _This field cannot be changed, so the surviving record keeps its
   own value._
6. **Relations are carried over, not chosen.** Nothing links to a deleted
   record. The merge moves the other record's relations to the survivor, and
   points records that link to the deleted one at the survivor. When there are
   such records, a line counts them: _3 linked record(s) will be moved to the
   surviving record._
7. **The loss is stated before the button.** The modal ends with _The other
   record will be permanently deleted._ in the danger colour, right above
   _Merge_ and _Cancel_; there is no extra confirm dialog.
8. **The result lands on the survivor.** While the merge runs, a spinner and
   _Merging the records, this may take a while..._ block the modal. On
   success _Records merged_ shows, the modal closes, the selection is cleared
   and the surviving record's detail page opens. On failure _Merge failed_
   shows and the modal stays open.

<StoryEmbed id="bulkoperations-mergemodal--values-chosen" :width="800" height="640px" />

Above: the survivor's title and creator replaced by the other record's.

<StoryEmbed id="bulkoperations-mergemodal--recommended" :width="800" height="640px" />

Above: a suggestion selected the recommended record; the inventory number
is locked.

<StoryEmbed id="bulkoperations-mergemodal--blocked" :width="800" height="680px" />

Above: the other record chosen while the recommended one is required.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | the title and a spinner | both records are fetched |
| Ready | survivor choice, the table of differences, the notes and the buttons | records loaded |
| No differences | _These records have no differing values._ instead of the table | all compared values are equal |
| Blocked | _Merge_ disabled, the reason under it in the danger colour | a required recommendation is not chosen |
| Merging | spinner and message over the modal | _Merge_ pressed |

If the records cannot be loaded, the modal closes with _Merge failed_.

## Components

| Component | Role in this pattern |
|---|---|
| [Selection action bar](./selection-action-bar) | holds _Merge_ and its disabled reason |
| [Modal](./modal) | the wide modal around the choice and the table |
| [History diff](./history-diff) | the same two-column comparison idea, for versions of one record |
| [Tooltip](./tooltip) | explains the lock on a locked field |
| [Button](./button) | _Merge_ (commit) and _Cancel_ (secondary) |
| [Feedback](./feedback) | the blocking overlay and the result notifications |

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab | moves to the survivor choice, each row's choice, the record links and the buttons |
| Arrow keys | change the chosen record, or the chosen value within a row |
| Escape | closes the modal; nothing is merged |

- The survivor choice is a `fieldset` whose legend is _Which record should
  remain?_.
- Every choice is a native radio button with its value as its label.
- The blocking overlay is a `role="alert"` region, so its message is
  announced.

## Content

- Title _Merge records_; intro _Choose which value to keep for each field.
  Fields with the same value are not shown._
- An empty value reads _(empty)_.
- Translation keys: `bulk-operations.merge-modal.*`,
  `notifications.success.merge-entities.*`,
  `notifications.errors.merge-entities.*`, `modals.mergingEntities`,
  `tooltip.bulkOperations.*`.

## Related

[Selection action bar](./selection-action-bar) · [Bulk edit](./bulk-edit) ·
[History diff](./history-diff) · [Modal](./modal) · [Feedback](./feedback)
