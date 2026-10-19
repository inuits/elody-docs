# Building a Module

This guide builds a shared Elody module from an empty repository to a client
that runs it. It assumes you have read [GraphQL Modules](graphql-modules.md),
which explains what a module is and how an instance merges them.

The example is `partsCatalogueModule` for the [garage network](/example-domain).
The network runs a parts catalogue service that collects supplier prices and
delivery times. The module lets a service advisor look up offers for a `part`
and order one, from inside Elody.

When you're done, a client turns the feature on by listing one more module:

```ts
new ElodyInstance({
  appConfig: garageAppConfig,
  modules: [mediafileModule, partsCatalogueModule, garageModule],
}).start();
```

## Shared module or client module?

Write a shared module when more than one client needs the feature. Code that
only one client needs belongs in that client's own module, which is built
the same way but lives in the client's GraphQL service. Every step below also
applies to a client module; only the repository and publishing steps differ.

## 1. Create the repository

A shared module is its own git repository and its own npm package. In
`elody-common` it is checked out under `modules/`, next to the shared modules:

```
modules/partsCatalogueModule/
├── .gitlab-ci.yml
├── .npmignore
├── codegen.ci.ts
├── package.json
├── tsconfig.json
├── partsCatalogueModule.ts            ← the module definition
├── partsCatalogueSchema.schema.ts     ← typeDefs
├── partsCatalogueResolver.ts          ← resolvers
├── partsCataloguePermissions.ts
├── sources/
│   └── partsCatalogue.ts              ← the data source
├── queries/
│   └── partsCatalogue.queries.ts      ← documents the PWA uses
└── translations/
    ├── en.json
    └── nl.json
```

The file names are load-bearing: the workspace codegen collects
`modules/*/*.schema.ts` and `modules/*/queries/*.queries.ts`. A schema in a
subfolder or a query file outside `queries/` is silently left out.

Add the repository to `repositories.txt` in `elody-common`, so `task
clone-repos` checks it out for everyone:

```
ssh://git@gitlab.inuits.io:2224/rnd/inuits/dams/parts-catalogue-module.git modules/partsCatalogueModule
```

**`package.json`.** `base-graphql` is a peer dependency, so the module
uses the client's copy instead of bundling its own. `main` points at the
TypeScript source for local development; `publishConfig` switches it to the
build output when the package is published.

```json
{
  "name": "parts-catalogue-module",
  "version": "0.0.1",
  "license": "MIT",
  "main": "./partsCatalogueModule.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@graphql-codegen/add": "^4.0.1",
    "@graphql-codegen/cli": "^4.0.1",
    "@graphql-codegen/typescript-resolvers": "^2.7.13",
    "@types/node": "^22.13.14",
    "graphql": "^16.9.0",
    "graphql-modules": "^2.1.0",
    "typescript": "^5.0.0"
  },
  "peerDependencies": {
    "base-graphql": "*"
  },
  "devDependencies": {
    "base-graphql": "*"
  },
  "publishConfig": {
    "main": "./dist/partsCatalogueModule.js",
    "types": "./types/partsCatalogueModule.d.ts",
    "registry": "https://nexus.inuits.io/repository/npm-private"
  }
}
```

