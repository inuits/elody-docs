# GraphQL Modules

The GraphQL service is not one codebase. It is assembled from
[graphql-modules](https://the-guild.dev/graphql/modules) modules: one base
module that every deployment runs, a few optional modules a client picks from,
and the client's own module on top. This page explains how they fit together
and what each shared module adds.

```
                ┌──────────────────────────────────────────┐
                │ client GraphQL service (main.ts)         │
                │                                          │
                │   garageModule      ← the client's own   │
                │   savedSearchModule ┐                    │
                │   importModule      ├ optional, opt-in   │
                │   mediafileModule   ┘                    │
                │   baseModule        ← always, from       │
                │                       base-graphql       │
                └──────────────────────────────────────────┘
```

## What a module is

A module is a `createModule()` call from `graphql-modules` with an `id`, its
`typeDefs` and its `resolvers`. Elody wraps that in an `ElodyModuleConfig`,
which can also carry what the module needs at runtime:

| Field | What it holds |
| --- | --- |
| `modules` | The `graphql-modules` modules: schema and resolvers |
| `dataSources` | `AuthRESTDataSource` subclasses, created once per request and available as `context.dataSources.*` |
| `endpoints` | `(app, environment) => void` functions that mount Express routes next to `/api/graphql` |

A module can also attach three things to the module object itself. base-graphql
collects them from every installed module, so a client doesn't configure them:

| Property | Merged into | A client overrides it with |
| --- | --- | --- |
| `elodyPermissions` | The permissions the GraphQL layer can evaluate | `customPermissions` |
| `elodyFeatures` | `features` on `/api/app-configs` | — |
| `elodyInputFields` | The input field definitions forms use | `customInputFields` |

Because these come with the module, installing a module is enough to turn its
feature on. Removing it from `modules` turns the feature off.

## How a client puts them together

A client's GraphQL service has a `main.ts` that lists its modules and starts an
`ElodyInstance` from `base-graphql`:

```ts
import { ElodyInstance, type ElodyModuleConfig } from 'base-graphql';
import { mediafileElodyConfig } from 'mediafile-module';
import { importModule, ImportAPI } from 'import-module';
import { savedSearchModule } from 'saved-search-module';
import { garageModule, garageAppConfig, garageTranslations } from './garageModule';
import { garagePermissions } from './garagePermissions';

const garageElodyConfig: ElodyModuleConfig = {
  modules: [
    ...mediafileElodyConfig.modules,
    importModule,
    savedSearchModule,
    garageModule,
  ],
  dataSources: { ...mediafileElodyConfig.dataSources, ImportAPI },
  endpoints: mediafileElodyConfig.endpoints,
};

new ElodyInstance({
  customModuleConfig: garageElodyConfig,
  appConfig: garageAppConfig,
  customTranslations: garageTranslations,
  customPermissions: garagePermissions,
}).start();
```

At boot, base-graphql puts its own `baseModule` first and appends the
client's modules after it, in the order listed. It then builds one
`graphql-modules` application from the whole list. On every request, each
data source class is created with the user's session and tenant, and the
results are merged into `context.dataSources`.

`CollectionAPI` is the only data source a request can't do without. If it is
missing, the request fails with `Missing required data sources: CollectionAPI`.
The data sources that modules add are optional.

::: warning A later module silently wins
A type or resolver declared twice doesn't cause an error: the module later in
the list overrides the earlier one. Before you add a type to a module, search
`baseModule/baseSchema.schema.ts` for it. A stale copy in a module will shadow
the base version, and nothing will tell you it happened.
:::

### Extending the shared types

Modules extend base-graphql's TypeScript types through declaration merging.
That is how `context.dataSources.ImportAPI` is typed inside a resolver:

```ts
declare module 'base-graphql' {
  interface DataSources {
    ImportAPI: ImportAPI;
  }
}
```

In the schema, modules extend the base enums the same way, for example
`enum Entitytyping { saved_search }`. In `graphql-modules`, a second
declaration of an enum merges its values into the first one.

## The modules

Every shared module is its own repository and its own npm package, and is
published to Nexus (see [Build Pipeline](build-pipeline.md#_1-modules-publish-to-nexus)).
In `elody-common` they are checked out under `modules/`.

| Module | npm package | Required | Repository |
| --- | --- | --- | --- |
| [baseGraphql](#basegraphql) | `base-graphql` | Yes | [inuits/elody-base-graphql](https://github.com/inuits/elody-base-graphql) |
| [mediafileModule](#mediafilemodule) | `mediafile-module` | No, but every DAMS client uses it | [inuits/elody-mediafile-module](https://github.com/inuits/elody-mediafile-module) |
| [importModule](#importmodule) | `import-module` | No | [inuits/elody-import-module](https://github.com/inuits/elody-import-module) |
| [savedSearchModule](#savedsearchmodule) | `saved-search-module` | No | [inuits/elody-saved-search-module](https://github.com/inuits/elody-saved-search-module) |
| [advancedSearchModule](#advancedsearchmodule) <Badge type="danger" text="deprecated" /> | `advanced-search-module` | No; no client loads it | [inuits/elody-advanced-search-module](https://github.com/inuits/elody-advanced-search-module) |

### baseGraphql

[inuits/elody-base-graphql](https://github.com/inuits/elody-base-graphql) is
the foundation. It is a library rather than a service: it exports `start()`
and `ElodyInstance`, and a client's `main.ts` is what runs it.

- **Server:** Express with Apollo Server, CORS, CSP, compression, a query
  depth limit, sessions (in memory or MongoDB), and OpenTelemetry tracing.
  It also serves the PWA: through Vite in development, as static files in
  production. See [Production Serving](production-serving.md).
- **Auth:** the OIDC login flow, token refresh, and `AuthRESTDataSource`, the
  base class every data source extends so that downstream calls carry the
  user's token. See [Auth & Session](auth-session.md).
- **Schema (`baseModule`):** `Entity` and its metadata, relations, forms and
  input fields, menus, bulk operations, advanced filters, formatters,
  permissions, history and jobs. These are the types the
  [GraphQL-driven UI](graphql-driven-ui.md) is built from.
- **Data sources:** `CollectionAPI` (required) and `GraphqlAPI`.
  `HistoryServiceAPI` is added only when a history service URL is configured.
- **Endpoints:** `/api/graphql`, `/api/app-configs`, `/api/me`, the auth
  routes, CSV upload/download/export, health, version, SEO, Prometheus, and the
  [Linked Open Data](features/linked-open-data.md) negotiation. See
  [Proxy Endpoints](proxy-endpoints.md).
- **Helpers:** the route helper (`getRoutesObject` and the `Route` type),
  `loadTranslationsFromDirectory`, and entity resolvers such as `resolveId`,
  `resolveMetadata` and `resolveRelations` that client resolvers reuse.

To start a new client, copy `examples/starter-client-graphql-service`. It is
the smallest service that boots.

### mediafileModule

[inuits/elody-mediafile-module](https://github.com/inuits/elody-mediafile-module)
handles everything about files: the `MediaFile` type, uploading them, and
getting them back out.

- **Schema:** `MediaFile` and `MediaFileEntity`, with queries such as
  `FetchMediafilesOfEntity`, `GetPrimaryMediafileFromEntity`,
  `DownloadItemsInZip` and `GenerateOcrWithAsset`, and mutations for
  metadata, transcodes and linking a mediafile to an entity.
- **Data sources:** `MediafileAPI`, `MediafileTranscodeService` (registered as
  `TranscodeService`), `StorageAPI` and `OcrService`.
- **Endpoints:** `/api/upload/batch` and `/api/upload/single`,
  `/api/download/zip/:id`, `/api/mediafile/*` (streams a file from
  storage-api), and the `/api/iiif/*` proxy that the
  [media viewers](features/media-viewers.md) load images and manifests from.

It is the only module that ships endpoints, so it exports a ready-made
`mediafileElodyConfig` rather than a bare module. Spread its `modules`,
`dataSources` and `endpoints` into your config, as in the example above.

### importModule

[inuits/elody-import-module](https://github.com/inuits/elody-import-module)
lets users browse the file-system importer's folders and start an import from
the PWA.

- **Schema:** the `Directories(dir)` query and the
  `postStartImport(folder)` mutation.
- **Data source:** `ImportAPI`, which calls the importer at
  `api.fileSystemImporterServiceUrl`.

When that URL is not set, the resolvers return empty results instead of
failing. A client can therefore install the module before the importer
service is deployed.

### savedSearchModule

[inuits/elody-saved-search-module](https://github.com/inuits/elody-saved-search-module)
adds the "save this search" feature. A saved search is an ordinary entity of
type `saved_search`, stored by collection-api, so the module has no data
source and no endpoints.

- **Schema:** the `SavedSearch` type, the `saved_search` entity type and a
  `privacyTypeField` input field.
- **Queries:** the fragments and the `GetSaveSearchForm` query that the PWA's
  codegen picks up.
- **Contributions:** the `create:saved_search` permission and a
  `savedSearch` feature flag gated by that permission. A user who may not
  create a saved search gets `savedSearch.enabled: false` from
  `/api/app-configs`, and the PWA hides the button.

It is the example to follow for a module that turns a feature on just by
being installed. On the collection-api side, the client must register
`saved_search` as an object configuration first. Otherwise the permission
check fails and the feature is reported as disabled.

### advancedSearchModule <Badge type="danger" text="deprecated" /> {#advancedsearchmodule}

::: danger Deprecated
Don't use this module in new clients, and don't add types to it. It will be removed.
:::

[inuits/elody-advanced-search-module](https://github.com/inuits/elody-advanced-search-module)
contains only schema: the input types of an older advanced search. It has no
resolvers, and no client in `elody-common` loads it. Several of its types
(`FilterInput`, `MinMaxInput`, `TextInput`) also exist in `baseModule`, so it
falls under the warning above. Filtering is part of baseGraphql now; see
[Advanced Filtering](/services/elody-collection/advanced-filtering) for the
backend side.

## Writing your own module

A client's own module, such as `garageModule`, is built the same way as the
shared ones:

```ts
import { createModule } from 'graphql-modules';
import { baseSchema, loadTranslationsFromDirectory } from 'base-graphql';
import path from 'path';
import { garageSchema } from './garageSchema.schema';
import { garageResolver } from './garageResolver';

export const garageTranslations = loadTranslationsFromDirectory(
  path.join(__dirname, 'translations')
);

export const garageModule = createModule({
  id: 'garageModule',
  dirname: __dirname,
  typeDefs: [baseSchema, garageSchema],
  resolvers: [garageResolver],
});
```

Put code in a shared module only if more than one client needs it. Behaviour
specific to one client belongs in that client's module. When something moves
from a client into a shared module, publish the module first, then bump the
version in each client that uses it. See [Build Pipeline](build-pipeline.md)
for the order.
