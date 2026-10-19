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

An Elody module is an `ElodyModule` from `base-graphql`
([`helpers/elodyModule.ts`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/elodyModule.ts)).
It bundles a `graphql-modules` module with everything the feature needs at
runtime. `defineElodyModule({ name, ... })` fills every field you leave out
with an empty default:

| Field | What it holds | Merged how |
| --- | --- | --- |
| `name` | The module's name, used in boot errors | — |
| `graphqlModule` | A `createModule()` call from `graphql-modules`: `typeDefs` and `resolvers` | Later definitions override earlier ones |
| `dataSources` | `{ name, source, enabled? }` entries: `AuthRESTDataSource` subclasses, created once per request as `context.dataSources.<name>`. `enabled(environment)` can switch one off | Two modules registering the same `name` is a boot error |
| `endpoints` | `(app, environment) => void` functions that mount Express routes next to `/api/graphql` | Mounted in module order |
| `translations` | Translation keys per locale | Deep merge, later module wins per key |
| `permissions` | The permissions the GraphQL layer can evaluate | By key, later module wins |
| `features` | `features` on `/api/app-configs` | By key, later module wins |
| `inputFields` | The input field definitions forms use | By key, later module wins |
| `formatters` | The [formatters](formatters.md) config | Deep merge |
| `typeCollectionMapping`, `typePillLabelMapping`, `filterMatchers` | Per-type lookups | By key, later module wins |
| `typeUrlMapping` | `{ mapping, reverseMapping }` | Both sides by key |
| `initialize` | `(environment) => void`, run at boot before anything else; throw to refuse to start | — |

Because all of this comes with the module, installing a module is enough to
turn its feature on. Removing it from `modules` turns the feature off.

## How a client puts them together

A client's GraphQL service has a `main.ts` that lists its modules and starts an
`ElodyInstance` from `base-graphql`:

```ts
import { ElodyInstance } from 'base-graphql';
import { mediafileModule } from 'mediafile-module';
import { importModule } from 'import-module';
import { savedSearchModule } from 'saved-search-module';
import { garageModule, garageAppConfig } from './garageModule';

new ElodyInstance({
  appConfig: garageAppConfig,
  modules: [mediafileModule, importModule, savedSearchModule, garageModule],
}).start();
```

At boot, base-graphql puts its own base module first and the client's modules
after it, in the order listed. It runs every module's `initialize`, merges
their contributions, and builds one `graphql-modules` application from their
`graphqlModule`s. On every request, each enabled data source class is created
with the user's session and tenant under its `name` in `context.dataSources`.

List the client's own module last: on a key clash it then overrides what the
shared modules contribute.

`CollectionAPI` is the only data source a request can't do without. If it is
missing, the request fails with `Missing required data sources: CollectionAPI`.
The data sources that modules add are optional.

::: warning A later module silently wins
A type or resolver declared twice doesn't cause an error: the module later in
the list overrides the earlier one. Before you add a type to a module, search
`baseModule/baseSchema.schema.ts` for it. A stale copy in a module will shadow
the base version, and nothing will tell you it happened.
:::

### Required settings

A module that can't work without some configuration checks it in
`initialize`. `requireSettings` maps an environment path to the env variable
that sets it, and throws when the value is missing or empty. Values set in
`appConfig` count too, since it reads the merged environment:

```ts
initialize: (environment) =>
  requireSettings(environment, {
    'api.fileSystemImporterServiceUrl': 'FILE_SYSTEM_IMPORTER_URL',
  }),
```

base-graphql runs every module's `initialize` and reports all failures in one
error, so the service refuses to start with a list of what to configure:

```
Elody modules failed to initialize:
- importModule: settings are not set: FILE_SYSTEM_IMPORTER_URL
```

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

### baseGraphql

[inuits/elody-base-graphql](https://github.com/inuits/elody-base-graphql) is
the foundation. It is a library rather than a service: it exports
`ElodyInstance`, `defineElodyModule` and `requireSettings`, and a client's
`main.ts` is what runs it. It is also the first module in every instance.

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

All of these come with `mediafileModule` itself: listing it in `modules`
registers its data sources and mounts its endpoints.

### importModule

[inuits/elody-import-module](https://github.com/inuits/elody-import-module)
lets users browse the file-system importer's folders and start an import from
the PWA.

- **Schema:** the `Directories(dir)` query and the
  `postStartImport(folder)` mutation.
- **Data source:** `ImportAPI`, which calls the importer at
  `api.fileSystemImporterServiceUrl`.

The URL is set with `FILE_SYSTEM_IMPORTER_URL`, which has no default. The
module requires it in `initialize`, so an instance that lists `importModule`
without it refuses to start (see [Required settings](#required-settings)).
Don't install the module before the importer service is deployed.

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

## Writing your own module

A client's own module, such as `garageModule`, is built the same way as the
shared ones:

```ts
import { createModule } from 'graphql-modules';
import {
  baseSchema,
  defineElodyModule,
  loadTranslationsFromDirectory,
} from 'base-graphql';
import path from 'path';
import { garageSchema } from './garageSchema.schema';
import { garageResolver } from './garageResolver';
import { GarageCollectionAPI } from './sources/garageCollection';
import { garageRedirectEndpoint } from './endpoints/garageRedirectEndpoint';
import { garageFields } from './garageFields';
import { garagePermissions } from './garagePermissions';
import { garageFormattersConfig } from './garageFormatters';
import { garageTypeCollectionMapping } from './garageTypeCollectionMapping';

declare module 'base-graphql' {
  interface DataSources {
    GarageCollectionAPI: GarageCollectionAPI;
  }
}

export const garageModule = defineElodyModule({
  name: 'garageModule',
  graphqlModule: createModule({
    id: 'garageModule',
    dirname: __dirname,
    typeDefs: [baseSchema, garageSchema],
    resolvers: [garageResolver],
  }),
  dataSources: [{ name: 'GarageCollectionAPI', source: GarageCollectionAPI }],
  endpoints: [garageRedirectEndpoint],
  translations: loadTranslationsFromDirectory(path.join(__dirname, 'translations')),
  inputFields: garageFields,
  permissions: garagePermissions,
  formatters: garageFormattersConfig,
  typeCollectionMapping: garageTypeCollectionMapping,
});
```

Leave out any field the module doesn't need; `defineElodyModule` fills it
with an empty default.

Put code in a shared module only if more than one client needs it. Behaviour
specific to one client belongs in that client's module. When something moves
from a client into a shared module, publish the module first, then bump the
version in each client that uses it. See [Build Pipeline](build-pipeline.md)
for the order.
