# Media Viewers

Elody renders a mediafile with one of five viewers, picked from the
mediafile's **mimetype**. There is no per-client configuration and no
registration step: put a mediafile on an entity and the viewer follows from
what the file is.

This page covers how that choice is made, what each viewer does, the
fallbacks when no viewer matches, and the image scaling feature that lets a
user download a resized copy of an image.

## Picking a viewer from the mimetype

The dispatch lives in
[`MediaViewerNew.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/MediaViewerNew.vue)
and is deliberately blunt — a **substring test**, not a mimetype table:

```ts
const viewerMap: Record<string, ElodyViewers> = {
  pdf: ElodyViewers.Pdf,
  image: ElodyViewers.Iiif,
  audio: ElodyViewers.Audio,
  video: ElodyViewers.Video,
  text: ElodyViewers.Text,
};

const viewerType = computed<ElodyViewers | undefined>(() => {
  try {
    for (const type in viewerMap) {
      if (mimetype.value.includes(type)) return viewerMap[type];
    }
  } catch {
    return undefined;
  }
  return undefined;
});
```

So `image/tiff`, `image/jpeg` and `image/x-anything` all land on the IIIF
viewer; `application/pdf` on the PDF viewer; `text/plain`, `text/csv` and
`text/xml` on the text viewer.

Two consequences of it being a substring match on the whole mimetype string:

- **First match wins, in the order the keys are written.** `pdf` is checked
  before `image`, so a mimetype containing both words resolves to PDF. If you
  ever add a key, its position in the object literal is part of the behaviour.
- **A mimetype that merely contains the word matches.** `application/pdf` is
  intended; something exotic like `application/x-image-index` would be routed
  to the IIIF viewer and fail there. In practice mimetypes come from the
  upload pipeline, so this has not bitten — but it is not a whitelist.

`ElodyViewers` is a GraphQL enum defined in
[`baseModule/baseSchema.schema.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts):

```graphql
enum ElodyViewers {
  iiif
  video
  audio
  pdf
  text
}
```

