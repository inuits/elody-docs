---
title: Bulk edit
---

# Bulk edit

How people change the same fields on many selected records at once.

<StoryEmbed id="bulkoperations-bulkeditmodal--default" :width="1200" height="480px" />

## When it applies

- A list whose entity type offers a _Bulk edit_ action in its
  [selection action bar](./selection-action-bar). The action needs at least one
  selected item; without a selection it stays disabled, with the reason in its
  tooltip.
- The selection may mix entity types. Each type brings the fields of its own
  form.
- A selection holds at most the tenant's select-all limit.
- Not for one record: edit it on its detail page, see
  [per-field editing](./per-field-editing).
- Not for merging duplicates: see [merge entities](./merge-entities).

## How it works

1. **The action opens a modal with the selection beside one form.** People see
   what they are about to change. The selected items are listed on the left;
   unticking an item takes it out of the selection. The form sits
   on the right, under _Bulk edit_ and the line _Only the fields you fill in
   are changed._ Below 56rem of modal width the list sits above the form.
2. **One form is merged from the forms of every type in the selection.**
   A field shared by all types appears once. A field that only some types have
   shows how far it reaches under it: _Applies to 2 of 3 selected items_.
   When one field behaves differently on some types (another input), the most
   common input wins and a note names the types that are left out. Types
   without a form are named too: _No form is configured for these types, they
   will not be changed_.
3. **Only touched fields are written.** An empty form changes nothing, so
   untouched fields are never sent, required rules are dropped and no default
   value is filled in. Each record only gets the fields its own type has. If
   nothing was touched, _Apply_ only warns: _No changes_.
4. **Emptying a field is its own action.** An empty input reads as "leave
   alone", so clearing needs intent. The trash button next to a field marks it
   for emptying: the input dims and the button turns into _Undo emptying_. A
   field that every type requires has no trash button.
5. **For relations, people choose what happens.** Picked relations can mean
   three things, so the form asks above the fields: _What should happen to the
   relations you pick below?_ The choices are _add to the existing ones_ (the
   default), _replace the existing ones_ and _remove from the existing ones_,
   each with a one-line explanation. Emptying a relation field removes all
   relations of that type. The question only shows when the form has a
   relation field.
6. **Apply asks first.** A bulk change is hard to undo. A
   [confirm dialog](./modal) sums it up: _You are about to change 2 field(s)
   on 3 selected entities. Chosen relation action: replace the existing ones._
7. **While it runs, the modal is blocked.** A spinner and _Applying your
   changes, this may take a while..._ cover the modal, so nothing changes
   halfway.
8. **The result tells per record what happened.** Records that succeeded
   leave the selection and the list reloads. When all succeeded, the modal
   closes with _Entities successfully updated_. Records that failed stay
   selected and the modal stays open, with _Bulk edit partially failed_.
   Records that have none of the changed fields are left alone and reported
   as _Items skipped_.

<StoryEmbed id="bulkoperations-bulkeditmodal--changed" :width="1200" height="480px" />

Above: a description typed in, _Rights statement_ marked for emptying and the
relation choice set to replace.

<StoryEmbed id="bulkoperations-bulkeditmodal--confirm" :width="1200" height="480px" />
<StoryEmbed id="bulkoperations-bulkeditmodal--applying" :width="1200" height="480px" />

## Components

| Component | Role in this pattern |
|---|---|
| [Selection action bar](./selection-action-bar) | holds the _Bulk edit_ action and its disabled reason |
| [Modal](./modal) | the wide modal around the list and the form; the confirm dialog before applying |
| [Entity list element](./entity-list-element) | the selected items, with their checkboxes |
| [Dynamic form](./dynamic-form) | renders the merged fields and the _Apply_ button |
| [Field row](./field-row) | each field's label and input, with the trash button beside it |
| [Dropdown](./dropdown) | the relation choice |
| [Feedback](./feedback) | the blocking overlay and the result notifications |

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab | moves through the list, the relation choice, the fields, their trash buttons and _Apply_ |
| Enter / Space | on a trash button: marks the field for emptying, or undoes it |
| Escape | closes the modal; nothing is applied |

- The trash button is named _Empty field_, or _Undo emptying_ once pressed.
- The blocking overlay is a `role="alert"` region, so its message is
  announced.

## Content

- Intro: _Only the fields you fill in are changed. For relations, choose
  whether they are added, replaced or removed._
- Relation explanations: _The relations you pick are added. Existing relations
  stay._ · _The relations you pick replace every existing relation of that
  same type._ · _The relations you pick are removed wherever they occur. Use
  'Empty field' to empty a whole field._
- Notifications: _No changes_ · _Entities successfully updated_ · _Items
  skipped_ · _Bulk edit partially failed_.
- Translation keys: `bulk-operations.bulk-edit*`,
  `bulk-operations.relation-mode.*`, `bulk-operations.field-partial-scope`,
  `bulk-operations.clear-field`, `bulk-operations.keep-field`,
  `confirm.bulk-edit.*`, `modals.bulkEditingEntities`.

## Related

[Selection action bar](./selection-action-bar) ·
[Merge entities](./merge-entities) · [Dynamic form](./dynamic-form) ·
[Per-field editing](./per-field-editing) · [Feedback](./feedback) ·
[Modal](./modal)
