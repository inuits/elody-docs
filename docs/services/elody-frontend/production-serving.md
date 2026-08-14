# How the Frontend Is Served in Production

In development you run Vite and get hot reload. In production there is no Vite
and no separate web server for the frontend: the PWA is compiled to static
files ahead of time, and the **client's GraphQL service serves them with
Express**. One Node process answers both the GraphQL API and every page
request.

That means "deploying the frontend" is really "deploying the client GraphQL
service image". The PWA is never deployed on its own.

This page covers what happens once that image runs. How the image gets built —
module packages, codegen, the client Docker build — is
[The Frontend Build Pipeline](build-pipeline.md).

## Where the code lives

Almost everything on this page lives in
[`inuits/elody-base-graphql`](https://github.com/inuits/elody-base-graphql)
(checked out as `modules/baseGraphql/`) — it owns the Express app that serves
the compiled PWA. For the full repo, package and image naming map, see
[Where the code lives](build-pipeline.md#where-the-code-lives) on the build
pipeline page.

## What's in the deployed image

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
`EXPOSE 4001` line in some client Dockerfiles is documentation-only and does not
reflect the port in use.

## Quick mental model

```
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

- **No Vite in production.** If a change only works with hot reload, it will not
  work in production — the static branch is a different code path. The most
  common instance of this is
  [dynamically built Tailwind classes](dynamic-tailwind-classes.md), which the
  production build silently drops.
- **A route that 404s in production but works locally** is usually served by the
  SPA fallback locally and shadowed by an API endpoint registered before the
  catch-all in production. Check the request ordering above.
- **The app's reported version comes from `pwa-version.json`**, stamped with the
  image tag at build time — so it identifies the client image, not the PWA repo
  commit.
