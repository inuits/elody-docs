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

Because the mode shows a whole chain, it fetches unpaged: on activation the
pagination limit is raised to 1000 (configurable, see below) and restored
when the user switches away.

## How the flow is computed

Everything the view knows about wiring comes from two metadata conventions,
both optional per entity:

- **Connections** — relation metadata on the entity's relation to the parent,
  keyed `connections.<port>.from` with a value of the form
  `"<producer-id>|<port>"`. Each such entry draws an edge from the producer's
  output port to this entity's input port. Optional sibling keys
  `connections.<port>.status` (`valid` / `mismatch`, anything else renders as
  unknown) and `connections.<port>.label` style the edge and put a badge on
  it — a `mismatch` renders dashed with its label, so an incompatible wiring
  is visible at a glance. The status is whatever validation already computed
  elsewhere; the view never validates anything itself.
- **Contracts** — plain metadata values `contracts.consumes` and
  `contracts.produces` (human-readable labels) become the card's chip row and
  drive the implicit single input/output port when an entity declares no
  explicit ports. `contracts.produces.iri` may carry one or more
  space-separated shape IRIs; a port that knows its IRIs gets the
  "add a consumer" affordance described below.

Producer references and entity identifiers often come from different layers
(component keys versus entity ids), so edge matching is tolerant: it
compares normalized suffixes rather than exact strings.

None of these key names is hardcoded. They are defaults of a
`PipelineViewConfig` resolved from the view mode's generic config channel.
Every key below is optional; the values shown ARE the defaults, so a bare
`{ viewMode: ViewModesPipeline }` behaves exactly like this. A client whose
metadata uses different names overrides the relevant key instead of
renaming its data (e.g. `connectionsKey: "wiring"`).

```graphql
{
  viewMode: ViewModesPipeline
  config: [
    { key: "connectionsKey", value: "connections" }  # wiring metadata prefix
    { key: "contractsKey", value: "contracts" }      # contract chip prefix
    { key: "consumesField", value: "consumes" }
    { key: "producesField", value: "produces" }
    { key: "shapeIriField", value: "iri" }           # port shape IRIs
    { key: "paginationLimit", value: 1000 }
    { key: "addConsumerBulkOperation", value: "addRelation" }
    { key: "edgeRelations", value: [] }              # see next section
  ]
}
```

This is the same pattern the map view mode already uses for
`keyToExtractCoordinates` and friends: the query says which metadata keys
carry the data, the PWA carries no client vocabulary.

### Relation-driven edges

For a plain hierarchy there is a third, even simpler wiring source:
`edgeRelations` names relation types that *are* the wiring. For every
relation of such a type on an entity, an edge is drawn from the related
entity (the producer) to that entity, read straight from the
`relationValues` the listing already selects — no connection metadata, no
computed field, no resolver work. A WEMI tree (work → expressions →
manifestations), where expressions carry `refWork` and manifestations carry
`refExpressions`, becomes pure declaration:

```graphql
{
  viewMode: ViewModesPipeline
  config: [
    { key: "edgeRelations", value: ["refWork", "refExpressions"] }
  ]
}
```

The three sources combine: an entity's explicit `connections` object, the
`connections.<port>.from` relation metadata, and declared edge relations
all contribute edges. Note the direction: the *related* entity feeds the
entity carrying the relation, which matches the common pattern of child
records pointing at their parent.

## Cards

Cards are the ordinary `ListItem` in a dedicated pipeline variant
(`PipelineListItemCard`): fixed width, no multiselect checkbox, no media,
and no click-through navigation — in a flow the card is a node, not a link.
The entity's context menu stays fully functional as a `⋮` in the top-right
corner, so declared actions (configure, connect, delete, …) remain the way
to act on a node.

The teaser metadata is rearranged for the purpose: the entity-type pill is
dropped (in a pipeline everything is the same kind of thing, so it says
nothing), the contract facts render as a chip row, and bookkeeping under the
contracts/connections prefixes stays off the card — the edges already draw
what feeds what.

## Adding a consumer from a port

An output port whose contract carries shape IRIs shows a **+** on hover.
Clicking it runs the type's ordinary declared bulk operation (default
`addRelation`) — the same modal, picker and save path a user gets from the
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
