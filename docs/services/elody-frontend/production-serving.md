# How the Frontend Is Served in Production

In development you run Vite and get hot reload. In production there is no Vite
and no separate web server for the frontend: the PWA is compiled to static
files ahead of time, and the **client's GraphQL service serves them with
Express**. One Node process answers both the GraphQL API and every page
request.

That means "deploying the frontend" is really "deploying the client GraphQL
service image". The PWA is never deployed on its own.

## Where the code lives

The two repos this page walks through are public on GitHub:

| Repo | Local path in elody-common | GitHub |
| --- | --- | --- |
| Elody PWA | `inuits-dams-pwa/` | [inuits/elody-pwa](https://github.com/inuits/elody-pwa) |
| baseGraphql | `modules/baseGraphql/` | [inuits/elody-base-graphql](https://github.com/inuits/elody-base-graphql) |

Client frontend repos are per customer and live on the internal GitLab, as do
`elody-common` itself and the Helm chart — those are referenced below by path
only. Client Dockerfiles also differ from one another in the details; the
walkthrough below follows the common webpack + Node setup.

## The two images

There are two Docker images involved, built by two separate pipelines.

| Image | Built from | Contains | Deployed? |
| --- | --- | --- | --- |
| `inuits/dams-frontend` | [PWA `docker/Dockerfile`](https://github.com/inuits/elody-pwa/blob/master/docker/Dockerfile) | Raw PWA **source**, no build output | No |
| Client image (per client) | `<client-frontend>/inuits-dams-graphql-service/docker/Dockerfile` | Compiled GraphQL service + compiled PWA | Yes |

### 1. The PWA image — a source bundle, not an app

[`docker/Dockerfile`](https://github.com/inuits/elody-pwa/blob/master/docker/Dockerfile)
in the PWA repo builds an image that carries nothing but the PWA source tree.
It deliberately does **not** ship `node_modules` and does **not** run
`vite build`:

- Client builds copy the source into their own build and run `pnpm install`
  there anyway, so shipping `node_modules` would only bloat the image
  (>1 GB versus ~15 MB of source).
- The PWA cannot be compiled on its own. Its GraphQL types are generated from
  the *client's* schema, which only exists in the client build (see
  [Generating the GraphQL types](#generating-the-graphql-types)).

Two details in that Dockerfile are easy to miss:

- **Unit tests gate the image.** The test stage runs `pnpm run test:unit`.
  The ship stage doesn't otherwise need anything from it, so a dummy
  `COPY --from=test-stage … /tmp/.unit-tests-passed` line is used to force the
  dependency. Failing unit tests fail the image build.
- **The pipeline never deploys.** The PWA's
  [`.gitlab-ci.yml`](https://github.com/inuits/elody-pwa/blob/master/.gitlab-ci.yml) sets
  `SKIP_DEPLOY: 'true'` and disables the `uat` and `prod` jobs. The pipeline
  only builds and pushes the image to Harbor
  (`elody-dams-dev/inuits/dams-frontend`).

### 2. The client image — where the PWA actually gets built

Every client has its own frontend repo under
`clients/<client>/client-frontend/`, and its Dockerfile
(`inuits-dams-graphql-service/docker/Dockerfile`) pulls the PWA image in as a
build stage:

```docker
FROM …/elody-dams-dev/inuits/dams-frontend:latest as frontend
FROM node:22-bookworm-slim as build-stage

WORKDIR /app/inuits-dams-graphql-service
COPY ./ ./
COPY --from=frontend /app /app/inuits-dams-graphql-service/dashboard
```

So the PWA source lands in `dashboard/`, *inside* the GraphQL service. From
there the build does, in order:

1. `pnpm i` — install the GraphQL service dependencies.
2. Collect every `*.schema.ts` and `*.queries.ts` from the service and its
   modules into a flat `/app/schemas` directory.
3. `pnpm run generate && pnpm run build` — generate the service's resolver
   types and compile the GraphQL service with webpack into `dist/`.
4. Apply client customisation to `dashboard/`: replace the logo, favicon and
   CSV template from `dashboard/client-customization/`, and patch the three
   `--color-accent-*` variables in `src/assets/main.css` from that client's
   `theme.txt`.
5. Stamp the image tag into `dashboard/public/pwa-version.json`, which is how
   the running app reports its own version.
6. `pnpm i && NODE_ENV=production pnpm run build` inside `dashboard/` — this
   is the actual PWA build (`pnpm generate` then `vite build`), producing
   `dashboard/dist/`.

::: warning The PWA image is pinned to latest
The client Dockerfile references `dams-frontend:latest` (the tagged form is
commented out). A client rebuild therefore picks up whatever the newest PWA
build is, including changes nobody on that client asked for. If a client build
suddenly behaves differently without a client-side change, this is the first
thing to check.
:::

### Generating the GraphQL types

Step 2 above exists purely to make the PWA's codegen work. The PWA's
[`codegen.ts`](https://github.com/inuits/elody-pwa/blob/master/codegen.ts)
reads its schema and documents from the absolute path `/app/schemas/*`, not
from a relative path in its own tree — because in a client build the schema
lives in the GraphQL service, not in the PWA. The Dockerfile flattens
everything into `/app/schemas` first, then the PWA's `pnpm run build` (which
is `run-s generate build-only`, see
[`package.json`](https://github.com/inuits/elody-pwa/blob/master/package.json))
generates `src/generated-types/queries.ts` from it and compiles.

`src/generated-types/queries.ts` is gitignored, so a CI build's clean checkout
contains no generated types at all and the PWA image ships without them — the
real file only ever exists per client, generated at build time from that
client's schema. The `touch src/generated-types/queries.ts` in the PWA
Dockerfile's test stage exists solely so `pnpm test:unit` can resolve that
import; it is not part of the shipped image.

## The production stage

The final image is deliberately small. It copies only build output plus the
manifests needed to install production dependencies:

```
dist/                  ← compiled GraphQL service (webpack)
dashboard/dist/        ← compiled PWA (vite)
package.json, pnpm-lock.yaml, .npmrc
```

Then `pnpm i --prod`, and the container's command is `pnpm start`, which is
`node dist/server`. No Vite, no source, no dev dependencies.

## How Express serves it at runtime

baseGraphql's [`main.ts`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts)
builds a single Express app and, near the end of startup, calls
`configureFrontendForEnvironment(app, viteServer)`. That function, in
[`endpoints/frontendEndpoint.ts`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/frontendEndpoint.ts),
is the entire dev/prod split:

```ts
if (vite) {
  app.use(vite.middlewares);          // non-production: Vite dev server
} else {
  app.use(express.static(frontendPath)); // production: serve dashboard/dist
}

app.get('*', (req, res) => renderPageForEnvironment(req, res, vite));
```

- `viteServer` is only created when `environment.environment !== 'production'`.
  In production it is `undefined`, so the static branch is taken.
- `frontendPath` is `dashboard/dist`, resolved from the process working
  directory.
- The `app.get('*')` catch-all sends `dashboard/dist/index.html` for anything
  `express.static` didn't match. That's the standard SPA fallback: it lets
  Vue Router own the URL, so deep links and page refreshes work instead of
  404ing.

Request ordering in the single process:

```
request
  ├── /graphql            → Apollo Server middleware
  ├── other API endpoints → SEO, prometheus, mediafiles, custom endpoints
  ├── existing static file → express.static (dashboard/dist)
  └── anything else       → dashboard/dist/index.html (Vue Router)
```

The GraphQL path itself is configurable (`environment.apollo.graphqlPath`), and
because it is registered before the catch-all it always wins.

### Port

The process listens on `PORT`, defaulting to **4000**
([`environment.ts`](https://github.com/inuits/elody-base-graphql/blob/master/environment.ts)),
which is also what the Helm chart's graphql service and HTTPRoute target. The
`EXPOSE 4001` line in
some client Dockerfiles is documentation-only and does not reflect the port in
use.

## Deployment

The client repo's `.gitlab-ci.yml` includes the shared
`pipelines/customers/deploy-k8s.yml` template. It builds and pushes the client
image to that client's Harbor project (dev / uat / prod) and deploys via a
per-client Helm values repo, configured with `VALUES_REPO` and
`VALUES_FILE: <environment>/elody.yaml`.

`IMAGE_TAG` is passed in as a build arg, which is also the value written into
`pwa-version.json`, so the version reported by the running app matches the
deployed image tag.

## Quick mental model

```
inuits-dams-pwa  ──build──▶  dams-frontend:latest   (source only, tests gated)
                                      │
                                      │ pulled as a build stage
                                      ▼
clients/<client>/client-frontend  ──build──▶  client image
                                                  │
     GraphQL service (webpack → dist/)  ──────────┤
     PWA (codegen + vite → dashboard/dist/) ──────┘
                                                  │
                                                  ▼
                            node dist/server  ·  one Express app
                            /graphql → Apollo
                            everything else → dashboard/dist
```

## Common gotchas

- **Editing PWA code doesn't change a client until the client rebuilds.** The
  PWA pipeline only pushes a source image; the compiled output lives in the
  client image.
- **A green PWA pipeline can still break a client build.** Type generation
  happens against the client schema, so a query the PWA adds must exist in that
  client's schema.
- **`latest` means unrelated PWA changes ride along** with any client rebuild.
- **No Vite in production.** If a change only works with hot reload, it will
  not work in production — the static branch is a different code path. The
  most common instance of this is
  [dynamically built Tailwind classes](dynamic-tailwind-classes.md), which the
  production build silently drops.
