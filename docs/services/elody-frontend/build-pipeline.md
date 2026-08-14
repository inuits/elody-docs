# The Frontend Build Pipeline

Getting an Elody frontend from source to a deployable image takes **three
separate pipelines** in three different repos. Nothing builds the whole thing
in one go, and that is the single most confusing part for a new developer: a
green pipeline on the repo you edited very often means *nothing has changed
yet* for the app you are looking at.

This page covers everything up to a pushed image. What happens once that image
runs is [Production Serving](production-serving.md).

::: tip "Frontend" here means two things
The Vue PWA is only half of it. The npm packages described below
(`base-graphql`, `import-module`, …) are the **GraphQL service** layer — Node
code that runs server-side. They end up in the same deployed image as the PWA,
which is why they belong on this page, but they are not PWA packages.
:::

## The three pipelines

```
1. modules/*            ──publish──▶  Nexus (npm-private)
   (base-graphql, …)                        │
                                            │ pnpm i
2. inuits-dams-pwa      ──build────▶  dams-frontend:latest       │
   (Vue PWA source)                   (source only, no build)    │
                                            │                    │
                                            │ build stage        │
                                            ▼                    ▼
3. clients/<client>/client-frontend ──build──▶  client image ──▶ deployed
```

| # | Repo | Trigger | Output | Deployed? |
| --- | --- | --- | --- | --- |
| 1 | `modules/<module>` | version bump on default branch | npm package on Nexus | No |
| 2 | `inuits-dams-pwa` | push to default branch | `dams-frontend` image | No |
| 3 | `clients/<client>/client-frontend` | push to default branch | client image | **Yes** |

Only pipeline 3 produces something that runs. Pipelines 1 and 2 publish
ingredients that a client build later consumes.

## Where the code lives

