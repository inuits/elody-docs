---
title: Loading
---

# Loading

Shows that content is on its way or that an operation is still running.

<StoryEmbed id="components-spinnerloader--default" />

## When to use

- **Spinner:** a short wait inside a region, such as a panel, a preview, a map or a
  count that is being fetched.
- **Skeleton:** content with a known shape is loading: the first page of a
  list, a level of a folder tree, a form.
- **Blocking overlay:** a long operation that must not be interrupted, such as
  a bulk edit, a merge or a reorder. Give it a message.

## When not to use

- **A list or a set of options:** use a skeleton. A spinner says nothing about
  what is coming.
- **The action of a button:** use the button's own loading state. See
  [Button](./button).
- **The whole app when one dialog is busy:** the overlay inside a dialog covers
  only that dialog. See [Modal](./modal).

## Anatomy

1. **Spinner ring:** a light track with one coloured edge, rotating once every
   `--spinner-duration`. On surfaces the edge is `--color-commit` and the track
   `--color-accent-light`. Inside a filled control the edge follows the text
   colour, so it stays visible on any fill. Large rings get a thicker stroke.
2. **Skeleton blocks:** neutral placeholder blocks in the shape of the content,
   pulsing slowly. A list row has a checkbox square, a thumbnail and two text
   lines.
3. **Blocking overlay:** a translucent light layer over the region, a large
   surface spinner in the middle and an optional message under it.

## Variants

| Variant | Where |
|---|---|
| Spinner, surface | panels, previews, viewers, overlays, counts |
| Spinner, inherited colour | inside filled controls, such as a loading button |
| List skeleton | rows of a list while its first page loads |
| Tree skeleton | two rows under a folder that is opening |
| Form skeleton | blocks in the shape of the form's title, fields and upload areas; a spinner when the shape is not known yet |
| Blocking overlay, app | the whole app, while no dialog is open |
| Blocking overlay, dialog | only the open dialog |

<StoryEmbed id="base-listitemskeleton--default" />

## States

| State | What you see | Trigger |
|---|---|---|
| Spinning | the ring rotates continuously | a short wait starts |
| Placeholder | pulsing skeleton blocks | content loads and nothing is shown yet |
| Blocking | translucent layer, spinner and message; clicks do not reach the content | a long operation starts |
| Done | the content replaces the skeleton, or the overlay disappears | loading or the operation ends |

<StoryEmbed id="base-blockingoverlay--default" />

When several operations block at once, the overlay stays until the last one
ends, and it keeps the message of the first.

## Keyboard & accessibility

- The spinner is hidden from screen readers and never announces itself. The
  thing that is loading says so: a loading button is `aria-busy="true"`.
- The blocking overlay is `role="alert"` with `aria-busy="true"`. Its message is
  what screen readers hear, so always give one.
- Skeletons have no role or label of their own.

## Content

- An overlay message says what is happening, in the present tense: _Applying
  your changes, this may take a while..._
- Name the work, not the waiting: _Merging the records_, not _Please wait_.
- Keep it to one short sentence.

## Related

[Button](./button) · [Modal](./modal) ·
[Spacing, shape & motion](./spacing-shape-motion) ·
[Accessibility](./accessibility)
