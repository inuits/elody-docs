---
title: Feedback
---

# Feedback

What people see after they act: that it is running, that it worked, or what
went wrong.

<StoryEmbed id="components-notification--after-an-action" />

## When it applies

- After every action that changes data: saving a field, a form or a bulk
  edit, creating, deleting, importing, exporting.
- Before an action that loses data, as a question.
- While an action runs and the result is not there yet.

## How it works

1. **Show it running where it was started.** Otherwise people click again.
   A button that starts an action shows its loading state: a spinner and
   `aria-busy`, and a second click is ignored until the action ends. An
   editor shows a spinner in place of its buttons while it saves.
2. **Block only long operations, and say what is happening.** A bulk edit,
   a merge, a CSV export or a guided flow puts a
   [blocking overlay](./loading) over the app, or over the open dialog only,
   with a one-line message. Shorter waits never block.
3. **Confirm a result at the place it happened, and in a notification.** A
   saved field shows its check on the row and in the panel header for 2
   seconds and announces _Saved_; see [Per-field editing](./per-field-editing).
   Record-level results (created, updated, deleted, _{n} entities were
   updated_) show a notification.
4. **Keep errors next to their cause.** An invalid value shows its message
   under the input, and a refused field save shows _Saving failed, try again_
   in the editor, which stays open with the value kept. Only errors without a
   place go to an error notification: a server error, or an action that
   failed as a whole (_Something went wrong_).
5. **Ask only before real loss.** A question every time trains people to
   click _OK_. A [confirm dialog](./modal) comes before deleting a record, a
   comment or a saved search, removing a saved row, a bulk change, and
   leaving a form or the page-wide edit mode with unsaved changes. Editing a
   field never asks: leaving it saves. Logging out and creating an entity
   from a dropdown also ask today.
6. **Notifications tell, they do not ask.** A notification has no buttons
   and nothing depends on reading it. Undo does not exist; an action that
   cannot be taken back asks first (rule 5).

### Notifications

| Type | Look | Used for |
|---|---|---|
| Success | inverted surface | a result: saved, created, deleted, exported |
| Warning | inverted surface, `--color-warning` bar on the left | a partial result or a job still running: _Saving failed_ for a form with errors, skipped items in a bulk edit |
| Error | inverted surface, `--color-danger` bar on the left | a failure without a place on screen |

<StoryEmbed id="components-notification--types" />

- They stack in the top right, newest on top, `--shadow-toast`,
  `--radius-overlay`, title in bold.
- They disappear after 10 seconds. A click closes one sooner. Hovering does
  not pause them.
- A persistent notification stays until the work ends, such as a running job
  or an export that is being prepared, and is then replaced by its result.
- While a dialog is open, notifications show on top of it.
- Two special ones sit in their own group: a new app version (the whole
  notification is clickable and reloads the page), and an announcement a
  tenant configures, which stays until closed.

## Components

| Component | Role in this pattern |
|---|---|
| Notification | success, warning and error messages (`useBaseNotification`) |
| [Button](./button) | the loading state of the action that runs |
| [Loading](./loading) | the blocking overlay for long operations |
| [Modal](./modal) | the confirm dialog before real loss |
| [Field row](./field-row) | the saved check and the _Saved_ announcement |
| [Inline editor](./inline-editor) | the saving spinner and the error message of a field |

## Keyboard & accessibility

- A loading button is disabled and `aria-busy="true"`.
- The blocking overlay is `role="alert"` with `aria-busy="true"`; its message
  is what screen readers hear.
- A field's error is `role="alert"`; a field's save is announced through a
  `role="status"` region.
- **Notifications are not announced by screen readers** and cannot be closed
  from the keyboard. Anything a person must know therefore also shows in
  place (rules 3 and 4).
- A confirm dialog puts focus on _Cancel_, so Enter never confirms a loss by
  accident.

## Content

- A notification title says what happened, a short sentence in the past
  tense: _Entity successfully created_. The text adds the detail:
  _{n} entities were updated_.
- An error says what failed and, when possible, what to do: _Saving failed,
  try again_.
- A confirm dialog names the action on its button: _Delete permanently_,
  _Remove_, _Leave editor_. Never _OK_ or _Yes_.
- Translation keys: `notifications.success.*`, `notifications.warning.*`,
  `notifications.errors.*`, `inline-edit.saved`, `inline-edit.save-failed`
  and `confirm.*`.

## Related

[Per-field editing](./per-field-editing) · [Action discovery](./action-discovery) ·
[Loading](./loading) · [Modal](./modal) · [Button](./button)
