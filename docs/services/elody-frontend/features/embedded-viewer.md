# Embedded Viewer

An external website can show one of your assets in a full IIIF deep-zoom
viewer by putting an `<iframe>` on its page. No SDK, no API key, no build
step on their side — just a URL.

The viewer is the same
[`IIIFViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/IIIFViewer.vue)
OpenSeadragon component the PWA uses internally, rendered on a bare page: no
navigation, no header, no modals. Only the
[`ViewerToolbar`](https://github.com/inuits/elody-pwa/blob/master/src/components/ViewerToolbar.vue)
zoom/fullscreen controls and an optional clickable logo.

This is used in production by the Digipolis DAMS (Antwerp), where
`https://dams.antwerpen.be/assets/<id>/embed/viewer` is embedded by city
websites.

## Embedding it (for the consuming application)

```html
<iframe
  src="https://dams.antwerpen.be/assets/813ef4f8-.../embed/viewer"
  width="100%"
  height="600"
  style="border: 0"
  allowfullscreen
  loading="lazy"
  title="Asset viewer"
></iframe>
```

The URL shape is `/<type>/<id>/embed/viewer`, where `<type>` is the overview
segment of the asset page (e.g. `assets`) and `<id>` the entity id. In other
words: take the asset's normal detail URL and append `/embed/viewer`.

Notes for the embedding side:

- The page fills 100% of the iframe (`100vw`/`100vh` inside), so the iframe's
  own height decides how tall the viewer is. Give it a real height.
- Add `allowfullscreen` or the toolbar's fullscreen button cannot escape the
  frame.
- The logo in the toolbar links back to the asset's own page in the DAMS
  (the embed URL with `/embed/viewer` stripped), opened in a new tab.
- Only images are supported. The viewer renders the entity's **primary
  mediafile** through the IIIF Image API; an entity without a primary
  mediafile shows an error message instead.

## Registering the route (for the Elody client)

The embedded viewer is opt-in per client. It exists in the base PWA, but a
client only gets it by registering a route.

`EmbeddedViewer` is already part of the base `RouteNames` enum
([`baseModule/baseSchema.schema.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseSchema.schema.ts))
and is already mapped to its component in the PWA's
[`views/router.ts`](https://github.com/inuits/elody-pwa/blob/master/src/views/router.ts),
so there is nothing to add to your schema or to the PWA. Add the route to your
client's router config — for Digipolis that is `assetEngineRoutes.ts`:

```ts
{
  path: "/:type/:id/embed/viewer",
  name: RouteNames.EmbeddedViewer,
  component: "EmbeddedViewer",
  meta: {
    requiresAuth: false,
    logo: {
      src: "/a-logo.svg",
      alt: "Antwerpen",
    },
  },
},
```

Three things matter here:

**It must be a top-level route**, not a child of the `Home` route.
[`App.vue`](https://github.com/inuits/elody-pwa/blob/master/src/App.vue)
special-cases `route.name === "EmbeddedViewer"` and renders a bare
`<router-view />` — no navigation, no header, no notifications. Nesting it
under `Home` would put the app chrome back around it.

**`requiresAuth: false`** keeps the router's auth guard
([`routerNavigationGuards.ts`](https://github.com/inuits/elody-pwa/blob/master/src/routerNavigationGuards.ts))
from bouncing an anonymous visitor to `/unauthorized`.

**`meta.logo`** is optional. `src` is resolved against the served web root;
client assets in `dashboard/client-customization/` land there (the client
Dockerfile copies them into `public/`). `alt` defaults to an empty string,
and the `href` is derived — you do not set it.

### CSP: framing is enabled automatically

The default policy is `frame-ancestors 'self'`, which makes any third-party
iframe render blank.
[`enableContentSecurityPolicy`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/contentSecurityPolicyHelper.ts)
in baseGraphql checks whether the client's `routerConfig` contains an
`EmbeddedViewer` route, and if it does, mounts a relaxed policy on
`*/embed/viewer` with
`frame-ancestors *` — that path only, the rest of the app keeps `'self'`.

So registering the route is enough. You do not touch the CSP helper.

::: tip
If you serve the embed through a custom endpoint rather than the PWA router
(Digipolis proxies `/asset/*` and `/assets/*` through its own
`redirectEndpoint`), that endpoint needs the relaxed policy itself. Use the
exported
[`createCspMiddleware`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/contentSecurityPolicyHelper.ts)
helper:

```ts
const embedCsp = createCspMiddleware({ "frame-ancestors": ["*"] });
app.get(["/asset/*", "/assets/*"], cors(), embedCsp, handler);
```

`createCspMiddleware` merges array directives with the base policy instead of
replacing them, so you only list what you add.
:::

### Anonymous read access

The viewer's data comes from the
[`GetPrimaryMediafileFromEntity`](https://github.com/inuits/elody-mediafile-module/blob/main/mediafileResolver.ts)
GraphQL query, which hits collection-api like any other request. A visitor
from an external website has no session, so the request needs a way through
[`AuthTokenManager.getValidToken()`](https://github.com/inuits/elody-base-graphql/blob/master/auth/authTokenManager.ts).
In order of precedence:

1. a valid session token (an authenticated user opening the embed)
2. `features.ipWhiteListing` — `tokenToUseForWhiteListedIpAddresses`
3. `features.domainWhiteListing` — `tokenToUseForWhiteListedDomainAddresses`
4. `ALLOW_ANONYMOUS_USERS=True` in the client's `.env`, which sends no token
   at all and leaves the decision to collection-api

Digipolis uses option 4. Without one of these, the query answers
`AUTH | NO VALID TOKEN` (401) and the iframe shows an error, not the image.

::: warning
Both `frame-ancestors *` and anonymous read access are deliberate holes. Any
site can frame the viewer, and anyone with an entity id can view its primary
mediafile. If that is not acceptable, restrict `frame-ancestors` to the
consuming domains and enforce publication status in collection-api rather
than relying on ids being unguessable.
:::

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/views/EmbeddedViewer.vue`](https://github.com/inuits/elody-pwa/blob/master/src/views/EmbeddedViewer.vue) | elody-pwa | the page: query + `IIIFViewer` + logo |
| [`src/views/router.ts`](https://github.com/inuits/elody-pwa/blob/master/src/views/router.ts) | elody-pwa | maps route name → component |
| [`src/App.vue`](https://github.com/inuits/elody-pwa/blob/master/src/App.vue) | elody-pwa | renders the route without app chrome |
| [`src/helpers.ts`](https://github.com/inuits/elody-pwa/blob/master/src/helpers.ts) | elody-pwa | `stripEmbeddedViewerSuffix` for the logo link |
| [`mediafileResolver.ts`](https://github.com/inuits/elody-mediafile-module/blob/main/mediafileResolver.ts) | elody-mediafile-module | `GetPrimaryMediafileFromEntity` |
| [`helpers/contentSecurityPolicyHelper.ts`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/contentSecurityPolicyHelper.ts) | elody-base-graphql | per-path `frame-ancestors` |
| [`auth/authTokenManager.ts`](https://github.com/inuits/elody-base-graphql/blob/master/auth/authTokenManager.ts) | elody-base-graphql | anonymous / whitelisted-token fallbacks |
