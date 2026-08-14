---
title: Map viewer
---

# Map viewer

Geodata display: points, WKT geometries, heatmaps · Implemented by `PointMap.vue`, `WktMap.vue`, `HeatMap.vue`, `ViewModesMap.vue`, `EntityElementMapViewer.vue` (OpenLayers, OSM tiles)

## When to use / when not
Location-bearing entities (vliz sampling stations, geo assets) — detail
panels, previews, and the map view mode of a list. Not for a single static
address (plain text).

## Anatomy
OSM basemap, accent-coloured markers/geometry (stroke = client accent, fill at
~25% alpha), zoom +/− control top-left (same 26px capsule style as the media
toolbar), attribution bottom-right, optional marker popup (10px radius,
overlay shadow) with title + open-link.

## States
| State | Visual cue | Trigger |
|---|---|---|
| loading | grey tiles + spinner | tiles |
| loaded | fitted to feature extent | — |
| marker selected | popup, marker enlarged | click |
| heat | gradient layer over basemap | HeatMap |
| offline/no geo | text-only line | no coordinates |

<StoryEmbed id="maps-pointmap--markers" />

## Behaviour & keyboard
Wheel zoom, drag pan; +/− buttons keyboard-operable; popup Escape-closable.
Map view mode shares selection state with the list.

## Accessibility
Map region labelled ("Kaart: vondstlocaties"); zoom controls are buttons;
popups `role="dialog"` named by the feature title. Feature data must also
exist as text (coordinates in the field list) — the map is never the only
carrier.

## Content & i18n
"Kaart" / "Map" · "Zoom in/uit" · attribution "© OpenStreetMap".

## Do & don't
Do fit to extent on load. Don't use red/green marker pairs (danger/success
collision); don't hide attribution.

## Related
[Media viewer](./media-viewer) · [Entity list element](./entity-list-element)