The mimetype itself is read off the selected mediafile through
`useEntityMediafileSelector().getValueOfMediafile(context, "mimetype")`. Which
mediafile is "selected" is per-context state — see
[Multiple mediafiles in one viewer](#multiple-mediafiles-in-one-viewer).

## The five viewers

### IIIF viewer (`image/*`)

[`IIIFViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/IIIFViewer.vue)
wraps [OpenSeadragon](https://openseadragon.github.io/) around a IIIF Image
API 3 tile source:

```
/api/iiif/3/{display_filename}/info.json
```

Deep-zoom, pan, fullscreen and reset come from OpenSeadragon; the buttons for
them live in
[`ViewerToolbar.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/ViewerToolbar.vue),
which hands its own DOM nodes back to OpenSeadragon as `zoomInButton`,
`zoomOutButton`, `fullPageButton` and `homeButton` instead of rendering
OpenSeadragon's default controls.

The toolbar is also where the image-only extras hang: crop selection, the
plain download button, and the scaling modal covered
[below](#downloading-a-scaled-image).

**Crop / area selection.** When `enableSelection` is set, the toolbar's crop
button turns on `openseadragon-select-plugin`. Drawing a rectangle emits
`selectArea` with rounded `{x, y, w, h}` in image pixels. If a
`cropSizes` prop is present, the viewer stops using tiles and loads a single
cropped image instead:

```
/api/iiif/3/{filename}/{x},{y},{w},{h}/{w},{h}/0/default.jpg
```

**Processing state.** If the mediafile has no `display_filename` yet — the
transcode service has not produced a derivative — `MediaViewerNew` skips the
viewer entirely and shows an `image-slash` icon with
`media-viewer.processing-image`. This is the normal state for the first
seconds after an upload.

### Audio and video (`audio/*`, `video/*`)

[`AudioAndVideoPlayer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/AudioAndVideoPlayer.vue)
is a native `<video>` / `<audio>` element pointed at
`/api/mediafile/{mediafileId}`, with a small toolbar carrying a download
button. Audio gets a music icon above the transport controls instead of a
picture.

`controlsList="nodownload"` hides the browser's own download item, so the
toolbar button is the single download path (and the only one that resolves the
original file — see [Transport](#transport-how-bytes-reach-the-browser)).

::: warning
The player overwrites the mimetype with `video/mp4` or `audio/mp3` before
building the `<source>` tag. It plays the transcoded derivative, which is
expected to be in those containers; it is not a general-purpose player for any
audio or video mimetype the browser supports.
:::

### PDF (`application/pdf`)

[`PDFViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/PDFViewer.vue)
renders with `pdfjs-dist` onto a `<canvas>`, one page at a time, and is loaded
via `defineAsyncComponent` so pdf.js is not in the initial bundle. The whole
file is fetched as a blob through
[`useGetMediafile`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useGetMediafile.ts)
(which can cache it), then handed to pdf.js.

[`PdfToolbar.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/PdfToolbar.vue)
provides page navigation and zoom, clamped to `MIN_SCALE = 0.2` /
`MAX_SCALE = 4`.

### Text (`text/*`)

[`TextViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/TextViewer.vue)
fetches `/api/mediafile/{id}` as text, converts newlines to `<br/>` and
renders it through
[`SanitizedHtml.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/SanitizedHtml.vue)
in `SanitizeMode.Html`. If sanitizing actually removed something, a dismissible
yellow banner (`text-viewer.sanitized-warning`) tells the user the rendered
content is not byte-identical to the file — the download button still gives
the untouched file.

## When no viewer matches

Three fallbacks, all inside `MediaViewerNew`, in the order they are checked.

**External URL — embedded.** A mediafile can stand in for a link rather than a
stored file. If it has an `external_url` from a provider with a real embed
player, the viewer frames it in an `<iframe>` with a header showing the URL
and an "open" button. Which providers qualify is decided by
`getEmbeddableUrl`. See
[External URL Mediafiles](./external-url-mediafiles) for the full feature.

**External URL — link out.** Any other `external_url` gets a centred link
card, because framing a site that sends `X-Frame-Options` would render a blank
box.

**Unsupported mimetype.** Otherwise the user sees a `desktop-slash` icon with
`media-viewer.unsupported-mimetype` (the mimetype interpolated) plus a
**download** button — an office document or an archive is still retrievable,
just not viewable in the browser. With no mimetype at all the message is
`media-viewer.no-viewer` and there is no download button.

## Downloading a scaled image

The magnifier-with-frame button on the right of the IIIF toolbar opens
[`IiifOperationsModal.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/modals/IiifOperationsModal.vue),
which produces a resized copy of the image on demand. Nothing is stored — the
image is generated by the IIIF server for that one request.

::: tip
This lives in `ViewerToolbar`, so it is **image-only**. The other viewers offer
a download of the file as-is, with no size or format options.
:::

The modal has three controls:

| Control | Values | Behaviour |
| --- | --- | --- |
| Scale | `25%`, `50%`, `100%` | Sets width and height to that fraction of the original, floored |
| Dimensions | free-form width / height | Overrides the scale buttons; either may be left empty |
| Format | `png`, `jpg`, `tif` | Output encoding; defaults to `jpg` |

Picking a scale recomputes both dimension fields from the mediafile's stored
`width`/`height`. Typing in a dimension field does not change the highlighted
scale button — the fields are the source of truth for the request.

**One dimension left empty** is filled in from the original aspect ratio
before the request goes out (`handleEmptyWidthOrHeight`). Leaving *both* empty
is an error. Enter mismatched values by hand and you get the largest image
that fits *inside* that box, not the box itself — the `!` in the URL below
means "best fit within", not "exactly".

The download itself:

```
GET /api/iiif/3/{display_filename}/full/^!{width},{height}/0/default.{format}
```

- `full` — the whole image, not a region. Cropping is a separate feature.
- `^!{w},{h}` — IIIF Image API 3 size syntax. `!` is best-fit-within
  (preserve aspect ratio); `^` permits **upscaling past the original size**, so
  a width larger than the source is honoured rather than rejected.
- `0/default` — no rotation, no quality transform.

The response is read as a blob and saved through a temporary `<a download>`, so
the file lands with a meaningful name instead of the IIIF path:

```
{originalFilenameWithoutExtension}_{width}x{height}.{format}
```

A non-OK response is logged to the console and the spinner stops — the user
sees no error message. Reopening the modal resets everything to `100%` /
`jpg` / the original dimensions.

::: warning Two things to know before trusting the output

**It scales the display copy, not the master.** The modal is handed
`imageFilename`, which is the mediafile's `display_filename` — the derivative
produced by the transcode service. In collection-api's
[`mediafile_download_urls.py`](https://github.com/inuits/elody-collection/blob/master/api/resources/elody/mediafiles/mediafile_download_urls.py)
that same `display_filename` is what backs `transcode_file_location`, while
the master is `filename` and is only served to users with
`copyright_access`. So a `100%`-scale download is 100% of the *display*
image. It is not a route to the archival master.

**Missing dimensions silently default to 1920×1080.** If the mediafile has no
`width`/`height` metadata, `originalWidth`/`originalHeight` fall back to
`1920` and `1080`. The scale buttons then compute percentages of a resolution
the image does not have, and the user gets a wrongly-sized file with no
warning. Check that your upload pipeline writes image dimensions.
:::

## Transport

No viewer fetches a file directly. Every URL on this page — `/api/iiif/...`
tiles, `/api/mediafile/{id}` for the PDF, text, audio and video players, the
scaled-image download — is same-origin and served by the client's GraphQL
service, which re-issues the request upstream with a bearer token attached so
the browser never holds one. See [Proxy Endpoints](../proxy-endpoints) for how
that works and how to add one.

Two endpoint families matter here. `/api/iiif/*` (plus `/api/iiif*.json` for
the tile manifest) backs the IIIF viewer, crops and the scaled download.
`/api/mediafile/*` backs the PDF, text, audio and video viewers and every
plain download button: it asks collection-api for
`/mediafiles/{id}/download-urls` and serves `transcode_file_location`, or
`original_file_location` when called with `?original=true`. Passing
`originalFilename` sets a `Content-Disposition` header so the browser saves
the file under a real name.

One consequence worth stating: a viewer URL only works from within the
dashboard's origin, since it needs the session. The exception is the
[Embedded Viewer](./embedded-viewer), which opts into anonymous or
whitelisted-token access explicitly.

::: tip
`?original=true` is a request, not a guarantee. collection-api resolves
`original_file_location` to the master `filename` only when the user has
`copyright_access`; otherwise it resolves to `display_filename` — the same
derivative as the non-original URL. PDF, XML and plain text are listed as
`NOT_TRANSCODABLE_MIMETYPES` and have no derivative at all, so for those the
transcode URL falls back to the original.
:::

## Multiple mediafiles in one viewer

`useEntityMediafileSelector` keeps viewer state — the mediafile list and the
selected mediafile — keyed by a `mediafileViewerContext` string that each
host provides. `EntityElementSingleMedia`, for example, provides
`"SingleMediaFileElement"`. That is what lets two viewers coexist on one page
without sharing a selection.

When a context holds more than one mediafile, `MediaViewerNew` overlays
previous/next arrows and re-emits `togglePreviewComponent` on each change so
the surrounding preview panel follows along.

## Two media viewer components

Both are live, with different consumers, and they are not interchangeable.

| | `MediaViewer.vue` | `MediaViewerNew.vue` |
| --- | --- | --- |
| Used by | [`ViewModesMedia.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/view-modes/ViewModesMedia.vue) (library media view mode) | [`MediaViewerPreview.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/previews/MediaViewerPreview.vue), [`EntityElementSingleMedia.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementSingleMedia.vue) |
| IIIF filename | `transcode_filename \|\| filename` | `display_filename` |
| Thumbnail strip | yes (`EntityImageSelection`, 1/3 width) | no |
| Prev/next arrows | no | yes |
| Crop | no | yes |
| External URL / unsupported fallbacks | no | yes |
| Processing state | no | yes |

The mimetype dispatch is duplicated verbatim in both. If you change
`viewerMap`, change it in both places.

## Not part of the mimetype dispatch

**`ManifestViewer.vue`** renders IIIF *Presentation* manifests with
[Mirador](https://projectmirador.org/) and
[TIFY](https://tify.rocks/) in tabs, driven by a `manifestUrl` prop from
`EntityElementManifestViewer` — not by a mediafile mimetype. Which of the two
viewers appear is decided by its `viewers` prop.

**The embedded viewer** is the IIIF viewer on a bare, frameable page for
external websites. See [Embedded Viewer](./embedded-viewer).

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/components/base/MediaViewerNew.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/MediaViewerNew.vue) | elody-pwa | mimetype dispatch, fallbacks, mediafile navigation |
| [`src/components/base/MediaViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/MediaViewer.vue) | elody-pwa | older dispatch used by the library media view mode |
| [`src/components/IIIFViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/IIIFViewer.vue) | elody-pwa | OpenSeadragon deep-zoom + area selection |
| [`src/components/ViewerToolbar.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/ViewerToolbar.vue) | elody-pwa | zoom/fullscreen/crop/download, opens the scaling modal |
| [`src/components/modals/IiifOperationsModal.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/modals/IiifOperationsModal.vue) | elody-pwa | scale, dimensions, format → scaled download |
| [`src/components/base/AudioAndVideoPlayer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/AudioAndVideoPlayer.vue) | elody-pwa | native `<audio>` / `<video>` |
| [`src/components/base/PDFViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/PDFViewer.vue) | elody-pwa | pdf.js canvas renderer |
| [`src/components/base/TextViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/TextViewer.vue) | elody-pwa | fetch + sanitize + render |
| [`src/components/ManifestViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/ManifestViewer.vue) | elody-pwa | Mirador / TIFY manifest viewer |
| [`src/composables/useEntityMediafileSelector.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useEntityMediafileSelector.ts) | elody-pwa | per-context mediafile selection state |
| [`src/composables/useMediafileDownload.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useMediafileDownload.ts) | elody-pwa | plain download of a mediafile |
| [`src/composables/useMediafileCrop.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useMediafileCrop.ts) | elody-pwa | crop mode + crop coordinates |
| [`endpoints/mediafilesEndpoint.ts`](https://github.com/inuits/elody-mediafile-module/blob/main/endpoints/mediafilesEndpoint.ts) | elody-mediafile-module | `/api/iiif/*` and `/api/mediafile/*` proxies |
| [`baseModule/baseSchema.schema.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts) | elody-base-graphql | `ElodyViewers` enum |
| [`mediafile_download_urls.py`](https://github.com/inuits/elody-collection/blob/master/api/resources/elody/mediafiles/mediafile_download_urls.py) | elody-collection | resolves original vs transcode download URLs |
