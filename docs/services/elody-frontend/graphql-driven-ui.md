# GraphQL-Driven UI

The PWA has no hardcoded entity pages. There is no `CarDetail.vue`, no
per-client form component, no list of fields in TypeScript. A client describes
what an entity page looks like *in its GraphQL query*, and the PWA renders it.

Adding a field to an entity page is editing a query in the client's GraphQL
service. No PWA change, no rebuild of the frontend source.

This page follows one field from its declaration in a query to a bound,
validated, editable input — because that path crosses four systems and every
break along it is silent.

## The spelling: `intialValues`

The field is `intialValues`. The `i` in "initial" is missing.

It is the GraphQL field name on the `Entity` interface, the type name
(`IntialValues`), the resolver filename (`intialValueResolver.ts`), a member of
both the `ValidationFields` and `EntitySubelement` enums, part of
`includeDefaultValuesFromIntialValues`, and — through codegen — part of every
generated TypeScript type. It appears in every client's queries.

Renaming it is a breaking schema change across all clients. It stays. Write
`intialValues` in queries.

::: warning Both spellings are live, one line apart
`createForm` passes the misspelled key *inside* vee-validate's own correctly
spelled option:

```ts
const form = useForm<EntityValues>({
  initialValues: formValues, // vee-validate's option — spelled correctly
});
```

called as:

```ts
createForm(props.id, {
  intialValues: structuredClone(deepToRaw(props.intialValues)), // ours — misspelled
  relationValues: structuredClone(deepToRaw(props.relationValues)),
  // ...
});
```

So `initialValues.intialValues.<key>` is the real shape. Field paths use the
misspelled one.
:::

## Columns

An entity's page layout is `entityView`, a list of columns. Each column has a
size and a set of elements:

```graphql
entityView {
  column {
    size(size: seventy)
    elements {
      Cars: entityListElement { ... }
      WorkOrders: entityListElement { ... }
    }
  }
  column2: column {
    size(size: thirty)
    elements {
      windowElement { ... }
    }
  }
}
```

Two things are load-bearing here.

**The second column is aliased.** `ColumnList` has exactly one field, `column`.
More than one column means aliasing it — `column2`, `column3`. `EntityColumn.vue`
does not read the field by name; it iterates `Object.values(props.columnList)`
and keeps every non-string value. So the alias can be anything, and **column
order follows the response object's key order** — which is your selection order.

**Sizes come from an enum, not from numbers.** `ColumnSizes` is `ten`, `twenty`,
… `hundred`, and `convertSizeToTailwind` maps them to `w-1/10` … `w-9/10` plus
`w-full`. They are tenths of the row, so they should add up to `hundred` —
nothing enforces this. The columns sit in a `flex` container with no wrapping,
so oversubscribing just makes flex shrink them all.

Sizes are also runtime-adjustable: `useColumnResizeHelper` keeps a per-entity
`currentColumnConfig`, which is what the template actually iterates, and an
element can flip the layout to 50/50 by emitting `resizeColumn`.

Each column's `elements` is an `EntityViewElements` — a bag of optional named
element types (`windowElement`, `entityListElement`, `wysiwygElement`,
`mapElement`, `mediaFileElement`, `commentsElement`, …). Same aliasing rule:
two `entityListElement`s in one column means aliasing them, and the alias is
just a key, not something the PWA looks up.

## Labels are i18n keys

No label in a query is display text. `label(input: "metadata.labels.licence-plate")`
is a translation key, and the frontend resolves it:

```vue
<p data-cy="metadata-label">{{ t(metadata.label) }}</p>
```

The keys are dot-notation paths into translation JSON that baseGraphql merges
with the client's own and ships alongside the runtime config. Every `label`,
`tooltip` and `panelHeaderContent` input in a query is a key, never text — see
[Translations](./translations) for where the files live and how the merge works.

