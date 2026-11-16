---
title: Dynamic form
---

# Dynamic form

A form built from configuration: its fields in order, then one action button.

<StoryEmbed id="repetitiveform-dynamicform--default" height="380px" />

## When to use

- Creating a record from a modal or drawer: _Create asset_, _Create tag_.
- Uploads, imports and downloads that need a few values first.
- A step in a [guided flow](./guided-flow) that creates a record.

## When not to use

- **Changing one value of an existing record:** edit it in place in its
  [field row](./field-row).
- **Records that are created together and linked:** use a
  [guided flow](./guided-flow).

## Anatomy

1. **Title (optional):** the form's label as a page title. In a modal
   without steps, the label is the modal title instead.
2. **Info line (optional):** a short explanation under the title.
3. **Fields:** one per configured field, in configured order. Each is a
   label over its input, the same as a [field row](./field-row) in edit
   mode. A required field has a red asterisk after its label.
4. **Action button:** always last, whatever the configured order. A full-width
   commit [button](./button) with an optional icon. Upload actions use the
   [upload](./upload) button and progress banner instead.
5. **Error line (optional):** the server's message under the button when the
   action fails.

In a modal, the upload button sits in a sticky zone at the bottom, above a
`--color-border-subtle` line, so it stays in view while the fields scroll.

## Variants

| Variant | Where | What changes |
|---|---|---|
| Single form | most create and action forms | fields and one action button |
| Steps | a form with more than one tab | a numbered step strip on top; a _Next_ action moves to the next step, the last step creates the records |
| With upload | upload and import forms | a dropzone between the fields, an upload button with progress |
| With picker | relation forms | an [entity picker](./entity-picker) as one of the fields |

<StoryEmbed id="repetitiveform-dynamicform--steps" />

**Steps can't be clicked.** The strip only shows where you are: the current
step is a filled accent circle with a bold label, done steps are a light accent
circle, steps to come are grey. _Next_ validates the current step before it
moves on.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | skeleton blocks, or a spinner for an unknown form | the form opens |
| Ready | empty or prefilled fields, button enabled | loaded |
| Errors | a message under each invalid field; the button is disabled until they are fixed | the button is pressed with invalid fields |
| Working | the button shows a spinner; other action buttons are disabled | the action runs |
| Failed | an error notification, or the server's message under the button; the values stay | the action fails |
| Done | a success notification; the modal closes or the new record opens | the action succeeds |

<StoryEmbed id="repetitiveform-dynamicform--states" height="400px" />

Fields are not validated while you fill them in for the first time, unless a
field is set to validate as you type. After the first press of the button,
every change validates again, and the button enables as soon as the last error
is fixed.

## Keyboard & accessibility

- Every input is a native field or a design-system input: Tab follows the
  configured order and ends on the action button.
- An error message sits directly under its field.
- One action runs at a time: pressing the button again while it works does
  nothing.
- Closing a modal with unsaved changes asks first: _Leave form_ with
  _Leave_ and _Cancel_.

## Content

- The action label is a verb for what happens: _Create_, _Upload_,
  _Download_.
- Field labels are nouns, in sentence case: _Title_, _Date of birth_.
- Use the info line only when the form needs it, in one or two sentences.

## Related

[Guided flow](./guided-flow) · [Text input](./text-input) ·
[Tooltip](./tooltip) · [Upload](./upload) · [Modal](./modal)
