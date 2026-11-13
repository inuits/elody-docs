# Media Elements

Three element configurations put mediafiles on an entity page. Which one fits
depends on the page:

| You want | Use |
| --- | --- |
| A mediafile's own detail page, with the file in a viewer | `singleMediaFileElement` |
| The photos, invoices or manuals attached to a car or work order | `entityListElement` with `type(input: media)` |
| A map with a marker (legacy) | `mediaFileElement` with `type(input: map)` |

Which viewer renders a file (IIIF for images, PDF, audio, video, text) follows
from its mimetype and is not configured here. See
[Media Viewers](../features/media-viewers).

## `singleMediaFileElement`: the page's own file

On a mediafile's detail page the usual layout is the viewer in a wide column
and the metadata in a narrow one:

```graphql
entityView {
  column {
    size(size: seventy)
    elements {
      singleMediaFileElement {
        label(input: "element-labels.media")
        isCollapsed(input: false)
      }
    }
  }
  column2: column {
    size(size: thirty)
    elements {
      windowElement {
        label(input: "element-labels.metadata")
        # ... panels, see Window Element
      }
    }
  }
}
```

| Field | Effect |
| --- | --- |
| `label` | Header label, an i18n key |
| `isCollapsed` | Starting state; the header toggles it. Defaults to `false` |
| `type`, `metaData` | In the schema, **never read** |

The element shows **the page's entity itself**, not its relations. When a
column holds a `singleMediaFileElement`, `EntitySingle.vue` puts the page's
entity in the `SingleMediaFileElement` viewer context and `MediaViewerNew`
renders it at a fixed `75vh` height, without a thumbnail strip or arrows.

::: warning Only on mediafile pages
On a car's page the element hands the *car* to the viewer, which then shows
its "no viewer" fallback. To show a car's photos, use an entity list.
:::

## A car's mediafiles: `entityListElement` with `type: media`

Mediafiles attached to another entity are listed with an
[entity list](./entity-list) in media mode. The list then shows mediafiles
with preview on, and clicking one opens it in the preview's media viewer:

```graphql
Photos: entityListElement {
  label(input: "element-labels.photos")
  isCollapsed(input: false)
  type(input: media)
  entityTypes(input: [mediafile])
  relationType: label(input: "has_mediafile")
  customQuery(input: "GetMediafilesOfCar")
    customQueryFilters(input: "GetMediafilesOfCarFilters")
}
```

The name of the relation between an entity and its mediafiles depends on the
client's data model; the garage network uses `has_mediafile`. The list's
custom query and filters are what find the mediafiles. There is no
`mediafiles` field on the entity query that drives the element.

For the click to open a viewer, the `mediafile` type's preview must be the
media viewer:

```graphql
previewComponent {
  type(input: MediaViewer)
  # ...
}
```

### The media view mode in lists

::: warning Deprecated
`ViewModesMedia` is deprecated in favour of the media viewer in previews,
above. It still works for existing clients.
:::

A list of mediafiles can also offer a **media** view mode next to list and
grid: the selected file large, with a thumbnail strip. It is enabled on the
`mediafile` fragment:

```graphql
allowedViewModes {
  viewModes(input: [
    { viewMode: ViewModesList }
    { viewMode: ViewModesGrid }
    { viewMode: ViewModesMedia }
  ]) {
    ...viewModes
  }
}
```

The toggle reads `allowedViewModes` from the **first** entity in the list. A
list in media mode (`type: media`) opens in this view mode straight away.
This view mode uses the older `MediaViewer` component; see
[Two media viewer components](../features/media-viewers#two-media-viewer-components)
for how it differs.

## `mediaFileElement`

`mediaFileElement` has two modes that have nothing in common, chosen by
`type` (default `media`).

**`type: media`** renders a mediafile library with preview on and bulk
operations, plus an "add media" link in edit mode. It takes no
`customQuery`, `customQueryFilters` or `relationType`, so it cannot be scoped
to a relation. Prefer an `entityListElement` with `type: media`.

**`type: map`** is the legacy map: a Leaflet map with one marker, plus a row
for every aliased `metaData` child:

```graphql
mediaFileElement {
  label(input: "element-labels.location")
  isCollapsed(input: false)
  type(input: map)
  location: metaData {
    label(input: "metadata.labels.location")
    key(input: "location")
    unit(input: COORDINATES_DEFAULT)
  }
  name: metaData {
    label(input: "metadata.labels.name")
    key(input: "name")
  }
}
```

::: danger `type: map` needs a `location` metaData
The map reads its marker from the metaData whose `key` is `location`. The
value must be shaped like `{ latitude, longitude }`. Without that row, the
component throws. An optional `name` row becomes the marker tooltip.
:::

A row with an `inputField` and `unit: COORDINATES_DEFAULT` is edited with a
coordinate editor. Other rows are edited as ordinary metadata. For new pages,
use the [map element](./map).

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/components/entityElements/EntityElementSingleMedia.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementSingleMedia.vue) | elody-pwa | `singleMediaFileElement` |
| [`src/components/entityElements/EntityElementMedia.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementMedia.vue) | elody-pwa | `mediaFileElement`, both modes |
| [`src/components/entityElements/EntityElementList.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementList.vue) | elody-pwa | `entityListElement`, including `type: media` |
| [`src/components/base/BaseMap.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/BaseMap.vue) | elody-pwa | legacy Leaflet map behind `type: map` |
| [`src/components/library/view-modes/ViewModesMedia.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/view-modes/ViewModesMedia.vue) | elody-pwa | media view mode in lists |
| [`src/views/EntitySingle.vue`](https://github.com/inuits/elody-pwa/blob/master/src/views/EntitySingle.vue) | elody-pwa | fills the `SingleMediaFileElement` viewer context |
