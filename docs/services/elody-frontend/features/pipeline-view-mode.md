# Pipeline View Mode

`ViewModesPipeline` is a third way to render an entity list, next to the list
and grid modes: the same entities, laid out left to right as a flow of cards
with connection lines between them. It exists for entity types whose
instances feed each other — processing steps in a data pipeline, stages in a
workflow — where a flat list hides the one thing a user actually wants to
see: what is wired to what.

The view is deliberately read-only about layout. Cards cannot be dragged and
nothing about their position is persisted; the flow is computed on every
render from metadata the entities already carry. If that metadata is absent
the view degrades gracefully to unconnected cards in a single column, never
to an error. Panning and zooming (with a fit-to-frame button) are the only
canvas interactions.

## Enabling it

Declare the view mode in the entity type's `allowedViewModes`, like any
other view mode (see [GraphQL-driven UI](/services/elody-frontend/graphql-driven-ui)):

```graphql
allowedViewModes {
  viewModes(
    input: [
      { viewMode: ViewModesList }
      { viewMode: ViewModesPipeline }
    ]
  ) {
    ...viewModes
  }
}
```

That is the whole switch: a type that does not declare `ViewModesPipeline`
never shows the toggle (a sitemap icon next to the list/grid icons), and
none of the machinery below runs. The picker variant of a library never
offers the pipeline toggle, regardless of the declaration.

## How the flow is computed

### Declared edge relations

The primary wiring source is declaration: `edgeRelations` in the view-mode
config names the relation types that *are* the wiring. For every relation
of such a type on an entity, an edge is drawn from the related entity (the
producer) to that entity, read straight from the `relationValues` the
listing already selects — no extra metadata, no computed field, no resolver
work. A WEMI tree (work → expressions → manifestations), where expressions
carry `refWork` and manifestations carry `refExpressions`, is pure
declaration:

```graphql
{
  viewMode: ViewModesPipeline
  config: [
    { key: "edgeRelations", value: ["refWork", "refExpressions"] }
  ]
}
```

Note the direction: the *related* entity feeds the entity carrying the
relation, which matches the common pattern of child records pointing at
their parent. The only other config key is `paginationLimit` (default
1000) — a pipeline shows the whole chain, so the mode fetches unpaged
while active and restores the previous limit when the user switches away.

### Typed wiring shapes

Plain relations cannot express everything: the same entity may be used
twice in one flow (so the wiring belongs to the *use*, not the entity),
inputs may be named ports, and an edge may carry a validation verdict. For
that richer wiring the platform defines two **typed shapes** — structure,
never metadata key-name conventions:

- **A `connections` object** — `{ "<port>": { "from": "<producer>|<port>",
  "status"?, "label"? } }`. It can live directly on the entity
  (client-computed, entity-level wiring) or as the value of a single
  relation-metadata entry keyed `connections` on the entity's relation to
  the parent (per-use wiring). `status` (`valid` / `mismatch`, anything
  else renders as unknown) and `label` style the edge and put a badge on
  it — a `mismatch` renders dashed with its label. The status is whatever
  validation already computed elsewhere; the view never validates anything
  itself.
- **A `ports` list on the entity** — `[{ "id"|"name", "direction":
  "in"|"out", "label"?, "required"?, "shapeIri"? }]` — naming the ports,
  and for outputs carrying the shape IRIs that power the port-scoped
  "add a consumer" picker.

How a client fills these shapes is its own business: DiSHACLed's
collection-api derives both from the pipeline definition it already stores,
a client could equally compute them in a GraphQL resolver from data it has
at hand.

All sources combine, and each degrades gracefully when absent. Producer
references and entity identifiers often come from different layers
(component keys versus entity ids), so edge matching is tolerant: it
compares normalized suffixes rather than exact strings.

## Cards

Cards are the ordinary `ListItem` in a dedicated pipeline variant
(`PipelineListItemCard`): fixed width, no multiselect checkbox, no media,
and no click-through navigation — in a flow the card is a node, not a link.
The entity's context menu stays fully functional as a `⋮` in the top-right
corner, so declared actions (configure, connect, delete, …) remain the way
to act on a node.

The teaser metadata is trimmed for the purpose: the entity-type pill is
dropped (in a flow every card is the same kind of thing, so it says
nothing), and fields flagged `hideOnPipelineCard` stay off. That flag is
structural — set by whoever supplies the field: a `dynamicFormConfig`
panel can mark its wiring rows as redundant next to the drawn edges.

## Adding a consumer from a port

An output port whose `ports` entry carries a shape IRI shows a **+** on
hover.
Clicking it runs the type's ordinary declared `addRelation` bulk
operation — the same modal, picker and save path a user gets from the
actions bar — but scoped: the clicked port's IRIs are handed over as the
`$portShapeIris` filter variable.

The scoping filter itself is declared in the picker's own query, exactly
like a `$parentIds` filter:

```graphql
shapeScope: advancedFilter(type: selection, key: ["suggest_for_shape"]) {
  type
  key
  defaultValue(value: "$portShapeIris")
  hidden(value: true)
}
```

The division of labour matters here. The PWA only fills the variable; which
filter key it lands in, and what that key means, is declared per client and
interpreted by that client's backend. A picker whose declaration never
references `$portShapeIris` simply never reads it. When the same picker is
opened any other way (no port clicked) the variable is unresolved and the
filter is sent with an empty value — the backend interpreting the key should
treat an empty value as a no-op, not as "match nothing".

## Legend and statuses

The canvas shows a legend containing only the line styles actually present
in the current graph: a plain line for connections, a dashed line for
mismatches, and — when a catalog suggestion ghost card is shown — the
suggested style. Valid connections render as a plain line with a ✓ badge
rather than a separate line style.

## Translations

The `pipeline.*` labels are client responsibility, like all UI copy: a
client that enables the mode adds them to its translation files. The keys
in use:

`pipeline.add-component`, `pipeline.connect-input-hint`,
`pipeline.consumes`, `pipeline.empty-subtitle`, `pipeline.empty-title`,
`pipeline.fit`, `pipeline.legend-connection`, `pipeline.legend-mismatch`,
`pipeline.legend-suggested`, `pipeline.legend-valid`,
`pipeline.suggested-next-step`.
