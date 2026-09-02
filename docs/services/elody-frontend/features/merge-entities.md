# Merge Entities

Cataloguers end up with duplicate records — two `person` entities for the same
author, two manifestations for the same book. Merge turns the pair into one
record in a single step: the user selects exactly two entities of the same type
on any overview, picks which value survives per differing field, and confirms.

One entity is updated (the **survivor**), the other is deleted (the
**victim**), and everything that pointed at the victim is repointed to the
survivor.

## What the user chooses, and what they do not

- **Scalar metadata** is a choice. The modal shows the two records
  side by side and renders a row per field only where the values differ —
  identical values are not worth a decision.
- **Relations are unioned**, server-side, with no choice offered. Two lists of
  authors cannot be reconciled by picking one, and a link from the victim to
  the survivor is dropped, since duplicates often reference each other.
- **Inbound references are repointed** automatically. The modal shows only a
  count, fetched after it opens, so it never blocks on the number.
- **Which record survives** is a two-option radio at the top. It flips which id
  is patched and which is deleted; it does not change the field choices.

The victim is **hard-deleted, and deleted last**. A failure earlier in the
sequence leaves a correct survivor and a recoverable duplicate rather than data
loss. Traceability comes from the history event, not from a tombstone.

Which fields are offered is derived from the entity's own detail view — every
`PanelMetaData` key, minus the identifier and minus `ref*` relation keys. A
panel the client marked `isEditable: false` is skipped, so audit timestamps and
other derived values are not presented as a choice; the survivor keeps its own.
There is no merge form to author.

## Enabling it for a client

Four steps: one in the client's GraphQL service, three in its collection
module. The GraphQL schema, the resolver, the modal and the translations are
all in the base and need no per-client work.

### 1. Add the bulk operation

In the entity's `*BulkOperations` fragment in the client's GraphQL service:

```graphql
{
  label: "bulk-operations.merge"
  value: "mergeEntities"
  primary: false
  bulkOperationModal: {
    typeModal: BulkOperationsMerge
    askForCloseConfirmation: true
    neededPermission: canupdate
  }
  actionContext: {
    activeViewMode: readMode
    entitiesSelectionType: someSelected
    requiresSameType: true
    minSelectedItems: 2
    maxSelectedItems: 2
    labelForTooltip: "tooltip.bulkOperationsActionBar.readmode-someselected"
  }
}
```

`requiresSameType`, `minSelectedItems` and `maxSelectedItems` are what grey the
option out with a reason: selecting a third item, or two subtypes of the same
abstract type, shows a tooltip saying why rather than failing on confirm.

::: warning
The fragment must also select `actionContext { ...actionContext }`. Without it
the constraints arrive `undefined`, the option can never grey out, and the
selection gate silently does not exist. Some older fragments omit it.
:::

### 2. Register the two resources

The base ships the logic but no routes, so a client mounts them on its own
entities blueprint. Both are subclasses, so the client's base resource keeps
supplying policies and parsers:

```python
from resources.base.merge import InboundReferenceCountResource, MergeResource

class ElodyMerge(VlaccBaseResource, MergeResource):
    @apply_policies(RequestContext(request))
    def post(self, id, spec):
        g.enable_parsers = True
        return self.merge(id, spec)

class ElodyInboundReferenceCount(VlaccBaseResource, InboundReferenceCountResource):
    @apply_policies(RequestContext(request))
    def get(self, id, spec):
        return self.inbound_reference_count(id)
```

on `POST /entities/<id>/merge` and
`GET /entities/<id>/inbound-reference-count` — the two paths the base GraphQL
data source calls.

Merge is an update **and** a delete. `neededPermission: canupdate` only greys
the button; the policies on these resources are what actually enforce it.

### 3. Declare the reference shape

`MergeResource` does not know how the client stores references. It reads two
keys off the object configuration of the entity being merged, and raises
`NotImplementedError` if either is missing — it fails closed rather than
merging blind:

```python
def crud(self):
    return {
        ...
        "inbound_reference_sources": lambda document_type, **_: [
            (collection, field),  # e.g. ("entities", "relations.key")
        ],
        "reference_repointer": lambda document, victim_id, survivor_id, **_: (
            patch_or_none
        ),
    }
```

- **`inbound_reference_sources`** returns the `(collection, field)` pairs to
  query for the victim's id. Each becomes one indexed `find`, so the field
  wants an index.
- **`reference_repointer`** returns the patch that swaps the victim's id for
  the survivor's in one found document, or `None` to skip it. Deduplication is
  its job: a document already referencing both must not end up with the
  survivor twice.

Declaring these on one shared configuration base class covers every entity type
that inherits from it.

