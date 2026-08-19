# Bulk Edit

Bulk edit lets a user change metadata and relations on many entities at once.
It appears as a bulk operation in the action bar once several items are
selected, and opens a modal with the selection on the left and one form on the
right.

There is no bulk-edit form to author. You list the entity types' existing
**create form queries**, and the frontend fetches them, diffs their field sets
and renders one merged form:

- a field every selected type has is shown once, unscoped;
- a field only some types have is shown with a note saying how much of the
  selection it applies to, and is only written to those types;
- when two types use a different input field for the same key, the widest
  group wins and the modal warns about the types that lose the field — writing
  a value picked from the wrong option list is worse than not offering it.

Only the fields the user actually touched are written. Each field also has a
toggle to clear it, and relation fields are written in one mode chosen at
submit time: **add**, **remove** or **replace**.

## Enabling it for a client

Add a bulk operation to the entity's list options in the client's GraphQL
service. The whole configuration is the list of form queries:

```graphql
{
  icon: Edit
  label: "bulk-operations.bulk-edit-works"
  value: "bulkUpdateMetadata"
  bulkOperationModal: {
    typeModal: BulkOperationsEdit
    formQueries: [
      "GetFullWorkMapCreateForm"
      "GetFullWorkWordCreateForm"
      "GetFullWorkSerialCreateForm"
    ]
    askForCloseConfirmation: true
    neededPermission: canupdate
  }
}
```

Every listed query must be a form whose `FormAction` carries a
`creationType` — that is how a form tells the frontend which entity type it
belongs to, so no type-to-query mapping is needed. A query that cannot be
resolved, or a form without a `creationType`, is skipped with a console
warning instead of breaking the modal. A selected type that none of the
queries describe is reported in the modal and left untouched.

That is all. Bulk edit now writes through the per-entity `bulkEditEntities`
mutation, which every client supports: one request per entity type for the
metadata, plus one for the relation change.

## Optional: the json batch transport

A client can instead write the metadata (and relation *replacements*) in a
single request, through the same bulk-update endpoint the CSV bulk edit uses.
This gives job tracking and one history entry per entity for free.

::: warning
This is opt-in for a reason. `PUT /entities` means two opposite things
depending on the client. Where it is routed to the patch-only batch resource
it merges metadata by key. Where it is not, it is a **full document replace**
that answers `201` — a partial bulk-edit document would then delete every
field it does not carry, and report success. Do not enable the flag before the
other two steps are in place.
:::

Three steps:

1. **Route `PUT /entities` to the batch resource.** Clients using the base
   elody spec resources get this from
   `resources/base/documents.py`, gated on the `edit` bulk operation feature
   in `apps/mappers.py`'s `FEATURES`. A client with its own entities resource
   does it like vlacc's `ElodyDocuments.put`:

   ```python
   def put(self, spec):
       return Batch().post(spec=spec, force_patch_only=True)
   ```

2. **Parse the json body.** The batch resource picks its serializer from the
   `_default` object configuration as
   `from_{content_type}_to_{SCHEMA_TYPE}`, so the method name has to carry
   the client's schema type. The parsing itself is generic and lives in the
   base collection-api, so this is a delegation:

   ```python
   from serialization.json_batch import serialize_json_batch

   class MyClientSerializer:
       def from_applicationjson_to_myclient(self, data, **kwargs):
           return serialize_json_batch(data, **kwargs)
   ```

   Pass `umbrella_types={...}` if the client has abstract types that must not
   be written to directly. A client with no `_default` in `apps/mappers.py`
   falls back to a configuration whose serialization is the identity — the
   batch endpoint does not work at all there, so add one first.

3. **Flip the flag** in the client's app config:

   ```ts
   features: {
     supportsJsonBulkEdit: true,
   }
   ```

Without the flag the GraphQL resolver reports that nothing was written, and
the frontend writes the same edit through the per-entity mutation. So a
misconfigured client degrades to the slower path rather than losing data.

Relation **add** and **remove** always go through the mutation, whatever the
flag says: the batch endpoint overwrites every relation of a type present in
the payload, which is exactly what *replace* means and exactly what *add* must
not do.
