---
title: Preview panel
---

# Preview panel

A panel that opens beside a list and shows one record without leaving the list.

<StoryEmbed id="library-viewmodes-viewmodeslist--with-preview" height="340px" />

## When to use

- People scan a list and need a closer look at a record before they open it
  or act on it.
- The list's entity type has a preview configured. Without one, rows have no
  eye and nothing opens.

## When not to use

- **Editing a record:** open its detail page; the preview is for reading.
- **A general sidebar:** the preview only exists next to a list.

## Anatomy

1. **Panel shell:** the same card as a detail panel: `--color-surface`, a
   `--color-border-panel` border, `--radius-card` corners, no shadow. See
   [panel & block shells](./panel-and-block-shells).
2. **Header band:** `--color-surface-panel-header`, `--panel-header-pad`.
3. **Title:** the configured preview title, otherwise the record's title;
   `--text-panel-title`, bold, `--color-text-panel-header`, cut off with an
   ellipsis when too long.
4. **Open detail page (optional):** a small primary [button](./button). It
   shows only when the list opens its records on click.
5. **Close:** a ghost icon button, ×.
6. **Body:** what the configuration asks for: label and value rows, a
   [media viewer](./media-viewer), a [map](./map-viewer) or the record's
   history. Under a viewer, the rows follow after a hairline.

The list and the preview share the width of their container: below 500px they
stack; from 500, 630, 830 and 1024px the split is 40/60, 35/65, 30/70 and
25/75. While the preview is open, the list shows only its first field.

## Variants

| Variant | Body |
|---|---|
| Fields | label and value rows |
| Media | a viewer, then the rows |
| With changes | the record on the left, the changed fields of the record it changes on the right (2 : 3) |
| Small screen | covers the page; a ‹ back button leads the header instead of the ×, and a media viewer fills the screen |

<StoryEmbed id="components-previewwrapper--small-screen" height="260px" />

On a small screen (below 48rem) the preview never opens by itself; only the
row's eye opens it. With more than one media file, a strip of thumbnails under
the viewer replaces the viewer's arrows; the thumbnail on screen is ringed in
the accent colour.

## States

| State | What you see | Trigger |
|---|---|---|
| Closed | the list uses the full width | default |
| Loading | header, and a spinner in the body | the preview's fields are fetched |
| Open | header and body; the row's eye is pressed, the row gets an accent border on the left | the row's eye, or opened by default |
| Switched | the same panel with the next record | another row's eye, or a click on another row while the preview is open |

<StoryEmbed id="components-previewwrapper--states" height="440px" />

Some lists open the preview for their first record when the page loads.

## Keyboard & accessibility

| Key | What happens |
|---|---|
| Enter / Space on a row's eye | opens the preview; focus moves to its header |
| Escape | closes the preview; focus goes back to that row's eye |
| Tab | moves through the header buttons and the body |

- The panel is a `role="complementary"` region named by its title.
- The title is an `aria-live="polite"` region, so switching records is
  announced.
- The close and back buttons have no visible text; their accessible name is
  _Close preview_.
- The eye is a toggle button (`aria-pressed`) named _Open preview_ or
  _Close preview_.
- On a small screen the preview is a `role="dialog"` with `aria-modal`.
- When the preview opens by default on page load, focus stays where it was.

## Content

- The header is the only close. Lists inside a preview have no close of their
  own.
- Translation keys: `preview-component.open-detail-page`,
  `preview-component.open`, `preview-component.close`.

## Related

[Entity list element](./entity-list-element) ·
[Panel & block shells](./panel-and-block-shells) ·
[Media viewer](./media-viewer) · [Button](./button)
