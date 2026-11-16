---
title: Toggle
---

# Toggle

Switches between a few ways of showing the same content, such as the list's
view mode.

<StoryEmbed id="base-basetogglegroup--default" />

## When to use

- Choosing one of a few views of the same results: _List view_,
  _Grid view_, _Table view_.
- Choosing one display option that applies straight away, such as the card
  size of the grid view: _Large_ or _Compact_.

## When not to use

- **An option that is saved with a form:** use a [checkbox](./checkbox).
- **Many options, or options with long labels:** use a
  [dropdown](./dropdown).
- **An action:** use a [button](./button). A toggle segment never runs
  anything; it only changes what is shown.

## Anatomy

1. **Group:** one capsule with a `--color-border-default` border,
   `--radius-input` corners and a `--color-surface` fill. The segments sit
   side by side without gaps.
2. **Segment:** a button `--view-switch-size` high. An icon segment is
   square; a text segment has `--view-switch-text-pad` on each side and a
   bold `--text-ui` label.
3. **Active segment:** `--color-accent-wash` fill with `--color-accent-ink`
   icon or text. Inactive segments use `--color-text-secondary`.
4. **Tooltip (icon segments):** the segment's label, shown under it on hover
   and focus.

## Variants

| Variant | Where | Segment content |
|---|---|---|
| Icon segments | the view-mode switch in the list toolbar | an icon, named by its label (_Grid view_) |
| Text segments | the card-size switch next to it, in grid view | a short visible label (_Large_, _Compact_) |
| Single icon toggle | — | one square icon button that swaps its icon when on |

<StoryEmbed id="base-basetogglegroup--text-segments" />

Exactly one segment of a group is on. Turning a segment on turns the others
off. If the page sets none, the first segment turns on. The view-mode switch
only shows the views the entity type allows, in the configured order.

## States

| State | What you see | Trigger |
|---|---|---|
| Off | no fill, secondary ink | — |
| Hover (off) | `--color-surface-row-hover` fill; icon segments show their tooltip | pointer |
| On | accent wash fill, accent ink | click, Enter or Space |
| Focus | `--focus-ring-width` ring in `--color-focus-ring` on the segment | keyboard |

<StoryEmbed id="base-basetogglegroup--states" />

Segments have no disabled state.

## Keyboard & accessibility

| Key | Action |
|---|---|
| Tab / Shift+Tab | moves to the next or previous segment; each segment is its own stop |
| Enter / Space | turns the focused segment on |

- The group is a `role="group"` with an `aria-label`: _View_ for the view
  mode switch, _Card size_ for the card-size switch.
- Each segment is a native `<button>` with `aria-pressed`, so the segment that
  is on is announced as pressed.
- **Icon segments need a label:** it becomes the segment's `aria-label` and
  its tooltip.
- Arrow keys do not move between segments.
- The focus ring is cut off at the top and bottom edge of the group, so only
  its sides show.
- The single icon toggle is not a button: Tab does not reach it and it has
  no accessible name. Use a group or a [button](./button) instead.

## Content

- Label each segment with what it shows, in sentence case: _Grid view_,
  _Compact_.
- Text segments hold one short word; longer choices belong in a dropdown.
- Name the group after the choice, not the control: _Card size_, not
  _Size toggle_.
- Translation keys: `library.view-mode`, `library.view-modes.*` and
  `library.grid-size.*`.

## Related

[Button](./button) · [Checkbox](./checkbox) · [Tooltip](./tooltip) ·
[Icons](./icons) · [Accessibility](./accessibility)
