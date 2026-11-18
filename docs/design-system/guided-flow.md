---
title: Guided flow
---

# Guided flow

A dialog that creates linked records step by step, and lists what it added.

<StoryEmbed id="repetitiveform-guidedflow--default" height="600px" />

## When to use

- Records that belong together and are created in one go: a person and their
  role, a work and its expression.
- Adding several of the same chain in a row, such as a list of authors.
- Picking existing records and linking them to the page you are on.

## When not to use

- **One record on its own:** use a [dynamic form](./dynamic-form).
- **Changing existing records:** edit them in place in their
  [field rows](./field-row).

## Anatomy

1. **Dialog:** a [modal](./modal) on `--radius-overlay`, with the same header
   band as every modal (`--color-surface-panel-header`, padding
   `--panel-header-pad`): the flow's name, then the step strip, then a close
   button.
2. **Step strip:** one chip per step, _1. Person_, _2. Role_, with
   `--chip-padding`. The current step is filled `--color-accent-dark` with
   `--color-text-on-accent`; a done step is white with a check; steps to come
   are faded.
3. **Step card:** the current step on `--color-surface-group-form`,
   `--radius-card`. It holds a [dynamic form](./dynamic-form) to create the
   record, or an [entity picker](./entity-picker) to choose existing ones,
   with _Create new_ above it. A picker step has no card around it.
4. **Added this session:** on wide screens a rail beside the card,
   `--guided-flow-rail-width` wide; on narrow screens it moves under the card.
   Newest first, one row per finished chain: a success check, each step's
   label and record, and a remove button. The newest row also has _Undo_.
5. **Footer:** _Previous step_ (ghost) on the left, _Save and close_ (commit)
   on the right.

## Variants

| Variant | Where | What changes |
|---|---|---|
| Repeating | adding several chains, such as authors | after the last step it starts again at step 1; the rail collects every chain |
| Single chain | one chain only | after the last step the card says _This item is complete. Save and close to finish._ |
| With finalize | a container record linked to every chain | _Save and close_ opens one more form that creates it |
| Straight through | one pass, such as work → expression → manifestation | no rail and no _Save and close_; the last step ends the flow and opens the record |

<StoryEmbed id="repetitiveform-guidedflow--later-step" height="600px" />

A step is either a create step or a picker step. A create step shows only
the form. A picker step lists the existing records: pick one or more and
_Confirm selection_ links them. _Create new_ above the list switches to the
step's form, with _Back to search_ to return to the list.

<StoryEmbed id="repetitiveform-guidedflow--picker-step" :width="800" height="560px" />

Each step saves as you go: _Create_ in a step creates the record at once, and
picking records links them straight away. Moving on to the next step needs no
extra button.

## States

| State | What you see | Trigger |
|---|---|---|
| First step | step 1 filled, no _Previous step_ | the flow opens |
| Later step | done steps checked, _Previous step_ shown | a step is finished |
| Chain in progress | _Save and close_ disabled, with a help icon: _Finish or go back from the current item first_ | a chain has started but is not finished |
| Chain saved | a new row on top of the rail, with _Undo_ | the last step is finished |
| Rail empty | _Nothing created yet._ | nothing finished yet |
| Undone | the row disappears; the records that chain created are deleted | _Undo_ |
| Working | a blocking overlay over the dialog; _Save and close_ shows a spinner | linking or saving |

<StoryEmbed id="repetitiveform-guidedflow--rail-states" />

_Undo_ is offered only on the newest row, and only while no other chain is in
progress. It deletes only records the chain created; picked records stay. A row
without created records has a remove button only, which takes it off the list.

## Keyboard & accessibility

- The dialog is a native `<dialog>`, named by its title. Focus stays inside it.
- Escape and the close button close it. When something was added, it asks
  first: _Leave guided flow_, with _Leave_ and _Cancel_. Records already
  created stay.
- The current step chip has `aria-current="step"`; a done step adds
  _(completed)_ for screen readers.
- The rail is a `role="log"` with `aria-live="polite"`, so a new row is
  announced.
- _Undo_ is named _Undo {record}_, the remove button _Remove {record}_.

## Content

- The title names the task: _Add authors_.
- Step labels are short nouns: _Person_, _Role_.
- Translation keys live under `repetitiveForm.*`, for example
  `repetitiveForm.save-and-close` and `repetitiveForm.created-this-session`.

## Related

[Dynamic form](./dynamic-form) · [Entity picker](./entity-picker) ·
[Modal](./modal) · [Button](./button)
