# UI Permissions

The user interface is generated from GraphQL config, so gating a feature on a
permission means gating a piece of config. The GraphQL layer resolves every
permission decision while it builds the response and **omits the config the
user is not allowed to have**. The frontend never evaluates a permission: if a
panel, a menu entry or a context-menu action arrives in the response, it
renders; if it was left out, there is nothing to render.

This is the second half of a two-part system. The
[collection service policies](/services/elody-collection/policies-and-permissions)
are what actually enforce access — they reject the request. The GraphQL layer
only *asks in advance* whether a request would be rejected, so the UI does not
offer a button that is going to fail.

::: warning The GraphQL side hides, it never secures.
A permission declared in the GraphQL service with no matching restriction in
the collection service's role config will probe as allowed, so the UI shows the
feature and the real action still fails. Always write the collection-side
restriction first.
:::

## The two files

Every gated feature involves two per-client files, and they are in different
services:

| File | Role |
| --- | --- |
| `clients/<client>/client-collection-module/api/apps/permissions.py` | The role dictionaries that **enforce**. One per role. See [Policies and Permissions](/services/elody-collection/policies-and-permissions). |
| `clients/<client>/client-frontend/inuits-dams-graphql-service/src/<client>Permissions.ts` | Named **probes** of that enforcement, so the GraphQL layer can decide what config to send. |

The TypeScript file is a plain map from a permission name you invent to the
request that would be attempted:

```ts
export const pzaIotPermissions: { [key: string]: PermissionRequestInfo } = {
  "create:zone": {
    datasource: "CollectionAPI",
    crud: "post",
    uri: `/entities`,
    body: { type: Entitytyping.Zone },
  },
  "read:iot-device-anpr:overview": {
    datasource: "CollectionAPI",
    crud: "post",
    uri: `/entities/filter`,
    body: [
      { type: "type", value: Entitytyping.IotDevice },
      { type: "text", key: ["iot:1|properties.category.value"], value: "anpr" },
    ],
  },
};
```