Copy `tsconfig.json`, `.npmignore` and `codegen.ci.ts` from
[elody-saved-search-module](https://github.com/inuits/elody-saved-search-module).
The `.gitlab-ci.yml` only includes the shared pipeline:

```yaml
include:
  - project: 'inuits/gitlab-ci/pipeline-templates'
    file: 'pipelines/applications/graphql-module-pipeline.yml'
    ref: 'v4.20.0'
```

## 2. Write the schema

The schema adds the module's own types and extends `Query` and `Mutation`:

```ts
// partsCatalogueSchema.schema.ts
import { gql } from 'graphql-modules';

export const partsCatalogueSchema = gql`
  type CatalogueOffer {
    supplier: String!
    price: Float!
    deliveryDays: Int!
  }

  type PartOrder {
    orderId: String!
    expectedDelivery: String!
  }

  extend type Query {
    CatalogueOffers(partNumber: String!): [CatalogueOffer!]!
  }

  extend type Mutation {
    orderPart(partNumber: String!, supplier: String!, quantity: Int!): PartOrder
  }
`;
```

Before you add a type, search `baseModule/baseSchema.schema.ts` and the other
shared modules for its name. A second definition doesn't cause an error: the
later module silently replaces the earlier one (see
[GraphQL Modules](graphql-modules.md#how-a-client-puts-them-together)).
Prefix new types with the feature, as `CatalogueOffer` does, to stay out of
the way.

## 3. Add the data source

The data source talks to the parts catalogue service. Extend
`AuthRESTDataSource`, so each call carries the user's token, request id and
tenant (see [Proxy Endpoints](proxy-endpoints.md)):

```ts
// sources/partsCatalogue.ts
import { AuthRESTDataSource } from 'base-graphql';

export class PartsCatalogueAPI extends AuthRESTDataSource {
  public baseURL = `${this.environment.partsCatalogue?.url}/`;

  async getOffers(partNumber: string) {
    return await this.get(`offers/${encodeURIComponent(partNumber)}`);
  }

  async orderPart(partNumber: string, supplier: string, quantity: number) {
    return await this.post('orders', {
      body: { part_number: partNumber, supplier, quantity },
    });
  }
}
```

A new instance is created for every request, with that request's session.
Don't keep state on it between requests.

Tell TypeScript about it, so resolvers see `context.dataSources.PartsCatalogueAPI`:

```ts
declare module 'base-graphql' {
  interface DataSources {
    PartsCatalogueAPI: PartsCatalogueAPI;
  }
}
```

## 4. Declare and require the setting

The data source needs the catalogue service's URL. Declare the setting on the
environment, so clients can set it in `appConfig` and the module can read it
with types. Both interfaces need it: `FullyOptionalEnvironmentInput` is what a
client's `appConfig` is checked against, `Environment` is what modules
receive.

```ts
declare module 'base-graphql' {
  interface Environment {
    partsCatalogue?: { url?: string };
  }
  interface FullyOptionalEnvironmentInput {
    partsCatalogue?: { url?: string };
  }
}
```

Give it no default. A default that only works in local Docker turns a
missing setting in a hosted environment into a confusing runtime failure.
Instead, require it in `initialize`, so an instance without it refuses to
start:

```ts
initialize: (environment) =>
  requireSettings(environment, {
    'partsCatalogue.url': 'PARTS_CATALOGUE_URL',
  }),
```

The second value is the env variable that sets it, so the boot error tells
the operator exactly what to configure:

```
Elody modules failed to initialize:
- partsCatalogueModule: settings are not set: PARTS_CATALOGUE_URL
```

`initialize` can do any other check the same way: throw an `Error`, and
base-graphql adds it to the list with your module's name.

## 5. Write the resolvers

Resolvers are typed from the module's `generated-types/type-defs.ts`, which
codegen writes (see [step 9](#_9-run-it-locally)). Read the data source from
the context:

```ts
// partsCatalogueResolver.ts
import { ContextValue } from 'base-graphql';
import { Resolvers } from './generated-types/type-defs';

export const partsCatalogueResolver: Resolvers<ContextValue> = {
  Query: {
    CatalogueOffers: async (_source, { partNumber }, { dataSources }) =>
      await dataSources.PartsCatalogueAPI.getOffers(partNumber),
  },
  Mutation: {
    orderPart: async (_source, { partNumber, supplier, quantity }, { dataSources }) =>
      await dataSources.PartsCatalogueAPI.orderPart(partNumber, supplier, quantity),
  },
};
```

You don't need to check whether `PartsCatalogueAPI` exists: the module
registers it itself, and `initialize` has already stopped an instance without
a URL.

## 6. Gate it with a permission

Only users who may add parts to a garage's inventory should order them. A
permission is a probe: a request the GraphQL layer dry-runs against
collection-api to see whether the user may make it (see
[UI Permissions](permissions.md)). Match it to what ordering really does.
Ordering adds stock, so it probes the create of a `part`:

```ts
// partsCataloguePermissions.ts
export const ORDER_PART_PERMISSION = 'order:part';

export const partsCataloguePermissions = {
  [ORDER_PART_PERMISSION]: {
    datasource: 'CollectionAPI',
    crud: 'post',
    uri: '/entities',
    body: { type: 'part' },
  },
};
```

A probe can use `CollectionAPI` or `GraphqlAPI`, not the module's own data
source. The collection side decides the verdict through each client's role
config. Until a client restricts `part`, the probe allows everyone.

A **feature flag** tells the PWA the feature is on. Name its permission, and
a user who fails the probe gets `{ enabled: false }` on `/api/app-configs`:

```ts
features: {
  partsCatalogue: { enabled: true, permission: ORDER_PART_PERMISSION },
},
```

The PWA only reacts to flags it has code for, so a new flag is the contract
between your module and the frontend work that uses it.

## 7. Add translations

Labels the module's query documents use live in the module, one JSON file per
language. Each file wraps its keys in the language code:

```json
{
  "en": {
    "partsCatalogue": {
      "offers": "Supplier offers",
      "deliveryDays": "Delivery (days)",
      "order": "Order part"
    }
  }
}
```

`loadTranslationsFromDirectory` reads the folder. Nest everything under the
feature name: a client can override any key from its own module, and a
shared prefix keeps your keys from colliding with theirs. See
[Translations](translations.md).

## 8. Write the query documents

The PWA runs documents, not schema. Put them in `queries/`, where codegen
finds them:

```ts
// queries/partsCatalogue.queries.ts
import { gql } from 'graphql-modules';

export const partsCatalogueQueries = gql`
  query GetCatalogueOffers($partNumber: String!) {
    CatalogueOffers(partNumber: $partNumber) {
      supplier
      price
      deliveryDays
    }
  }

  mutation OrderPart($partNumber: String!, $supplier: String!, $quantity: Int!) {
    orderPart(partNumber: $partNumber, supplier: $supplier, quantity: $quantity) {
      orderId
      expectedDelivery
    }
  }
`;
```

How a document ends up in a form, panel or button, and where its `can:`
permission arguments go, is described in
[GraphQL-driven UI](graphql-driven-ui.md) and
[UI Permissions](permissions.md#where-a-permission-can-be-attached).

## Put it together

The module file gathers everything into one `defineElodyModule` call. Leave
out what the module doesn't carry; here that is endpoints, input fields and
the per-type mappings:

```ts
// partsCatalogueModule.ts
import path from 'path';
import { createModule } from 'graphql-modules';
import {
  defineElodyModule,
  loadTranslationsFromDirectory,
  requireSettings,
} from 'base-graphql';
import { partsCatalogueSchema } from './partsCatalogueSchema.schema';
import { partsCatalogueResolver } from './partsCatalogueResolver';
import { PartsCatalogueAPI } from './sources/partsCatalogue';
import {
  ORDER_PART_PERMISSION,
  partsCataloguePermissions,
} from './partsCataloguePermissions';

declare module 'base-graphql' {
  interface DataSources {
    PartsCatalogueAPI: PartsCatalogueAPI;
  }
  interface Environment {
    partsCatalogue?: { url?: string };
  }
  interface FullyOptionalEnvironmentInput {
    partsCatalogue?: { url?: string };
  }
}

const partsCatalogueModule = defineElodyModule({
  name: 'partsCatalogueModule',
  graphqlModule: createModule({
    id: 'partsCatalogueModule',
    dirname: __dirname,
    typeDefs: [partsCatalogueSchema],
    resolvers: [partsCatalogueResolver],
  }),
  dataSources: [{ name: 'PartsCatalogueAPI', source: PartsCatalogueAPI }],
  permissions: partsCataloguePermissions,
  features: {
    partsCatalogue: { enabled: true, permission: ORDER_PART_PERMISSION },
  },
  translations: loadTranslationsFromDirectory(
    path.join(__dirname, 'translations')
  ),
  initialize: (environment) =>
    requireSettings(environment, {
      'partsCatalogue.url': 'PARTS_CATALOGUE_URL',
    }),
});

export { partsCatalogueModule, PartsCatalogueAPI, partsCatalogueSchema };
```

The other fields work the same way when you need them:

- **`endpoints`** for anything a GraphQL response can't carry, such as a
  supplier's datasheet PDF. Pick the pattern in
  [Proxy Endpoints](proxy-endpoints.md).
- **`inputFields`** for a field type forms can use, as `savedSearchModule`
  does with its privacy dropdown.
- **`typeCollectionMapping`**, **`typePillLabelMapping`**,
  **`filterMatchers`**, **`formatters`** and **`typeUrlMapping`** for
  per-type behaviour. These are usually client concerns.

## 9. Run it locally

1. **Add the dependency** to the client's GraphQL service `package.json`:

   ```json
   "parts-catalogue-module": "0.0.x"
   ```

2. **Register the module** in the client's `main.ts`, before the client's own
   module, so the client can still override it:

   ```ts
   import { partsCatalogueModule } from 'parts-catalogue-module';

   new ElodyInstance({
     appConfig: garageAppConfig,
     modules: [mediafileModule, partsCatalogueModule, garageModule],
   }).start();
   ```

3. **Map the setting** in the client's app config, and give it a value in the
   client's `.env` and `.env.dist`:

   ```ts
   // garageAppConfig.ts
   partsCatalogue: { url: process.env.PARTS_CATALOGUE_URL },
   ```

   ```
   PARTS_CATALOGUE_URL=http://parts-catalogue-service:8000
   ```

   The dashboard container reads `.env` only when it is created, so recreate
   it (`docker compose up -d dashboard`) after adding the variable.

4. **Link and generate.** In local development, the container's pnpm
   workspace links `modules/partsCatalogueModule` instead of the published
   package. Run `pnpm install` inside the dashboard container (never on the
   host) to create the link, then `task generate`. Codegen writes the PWA's
   types and syncs `generated-types/type-defs.ts` into every module, which is
   what the resolvers import.

The GraphQL service restarts on its own. If something is missing, it refuses
to start and the log lists every module that failed to initialize.

## 10. Publish

Bump `version` in `package.json` and merge to the default branch: the bump
is the release (see
[Build Pipeline](build-pipeline.md#the-version-bump-is-the-release)).
Publish the module **before** you push a client that lists it. Clients
install `0.0.x` from Nexus without a lockfile, so a client built before the
module is published fails to install it.

Deployed environments need the setting too. Add `PARTS_CATALOGUE_URL` to the
GraphQL service's environment in the deployment config before the client
goes out, or the instance refuses to start, which is the point.

## Checklist

Before you publish, check that:

- the schema is in `<name>Schema.schema.ts` at the module root, and the
  documents are in `queries/`;
- nothing in the module redefines a type or resolver from base or another
  module;
- the data source is registered in `dataSources` and declared on
  `DataSources`;
- every setting is declared on `Environment` and
  `FullyOptionalEnvironmentInput`, has no default, and is required in
  `initialize`;
- each permission probes the request the feature really makes;
- translation keys are nested under the feature name;
- the module is published before any client that lists it.
