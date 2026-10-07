# History Viewer

The history viewer shows how an entity changed over time. From the detail
page of an entity, a **View history** button opens a comparison page with two
versions of the entity side by side. Fields that differ are marked, relations
that were added, removed or renamed are shown as coloured chips, and every
version shows who edited it and when.

The viewer is read-only. Edit mode is switched off while the page is open and
restored when the user leaves it. Restoring an older version is not part of
the feature.

It builds on three parts:

- the **collection** writes a snapshot of a document into a history
  collection on every change;
- a **history service** serves those snapshots per entity, and can resolve a
  snapshot as it was at a given moment;
- **baseGraphql** queries the history service and exposes the versions to
  the PWA, which renders the comparison.

## What the user sees

### The comparison page

The page has two columns, each with a version dropdown.

- The **left** dropdown offers the current version (the live entity) and all
  historical versions. It starts on the current version.
- The **right** dropdown offers the historical versions only. It starts on
  the most recent one, so the page opens on "what changed last".

Versions are numbered from oldest (1) upwards and labelled
`Version {number} ({date})`, followed by the author when one is known. Below
each dropdown an "Edited by {author} on {date}" line repeats who made that
version.

The newest snapshot is left out of the historical list, because it holds the
same content as the live entity.

The diff is always computed from the older to the newer version, whichever
side the user puts them on, so the markers land on the correct side.

### How differences are shown

| Kind of field                      | How a difference is shown                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| Scalar metadata                    | The value is marked as modified or added. Repeatable (table) fields are included. |
| Relations in an `entityListElement` | Chips: added (green), removed (red), unchanged (grey).                         |
| Renamed related entity             | The chip shows the name the related entity had in that version, marked "renamed". |
| WYSIWYG fields                     | Only a changed / unchanged flag, no inline diff.                               |

Related entities are labelled with the name they had **at that version**, not
their current name. When the name differs between the two versions, the chip
is marked as renamed: the older side shows the previous name, the newer side
the current one.

Panels are expanded by default. The `id` metadata field is never shown, and
neither is any element declared with `hideInHistory` (see below).

### Empty and error states

| Situation                          | Message                                                  |
| ---------------------------------- | -------------------------------------------------------- |
| The entity has no history          | This item has no history yet.                            |
| Only the live version exists       | There are no earlier versions yet.                       |
| The version list cannot be loaded  | The history could not be loaded. Please try again later. |
| One version cannot be loaded       | This version could not be loaded. (in that column)       |

### Version list on the detail page

Besides the comparison page, an entity can show a **History** panel on its
normal detail page: a list of versions with version number, author and date
of the change. The rows are informational and do not navigate.

## Enabling it for a client

### 1. Run the history service

The GraphQL service needs the URL of the history service in
`HISTORY_SERVICE_URL`, read into the app config as
`api.historyServiceUrl`:

```ts
api: {
  historyServiceUrl: process.env.HISTORY_SERVICE_URL || "http://history-service:5000",
},
```

Without a URL no history datasource is registered. The page then does not
fail: it shows "This item has no history yet".

On the collection side, every object configuration whose entities need
history declares a `collection_history` collection in its `crud()`, and
writes snapshots into it on create and update. Add an index on
`id` + `audit.updated.at` to that collection, since every lookup filters on
the entity id and sorts on the change date.

### 2. Register the route

The button only appears when the client declares the `HistoryComparison`
route:

```ts
{
  path: "/:type/:id/history",
  name: "HistoryComparison",
  component: "HistoryComparison",
  meta: {
    title: "history.title",
    breadcrumbs: [
      { current: true, title: "history.title" },
      { entity: true, routeName: RouteNames.SingleEntity },
    ],
  },
},
```

The `breadcrumbs` meta gives the page a "History" root crumb, followed by a
crumb for the entity itself that links back to its detail page.

### 3. Show the button per entity type

The button is shown when the entity page config of the type sets
`showHistoryButton: true` **and** the route above exists. To enable it for
every type and opt a few out:

```ts
export const entityPageConfig = Object.fromEntries(
  Object.values(Entitytyping).map((type) => [
    type,
    { showHistoryButton: true, ...entityTypeConfig[type] },
  ]),
);
```

A type that should not show history sets `showHistoryButton: false`.

### 4. Add the history queries

The PWA loads two client queries, `GetEntityHistoryVersions` and
`GetEntityHistoryVersionDetail`. They wrap the baseGraphql queries of the
same name; the detail query selects the client's full entity fragment so the
historical version renders with the same form as the live entity:

```graphql
query GetEntityHistoryVersions($id: String!, $type: String!) {
  EntityHistoryVersions(id: $id, type: $type) {
    versionId
    documentVersion
    timestamp
    editedBy
  }
}

query GetEntityHistoryVersionDetail($id: String!, $type: String!, $versionId: String!) {
  EntityHistoryVersionDetail(id: $id, type: $type, versionId: $versionId) {
    ...fullEntity
  }
}
```

When a client does not define them, the viewer has nothing to load.

### 5. Optional: the version list panel

Spread the `entityHistoryVersionList` fragment from baseGraphql in the
`elements` of an entity type's column:

```graphql
elements {
  ...
  ...entityHistoryVersionList
}
```

The fragment declares an `entityListElement` with the label
`panel-labels.history`, backed by `GetEntityHistoryVersionList`. It carries
`hideInHistory(input: true)` itself, so the list does not show up inside the
comparison page.

### 6. Hide elements from the comparison

Some panels make no sense in a comparison, such as an audit panel that would
differ on every version. Mark them with `hideInHistory`, available on both
`windowElement` and `entityListElement`:

```graphql
audit: windowElement {
  label(input: "panel-labels.audit-panel")
  hideInHistory(input: true)
  ...
}
```

To hide fields that are empty in a version, set
`customization.hideEmptyFields: true` in the app config.

## GraphQL API

| Query                        | Returns                    | Purpose                                                                 |
| ---------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| `EntityHistoryVersions`      | `[EntityHistoryVersion!]!` | All versions of an entity, oldest first: `versionId`, `documentVersion`, `timestamp`, `editedBy`. |
| `EntityHistoryVersionDetail` | `Entity`                   | The entity as it was at `versionId`.                                    |
| `EntityHistoryVersionList`   | `HistoryVersionResults!`   | Versions as list rows (newest first), for the version list panel.       |

The `versionId` is the timestamp of the change. The detail is resolved by the
history service as the snapshot at that moment.

In a historical version, every relation keeps the id of the live related
entity in `key` and gets the id of the historical snapshot in `historyKey`.
`RelationLabelsForIds` accepts these `historyKeys`, so chips resolve to the
name the related entity had at that time.

::: warning Breaking change
`RelationLabelsForIds` now takes `types: [String!]!` instead of `type`.
Client queries that call it must be updated. All ids in one call are
looked up in the collection of the first type.
:::

## Translations

The viewer uses the `history.*` keys and `panel-labels.history`, which ship
with the base translations (English and Dutch, most also Arabic):
`view-history`, `title`, `version-label`, `version-label-undated`,
`current-version`, `current-version-number`, `select-version`, `edited-by`,
`renamed`, `no-history`, `no-previous-versions`, `versions-load-error`,
`version-load-error`, `version` and `no-items`. A client can override them
like any other key.

## Limitations

- The history service fetches all versions of an entity in one call; the
  list is paged in memory.
- Mediafile history is not shown.
- Repeatable fields are compared by position: a value inserted at the top
  marks every following row as changed.
- WYSIWYG fields only show that they changed, not what changed.
- There is no "show only changes" toggle yet.