The map is handed to [`start()`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts) in the client's `main.ts` as
`customPermissions`, and it is merged with whatever the installed modules
contribute — see [Module-contributed permissions](#module-contributed-permissions).

The names are free-form strings. The convention in every existing client is
`<action>:<subject>[:<qualifier>]`, e.g. `create:zone`,
`read:asset-group:overview`, `update:asset:field:access`,
`update:asset-group:remove-ref-assets`. Nothing parses them, so pick a name
that says what the gate protects.

## How a verdict is reached

A probe is executed as a **soft call**: the declared request is sent to the
collection service with `soft=1` appended, which makes the API run the full
policy chain and answer with a status code without performing the write. `200`
means allowed, anything else means denied.

You do not add `soft=1` yourself — the data source appends it (and strips a
leading `/` from `uri`). Write the real endpoint path and the real body you
want tested.

Verdicts are cached in the GraphQL process, keyed on the principal and on the
final substituted request. **Grants are cached for 30 seconds, denials for 5.**
That matters while testing: after changing a role, a grant can lag behind by up
to half a minute, while a denial disappears almost immediately.

A `datasource` of `GraphqlAPI` is also accepted, for permissions that probe the
GraphQL service itself. Those get no entity id, so they cannot be
instance-scoped.

## Adding a gated feature

### 1. Add the restriction on the collection side

Declare in the client's role config which roles may perform the request, using
the object and key restrictions described in
[Policies and Permissions](/services/elody-collection/policies-and-permissions#permission-configuration).
Until this exists, everything below resolves to "allowed".

### 2. Declare the probe

Add an entry to `<client>Permissions.ts` describing the request that the
feature performs. Match it to the real action as closely as possible: a create
button probes `post /entities` with the type it would create; an overview probes
`post /entities/filter` with the filter the overview uses; a relation button
probes the `patch` it would issue, with that relation in the body.

### 3. Reference it from the query document

Every gated field takes the permission name as an argument in the client's
query documents. Which argument depends on the surface — see
[Where a permission can be attached](#where-a-permission-can-be-attached):

```graphql
info: panel(panelType: metadata, can: "read:asset:panel:rights") {
  access: metaData(
    key: "access"
    label: "asset.access"
    readOnly(input: ["update:asset:field:access"])
    permitted(input: ["read:asset-mediafile:field:deferred_access"])
  )
}
```

### 4. Regenerate types

Run `task generate` (or, non-interactively,
`docker exec -w /app <dashboard-container> pnpm run generate`) so the PWA's
generated types match the query documents.

## Where a permission can be attached

| Surface | Field and argument | On denial |
| --- | --- | --- |
| Window panel | `WindowElementPanel.can(input: String)` | panel omitted |
| Metadata field, read | `PanelMetaData.permitted(input: [String!])` | resolves `false` |
| Metadata field, write | `PanelMetaData.readOnly(input: [String!])` | resolves `true` |
| Entity list element | `EntityListElement.can(input: [String!])` | element omitted |
| Hierarchy list element | `HierarchyListElement.can(input: [String])` | element omitted |
| Context-menu actions (5 kinds) | `can(input: [String])` on `ContextMenuGeneralAction`, `ContextMenuElodyAction`, `ContextMenuLinkAction`, `ContextMenuCustomAction`, `ContextMenuQueryAction` | action omitted |
| Bulk-operation option | `can` on the option in `BulkOperationOptions.options` | option omitted |
| Actions-on-result option | `can` on the option in `ActionsOnResult.options` | option omitted |
| Dropdown sub-option | `can` on the option in `DropdownOption.subOptions` | option omitted |
| Menu item | `Menu.menuItem(can: ...)` | item omitted |
| Route | `meta.can` in the client's router config | resolves `meta.permitted: false` |

Options in the other dropdown-shaped lists — `SortOptions.options`,
`PaginationLimitOptions.options` and `DropzoneEntityToCreate.options` — accept
`can` because they share [`DropdownOptionInput`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts), but **nothing evaluates it
there**. A `can` on a sort option is silently ignored. Only the three rows
listed above are filtered.

### Omission versus a resolved flag

Omission is the default because it needs no frontend logic. It is only possible
where the schema allows the field to be absent: a nullable field, or a member
of a list.

`PanelMetaData` is non-null in every client query, so a field cannot be dropped
from a panel — the two verdicts there resolve to booleans instead, and the PWA
hides the field on `permitted: false` and disables it on `readOnly: true`.
Selecting either one **without** an argument means no permission was
configured, which resolves to visible and editable.

The same applies to routes: the router config is a plain object the PWA needs
in full, so `meta.can` is consumed server-side and replaced with a resolved
`meta.permitted`. The `can` key never reaches the browser.

## Entity-scoped permissions

Permissions on a specific record — "may this user edit *this* asset group" —
use placeholders in the probe. `$parentEntityId` and `$childEntityId` are
substituted across the whole config, in the `uri` **and** anywhere in the
`body`:

```ts
"update:asset-group:remove-ref-assets": {
  datasource: "CollectionAPI",
  crud: "patch",
  uri: `/entities/$parentEntityId`,
  body: { relations: [{ key: "$childEntityId", type: "assets" }], type: Entitytyping.AssetGroup },
},
```

Which id fills which placeholder depends on where the gated element is
rendered. In an entity's own detail window, that entity is the parent. In a row
of a list inside another entity's window, the row is the child and the
surrounding entity is the parent — the resolver tags the two cases apart, so
the same permission name substitutes correctly in both places.

For a list rendered inside another entity, the GraphQL layer cannot know the
surrounding entity from the query alone, so the PWA sends it as a request
header:

```ts
{
  headers: { "X-Parent-Entity-Id": parentEntityId ?? "" },
  fetchPolicy: "no-cache",
}
```

::: danger `fetchPolicy: "no-cache"` is required
Apollo Client does not include headers in its cache key. Without `no-cache`, a
query for one parent entity is served from the cache for a different parent,
and the permissions rendered belong to the wrong record.
:::

## Verdicts with no configuration

Not every decision needs an entry in `<client>Permissions.ts`. Some verdicts
are derived from the entity itself, using fixed soft calls, and need no
configuration at all:

- **Entity edit and delete.** `IntialValues.canUpdate` and
  `IntialValues.canDelete` soft-probe a `patch` and a `delete` on that specific
  entity. The PWA maps the pair to an edit mode, so a user with neither gets no
  Edit button. Select both on any entity your view lets the user edit.
- **Comment posting.** `CommentsElement.readOnly` is true unless the user may
  both create a `comment` entity and patch the entity being commented on.
- **Simple search item types.** The app config only offers the item types the
  user may read, so the frontend builds its search filter from the config it
  was handed.
- **Menu items and create modals without a `can`.** A menu item declaring an
  `entityType` falls back to probing create or read on that type. One
  declaring neither `can` nor `entityType` is unconditionally visible.

## Module-contributed permissions

A GraphQL module can ship its own permissions and its own feature flags, so a
feature that lives entirely in a module needs no per-client configuration:

```ts
export const savedSearchModule = {
  ...createModule({ /* ... */ }),
  elodyPermissions: {
    "create:saved_search": {
      datasource: "CollectionAPI",
      crud: "post",
      uri: "/entities",
      body: { type: "saved_search" },
    },
  },
  elodyFeatures: {
    hasSavedSearch: { enabled: true, permission: "create:saved_search" },
  },
};
```

Module permissions are merged with the client's `customPermissions`, which win
on a name collision. A feature declared with a `permission` is resolved in the
app config: the frontend receives `{ enabled: false }` when the probe is
denied, and never learns why.

## Route permissions

A client's router config carries `meta.can`, which the app-config endpoint
resolves per request:

```ts
{
  name: RouteNames.IotDevicesAnpr,
  path: "/devices-anpr",
  meta: {
    can: ["read:iot-device-anpr:overview"],
    alternativeRoutes: { operator: "/devices-tt" },
  },
}
```

The navigation guard then redirects a denied route to the entry in
`alternativeRoutes` matching the user's role. Two details are load-bearing:

- The [guard](https://github.com/inuits/elody-pwa/blob/master/src/routerNavigationGuards.ts) reads verdicts from the **config object** it is handed, not from
  router meta. `createRouter` runs before the post-auth config refetch, so
  router meta may still hold the pre-authentication answer.
- `alternativeRoutes` is still read from router meta. Only the verdict moved
  server-side.

Removing `meta.can` from a route does not lock it down — it makes the route
reachable by everyone.

## Gotchas

**Only the first permission in the list is evaluated.** Every gated field takes
a list, but the resolvers read `can[0]`. A second entry is neither AND nor OR;
it is ignored. Model an "either of two" gate as one probe on the collection
side.

**The defaults are opposite, and both are silent.** An unknown permission name
resolves to *denied*, so a typo makes the feature disappear. A field with no
`can` argument at all resolves to *allowed*, so a gate you forgot to attach
leaves the feature visible. A missing feature is a typo; a visible feature is a
missing gate.

**A permission name is only as specific as its probe.** Two names whose
substituted request is identical share one cache entry and one verdict. If two
gates must differ, their probes must differ.

**`ignorePermissions` does not disable everything.** The flag on the
environment config short-circuits the entity-type soft calls
(`create`/`read` on a type) only. Named custom permissions, entity edit/delete
and comment posting are still probed, so it is not a blanket dev-mode bypass.

**Denials cost a request each.** A gated context-menu action whose probe
substitutes `$childEntityId` is evaluated once per row, because each row's
request genuinely differs. Gates that do not depend on an id collapse to a
single call per request through the cache.

## Where the code lives

| File | Repo | What is in it |
| --- | --- | --- |
| `helpers/permissions.ts` | elody-base-graphql | `evaluateAdvancedPermission` and the per-surface helpers |
| `helpers/permissionCache.ts` | elody-base-graphql | verdict cache and its TTLs |
| [`sources/collection.ts`](https://github.com/inuits/elody-base-graphql/blob/master/sources/collection.ts) | elody-base-graphql | `checkAdvancedPermission` — soft call and placeholder substitution |
| [`endpoints/appConfigEndpoint.ts`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/appConfigEndpoint.ts) | elody-base-graphql | route, feature and simple-search resolution |
| [`baseModule/baseResolver.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseResolver.ts) | elody-base-graphql | per-surface wiring |
| [`baseModule/baseSchema.schema.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts) | elody-base-graphql | which fields accept a permission argument |
| `helpers/moduleContributions.ts` | elody-base-graphql | `elodyPermissions` / `elodyFeatures` collection |
| [`main.ts`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts) | elody-base-graphql | `customPermissions` merge, request context |
| [`src/routerNavigationGuards.ts`](https://github.com/inuits/elody-pwa/blob/master/src/routerNavigationGuards.ts) | elody-pwa | reads `meta.permitted`, redirects |
| [`src/composables/useEditState.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useEditState.ts) | elody-pwa | maps `canUpdate` / `canDelete` to an edit mode |
| [`src/components/metadata/useMetadataWrapper.ts`](https://github.com/inuits/elody-pwa/blob/master/src/components/metadata/useMetadataWrapper.ts) | elody-pwa | applies `permitted` / `readOnly` to a field |
| [`src/components/library/useBaseLibrary.ts`](https://github.com/inuits/elody-pwa/blob/master/src/components/library/useBaseLibrary.ts) | elody-pwa | sends `X-Parent-Entity-Id` |

The three unlinked files are new in this refactor and appear in
[elody-base-graphql](https://github.com/inuits/elody-base-graphql) once it is
merged. The per-client permission maps and the collection-side role
configuration live in the client repositories, which are not public.
