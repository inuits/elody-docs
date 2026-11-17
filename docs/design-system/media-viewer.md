---
title: Media viewer
---

# Media viewer

Shows a mediafile in the viewer that fits its type, under one shared toolbar.

<StoryEmbed id="components-mediaviewer--with-toolbar" :width="800" height="360px" />

## When to use

- Mediafiles on a record's detail page, in a media panel or in the preview.
- Whenever people need to look closely: zoom into an image, page through a
  PDF, play a recording.

## When not to use

- **Thumbnails in lists and cards:** show the image itself, not a viewer.
- **Actions on the mediafile record** (edit, delete, link): those belong in
  the panel or the list row, not in the viewer toolbar.

## Anatomy

1. **Toolbar:** a white bar over the top of the viewer,
   `--viewer-toolbar-height` high, with a soft shadow. Viewer actions on the
   left, the file arrows in the middle when there are several files, mode
   actions on the right. Below 768px it moves to the bottom of the viewer and
   scrolls sideways when the buttons don't fit.
2. **Viewer buttons:** icon buttons of `--viewer-button-width` by
   `--viewer-button-height`, with a `--color-accent-wash` hover on
   `--viewer-button-radius`. Text buttons such as _Reset_ get
   `--viewer-text-button-padding-x`. A disabled button uses
   `--color-text-disabled`.
3. **Viewer:** the file itself, on a checkerboard background.
4. **File arrows (optional):** _Previous file_ and _Next file_, when the
   record has more than one mediafile.

The viewer is picked from the file's type:

| Type | Viewer |
|---|---|
| image | deep-zoom image viewer (OpenSeadragon, IIIF) |
| PDF | page-by-page PDF viewer |
| text | the text, sanitised, with adjustable size |
| audio, video | the browser's own player |
| external link | the linked page in a frame, or a link to open it |

## Variants

The toolbar shows what the viewer can do:

| Mode | Left | Right |
|---|---|---|
| Image | fullscreen, zoom in, zoom out, rotate, crop tools (when cropping is on), download, recrop, _Show original_ / _Show cropped_ | _Download resized image_, _Reset_ |
| PDF | fullscreen, zoom in, zoom out, download | ‹ page number / count › |
| Text | zoom in, zoom out, download | — |
| Audio, video | download | — |

<StoryEmbed id="components-mediaviewer--modes" :width="800" height="460px" />
<StoryEmbed id="base-pdfviewer--default" :width="800" height="460px" />

- **Image:** drag to pan, scroll to zoom. _Reset_ fits the image again. With
  cropping on, the crop button draws a selection and the clear button removes
  it; both are disabled with the tooltip _Select an item first to enable this
  tool_ until a file is selected.
- **PDF:** the arrows are disabled on the first and last page. A typed page
  number outside the document is corrected to the nearest page.
- **Text:** the size goes from 50% to 300% in steps of 25%. When unsafe
  content was removed, a warning band under the toolbar says so
  (`--color-warning-bg` with a `--viewer-banner-accent-width` bar in
  `--color-warning`), with _Dismiss_.

<StoryEmbed id="base-textviewer--default" :width="800" height="300px" />

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | a spinner | the file loads |
| Processing | _Processing the image..._ with a crossed-out image icon | the image has no display version yet |
| Downloading | a spinner in place of the download button | download |
| No viewer | _There is currently no viewer available for files with type '{mimetype}'_ and _Download file_ | a type without a viewer |
| No file type | _No viewer available for this file_ | the file has no type |
| External link | a frame with the URL and _Open link_, or only _Open link_ | the mediafile is a link |

<StoryEmbed id="base-mediaviewernew--unsupported" :width="800" />

## Keyboard & accessibility

- The toolbar is a `role="toolbar"` named _Viewer actions_.
- Every toolbar button is a real `<button>` with a name: _Fullscreen_,
  _Zoom in_, _Zoom out_, _Rotate_, _Download file_, _Previous page_,
  _Next page_. The page field is named _Page number_.
- Entering fullscreen is announced: _Fullscreen. Press Escape to exit._
  Escape leaves fullscreen.
- Audio and video use the browser's controls, which are keyboard accessible.

## Content

- Button names are short verbs or nouns, the same in every viewer:
  _Zoom in_, _Download file_.
- Translation keys live under `media-viewer.*`, plus
  `tooltip.media-viewer.*` for the crop tools and `text-viewer.*` for the
  warning band.

## Related

[Map viewer](./map-viewer) · [Preview panel](./preview-panel) ·
[Upload](./upload) · [Loading](./loading)