::: danger
Derive the sources from something that cannot fall out of date, and verify them
against real data before enabling merge for a type. A merge hard-deletes the
victim, so an inbound reference no declaration covers becomes a dangling id
that nothing will ever repair — and it fails silently, with a successful
response.

vlacc derives them from the `_customAttributes.sync` blocks on its validators
and checks them with `apps/reindexer/verify_reference_declarations.py`, which
scans the entity collections for ids of a given type and reports every
`(collection, property)` that no declaration names. Run that against an
environment with real data — a type nobody has linked yet passes trivially.
:::

#### Declaring `sync` blocks on a validator

This is how vlacc does it, and the pattern is worth copying by any client that
stores references as properties rather than in a `relations` array. A relation
is declared on the validator of the type that participates in it, next to the
property itself:

```python
"ref_authors": {
    "items": {"minLength": 1, "type": "string"},
    "type": "array",
    "_customAttributes": {
        "sync": {
            "document_types": [*WORK_TYPES, *EXPRESSION_TYPES, *MANIFESTATION_TYPES],
            "property": "ref_authors",
        },
        "virtual": True,
    },
},
```

Read it as: *documents of these types hold `property`, and that property can
point at me.* `get_sync_declarations` collects them, and
`inbound_reference_sources` turns each `document_types` entry into the
collection its object configuration declares, giving one
`(collection, "properties.<property>.value")` pair per far collection.

Four rules:

- **Declare it on both sides.** The property name is the same on both ends of
  a relation by convention (`ref_authors` on the corporation *and* on the
  work), so each validator mirrors every relation it participates in. Merging
  a corporation needs the corporation's declaration; merging a work needs the
  work's.
- **Use the type-group constants** from `validation/constants.py`
  (`AUTHORITY_TYPES`, `WORK_TYPES`, `EXPRESSION_TYPES`, `MANIFESTATION_TYPES`)
  rather than listing types by hand. A type added to a group is then covered
  everywhere at once.
- **A one-directional property gets no `sync`.** A corporation has
  `ref_places`, but a place holds no list of the corporations based there —
  there is no inbound reference to find, so there is nothing to declare. Say
  so in a comment; an absent declaration otherwise reads as an oversight.
- **`sync` is independent of `virtual`.** `virtual` is what makes a property
  write to the far side instead of being stored; it is read by the
  configuration's relation sync, which never looks at `sync`. So adding a
  `sync` block changes no runtime write behaviour — it is purely a
  declaration, and can be added to an existing type without a migration.
  Declare it on stored properties too: a stored property's reverse edge is
  exactly what makes the victim findable.

A type that can reference *anything* has no useful `document_types` list.
vlacc handles the one case it has — `comment`, via `ref_parent_entity` and
`ref_tagged_entities` — with a fixed `POLYMORPHIC_REFERENCE_SOURCES` map in
`apps/vlacc/references.py`, appended to every type's sources.

::: tip
Write the declarations test-first. `inbound_reference_sources("person")` is a
pure function of the validators, so the expected `(collection, field)` set is
a plain unit test — and it is much easier to reason about there than through a
merge.
:::

### 4. Implement relation carry-over

`MergeResource._carry_over_relations` raises `NotImplementedError`, because
writing relations is the one part with no shared shape. Override it with the
client's own relations resource:

```python
def _carry_over_relations(self, survivor_id, victim_id, spec, document_type):
    victim = self._check_if_collection_and_item_exists(None, victim_id)
    victim = serialize(victim, type=document_type, to_format=spec)
    relations = relations_to_carry_over(
        victim.get("relations", []), survivor_id, document_type
    )
    if not relations:
        return
    # POST is additive and dedupes, so the survivor keeps its own relations.
    ElodyDocumentRelations().post(id=survivor_id, spec=spec, content=relations)
```

Two things to get right, both client-specific:

- **Use the additive write, not the replacing one.** `POST .../relations` adds
  and dedupes; `PUT .../relations` and the json batch endpoint replace every
  relation of a type present in the payload, which would drop the survivor's
  own.
- **Skip virtual relations.** A relation stored on the far side of the link is
  already handled by the repoint in step 3. Carrying it over as well writes a
  key the schema rejects, or duplicates the edge.

Override `_delete_victim` too if the client's delete route differs from the
base `Document().delete`.

## Deliberately not handled

- No N-way merge. The limit is 2, enforced by `maxSelectedItems`.
- No tombstone or `merged_into` reference — hard delete, traceability via the
  history event.
- The metadata patch is not rolled back if a later step fails.
- Cardinality-1 constraints on the far side of an inbound relation are not
  checked; add it when a client actually has one.