Everything except the client repos is public on GitHub. Note that a repo's
GitHub name, its checkout directory, and the npm package it publishes are three
different strings — see [A note on naming](#a-note-on-naming).

| Checkout directory | npm package | GitHub |
| --- | --- | --- |
| `inuits-dams-pwa/` | — (not published) | [inuits/elody-pwa](https://github.com/inuits/elody-pwa) |
| `modules/baseGraphql/` | `base-graphql` | [inuits/elody-base-graphql](https://github.com/inuits/elody-base-graphql) |
| `modules/advancedFiltersModule/` | `advanced-filter-module` | [inuits/elody-advanced-filter-module](https://github.com/inuits/elody-advanced-filter-module) |
| `modules/advancedSearchModule/` | `advanced-search-module` | [inuits/elody-advanced-search-module](https://github.com/inuits/elody-advanced-search-module) |
| `modules/importModule/` | `import-module` | [inuits/elody-import-module](https://github.com/inuits/elody-import-module) |
| `modules/mediafileModule/` | `mediafile-module` | [inuits/elody-mediafile-module](https://github.com/inuits/elody-mediafile-module) |
| `modules/savedSearchModule/` | `saved-search-module` | [inuits/elody-saved-search-module](https://github.com/inuits/elody-saved-search-module) |
| `clients/<client>/client-frontend/` | — (private) | internal GitLab only |

Client frontend repos are per customer and live on the internal GitLab, as do
`elody-common` itself and the Helm chart. Client Dockerfiles also differ from
one another in the details; the walkthrough below follows the common
webpack + Node setup.

### A note on naming

The platform used to be called **DAMS** and is now called **Elody**. The rename
reached the GitHub repositories but not everything else, so all three of these
refer to the same code:

| Layer | Naming | Example |
| --- | --- | --- |
| GitHub repos | **Elody** | `inuits/elody-pwa` |
| Checkout dirs & GitLab | still DAMS | `inuits-dams-pwa`, `inuits-dams-graphql-service` |
| Harbor projects | partly renamed | `elody-dams-dev` |
| Harbor images | still DAMS | `inuits/dams-frontend` |

Where this page writes `inuits-dams-pwa` or `dams-frontend:latest` it means the
literal path or image name you will type — those are not stale prose. Several
client directories (`vliz-dams`, `coghent-dams`, …) keep the old name too.

## 1. Modules publish to Nexus

Every GraphQL module — [`baseGraphql`](https://github.com/inuits/elody-base-graphql),
[`importModule`](https://github.com/inuits/elody-import-module),
[`mediafileModule`](https://github.com/inuits/elody-mediafile-module),
[`advancedFiltersModule`](https://github.com/inuits/elody-advanced-filter-module),
[`savedSearchModule`](https://github.com/inuits/elody-saved-search-module),
[`advancedSearchModule`](https://github.com/inuits/elody-advanced-search-module)
— is its own repo and its own npm package, published to the private Nexus
registry at `https://nexus.inuits.io/repository/npm-private`.

They all share one CI template:

```yaml
include:
  - project: 'inuits/gitlab-ci/pipeline-templates'
    file: 'pipelines/applications/graphql-module-pipeline.yml'
    ref: 'v4.20.0'
```

### The version bump *is* the release

The build job's publish step is guarded by a version check:

```bash
NPM_PACKAGE_NAME=$(node -p "require('./package.json').name")
NPM_PACKAGE_VERSION=$(node -p "require('./package.json').version")

if ! npm view "$NPM_PACKAGE_NAME" versions | grep -F "$NPM_PACKAGE_VERSION"; then
  pnpm exec graphql-codegen --config codegen.ci.ts
  pnpm build
  pnpm publish
else
  echo "Version exists, skipping."
fi
```

So the workflow is: **change code, bump `version` in `package.json`, merge to
the default branch.** That is the whole release process. Consequences worth
internalising:

- **Forget the bump and the pipeline still goes green.** It just prints
  `Version exists, skipping.` and publishes nothing. If a client build doesn't
  pick up your change, check the published version first.
- **Only the default branch publishes.** The template's `workflow.rules` set
  `when: never` for every other branch, so a feature branch runs no jobs at
  all. Merging is the publishing action.
- The version check uses `grep -F`, a plain substring match. A version that is
  a substring of an already-published one (`0.9.2` against a published
  `0.9.22`) would be considered existing and silently skipped. Rare, but it
  explains an otherwise impossible "nothing published" case.

Before publishing, the pipeline runs `pnpm build` (`tsc`) to produce `dist/`
and `types/`, and `codegen.ci.ts` to produce `generated-types/type-defs.ts`.
Both directories are gitignored — they only ever exist inside a CI run or a
local build.

The `test` stage runs first and gates the build. It fabricates the generated
types the module's own code imports by copying `__mock__/types.ts` to
`generated-types/type-defs.ts`, then runs vitest over any `*.test.ts` /
`*.spec.ts` it finds. No mock file, or no test files: the stage exits
successfully and the build proceeds.

### What ends up in the package

This is the part that makes the rest of the pipeline work. Each module's
`.npmignore` strips **all** TypeScript source, then re-admits three patterns:

```
*.ts
!*.d.ts
!*.schema.ts
!*.queries.ts
```

The published tarball therefore contains the compiled JavaScript, its type
declarations, **and the raw GraphQL schema and query source files**. For
`base-graphql` that's 19 files:

```
dist/…             compiled JS          ← what Node actually runs
types/…            .d.ts declarations   ← what tsc type-checks against
baseModule/baseSchema.schema.ts         ← shipped as-is
baseModule/queries/*.queries.ts         ← shipped as-is (6 files)
translations/*.json, views/seo.pug, package.json, README
```

Shipping `.schema.ts` and `.queries.ts` as source looks redundant next to the
compiled output, but it is deliberate: **the client build re-extracts them
from `node_modules` to run codegen.** Without them the client could run the
modules but could not generate types for them. See
[The codegen chain](#the-codegen-chain) below.

### Local source vs published build

`package.json` points at two different entry points:

```json
"main": "./main.ts",
"publishConfig": {
  "main": "./dist/main.js",
  "types": "./types/main.d.ts",
  "registry": "https://nexus.inuits.io/repository/npm-private"
}
```

`publishConfig` overrides the top-level fields at publish time only. So the
same repo resolves to TypeScript source when linked as a local pnpm workspace
package (development, via `link-workspace-packages=true` in the client's
`.npmrc`) and to compiled JavaScript when installed from Nexus (CI). Nothing
else needs to change between the two modes.

### How clients pick up a new version

Clients depend on modules with loose ranges, and the client Dockerfile installs
with `pnpm i --force`:

```json
"base-graphql": "*",
"import-module": "0.0.x",
"mediafile-module": "0.0.x",
"saved-search-module": "0.0.x"
```

Two things follow:

- **A client rebuild silently adopts new module versions**, with no change in
  the client repo. This is the module-level twin of the
  [`dams-frontend:latest` pin](#the-latest-pin) below. If a client build starts
  behaving differently and nobody touched the client, check what got published
  to Nexus.
- **A minor bump strands every client.** `0.0.x` does not match `0.1.0`. Going
  from `0.0.36` to `0.1.0` means no client picks the module up again until each
  one's range is widened by hand.

## 2. The PWA image — a source bundle, not an app

`inuits-dams-pwa`'s [`docker/Dockerfile`](https://github.com/inuits/elody-pwa/blob/master/docker/Dockerfile)
builds `elody-dams-dev/inuits/dams-frontend`, an image carrying nothing but the
PWA source tree. It deliberately does **not** ship `node_modules` and does
**not** run `vite build`:

- Client builds copy the source into their own build and run `pnpm install`
  there anyway, so shipping `node_modules` would only bloat the image
  (>1 GB versus ~15 MB of source).
- The PWA *cannot* be compiled on its own. Its GraphQL types are generated from
  the **client's** schema, which only exists in a client build.

Two details are easy to miss:

- **Unit tests gate the image.** The test stage runs `pnpm run test:unit`. The
  ship stage doesn't otherwise need anything from it, so a dummy
  `COPY --from=test-stage … /tmp/.unit-tests-passed` forces the dependency.
  Failing unit tests fail the image build.
- **The pipeline never deploys.**
  [`.gitlab-ci.yml`](https://github.com/inuits/elody-pwa/blob/master/.gitlab-ci.yml)
  sets `SKIP_DEPLOY: 'true'` and disables the `uat` and `prod` jobs. It only
  builds and pushes to Harbor.

## 3. The client image — where everything is actually built

Every client has its own frontend repo under
`clients/<client>/client-frontend/`. Its Dockerfile
(`inuits-dams-graphql-service/docker/Dockerfile`) pulls the PWA image in as a
build stage:

```docker
FROM …/elody-dams-dev/inuits/dams-frontend:latest as frontend
FROM node:22-bookworm-slim as build-stage

WORKDIR /app/inuits-dams-graphql-service
COPY ./ ./
COPY --from=frontend /app /app/inuits-dams-graphql-service/dashboard
```

The PWA source lands in `dashboard/`, *inside* the GraphQL service. From there
the build runs, in order:

1. **`pnpm i --force`** — installs the GraphQL service dependencies, including
   the module packages from Nexus. The registry URL and auth token are mounted
   as Docker build secrets (`NPM_CONFIG_REGISTRY`, `NPM_CONFIG__AUTH_TOKEN`)
   rather than baked into the image.
2. **Flatten every schema and query file into `/app/schemas`:**
   ```docker
   RUN mkdir -p /app/schemas
   RUN find /app/inuits-dams-graphql-service -type f -name "*.schema.ts" -exec cp -n {} /app/schemas \;
   RUN find /app/inuits-dams-graphql-service -type f -name "*.queries.ts" -exec cp -n {} /app/schemas \;
   ```
   The `find` walks the *whole* tree, `node_modules` included — which is
   precisely why the modules ship those files as source. The client's own
   `src/<client>Schema.schema.ts` and every module's schema and queries land
   side by side in one flat directory.
3. **`pnpm run generate && pnpm run build`** — generate the service's resolver
   types (`generated-types/type-defs.ts`) and compile the GraphQL service with
   webpack into `dist/`.
4. **Apply client customisation to `dashboard/`** — replace logo, favicon and
   CSV template from `dashboard/client-customization/`, and patch the three
   `--color-accent-*` variables in `src/assets/main.css` from that client's
   `theme.txt`.
5. **Stamp the image tag** into `dashboard/public/pwa-version.json`, which is
   how the running app reports its own version.
6. **`pnpm i && NODE_ENV=production pnpm run build` inside `dashboard/`** —
   the actual PWA build. `pnpm run build` is `run-s generate build-only`: codegen
   first, then `vite build`, producing `dashboard/dist/`.

::: warning `cp -n` into a flat directory
`-n` is no-clobber, and the target is flat, so **basenames must be unique
across the entire dependency tree**. Two modules shipping a
`fragments.queries.ts` means the second one is silently dropped and its
operations never reach codegen. Name schema and query files after their module.
:::

### The codegen chain

Type generation happens in three hops, each reading the output of the last:

| Hop | Where | Config | Reads | Produces |
| --- | --- | --- | --- | --- |
| 1 | Module CI | `codegen.ci.ts` | own `*.schema.ts` + `./node_modules/**/*.schema.ts` | module resolver types |
| 2 | Client build | `codegen.ts` | `./**/*.schema.ts` | service resolver types (`generated-types/type-defs.ts`) |
| 3 | Client build | PWA `codegen.ts` | `/app/schemas/*.schema.ts` + `/app/schemas/*.queries.ts` | PWA `src/generated-types/queries.ts` |

Hop 1 shows that modules consume their dependencies exactly the way clients do
— `base-graphql` ships its schema, and a module building against it globs that
schema out of `node_modules`. The same trick, one level down.

Hop 3 is the one that surprises people: the PWA's
[`codegen.ts`](https://github.com/inuits/elody-pwa/blob/master/codegen.ts) reads
from the **absolute path** `/app/schemas/*`, not from a relative path in its own
tree — because in a client build the schema lives in the GraphQL service, not in
the PWA.

```ts
const config: CodegenConfig = {
  schema: "/app/schemas/*.schema.ts",
  documents: "/app/schemas/*.queries.ts",
  generates: { "src/generated-types/queries.ts": { /* … */ } },
};
```

`src/generated-types/queries.ts` is gitignored, so a clean CI checkout contains
no generated types at all and the PWA image ships without them — the real file
only ever exists per client, generated at build time from that client's schema.
The `touch src/generated-types/queries.ts` in the PWA Dockerfile's test stage
exists solely so `pnpm test:unit` can resolve that import; it is not part of the
shipped image.

### The `latest` pin

The client Dockerfile references `dams-frontend:latest` (the pinned, tagged form
is commented out just above it). A client rebuild therefore picks up whatever
the newest PWA build is, including changes nobody on that client asked for. If a
client build suddenly behaves differently without a client-side change, this and
the module version ranges are the first two things to check.

## Deployment

The client repo's `.gitlab-ci.yml` includes the shared
`pipelines/customers/deploy-k8s.yml` template. It builds and pushes the client
image to that client's Harbor project (dev / uat / prod) and deploys via a
per-client Helm values repo:

```yaml
variables:
  APPLICATION: graphql
  HARBOR_PROJECT_DEV: <client>-dev
  HARBOR_PROJECT_UAT: <client>-uat
  HARBOR_PROJECT_PROD: <client>-prod
  VALUES_REPO: "<path>/<client>-elody-helm-values"
  VALUES_FILE: "${ENVIRONMENT_NAME}/elody.yaml"

.build:
  variables:
    PODMAN_EXTRA_FLAGS: >-
      --secret id=NPM_CONFIG_REGISTRY
      --secret id=NPM_CONFIG__AUTH_TOKEN
      --build-arg IMAGE_TAG=${IMAGE_TAG}
```

`IMAGE_TAG` is passed in as a build arg and is also the value written into
`pwa-version.json`, so the version the running app reports matches the deployed
image tag.

## I changed something — what do I need to rebuild?

| You changed | To see it in a deployed client |
| --- | --- |
| A module (`modules/*`) | Bump `version`, merge → publishes to Nexus → **rebuild the client** |
| The PWA (`inuits-dams-pwa`) | Merge → rebuilds `dams-frontend:latest` → **rebuild the client** |
| The client's GraphQL service or schema | Merge → the client pipeline builds and deploys it |

Every path ends in a client rebuild. Nothing else deploys.

## Common gotchas

- **A green module pipeline may have published nothing.** No version bump means
  no publish. Check `npm view <package> versions` against your `package.json`.
- **Editing PWA code doesn't change a client until the client rebuilds.** The
  PWA pipeline only pushes a source image; the compiled output lives in the
  client image.
- **A green PWA pipeline can still break a client build.** Type generation runs
  against the client schema, so a query the PWA adds must exist in that client's
  schema — the failure only surfaces in the client pipeline.
- **`latest` and `0.0.x` mean unrelated changes ride along** with any client
  rebuild, from both the PWA image and the module packages.
- **Duplicate `*.schema.ts` / `*.queries.ts` basenames are silently dropped**
  by the flattening step's `cp -n`.