::: warning A missing translation key renders as the raw key, silently
`setupI18n` sets `missingWarn: false` and `fallbackWarn: false`, so a label
reading `metadata.labels.licence-plate` in the UI is not a rendering bug — it is
a missing key, and there is nothing in the console about it. See
[When a label shows as `metadata.labels.something`](./translations#when-a-label-shows-as-metadata-labels-something).
:::

## `intialValues`: where the data comes from

`entityView` says how the page is laid out. `intialValues` says what values it is
laid out *around*. It is a single parameterised field:

```graphql
keyValue(key: String, source: KeyValueSource!, ...): JSON
```

One field, so **the only way to ask for more than one value is to alias it** —
which is why every client query looks like this:

```graphql
intialValues {
  identifiers:      keyValue(source: root)
  licence_plate:    keyValue(source: metadata)
  mileage:          keyValue(source: metadata)
  slug:             keyValue(key: "id", source: root)
}
```

The aliases become the property names on the returned object. That object is the
form's initial values, so **the alias is the field path**. This matters in the
next section.

`key` names the property to read and **defaults to the alias**, so it is only
written when the two differ, like `slug` above. See
[`key` defaults to the alias](#key-defaults-to-the-alias).

`source` picks which resolver reads the value off the collection-api document:

| `source` | Reads from |
| --- | --- |
| `root` | a top-level property (dotted keys traverse; backticks escape a literal dot) |
| `metadata` | the `metadata` array, by `key`; multiple or `lang`-tagged entries come back as a list |
| `repeatableMetadata` | a metadata value that is itself a list of objects, optionally projected to one `repeatableMetadataKey` |
| `technicalMetadata` | the `technical_metadata` array |
| `relations` | relations of type `key`; labelled via `keyAsLabel: { origin, key }` (origin `metadata` or `root`; a metadata `key` may list `a\|b` fallbacks), optionally filtered by a relation property |
| `relationMetadata` | metadata stored *on* a relation edge |
| `relationRootdata` | a plain property on a relation edge |
| `metadataOrRelation` | tries metadata first, falls back to a relation |
| `parentRoot` / `parentMetadata` / `parentRelations` | the same, but on an ancestor reached by walking `parentRelations` |
| `typePillLabel` | a label from the type-pill mapping |

Most take a `formatter` too, which wraps the raw value in a display shape
(`pill`, `link|...`) instead of returning a bare string. That has a consequence
for the form path — see the warning at the end of the next section.

### `key` defaults to the alias

Both `keyValue(key:)` and a panel item's `key(input:)` are optional. Left out,
they take the field's alias:

```graphql
intialValues {
  planned_date: keyValue(source: metadata)
}
# ...
planned_date: metaData {
  label(input: "metadata.labels.planned-date")
  inputField(type: baseDateField) { ...inputfield }
}
```

is the same as writing `key: "planned_date"` and `key(input: "planned_date")`.

An explicit `key` always wins. Keep it whenever the name you read differs from
the alias you want:

- the property has another name than the alias: a relation type, a dotted
  path, or `key: "id"` behind `slug`;
- two siblings read the same property, since GraphQL aliases must be unique
  within a selection;
- a consumer expects a fixed alias (the mediafile viewer reads
  `intialValues.external_url`, see
  [External URL Mediafiles](/services/elody-frontend/features/external-url-mediafiles.md)).

**How it works.** The PWA registers an Apollo `DocumentTransform`
(`inuits-dams-pwa/src/aliasAsKeyTransform.ts`) that writes the alias in as the
`key` before a query reaches the cache or the network. Doing this on the client
is not optional. Apollo stores fields by name and arguments, not by alias, so
two keyless `keyValue(source: metadata)` siblings would share one cache entry
and overwrite each other. baseGraphql also accepts a missing `key` and falls back
to the alias (`info.path.key`). The transform result is cached per document, so
it costs nothing per request.

Two limits:

- **The field needs an alias.** A bare `keyValue(source: metadata)` or
  `metaData { }` has no name to default to and still needs its `key`.
- **Matching is by field name** (`keyValue`, `metaData`, `uploadMetadata`): the
  transform has no schema to check types against.

::: warning Base version
The optional `keyValue(key:)` needs baseGraphql 0.10.35 or later. A client
pinned to an older base-graphql fails codegen without the
`key`, so keep writing it there.
:::

## From `intialValues` to a vee-validate field

Four hops, in this order.

**1. `EntityColumn.vue`** takes the entity's `intialValues` and its `entityView`
and normalizes them:

```ts
intialValues.value = determineDefaultIntialValues(
  props.entity.intialValues,
  props.entity.entityView,
);
```

`determineDefaultIntialValues` pulls every `PanelMetaData` out of the column tree
and hands both to `normalizeEmptyInitialValuesByFieldType`, which fixes the
*shape* of empty values. The resolvers return `""` for "nothing there", but `""`
is wrong for a multiselect (which needs `[]`) and wrong for a checkbox (which
needs `false`). Only empty values are touched, and only for those field types.

**2. `EntityForm.vue`** creates the vee-validate form around them:

```ts
const form = ref(
  createForm(props.id, {
    intialValues: structuredClone(deepToRaw(props.intialValues)),
    relationValues: structuredClone(deepToRaw(props.relationValues)),
    relationMetadata: {},
    relatedEntityData: { metadata: {}, relations: {} },
    uuid: props.uuid,
  }),
);
```

Those five keys are the roots of every field path in the form. The form is
registered per entity id in `useFormHelper`, which is how a nested component
several levels down finds it without prop drilling.

**3. `getVeeValidateKey`** turns a `PanelMetaData` into a path. The leaf is
`getKeyBasedOnInputField`:

```ts
if (!metadataItem.inputField?.fieldKeyToSave) return metadataItem.key;
return metadataItem.inputField.fieldKeyToSave;
```

and the root depends on where the value has to be *written*, not where it was
read from. Read-only fields and metadata fields get `intialValues.<key>`. A
relation dropdown gets `relationValues.<relationType>`. Metadata on a relation
edge gets `relationMetadata.<key>`, and so on across the five roots.

**4. `useMetadataWrapper`** binds it:

```ts
const field: FieldContext = useField<MetadataWrapperProps>(
  fieldKey,
  fieldValidationRules,
  { label: fieldLabel },
);
```

`MetadataWrapper.vue` then exposes `field.value` through a `fieldValueProxy`
computed — a get/set pair that also routes through the multilingual composable
when a field `isMultilingual`, and unwraps formatter objects on write. Every
input component in `components/metadata/` binds to that proxy, so read mode and
edit mode share one source of truth and edits land straight in the form state.

::: warning The `intialValues` alias and the panel key must agree
Two places in a query name the same thing, and nothing errors if they don't:

```graphql
intialValues {
  licence_plate: keyValue(source: metadata)       # intialValues alias
}
# ...
licence_plate: metaData {                         # panel key, from the alias
  label(input: "metadata.labels.licence-plate")
}
```

The `intialValues` alias becomes the property on `intialValues`. The panel key
(the panel item's alias, unless it sets `key(input:)`) becomes the vee-validate
path `intialValues.licence_plate`. Giving both the same alias and leaving out
`key` is the simplest way to keep them in step. If they differ, `useField`
resolves a path that does not exist, the field renders empty, and there is no
error in the console, in the network tab, or in the GraphQL response. An empty
field on an entity you know has data is nearly always this.

Two more things shift the path out from under you:

- **`fieldKeyToSave`** wins over `key`. The label and display follow `key`; the
  form path follows `fieldKeyToSave`. That split is deliberate — it is how a
  field reads one property and writes another — but it means the path is not
  always the key you see next to the label.
- **A `formatter` appends `.label`.** When a field's value is a formatter object,
  `getVeeValidateKey` binds to `intialValues.<key>.label` rather than
  `intialValues.<key>`, and `getNewFieldValue` unwraps `{ label }` on write.
:::

## Writing back

Submitting is the same path in reverse. `EntityForm.vue` runs
`parseFormValuesToFormInput(id, form.values, false, locale, fields)` over the
form state and sends the result through the `MutateEntityValues` mutation. The
`fields` argument is the `panelsFields` map `EntityColumn.vue` built by walking
the column tree — keyed by `key || metadataKey` — so the parser knows each
value's field type and can split metadata from relations correctly.

After a successful mutation the response's fresh `intialValues` go back through
`normalizeEmptyInitialValuesByFieldType` before `setValues`, for the same reason
as on the way in. Relation types that the mutation dropped entirely are
explicitly reset to `[]`, because a key absent from the response would otherwise
keep its stale value. Then `resetForm({ values })` re-baselines dirty state so
the form is no longer considered modified.

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`baseModule/baseSchema.schema.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts) | elody-base-graphql | `IntialValues`, `KeyValueSource`, `ColumnList`, `Column`, `PanelMetaData`, `ValidationFields` |
| [`resolvers/intialValueResolver.ts`](https://github.com/inuits/elody-base-graphql/blob/master/resolvers/intialValueResolver.ts) | elody-base-graphql | one resolver per `KeyValueSource` |
| [`src/components/EntityColumn.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/EntityColumn.vue) | elody-pwa | renders columns, builds the `panelsFields` map |
| [`src/components/EntityForm.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/EntityForm.vue) | elody-pwa | creates the form, submits, re-baselines |
| [`src/composables/useFormHelper.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useFormHelper.ts) | elody-pwa | `createForm`, `getKeyBasedOnInputField`, `parseFormValuesToFormInput` |
| [`src/components/metadata/useVeeValidate.ts`](https://github.com/inuits/elody-pwa/blob/master/src/components/metadata/useVeeValidate.ts) | elody-pwa | `getVeeValidateKey` — path routing |
| [`src/components/metadata/useMetadataWrapper.ts`](https://github.com/inuits/elody-pwa/blob/master/src/components/metadata/useMetadataWrapper.ts) | elody-pwa | `useField`, `fieldValueProxy` |
| [`src/components/metadata/MetadataTitle.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/metadata/MetadataTitle.vue) | elody-pwa | `t(metadata.label)` |
| [`src/helpers.ts`](https://github.com/inuits/elody-pwa/blob/master/src/helpers.ts) | elody-pwa | `normalizeEmptyInitialValuesByFieldType`, `convertSizeToTailwind` |
