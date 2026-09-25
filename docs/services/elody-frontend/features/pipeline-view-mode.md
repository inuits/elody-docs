# Pipeline View Mode

`ViewModesPipeline` renders an entity list as a directed flow, next to the
list, grid and map view modes: the same entities, laid out left to right as
cards with lines between them. It suits entity types whose instances build
on each other — a work and its expressions and manifestations, stages in a
workflow — where a flat list hides the one thing a user wants to see: what
follows from what.

The entities are the nodes. The edges are relations the entities already
carry; which relation types count as edges is declared per client, so the
PWA holds no knowledge of any particular data model.

The view is read-only about layout. Cards cannot be dragged and nothing
about their position is persisted; the flow is computed on every render.
Panning and zooming (with a fit-to-frame button) are the only canvas
interactions.

## Enabling it

Declare the view mode in the entity type's `allowedViewModes`, like any
other view mode (see [GraphQL-driven UI](/services/elody-frontend/graphql-driven-ui)):

```graphql
allowedViewModes {
  viewModes(
    input: [
      {
        viewMode: ViewModesPipeline
        config: [{ key: "edgeRelations", value: ["refWork", "refExpressions"] }]
      }
      { viewMode: ViewModesList }
    ]
  ) {
    ...viewModes
  }
}
```

A type that lists `ViewModesPipeline` gets a sitemap toggle next to the
other view-mode icons; a type that does not never runs any of it. Entity
pickers never offer the pipeline toggle, whatever the declaration: in a
picker, selecting is the task.

## Configuration

The view mode reads its settings from the generic `config` list on the
view-mode declaration.

| Key               | Value                  | Default | Effect                                                            |
| ----------------- | ---------------------- | ------- | ----------------------------------------------------------------- |
| `edgeRelations`   | list of relation types | `[]`    | Relation types that are drawn as edges. A single string also works. |
| `paginationLimit` | positive number        | `1000`  | How many entities the mode fetches while active.                  |

### `edgeRelations`

For every relation of a listed type on an entity, an edge is drawn **from
the related entity to the entity carrying the relation**. That matches the
common pattern of child records pointing at their parent. In the WEMI
example above, expressions carry `refWork` and manifestations carry
`refExpressions`, which gives work → expressions → manifestations.

The edges are read from `relationValues`, so the listing query must select
it for every type in the flow:

```graphql
results {
  id
  uuid
  type
  ... on Expression {
    relationValues
    ...expressionTeaser
  }
}
```

A relation only becomes an edge when its `key` equals the `id` or `uuid` of
another entity **in the same listing**. Relations to entities outside the
listing, relation types that are not declared, self references and
duplicates are skipped. Nothing is matched on names or partial
identifiers.

Without `edgeRelations` the entities render as unconnected cards in a
single column, never as an error.

### `paginationLimit`

A flow is only readable in full, so the mode fetches unpaged while it is
active (1000 entities unless declared otherwise) and restores the regular
page size when the user switches to another view mode. The pagination
controls are hidden while the pipeline is shown.

## Layout

Columns follow the longest path from an entity without incoming edges:
roots on the left, each step one column further right. Within a column,
cards are ordered by the vertical centre of the cards feeding them, so a
fan-out stays next to its source. Cycles are tolerated; they never hang
the layout.

Card heights are measured, not guessed, so edges attach to the actual port
dots. An input port is drawn per relation type a card receives edges on;
an output port when the card feeds another one.

When the whole flow fits the panel it is centred. When it does not (a work
with over a hundred manifestations), the first card of the first column is
brought into view so the reader starts at the beginning of the flow.

## Cards

Cards are the ordinary `ListItem` in a pipeline variant: fixed width, no
multiselect checkbox, no media and no click-through navigation — in a flow
the card is a node, not a link. The entity's context menu stays available
in the top-right corner, so declared actions remain the way to act on a
node. The card shows the entity's read-mode teaser metadata in declared
order.

## Translations

The canvas controls use `pipeline.fit`, `pipeline.zoom-in` and
`pipeline.zoom-out`, which ship with the base translations (English and
Dutch). A client can override them like any other key.
