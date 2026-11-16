---
title: Map viewer
---

# Map viewer

Shows where records are: their geometries, points or density on a map.

<StoryEmbed id="components-wktmap--default" height="400px" />

## When to use

- Records with a location or an area: sampling stations, sites, finds.
- The map view of a list, to see where the results are and filter by the
  visible area.
- A record's location on its detail page.

## When not to use

- **An address without coordinates:** show it as text.
- **The only place a location is given:** the coordinates should also be
  readable as a value in the record's fields.

## Anatomy

1. **Base map:** OpenStreetMap tiles, or satellite imagery where the map is
   configured for it. On geometry, point and heat maps the attribution sits at
   the bottom right and never collapses.
2. **Features:** the records on the map, in the client accent
   (`--color-accent`): an area has an accent outline and a 25% accent fill; an
   area too small to see at the current zoom shows as an accent dot with a
   white ring.
3. **Map controls:** a white capsule at the top left with zoom in, zoom out
   and, on point and heat maps, fullscreen. They use the same viewer buttons as
   the [media viewer](./media-viewer).
4. **Popup:** a click on a feature opens a small card on `--radius-overlay`
   with an overlay shadow: a close button, the configured values of the
   record, and _Open in new tab_.

Geometry and point maps fit themselves around their features when they load.

## Variants

| Variant | Where | What it shows |
|---|---|---|
| Geometry map | detail panels, list map view | areas and points from WKT; at low zoom, large result sets show as numbered accent discs |
| Point map | list map view | one point per record; with clustering on, a single record shows as a pin and nearby records merge into a numbered accent disc |
| Heat map | list map view, detail panels | the density of records as a heat layer |
| Location | mediafile details | one pin at the mediafile's location, with its own zoom buttons, and its location fields below |

<StoryEmbed id="components-pointmap--clustered" height="400px" />
<StoryEmbed id="base-basemap--default" height="420px" />

A click on a numbered disc zooms in on it. In the list's map view, moving the
map can filter the list to the visible area, when the view is configured to.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading results | a small spinner capsule at the top centre of the map | the list's results load |
| Pointer on a feature | pointer cursor | hover over a feature on a geometry map |
| Popup loading | the popup with a spinner | a feature is clicked |
| Popup | the record's values and _Open in new tab_; an empty value reads _No value_ | loaded |

<StoryEmbed id="components-mapfeaturepopup--states" />

## Keyboard & accessibility

- Each map is a `role="region"` named _Map_.
- Zoom in, zoom out and fullscreen are real buttons named _Zoom in_,
  _Zoom out_ and _Fullscreen_.
- The popup is a `role="dialog"` named after its first value. Its close button
  is named _Close_, and Escape closes it.
- Panning and selecting features need a pointer, so the record's coordinates
  and values must also be available as text.

## Content

- Popup labels are the record's field labels: _Name_, _Station code_.
- Translation keys: `map.label`, `map.open-in-new-tab`, and the viewer
  buttons' `media-viewer.zoom-in`, `media-viewer.zoom-out`,
  `media-viewer.fullscreen`.

## Related

[Media viewer](./media-viewer) · [Entity list element](./entity-list-element) ·
[Preview panel](./preview-panel)
