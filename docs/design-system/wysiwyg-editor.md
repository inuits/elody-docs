---
title: WYSIWYG editor
---

# WYSIWYG editor

A rich-text field: formatted text that is edited in place, as a whole.

<StoryEmbed id="entityelements-wysiwygfield--default" />

## When to use

- Long, formatted text: descriptions, transcriptions, annotations.
- Text that tags other records inline, such as people or places.

## When not to use

- **Short plain text:** use a [field row](./field-row) with a
  [text input](./text-input).
- **Titles and identifiers:** they are plain text.

## Anatomy

1. **Label line:** the label, then what the field offers: the on-screen
   keyboard button (while editing, when the field has keyboard layouts), the
   transliteration toggle (at rest), the language picker, and the actions.
   At rest the action is a pencil in `--color-text-subtle`; while editing it
   is ✓ (commit) and × (secondary). They sit on the label line so they stay
   in view however long the text is.
2. **Toolbar (while editing):** the buttons the field's extensions provide.
   The full set is _Paragraph_, _H1_–_H6_, bullet list, ordered list, code
   block, _Blockquote_, horizontal rule, _Hard break_, **B** and _I_. A field
   with tagging adds _Tag_ or a button per tagging flow. The button for the
   current format is filled with the accent colour.
3. **Content:** the editor, with a `--color-border-default` border on
   `--radius-input`. Editable content gets the `--color-surface-editable-hover`
   wash on hover.
4. **Under the content (while editing):** an error message in
   `--color-danger` when saving fails, and the hint
   _Ctrl+Enter saves · Esc cancels_ in `--text-hint`, `--color-text-muted`.

## Variants

| Variant | Where | What changes |
|---|---|---|
| Field | in a panel's field list | label line like a field row, content below |
| Panel | a field shown as its own panel | a header with the label as title and the actions on the right; a taller editor |
| Line numbers | transcriptions | a number before each paragraph |
| Multilingual | fields with a value per language | a language picker; while editing, a chip names the language being edited |

<StoryEmbed id="entityelements-wysiwygfield--panel" height="380px" />

**Transliteration** shows the text in another script, such as Latin for Arabic
text. It only changes the view: it is hidden while editing, and editing starts
from the stored text.

**The on-screen keyboard** inserts characters at the cursor, for scripts and
diacritics a regular keyboard lacks. Which layouts it offers is configured per
field.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting, editable | content and a pencil; hover wash on the content | — |
| Resting, read-only | content only | no edit permission, or the field is locked |
| Editing | toolbar, ✓ and ×, the hint; the editor has a focus border | the pencil, or a click on the content |
| Saving | a spinner in place of ✓ and × | ✓, Ctrl+Enter, or leaving a changed field |
| Error | _Saving failed, try again_ under the content; the editor stays open | the save fails |
| Saved | read-only again; _Saved_ is announced | the save succeeds |

<StoryEmbed id="entityelements-wysiwygfield--states" height="300px" />
<StoryEmbed id="entityelements-wysiwygfield--editing" height="380px" />
<StoryEmbed id="entityelements-wysiwygfield--saving" height="340px" />
<StoryEmbed id="entityelements-wysiwygfield--save-failed" height="360px" />

## Keyboard & accessibility

| Key | While editing |
|---|---|
| Enter | new paragraph |
| Ctrl/Cmd+Enter | saves |
| Escape | cancels and restores the text from before editing |
| Ctrl/Cmd+B, Ctrl/Cmd+I | bold, italic |

- Leaving the field saves it: a click outside, or Tab to something outside.
  An unchanged editor just closes. The toolbar, tag suggestions and the field's
  own dialogs count as inside.
- A click on a tagged record opens that record instead of starting editing,
  and selecting text doesn't start editing either.
- Only one field is edited at a time; opening another one saves this one
  first.
- The pencil is named _{label}, edit_; ✓ and × are named _Save {label}_ and
  _Cancel {label}_.
- A save is announced in a `role="status"` region; an error is a
  `role="alert"`.

## Content

- Keep the toolbar to what the field needs: configure only the extensions it
  uses.
- Saving sends only this field, in the language being edited.
- Translation keys: `inline-edit.save`, `inline-edit.cancel`,
  `inline-edit.edit-field`, `inline-edit.hint-textarea`, `inline-edit.saved`,
  `inline-edit.save-failed`.

## Related

[Field row](./field-row) · [Inline editor](./inline-editor) ·
[Text input](./text-input) · [Tooltip](./tooltip)
