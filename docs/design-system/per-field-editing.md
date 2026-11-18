---
title: Per-field editing
---

# Per-field editing

How a detail page is edited: one field at a time, saved on its own, right
where it is shown.

<StoryEmbed id="entityelements-entityelementwindowpanel--independent-rows" />

## When it applies

- Every editable value on a detail page or in a preview: a
  [field row](./field-row), a WYSIWYG field, coordinates, a relation stored on
  the entity, and each field of a [repeatable row group](./repeatable-row-group).
- An editable value on a list row: a value stored on the relation between the
  row and the page's entity (a contact person's role), or a row value whose
  list is configured for it.
- Not when the entity type turns on the page-wide edit mode; see rule 7.
- Not for creating an entity: that is a form, such as a
  [dynamic form](./dynamic-form).

## How it works

1. **Edit scope = save scope = validation scope.** Each editable value is its
   own scope, so nothing you did not touch is ever sent or checked. Saving
   sends only that field's key (in the selected language for a multilingual
   field), or only the relations that were added, removed or changed. Only
   that field's rules run.
2. **One scope is open at a time.** Two open editors would raise the question
   which one a save belongs to. Opening another value saves the changed one
   first. If that save fails, the changed field stays open with its error,
   and the other value does not open. An unchanged editor
   just closes. Clicks made while a save runs count once: the last one opens.
3. **Leaving a field saves it.** There is no separate save step to forget. A
   click outside or focus moving away saves a changed value and closes an
   unchanged one. Enter (Ctrl+Enter in a textarea) saves, Escape cancels and
   restores the stored value.
4. **Leaving the record saves the open field.** A change is never dropped
   silently. Navigating to another page or record first saves a changed field,
   and you only leave when that save worked; if it fails you stay, with the
   error on the field. A changed query or hash on the same record (paging a
   related list, switching a tab) is not leaving, so it never saves or asks.
5. **A save is confirmed at the field.** The feedback appears where you
   looked. The pencil turns into a check for 2 seconds, the panel header shows
   the same check, _Saved_ is announced, and the _Entity successfully Updated_
   notification shows. See [Feedback](./feedback).
6. **A scope ends with its field.** Otherwise one invisible open editor would
   lock every other field. When a field disappears with its editor open (a
   refetch, paging, a closed panel), its scope is released.
7. **The page-wide edit mode is the exception.** Some entity types still edit
   all fields at once; this stays off unless the entity type's page config
   turns it on. Then an _Edit metadata_ button in the page header switches
   every row to its form input, nothing is editable in place, and a bar at the
   bottom of the page offers _Save_ and _Cancel_ (and _Delete_ when allowed).
   Cancel, or leaving with unsaved changes, asks in a
   [confirm dialog](./modal): _Leave editor_, _Save changes and leave editor_
   or _Cancel_.

Removing a saved row of a repeatable row group also takes the edit scope, so
no field saves while the rows shift, and it asks for confirmation first: the
row's values are lost.

## Components

| Component | Role in this pattern |
|---|---|
| [Field row](./field-row) | shows the value and the editable cue; opens the scope; shows the saved check |
| [Inline editor](./inline-editor) | the input, save and cancel buttons and error message of the open scope |
| [Panel & block shells](./panel-and-block-shells) | the panel header repeats the saved check of any row inside it |
| [Repeatable row group](./repeatable-row-group) | each field in a row is its own scope; removing a row takes the scope |
| [WYSIWYG editor](./wysiwyg-editor) | a rich-text field is its own scope; the editor stays mounted and only turns editable |
| [Modal](./modal) | the confirm dialog of the page-wide edit mode and of removing a row |

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab | moves to an editable value; out of an open editor, saves a changed value |
| Enter / Space | on a value: opens its editor |
| Enter | in an editor: saves; with nothing changed, closes |
| Ctrl+Enter / ⌘+Enter | saves a textarea |
| Escape | cancels and restores the stored value |

- An editable value is a `role="button"` named _{label}, edit_.
- When an editor opens, its input gets focus. After save or cancel, focus goes
  back to the value, unless you already moved it on.
- Errors are `role="alert"`; a successful save is announced as _Saved_ through
  a `role="status"` region. The checks themselves are decorative.

## Content

- A failed save reads _Saving failed, try again_; validation messages name the
  field: _Title is required_.
- The page-wide edit mode's dialog: _Discard edit_, _Are you certain you wish
  to leave the entity editor? Any unsaved changes will be discarded._
- Translation keys: `inline-edit.*`, `confirm.discard-edit.*` and
  `metadata.labels.edit-metadata`.

## Related

[Field row](./field-row) · [Inline editor](./inline-editor) ·
[Repeatable row group](./repeatable-row-group) · [Feedback](./feedback) ·
[History diff](./history-diff)
