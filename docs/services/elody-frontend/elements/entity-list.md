# Entity Lists & BaseLibrary

Every list of entities in the PWA is a **BaseLibrary**: the overview pages
behind the main menu, the related entities on a detail page, the entity
picker, and the list in a preview. The library fetches a page of entities,
shows them in a view mode (list, grid, table, map, pipeline, media) and
offers search, sorting, filters and bulk operations.

There are two ways to configure one:

- **On a detail page**, with an `entityListElement` in the entity's query.
- **As an overview page**, with a route in the client's router config.

## `entityListElement`

A car's detail page lists its work orders:

```graphql
WorkOrders: entityListElement {
  label(input: "element-labels.work-orders")
  isCollapsed(input: false)
  entityTypes(input: [workOrder])
  relationType: label(input: "has_work_order")
  customQuery(input: "GetWorkOrdersOfCar")
  customQueryFilters(input: "GetWorkOrdersOfCarFilters")
  customQueryEntityPickerList(input: "GetWorkOrderPickerList")
  customQueryEntityPickerListFilters(input: "GetWorkOrderPickerFilters")
  customBulkOperations(input: "GetBulkOperationsForCarWorkOrders")
}
```

::: danger Write `relationType: label(input: ...)`
`EntityListElement` has no resolver for `relationType`, so
`relationType(input: "has_work_order")` comes back `null` without an error.
Every client aliases `label` instead, which resolves its input. Without it,
the entity picker and unlinking have no relation type to work with.
:::

### Where the entities come from

The list runs the query document named in `customQuery`, with the filters
from the document named in `customQueryFilters`. **These are what scope the
list to the page's entity.** `relationType` does not filter anything.

The query takes the same variables as `GetEntities` and its root field must be
`Entities`:

```graphql
query GetWorkOrdersOfCar(
  $type: Entitytyping
  $limit: Int
  $skip: Int
  $searchValue: SearchFilter!
  $advancedSearchValue: [FilterInput]
  $advancedFilterInputs: [AdvancedFilterInput!]!
  $searchInputType: SearchInputType
) {
  Entities(
    type: $type
    limit: $limit
    skip: $skip
    searchValue: $searchValue
    advancedSearchValue: $advancedSearchValue
    advancedFilterInputs: $advancedFilterInputs
    searchInputType: $searchInputType
  ) {
    results {
      ...minimalWorkOrder
    }
    count
    limit
  }
}
```

The filters document scopes it with a hidden filter. A hidden `selection`
filter with an empty `defaultValue` is filled with the page entity's id
(`$parentIds`):

```graphql
query GetWorkOrdersOfCarFilters($entityType: String!) {
  EntityTypeFilters(type: $entityType) {
    advancedFilters {
      type: advancedFilter(type: type) {
        type
        defaultValue(value: "workOrder")
        hidden(value: true)
      }
      car: advancedFilter(type: selection, key: "relations.for_car.key") {
        type
        key
        defaultValue(value: [])
        hidden(value: true)
      }
    }
  }
}
```

Other placeholders a filter's `defaultValue` can use are `$entityType`,
`$routeEntityType`, `$dateToday` and `$entity.<path>`, a value of the page's
entity. See [Advanced Filtering](../../elody-collection/advanced-filtering)
for the filters themselves.

::: warning Without a `customQuery` the list is unscoped
Leave `customQuery` out and the list runs `GetEntities` for
`entityTypes[0]`: every work order, not the car's.
:::

Both are names of query documents in the client's GraphQL service, looked up
in the generated types. A new document needs a codegen run before the PWA
finds it.

### Fields

