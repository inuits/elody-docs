# Proxy Endpoints

The browser never talks to collection-api, Cantaloupe or the storage API
directly. Everything goes through the client's GraphQL service — the
Node/Express app that also hosts Apollo Server — over same-origin `/api/...`
URLs.

The reason is **authentication**. Those upstream services require a bearer
token, and the browser must not hold one. A proxy endpoint takes a plain,
credential-free request carrying only the session cookie, re-issues it
server-side with a valid token attached (refreshing the token first if it has
expired), and returns the result.

The endpoints exist for anything a plain GraphQL query cannot carry: file
bytes, streams, CSV and XLSX exports, third-party viewer libraries that build
their own URLs. If your data fits in a GraphQL response, use a resolver
instead — a proxy endpoint is the escape hatch, not the default.

## Registration order

`start()` in
[`main.ts`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts)
mounts handlers in a fixed order:

1. **`defaultElodyEndpointMapping`** — the base endpoints every client gets:
   auth, upload, download, export, XLSX export, health, version, app configs.
2. **`fullElodyConfig.endpoints`** — module endpoints, contributed by whichever
   modules the client composes (for example `mediafileElodyConfig.endpoints`).
3. **SEO** (only if `features.SEO`) and **Prometheus** (only if `promUrl` is
   not `no-prom`).
4. **`customEndpoints`** — the client's own.
5. **`configureFrontendForEnvironment(app, viteServer)`** — the frontend
   handler.

::: warning The frontend handler is mounted last, and it catches everything
Anything not claimed by an earlier handler is answered by the SPA. A proxy
registered outside this flow, or one whose path the frontend also claims,
silently returns `index.html` — you get a 200 with HTML where you expected
JSON or bytes, which is a confusing failure mode. If a new endpoint "does
nothing", check that it is registered in one of the four slots above.
:::

Express is first-match-wins, so two handlers on overlapping paths mean the
earlier registration shadows the later one. Note that this is about **route
paths, not filenames**: `baseGraphql` and `mediafileModule` both have an
`uploadEndpoint.ts`, and those are a deliberate split (CSV/XML versus media)
serving different paths, not a conflict. Compare the paths.

## Setting one up

Both registration paths use the same signature:

```ts
(app: Express, environment: Environment) => void
```

### As a client endpoint

Write the handler, then pass it to `start()` in your client's
`inuits-dams-graphql-service/src/main.ts`:

```ts
start({
  customModuleConfig: assetEngineElodyConfig,
  appConfig: assetEngineAppConfig,
  customTranslations: assetEngineTranslations,
  customEndpoints: [redirectEndpoint, genericApiRedirectEndpoint],
  // ...
});
```

### As a module endpoint

