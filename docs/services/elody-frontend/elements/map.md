# Maps

Elody draws maps in two places:

- **`mapElement`** on a detail page: the entity's own geometry.
- **The map view mode** of a list: every entity in the list on one map, next
  to the list and grid view modes.

Both use [OpenLayers](https://openlayers.org/) (through `vue3-openlayers`)
and take their data from the entity's `intialValues`. Neither fetches
geometry by itself.

The examples give each garage two extra metadata keys:

| Key | Value |
| --- | --- |
| `gps_coordinates` | `{ "latitude": 51.05, "longitude": 3.72 }` |
| `map_location` | the area the garage serves, as WKT in EPSG:4326: `POLYGON((3.70 51.04, ...))` |

## Map types

| `MapTypes` | Draws | `mapElement` | View mode |
| --- | --- | --- | --- |
| `wktMap` | WKT geometries: points, lines, polygons | yes | yes |
| `heatMap` | weighted points as a heat map | yes | yes |
| `pointsMap` | `{latitude, longitude}` points, optionally clustered | **no**, renders an empty box | yes |

## `mapElement` on a detail page

A garage's page shows the area it serves:

```graphql
mapElement {
  label(input: "element-labels.service-area")
  isCollapsed(input: false)
  type(input: wktMap)
  center(input: "gps_coordinates")
  area: metaData {
    key(input: "map_location")
  }
}
```

The entity query must also select both keys in `intialValues`:

```graphql
intialValues {
  gps_coordinates: keyValue(key: "gps_coordinates", source: metadata)
  map_location: keyValue(key: "map_location", source: metadata)
}
```

| Field | Effect |
| --- | --- |
| `label`, `isCollapsed` | Header label (an i18n key) and starting state |
| `type` | A `MapTypes` value. **Required**: leaving it out is a GraphQL error |
| `center` | The **`intialValues` key** holding the center, not coordinates. See below for its shape |
| `metaData` | One aliased `metaData` per geometry source; its `key` is an `intialValues` key holding WKT in EPSG:4326 |
| `config` | `[{ key, value }]` pairs; see the table below. A key given twice: the last wins |
| `geoJsonFeature` | Heat map data; see [Heat maps](#heat-maps) |
| `mapFeatureMetadata`, `mapMetadata` | Not used here; `mapFeatureMetadata` belongs on the list fragment, see [Popups](#popups). `mapMetadata` is never read |

A `wktMap` element only renders once there is WKT data or a center.

::: warning The shape of `center` depends on the map
The `center` key's value must be `{ latitude, longitude }` for a `wktMap`
and a `[lon, lat]` array for a `heatMap`. In `satellite` view a `wktMap` puts
a pin at the center; in `standard` view it doesn't.
:::

### Element `config` keys

| Key | Value |
| --- | --- |
| `mapView` | `satellite` (default, Esri World Imagery) or `standard` (OpenStreetMap) |
| `mapMode` | `default`, or `heatMode`: every WKT feature is coloured by the number in `keyOfHeatValue` (≤ 4 green, ≤ 6 orange, above red) |
| `keyOfHeatValue` | the `intialValues` key used by `heatMode` |
| `zoom`, `blur`, `radius` | heat map only |
| `overlayWkt` | a toggle button that draws related geometries over the map, see below |

### Overlaying related geometries

`overlayWkt` adds a button that fetches up to 1000 other entities and draws
their WKT in orange. To show the customers' addresses around a garage:

```graphql
config(input: [{
  key: "overlayWkt"
  value: {
    query: "GetCustomersWkt"
    filterQuery: "GetCustomersOfGarageFilters"
    entityType: "customer"
    wktKey: "map_location"
    label: "element-labels.show-customers"
    hideLabel: "element-labels.hide-customers"
  }
}]) {
  key
  value
}
```

`filterQuery` is a query document that returns the type's
`advancedFilters`, built with the page's entity as parent. `query` returns
`Entities { results { id intialValues { <wktKey> } } }`.

## The map view mode

A list of garages gets a map toggle when the `garage` fragment allows the map
view mode:

```graphql
allowedViewModes {
  viewModes(input: [
    { viewMode: ViewModesList }
    {
      viewMode: ViewModesMap
      config: [
        { key: "mapType", value: pointsMap }
        { key: "mapView", value: standard }
        { key: "pointsConfig", value: { keyToExtractCoordinates: "gps_coordinates", clustering: true } }
      ]
    }
  ]) {
    ...viewModes
  }
}
```

The configuration is read from the **first** entity in the list. A list that
mixes types uses whatever that entity carries.

| Key | Value |
| --- | --- |
| `mapType` | **Required.** `wktMap`, `heatMap` or `pointsMap` |
| `mapView`, `mapMode`, `keyOfHeatValue` | as on the element |
| `pointsConfig` | `{ keyToExtractCoordinates, clustering }`: the `intialValues` key holding `{latitude, longitude}`, and whether to cluster nearby points |
| `useFilters` | Panning filters the list to the visible area. Needs a client `GetGeoFilterForMap` query; the base one returns nothing |
| `bucketUntilZoom` | Below this zoom level, the backend returns buckets, drawn as numbered circles. Clicking one zooms in |
| `paginationLimit` | Entities fetched for the map. Default: 1000 for `wktMap` and `pointsMap`, all for `heatMap`. Leaving the map resets it to 20 |
| `center` | `[lat, lon]`. Otherwise the first entity's `gps_coordinates` |
| `zoom`, `blur`, `radius` | heat map only |

For `wktMap` the geometry key is fixed: the view mode reads `map_location`.
Buckets read `bucket_count` and `bucket_location` (`[lon, lat]`).

## Popups

Clicking a feature on a `wktMap` or `heatMap` opens a popup with a few fields
of the clicked entity and an "open in other tab" link. The fields come from a
`mapElement` on the **list fragment** of the type, outside `entityView`:

```graphql
fragment minimalGarage on Garage {
  mapElement {
    mapFeatureMetadata {
      name: metaData {
        label(input: "metadata.labels.name")
        key(input: "name")
      }
      phone: metaData {
        label(input: "metadata.labels.phone")
        key(input: "phone")
      }
    }
  }
  # ...
}
```

::: warning The client resolver must pass `mapElement` through
The type's resolver in the client needs `mapElement: simpleReturn`. Without it
the field resolves to `null` and the popup stays empty, with no error.
:::

## Heat maps

A `heatMap` element draws the weighted points of its parent entity:
`mapElement.geoJsonFeature` on the entity, or the `mapElement` in the first
column of its `entityView`.

```graphql
geoJsonFeature {
  value(
    id: { key: "id", source: root }
    coordinates: { key: "location", source: metadata }
    weight: { key: "visits", source: metadata, minimalValue: 5 }
  )
}
```

`coordinates` must be `[lon, lat]` in EPSG:4326; the resolver reprojects them.
The weight is the value divided by 100, raised to `minimalValue` first. The
`source` can be `root`, `metadata` or `location`; `relations` throws.

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/components/entityElements/EntityElementMapViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementMapViewer.vue) | elody-pwa | `mapElement` |
| [`src/components/library/view-modes/ViewModesMap.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/view-modes/ViewModesMap.vue) | elody-pwa | the map view mode |
| [`src/components/maps/WktMap.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/maps/WktMap.vue) | elody-pwa | WKT map, popups, buckets |
| [`src/components/maps/HeatMap.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/maps/HeatMap.vue) | elody-pwa | heat map |
| [`src/components/maps/PointMap.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/maps/PointMap.vue) | elody-pwa | points and clustering |
| [`src/composables/useMaps.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useMaps.ts) | elody-pwa | config flattening, WKT parsing, heat data |
| [`src/composables/useMapCenter.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useMapCenter.ts) | elody-pwa | resolving `center` |
| [`src/composables/useMapOverlay.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useMapOverlay.ts) | elody-pwa | `overlayWkt` |
| [`baseModule/baseResolver.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseResolver.ts) | elody-base-graphql | `MapElement` and `geoJsonFeature` resolvers |