| Field | Effect |
| --- | --- |
| `label`, `isCollapsed` | Header label (an i18n key) and starting state |
| `entityTypes` | The listed type. **Only the first entry is used**, for the query, the filters and the picker |
| `relationType: label(input: ...)` | The relation from the page's entity to the listed ones: added by the picker, removed when unlinking, shown on new items in edit mode |
| `customQuery`, `customQueryFilters` | The list query and its filters, see above |
| `customQueryEntityPickerList`, `customQueryEntityPickerListFilters` | The query and filters of the entity picker that adds entities to the list |
| `customBulkOperations` | The query document with the list's bulk operations, such as "add" (`addRelation`) |
| `baseLibraryMode` | How much of the library to show, see [Modes](#modes) |
| `disableLibraryBar` | Hides the view mode toggles, sorting, page size and search |
| `enableAdvancedFilters` | Shows the filter panel |
| `actionOnClick` | `navigate`, `openPreview`, `openInModal` or `none`; see [List Item Click Actions](../features/list-item-click-actions) |
| `type(input: media)` | Lists mediafiles with preview; see [Media Elements](./media) |
| `cropMediafileCoordinatesKey` | With `type: media`: the metadata key crop coordinates are saved to |
| `displayCondition { key value }` | Shows the list only when metadata `key` equals `value`, or, without `value`, when a relation `key` exists |
| `can(input: [...])` | Hides the list without that permission; see [UI Permissions](../permissions) |
| `hideInHistory` | Leaves the list out of the [history viewer](../features/history-viewer) |
| `entityListElement` | A nested list under each item, scoped to that item. List and grid view only |
| `actionsOnResult { type options }` | With type `NoResult`: an action menu shown when the list is empty |
| `fetchDeepRelations` | Shows an ancestor entity from the breadcrumbs or route instead of running a query |
| `addEntitiesToForms` | Gives every listed entity its own form, for editing them inline |
| `filtersNeedContext` | Meant to send values of the page entity as `$context` to the filters query, only inside a window panel. **Currently broken**: reading the form throws, and the filters fail to load |

`fetchDeepRelations`, `actionsOnResult`, `addEntitiesToForms` and
`filtersNeedContext` are ignored with `type: media`.

These fields are in the schema but do nothing: `viewMode` (`Dropdown` is not
implemented), `entityList`, `customQueryRelationType`, `searchInputType`, and
`type(input: map)`.

::: warning Don't select a name field without its input
`customQuery`, `customQueryFilters`, `customBulkOperations` and the picker
fields resolve to the string `'undefined'` when selected without `input`. The
PWA takes that as a set value and looks for a document called `undefined`.
:::

### Modes

`baseLibraryMode` decides how much of the library shows:

| Mode | Header | View mode toggles | Library bar | Bulk operations and selection | Notes |
| --- | --- | --- | --- | --- | --- |
| `normalBaseLibrary` (default) | yes | yes | yes | yes | |
| `previewBaseLibrary` | centred title and close button | no | yes, without search | no | for lists inside a preview |
| `basicBaseLibraryWithBorder` | yes | no | no | no | bordered, small pagination |
| `basicBaseLibrary` | **no** | no | no | no | compact, shows `-` when empty |

Only `normalBaseLibrary` has bulk operations, so it is the only mode where
users can add entities to the list.

## View modes

The view modes a list offers are not set on the list. They come from
`allowedViewModes` on the listed type's fragment, read from the **first
entity** in the results:

```graphql
fragment minimalWorkOrder on WorkOrder {
  allowedViewModes {
    viewModes(input: [
      { viewMode: ViewModesList }
      { viewMode: ViewModesGrid }
      { viewMode: ViewModesPipeline, config: [...] }
    ]) {
      ...viewModes
    }
  }
  # ...
}
```

| View mode | Shows |
| --- | --- |
| `ViewModesList` | rows with the type's `teaserMetadata` |
| `ViewModesGrid` | cards |
| `Table` | a table with one column per `teaserMetadata` key, with group-by |
| `ViewModesMap` | entities on a map, see [Maps](./map#the-map-view-mode) |
| `ViewModesPipeline` | a board along relations, see [Pipeline View Mode](../features/pipeline-view-mode) |
| `ViewModesMedia` | deprecated, see [Media Elements](./media#the-media-view-mode-in-lists) |

The toggles follow the order of the input. With one view mode there is no
toggle. The user's choice is remembered for every list, not per list.

- An empty list has no toggles, because there is no first entity.
- `Table` is left out when the entities have different `teaserMetadata` keys.
- `ViewModesPipeline` is left out in the entity picker.

What a row or card shows is the type's `teaserMetadata`; see
[Inputs & Teaser Metadata](../inputs-and-teaser-metadata).

## Overview pages

An overview page is a route in the client's router config, not a GraphQL
query. The routes are children of the `/` route, which renders the library
for every route that isn't an entity's detail page:

```ts
{
  path: "/",
  component: "HomeWrapper",
  children: [
    {
      path: "work-orders",
      name: RouteNames.WorkOrders,
      component: "Home",
      meta: {
        type: Collection.Entities,
        entityType: Entitytyping.WorkOrder,
        requiresAuth: true,
        breadcrumbs: [{ overviewPage: RouteNames.WorkOrders, title: "navigation.work-orders" }],
        queries: {
          getEntities: "GetWorkOrders",
          getFilters: "GetWorkOrderFilters",
          getSortOptions: "GetWorkOrderSortOptions",
          getBulkOperations: "GetBulkOperationsForWorkOrders",
        },
        simpleSearch: { keys: ["title", "description"] },
      },
    },
  ],
}
```

| `meta` | Effect |
| --- | --- |
| `entityType` | The listed type |
| `type` | `Collection.Entities` for an overview |
| `requiresAuth` | Only for logged-in users |
| `breadcrumbs` | **Required.** The page throws without them |
| `queries.getEntities` | The list query, shaped like `GetEntities` |
| `queries.getFilters` | Filters; default `GetAdvancedFilters` |
| `queries.getSortOptions` | Sort options; default `GetSortOptions` |
| `queries.getBulkOperations` | Bulk operations; default `GetBulkOperations` |
| `queries.getGroupByOptions` | Group-by options for the table view |
| `simpleSearch` | `{ keys, relationKeys }`: what the search box searches |
| `actionOnClick` | See [List Item Click Actions](../features/list-item-click-actions#on-an-overview-route) |

::: warning `queries` is all or nothing for two of them
Without a `queries` object every query falls back to its default. With one,
a missing `getEntities` or `getBulkOperations` has **no** fallback, and the
list or its bulk operations stay empty. Filters, sort options and group-by
still fall back.
:::

The page sizes always come from the base `GetPaginationLimitOptions`.

`component` must be a name the PWA knows (`HomeWrapper`, `Home`,
`SingleEntity`, …); an unknown name throws at boot. Only one level of
`children` gets its components mapped.

To reach the page from the main menu, add a menu item to the client's
`GetMenu(name: "main-menu")` query that links to the route's path:

```graphql
workOrders: menuItem(
  label: "navigation.work-orders"
  entityType: workOrder
  typeLink: { route: { destination: "work-orders" } }
  requiresAuth: true
) {
  ...menuItem
}
```

## Related pages

- [List Item Click Actions](../features/list-item-click-actions)
- [Pipeline View Mode](../features/pipeline-view-mode)
- [Rounded Counts](../features/rounded-counts)
- [Bulk Edit](../features/bulk-edit)
- [Merge Entities](../features/merge-entities)

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/components/entityElements/EntityElementList.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementList.vue) | elody-pwa | `entityListElement` → BaseLibrary props |
| [`src/components/library/BaseLibrary.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/BaseLibrary.vue) | elody-pwa | the library: modes, view modes, bulk operations |
| [`src/components/library/useBaseLibrary.ts`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/useBaseLibrary.ts) | elody-pwa | which query runs, with which variables |
| [`src/components/library/LibraryBar.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/LibraryBar.vue) | elody-pwa | sorting, page size, search, group-by |
| [`src/components/library/AssetLibrary.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/AssetLibrary.vue) | elody-pwa | the library on an overview route |
| [`src/composables/useViewModes.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useViewModes.ts) | elody-pwa | view modes from `allowedViewModes` |
| [`src/composables/filters/useFilterState.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/filters/useFilterState.ts) | elody-pwa | hidden filters and `$parentIds` |
| [`src/views/router.ts`](https://github.com/inuits/elody-pwa/blob/master/src/views/router.ts) | elody-pwa | route component names |
| [`baseModule/baseResolver.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseResolver.ts) | elody-base-graphql | `EntityListElement` resolvers and defaults |
