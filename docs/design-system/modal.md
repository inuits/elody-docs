---
title: Modal
---

# Modal

A dialog over a dimmed page, for a task or a decision that needs full
attention.

<StoryEmbed id="modals-basemodal--default" :width="800" height="560px" />

## When to use

- Creating or picking something without leaving the page: a form, a picker.
- Confirming an action that cannot be undone, or leaving a form with unsaved
  changes. Use the confirm dialog.
- A delete that must first show which related records go with it.

## When not to use

- **Editing a single field:** edit it in place, with a
  [text input](./text-input) or another field control.
- **Help or hints:** use a [tooltip](./tooltip) or the info panel.
- **Choosing an action:** use an [overflow menu](./overflow-menu).
- **A wait without a decision:** show [loading](./loading) in the region
  itself.

## Anatomy

1. **Scrim:** `--color-scrim` over the page behind.
2. **Container:** `--shadow-modal`; centred dialogs have `--radius-overlay`
   corners. Below 48rem the dialog fills the screen, without corners.
3. **Header:** the panel-header band (`--panel-header-pad`) with the title in
   bold `--text-panel-title`, optional extra controls, and a close button (✕)
   at the end. On small screens the close button is `--touch-target-min`
   square. Without a title the header holds only the close button.
4. **Body:** the task itself, such as a form with its own action button at
   the end. It scrolls when its content is taller than the dialog. The modal
   adds no buttons of its own.
5. **Footer (confirm dialog):** a top border, `--modal-footer-pad`, buttons
   aligned right. The message above it uses `--modal-body-pad`.

## Variants

| Variant | Shape | Where |
|---|---|---|
| Centred | centred, height capped | forms, pickers, the confirm dialog |
| Centred wide | centred, wider and taller | large pickers, the delete dialog |
| Side panel | full height, against the right edge | forms and pickers that sit beside the page |
| Side panel wide | the same, wider | saved searches, media |
| Confirm dialog | centred, title, message and buttons | decisions |
| Inline confirm | a button pair inside a dialog's content | the end of the delete dialog |

**Confirm dialog.** A title, an optional message and up to three buttons, from
left to right: _Cancel_ (ghost), an optional second choice and the confirm
action (both danger by default). The second choice offers a way out that is
not cancelling, such as _Save changes and leave editor_ in the commit colour.
Asking a new question while one is open cancels the first.

<StoryEmbed id="base-confirmmodal--default" :width="800" />

**Inline confirm.** A confirm button (danger) and a cancel button (secondary)
side by side, sharing the width, in the small size. The delete dialog ends with
it, under any related records that are deleted along with the record.

<StoryEmbed id="base-inlineconfirmbuttons--default" />

## States

| State | What you see | Trigger |
|---|---|---|
| Open | scrim and dialog; the page behind cannot be reached or scrolled | an action opens it |
| Busy | a translucent layer with a spinner and a message covers the dialog | a long operation runs |
| Asking to leave | a confirm dialog on top: _Leave form_ | closing a form with unsaved changes |
| Confirming (inline) | spinner in the confirm button; cancel is disabled | the delete runs |
| Closed | dialog and scrim disappear | close button, Escape, a cancel button, or the task completes |

<StoryEmbed id="modals-basemodal--busy" :width="800" />

A click on the scrim does not close the dialog.

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab / Shift+Tab | moves between the controls of the dialog only |
| Escape | closes the dialog; in a confirm dialog it counts as _Cancel_ |
| Enter / Space | runs the focused button |

- It is a native modal `<dialog>`: the page behind is inert while it is open.
- The title names the dialog (`aria-labelledby`). **Always give a title**;
  without one the dialog has no name.
- The close button is named _Close_.
- On open, focus goes to the first focusable element, which is the close
  button. A confirm dialog moves focus to _Cancel_, so Enter never confirms a
  destructive action by accident.
- Closing a confirm dialog with ✕ or Escape counts as _Cancel_.
- A confirming inline button is `aria-busy="true"`; see [Button](./button).

## Content

- The title says the action or asks the question: _Delete permanently?_,
  _Leave form_.
- The message says what happens: _You're deleting 'Annual report' (Asset)
  permanently. This can't be undone._
- Buttons name the action with a verb: _Delete permanently_, _Leave editor_.
  Never _OK_ or _Yes_.
- The cancel button is _Cancel_.

## Related

[Button](./button) · [Loading](./loading) · [Tooltip](./tooltip) ·
[Accessibility](./accessibility)