Module authors add to the `endpoints` array on their `ElodyModuleConfig`, as
[`mediafileModule.ts`](https://github.com/inuits/elody-mediafile-module/blob/main/mediafileModule.ts)
does:

```ts
export const mediafileElodyConfig: ElodyModuleConfig = {
  modules: [mediafileModule],
  dataSources: { /* ... */ },
  endpoints: [
    (app) => applyUploadEndpoint(app),
    (app, env) => applyDownloadZipEndpoint(app),
    (app, env) => applyMediaFileEndpoint(app, env),
  ],
};
```

A client that composes the module gets the endpoints along with it — but only
if it forwards them. Digipolis, for instance, builds its own module config and
has to pass `endpoints: mediafileElodyConfig.endpoints` through explicitly.

## Three patterns — pick by response type

### JSON in, JSON out → `AuthRESTDataSource`

The default choice. `AuthRESTDataSource` is the same Apollo
`RESTDataSource` subclass the resolvers use, so its `willSendRequest` hook
attaches everything an upstream call needs: the bearer token from
`AuthTokenManager.getValidToken()`, an `X-request-id` for tracing, and
`X-tenant-id` when a tenant is in context. Retries are handled for you.

```ts
export const applyDownloadEndpoint = (app: Express) => {
  app.post('/api/download/csv', async (request, response) => {
    try {
      const environment = getCurrentEnvironment();
      const datasource = new AuthRESTDataSource({
        environment,
        session: request.session,
        clientIp: request.headers['x-forwarded-for'] as string,
        clientOrigin: getClientOrigin(request.headers),
      });
      const result = await datasource.post(/* url */, { method: 'GET' });
      response.status(200).setHeader('Content-Type', 'text/csv').end(result);
    } catch (exception: any) {
      /* ... */
    }
  });
};
```

You must pass `session` — that is where the token lives. `clientIp` and
`clientOrigin` are what make IP and domain whitelisting work, so pass them
too unless you know the endpoint is session-only.

Subclass it when you want a fixed `baseURL` and named methods, as Digipolis's
`genericApiRedirectEndpoint` does to forward `/api/entities/*` straight to
collection-api:

```ts
export class EntityCollectionAPI extends AuthRESTDataSource {
  public baseURL = `${this.environment.api.collectionApiUrl}/`;
  async proxyRequest(method: string, path: string, body?: any, query?: any) {
    /* ... */
  }
}
```

### Binary or streamed → `fetchWithTokenRefresh`

For file bytes, `AuthRESTDataSource` is the wrong tool — it parses responses.
Use
[`fetchWithTokenRefresh`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/fetchWithToken.ts)
and stream the body, as `/api/iiif/*` does:

```ts
app.use('/api/iiif/*', async (req, res) => {
  const target = `${environment.api.iiifUrl}${req.originalUrl.replace('/api', '')}`;
  try {
    const incomingAuth = req.headers.authorization as string | undefined;
    const response = incomingAuth
      ? await fetch(target, { method: 'GET', headers: { Authorization: incomingAuth } })
      : await fetchWithTokenRefresh(target, { method: 'GET' }, req);

    if (!response.ok) throw response;

    const blob = await response.blob();
    res.setHeader('Content-Type', blob.type);
    pump(blob.stream().getReader(), res);
  } catch (error: any) {
    res
      .status(extractErrorCode(error))
      .set({ 'Cache-Control': 'no-store', Pragma: 'no-cache' })
      .end(JSON.stringify(error));
  }
});
```

Three things this shows that are worth copying:

- **The third argument is mandatory.** `fetchWithTokenRefresh(url, options,
  req)` throws immediately if `req.session` is missing — it needs the session
  to build an `AuthTokenManager`. The error message states the signature, so
  this fails loudly rather than silently sending an unauthenticated request.
- **Pass through an incoming `Authorization` header.** If the caller already
  has its own token — a service-to-service client such as the canopy
  generator, using a scoped JWT — use it as-is instead of the dashboard
  session. This keeps the proxy generic, with no tenant flags or referer
  sniffing.
- **`Cache-Control: no-store` on the error path.** Without it, a 401 served
  where an image was expected can be cached by the browser, and the image
  stays broken after the user's session recovers.

### Rewriting the upstream body → `createProxyMiddleware`

Reach for `http-proxy-middleware` when you need to *mutate* the upstream
response rather than relay it. The `/api/iiif*.json` endpoint exists purely
for that: a IIIF `info.json` contains an absolute `id` pointing at
Cantaloupe's own origin, and OpenSeadragon would take it at face value and
request tiles from a host the browser cannot reach. So the `id` is rewritten
to an `/api/iiif/...` URL on the way through:

```ts
app.use(
  '/api/iiif*.json',
  createProxyMiddleware({
    target: environment.api.iiifUrl,
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: (path, req) => `${req.originalUrl.replace('/api', '')}`,
    onProxyRes: responseInterceptor(async (responseBuffer) => {
      /* parse, rewrite response.id, re-serialize */
    }),
    onError: (err, req, res) => res.status(500).send(err),
  })
);
```

`selfHandleResponse: true` is what enables `responseInterceptor`; without it
the body is piped straight through and the interceptor never runs. Note this
buffers the whole response in memory — fine for a small JSON document, wrong
for a media file.

## Errors

[`extractErrorCode`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/helpers.ts)
is the shared helper for turning whatever an upstream threw into a status
code, checking in order:

```
error.extensions.statusCode → error.extensions.response.status → error.status → 500
```

Use it rather than hand-rolling the chain — the shape differs depending on
whether the failure came from a `RESTDataSource` (`extensions`) or a bare
`fetch` (`status`).

## Existing endpoints

Verified while writing this page; the list is not exhaustive.

| Path | Module | Pattern | Purpose |
| --- | --- | --- | --- |
| `/api/mediafile/*` | elody-mediafile-module | `fetchWithTokenRefresh` + pipe | resolves download URLs, serves original or transcode |
| `/api/iiif*.json` | elody-mediafile-module | `createProxyMiddleware` | IIIF `info.json` with rewritten `id` |
| `/api/iiif/*` | elody-mediafile-module | `fetchWithTokenRefresh` + stream | tiles, crops, scaled downloads |
| `/api/download/csv` | elody-base-graphql | `AuthRESTDataSource` | ordered CSV of an entity's children |
| `/api/entities/*` | digipolis-dams (client) | `AuthRESTDataSource` subclass | generic method-preserving collection-api passthrough |

For how the media viewers consume the first three, see
[Media Viewers](./features/media-viewers).

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`main.ts`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts) | elody-base-graphql | `start()`, registration order, `applyCustomEndpoints` |
| [`sources/defaultElodyEndpointMapping.ts`](https://github.com/inuits/elody-base-graphql/blob/master/sources/defaultElodyEndpointMapping.ts) | elody-base-graphql | the base endpoint set |
| [`endpoints/fetchWithToken.ts`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/fetchWithToken.ts) | elody-base-graphql | `fetchWithTokenRefresh` |
| [`auth/AuthRESTDataSource.ts`](https://github.com/inuits/elody-base-graphql/blob/master/auth/AuthRESTDataSource.ts) | elody-base-graphql | token, `X-request-id`, `X-tenant-id`, retries |
| [`auth/authTokenManager.ts`](https://github.com/inuits/elody-base-graphql/blob/master/auth/authTokenManager.ts) | elody-base-graphql | session / whitelist / anonymous token resolution |
| [`helpers/helpers.ts`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/helpers.ts) | elody-base-graphql | `extractErrorCode`, `getClientOrigin` |
| [`endpoints/downloadEndpoint.ts`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/downloadEndpoint.ts) | elody-base-graphql | minimal `AuthRESTDataSource` example |
| [`endpoints/mediafilesEndpoint.ts`](https://github.com/inuits/elody-mediafile-module/blob/main/endpoints/mediafilesEndpoint.ts) | elody-mediafile-module | all three patterns in one file |
| [`mediafileModule.ts`](https://github.com/inuits/elody-mediafile-module/blob/main/mediafileModule.ts) | elody-mediafile-module | module-level `endpoints` registration |
