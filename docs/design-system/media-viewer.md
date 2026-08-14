---
title: Media viewer
---

# Media viewer

Deep-zoom media display with toolbar · Implemented by `MediaViewerNew.vue`, `IIIFViewer.vue` (OpenSeadragon)

## When to use / when not
Mediafiles on detail screens, previews, and as the primary column for
DAMS-type clients (damsv2). Not for plain thumbnails in lists.

## Anatomy
Dark viewport (`--color-surface-inverted`), the image, and the
**ViewerToolbar**: zoom in / zoom out / home / fullscreen / rotate — 26px icon
buttons, white glyphs on translucent dark capsules; filename + mimetype line
below. Multi-file: filmstrip of thumbnails under the viewport.

## States
| State | Visual cue | Trigger |
|---|---|---|
| loading | spinner on dark viewport | fetch/tiles |
| loaded | image fitted (home) | — |
| zoomed | cursor grab/grabbing | wheel/toolbar |
| fullscreen | viewport fills screen, Escape hint | toolbar |
| no media | text-only line — art is Open, see brief | no files |

<StoryEmbed id="previews-mediaviewerpreview--no-mediafiles" />

## Behaviour & keyboard
OpenSeadragon defaults: wheel zoom, drag pan, double-click zoom. Toolbar
buttons are real buttons: +/− zoom, 0 home, F fullscreen. Filmstrip arrows
switch files.

## Accessibility
Viewport `role="img"` named by the file title. Toolbar `role="toolbar"`
"Viewer-acties"; every icon button labelled ("Zoom in", "Volledig scherm").
Fullscreen announces via `role="status"`.

## Content & i18n
"Zoom in/uit" / "Zoom in/out" · "Volledig scherm" / "Fullscreen" ·
"Geen media" / "No media".

## Do & don't
Do keep the toolbar visible (no hover-only chrome on touch). Don't recreate
the toolbar per surface — one ViewerToolbar everywhere.

## Round 2 — one toolbar, four modes
**Decision: PdfToolbar is deprecated — one ViewerToolbar** hosts mode-specific
buttons in the same 26px capsule style: **image** (zoom, home, fullscreen,
rotate), **PDF** (page ‹ n/m ›, zoom, fullscreen, download), **AV** (play/
pause, timeline scrubber [slider spec], volume, fullscreen), **text** (zoom,
download). **IIIF manifest viewer**: the image mode driven by a manifest —
adds the filmstrip fed by manifest canvases and a manifest-info line;
no separate chrome.

## Related
[Preview panel](./preview-panel) · [Entity list element](./entity-list-element)
