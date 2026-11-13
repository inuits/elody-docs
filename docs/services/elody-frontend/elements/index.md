# Page Elements

A detail page is a set of columns, and each column holds **elements**: a
metadata window, a list of related entities, a media viewer, a map. This page
lists every element type the PWA renders, and documents the smaller ones in
full. The larger ones have their own page.

How columns are declared, sized and aliased is in
[GraphQL-Driven UI](../graphql-driven-ui#columns). In short:

```graphql
entityView {
  column {
    size(size: sixty)
    elements {
      windowElement { ... }
      Cars: entityListElement { ... }
      WorkOrders: entityListElement { ... }
    }
  }
  column2: column {
    size(size: forty)
    elements {
      mapElement { ... }
    }
  }
}
```

Two elements of the same type in one column are aliased (`Cars:`,
`WorkOrders:`). Elements render in the order they are selected.

## All element types

| Field in `elements` | Renders | Docs |
| --- | --- | --- |
| `windowElement` | Metadata panels, where the entity is edited | [Window Element](./window) |
| `entityListElement` | A list of related entities: list, grid, media, map or pipeline view | [Entity Lists](./entity-list) |
| `singleMediaFileElement` | The page's own mediafile in a viewer | [Media Elements](./media) |
| `mediaFileElement` | A mediafile library, or a legacy map | [Media Elements](./media#mediafileelement) |
| `mapElement` | WKT geometries or a heat map | [Maps](./map) |
| `wysiwygElement` | A rich text field | [below](#wysiwygelement) |
| `commentsElement` | Comment threads | [below](#commentselement) |
| `hierarchyListElement` | The chain of ancestors of the entity | [below](#hierarchylistelement) |
| `graphElement` | A chart of statistics | [below](#graphelement) |
| `markdownViewerElement` | A metadata value rendered as Markdown | [below](#markdownviewerelement) |
| `manifestViewerElement` | A IIIF Presentation manifest in Mirador or TIFY | [below](#manifestviewerelement) |
| `entityViewerElement`, `actionElement` | **Nothing** | [below](#elements-that-render-nothing) |

Every `label` is an i18n key, see [Translations](../translations).
`isCollapsed` sets the starting state; the element header toggles it, except
where noted below.

## `wysiwygElement`

A rich text editor ([TipTap](https://tiptap.dev/)) on one metadata key. It
works as a column element, with its own header, or inside a
[window panel](./window#panel-fields), inline with the other fields. A work
order's description:

```graphql
wysiwygElement {
  label(input: "metadata.labels.description")
  metadataKey(input: "description")
  extensions(input: [starterKit, bold, italic])
}
```

The key must also be selected in `intialValues`. The editor reads from and
writes to `intialValues[metadataKey]` as HTML, and saves with the entity.

| Field | Effect |
| --- | --- |
| `label` | Label, an i18n key |
| `metadataKey` | The metadata key read and saved |
| `extensions` | **Required.** The TipTap extensions to load, see below |
| `isMultilingual` | One value per language. Only inside a panel, and only with the `supportsMultilingualMetadataEditing` feature on |
| `taggingConfiguration { customQuery taggableEntityConfiguration(configuration: [...]) }` | What can be tagged with `elodyTaggingExtension`; `customQuery` feeds the suggestion dropdown |
| `wysiwygElementConfiguration` | `customEditorStyles` (extra classes), `showLineNumbers`, `virtualKeyboardLayouts`, `transliterationConfig` |
| `infoPanel(title, content)` | An info button that opens `content` (HTML) |
| `lockedTooltip` | Tooltip on the lock icon while the field is locked |

| Extension | Adds |
| --- | --- |
| `starterKit` | Paragraphs, headings, lists, code block, blockquote, horizontal rule, with toolbar buttons |
| `bold`, `italic` | Their toolbar buttons |
| `hardBreak` | Enter inserts `<br>` instead of a new paragraph |
| `color`, `textStyle` | Loaded, but no toolbar button |
| `doc`, `paragraph`, `text` | The minimum document; required when `starterKit` is left out |
| `elodyTaggingExtension` | Tagging entities in the text, see [Comments & Threads](../features/comments#tagging) |

::: warning An unknown extension breaks the editor
A misspelled extension throws while the editor is created, and the editor
never appears.
:::

The virtual keyboard, transliteration toggle, language selector and
`infoPanel` only show when the field is **inside a panel**. As a column
element it renders only its header and the editor.

## `commentsElement`

Threaded comments on the entity. What threads, tagging and notifications do
is in [Comments & Threads](../features/comments); the element is configured
like this:

```graphql
commentsElement {
  label(input: "element-labels.comments")
  parentEntityFilterKey(input: "pim:1|properties.ref_parent_entity.value")
  readOnly
  createFields {
    category: metaData {
      label(input: "metadata.labels.category")
      inputField(type: commentCategoryField) { ...inputfield }
    }
  }
  composer {
    label(input: "metadata.labels.comment")
    metadataKey(input: "body")
    extensions(input: [doc, paragraph, text, bold, italic, hardBreak, elodyTaggingExtension])
    taggingConfiguration {
      taggableEntityConfiguration(
        configuration: [
          {
            tag: "user"
            taggableEntityType: user
            relationType: "ref_tagged_users"
            metadataFilterForTagContent: "pim:1|properties.name.value"
            inlineTrigger: { character: "@", minCharacters: 1 }
          }
        ]
      ) {
        ...taggableEntityConfiguration
      }
    }
  }
}
```

`commentCategoryField` stands for a dropdown field type the client defines.

| Field | Effect |
| --- | --- |
| `label` | Header label |
| `parentEntityFilterKey` | **Required.** The filter key that finds the comments of this entity |
| `readOnly` | Takes no input: the server sets it from the user's permission to comment. **Select it anyway**, or the composer always shows |
| `composer` | A `wysiwygElement`; its `metadataKey` is where the comment text is stored |
| `createFields` | Extra fields filled in when a comment is created, stored as metadata and shown on every comment |

There is no `isCollapsed`; the element always starts open.

## `hierarchyListElement`

The entity's ancestors, top-most first, as a list. It follows one relation
per step: from a work order to its car, from the car to its customer.

```graphql
hierarchyListElement {
  label(input: "element-labels.hierarchy")
  isCollapsed(input: false)
  hierarchyRelationList(input: [
    { key: "for_car", entityType: car }
    { key: "owned_by", entityType: customer }
  ]) {
    key
    entityType
  }
  customQuery(input: "GetEntityForHierarchy")
}
```

| Field | Effect |
| --- | --- |
| `hierarchyRelationList` | The relations to follow, in order. Select `{ key entityType }` |
| `customQuery` | The query document fetching each ancestor, called with `id` and `type`. It must return `relationValues`, so the walk can go on, and the list fragment (`teaserMetadata`, `allowedViewModes`) |
| `can` | Hides the element without that permission. **Only the first entry is checked** |
| `entityTypeAsCenterPoint`, `centerCoordinatesKey` | Passed to the [map view mode](./map#the-map-view-mode) of the list |

Each step reads the first relation of that type from the previous entity.

::: warning A missing link empties the whole list
When an entity in the chain lacks the next relation, the element shows
"no results", even for the ancestors it already found. A failed fetch, by
contrast, keeps the partial list. An empty `hierarchyRelationList` keeps the
element loading forever.
:::

## `graphElement`

A [Chart.js](https://www.chartjs.org/) chart of statistics from the
collection API.

```graphql
mileageGraph: graphElement {
  label(input: "element-labels.mileage")
  isCollapsed(input: true)
  type(input: line)
  datasource(input: "mileage")
  dataset(input: { labels: ["mileage (km)"] }) {
    labels
    filter { key values }
  }
  timeUnit(input: dayOfYear)
  datapoints(input: 30)
}
```

| Field | Effect |
| --- | --- |
| `type` | Chart type: `bar`, `bubble`, `doughnut`, `line`, `pie`, `polarArea`, `radar`, `scatter` |
| `datasource` | Fetches `GET /stats/{datasource}/{entityId}` from the collection API |
| `dataset(input: { labels, filter: { key values } })` | Series names, and an optional filter sent as `filter_key` / `filter_values` |
| `timeUnit` | `month`, `hour`, `dayOfYear`, `dayOfWeek` |
| `datapoints` | How many points to request |
| `convert_to` | Passed to the endpoint as `convert_to` |

::: warning Things to know before using it
- **The base collection API has no `stats` endpoint.** A client must
  implement `stats/{datasource}` in its collection module.
- Graphs always start collapsed and move to the end of their column,
  whatever `isCollapsed` says. They are hidden in edit mode.
- Select `filter { key values }` on `dataset`: the request is built from the
  returned dataset, so an unselected filter is never sent.
- Only `dayOfYear` gets x-axis labels; the other time units leave them blank.
:::

## `markdownViewerElement`

A metadata value, in the user's preferred language, rendered as Markdown.
Read-only. A car model's service notes:

```graphql
markdownViewerElement {
  label(input: "element-labels.service-notes")
  isCollapsed(input: false)
  markdownContent(metadataKey: "service_notes")
}
```

Nothing renders while the value is empty. The collapse chevron shows but does
nothing: `isCollapsed` is fixed by the query.

## `manifestViewerElement`

A IIIF Presentation manifest whose URL is stored on the entity:

```graphql
manifestViewerElement {
  label(input: "element-labels.manual")
  isCollapsed(input: false)
  manifestUrl(metadataKey: "manifest_url")
  manifestVersion(metadataKey: "manifest_version")
}
```

| Field | Effect |
| --- | --- |
| `manifestUrl(metadataKey)` | The metadata key holding the manifest URL. Empty: a "no manifest" message |
| `manifestVersion(metadataKey)` | The metadata key holding the IIIF version, a number. Default `3` |

Version 3 opens in [Mirador](https://projectmirador.org/). Any other version
opens in tabs with [TIFY](https://tify.rocks/) and Mirador. The header can add
the manifest to a collection, and opens a page where Mirador shows every
collected manifest. Like the Markdown viewer, its collapse chevron does
nothing.

## Elements that render nothing

`entityViewerElement` and `actionElement` are in the schema and resolve on the
server, but the PWA has no component for them. Selecting them renders
nothing and logs nothing. Don't use them.

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/components/EntityColumn.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/EntityColumn.vue) | elody-pwa | columns and their sizes |
| [`src/components/entityElements/EntityElement.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElement.vue) | elody-pwa | picks the component per element, by `__typename` |
| [`src/components/entityElements/WYSIWYG/EntityElementWYSIWYG.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/WYSIWYG/EntityElementWYSIWYG.vue) | elody-pwa | `wysiwygElement` |
| [`src/composables/useWYSIWYGEditor.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useWYSIWYGEditor.ts) | elody-pwa | extension names → TipTap extensions |
| [`src/components/entityElements/comments/EntityElementComments.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/comments/EntityElementComments.vue) | elody-pwa | `commentsElement` |
| [`src/components/entityElements/EntityElementHierarchyListViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementHierarchyListViewer.vue) | elody-pwa | `hierarchyListElement` |
| [`src/components/entityElements/EntityElementGraph.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementGraph.vue) | elody-pwa | `graphElement` |
| [`src/components/entityElements/EntityElementMarkdownViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementMarkdownViewer.vue) | elody-pwa | `markdownViewerElement` |
| [`src/components/entityElements/EntityElementManifestViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementManifestViewer.vue) | elody-pwa | `manifestViewerElement` |
| [`baseModule/baseSchema.schema.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts) | elody-base-graphql | `EntityViewElements` and every element type |
