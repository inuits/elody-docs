# Auth & Session

Elody uses OpenID Connect (OIDC) with Keycloak as the default identity
provider. The important thing to understand up front: **the browser never
holds an access token**. Tokens live in a server-side session inside the
GraphQL service, and the browser only holds an opaque session cookie. Every
call to collection-api is made server-side, with the GraphQL service attaching
the token.

## The three actors

| Actor | Role |
| --- | --- |
| **PWA** (browser) | Starts the login redirect, reads user claims from `/api/me`, reacts to auth state. Sees no tokens. |
| **baseGraphql** (Express + Apollo Server) | The OIDC *confidential client*. Exchanges the auth code for tokens, stores them in the session, refreshes them, attaches them to collection-api requests. |
| **Keycloak** (or any OIDC-compliant IdP) | Authenticates the user, issues and revokes tokens. |

Both the PWA and baseGraphql are served from the same origin in production
(see [Production Serving](production-serving.md)), which is why the PWA can
call `/api/me` and `/api/graphql` as relative paths and the session cookie just
works.

## Login flow

The flow is the standard OIDC **authorization code flow**, with the code
exchange done server-side so the client secret never reaches the browser.

```
1. PWA          auth.redirectToLogin()
                  → browser navigates to Keycloak /auth?...&redirect_uri=<current page>
2. Keycloak     user logs in, redirects back to redirect_uri?code=<authCode>
3. PWA          main.ts reads ?code= from the URL on boot
                  → POST /api/auth_code { authCode, clientId, redirectUri }
4. baseGraphql  AuthManager.authenticate() POSTs to Keycloak's token endpoint
                  grant_type=authorization_code + client_secret
                  → stores { accessToken, refreshToken } in req.session.auth
5. PWA          auth.verifyServerAuth() → GET /api/me
                  → isAuthenticated = (status !== 401), auth.user = token claims
```

Step-by-step, in code:

- **`redirectToLogin()`** builds the Keycloak `/auth` URL (`response_type=code`,
  `scope=openid`, `client_id`, `redirect_uri`) from the OIDC config the PWA
  received from `/api/app-configs`. It lives in the separate
  `session-vue-3-oidc-library` package, vendored at
  `packages/session-vue-3-oidc-library/src/components/OpenIdConnectPlugin.ts`.
  That plugin accepts more config than Elody feeds it — for instance it
  supports a `kcIdpHint` option (to add `kc_idp_hint` and skip Keycloak's
  provider-selection screen), but `/api/app-configs` never sends one, so it is
  not currently reachable.
- **Boot handling** lives in
  [`src/main.ts`](https://github.com/inuits/elody-pwa/blob/master/src/main.ts):
  if `?code=` is present it calls `processAuthCode()`, otherwise it calls
  `verifyServerAuth()` to pick up an existing session (e.g. a page refresh).
- **The code exchange endpoint** is `POST /api/auth_code` in
  [`auth/index.ts`](https://github.com/inuits/elody-base-graphql/blob/master/auth/index.ts).
  It first checks whether the session already has a non-expired token and
  short-circuits if so — so a stale `?code=` in the URL can't blow away a
  working session.
- **The token request** itself is
  [`AuthManager.authenticate()`](https://github.com/inuits/elody-base-graphql/blob/master/auth/auth-manager.ts).

If the exchange fails and `allowAnonymousUsers` is off, `main.ts` bounces the
user straight back to the login page.

### The two "users" — don't confuse them

| | What it is | Where it comes from |
| --- | --- | --- |
| `auth.user` | The **decoded access token claims** (`name`, `email`, `preferred_username`, `role`, …). No network call to a userinfo endpoint — `/api/me` literally returns `jwt_decode(accessToken)`. | `verifyServerAuth()` → `GET /api/me` |
| `useAuth().elodyUser` | A **collection entity** representing the user in the data model, with metadata and relations like any other entity. | `GetElodyUser` GraphQL query |

`getUserName()` / `getUserEmail()` in
[`src/composables/useAuth.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useAuth.ts)
read from `auth.user`; anything that needs the user *as data* uses `elodyUser`.

### Where the OIDC config comes from

The PWA does not hardcode any OIDC settings. On boot it fetches
`/api/app-configs`
([`endpoints/appConfigEndpoint.ts`](https://github.com/inuits/elody-base-graphql/blob/master/endpoints/appConfigEndpoint.ts))
and receives a `config.oidc` object built from baseGraphql's environment.

Note that `oidc.baseUrl` uses **`OAUTH_BASE_URL_FRONTEND`**, not
`OAUTH_BASE_URL`. The browser and the container network usually reach Keycloak
under different hostnames (`keycloak.elody.localhost:8100` vs `keycloak:8080`),
and the browser-facing one is the one that goes into the redirect URL.

Endpoints can also be discovered instead of configured. Set
`OIDC_DISCOVERY_URL` and
[`auth/oidcDiscovery.ts`](https://github.com/inuits/elody-base-graphql/blob/master/auth/oidcDiscovery.ts)
fetches `.well-known/openid-configuration` at boot and fills in the token,
auth and logout endpoints. Any explicitly set `OAUTH_*_ENDPOINT` env var wins
over discovery, and a failed discovery request only logs a warning and falls
back to the env vars. The built-in defaults assume Keycloak's URL shape, so a
non-Keycloak IdP needs either discovery or all four endpoints set by hand.

## The session

`applyAuthSession()` in
[`auth/index.ts`](https://github.com/inuits/elody-base-graphql/blob/master/auth/index.ts)
wires up `express-session`, storing sessions in MongoDB via `connect-mongo`
when Mongo config is available. That persistence matters: without it, every
GraphQL service restart or new replica logs every user out.

The session cookie (`connect.sid`) is `httpOnly` and, by default,
`sameSite: 'strict'` with `secure: false`. It only switches to
`sameSite: 'none'` + `secure: true` when the deployment is **both**
`NODE_ENV=production` **and** has `features.hasRedirectToExternalSites`
enabled — that combination is needed when the app bounces users to an external
site that then links back, since a `strict` cookie is not sent on such a
cross-site navigation.

::: warning Two gotchas in this area
- `hasPersistentSessions` is currently a no-op: the code reads
  `appConfig.features.hasPersistentSessions || true`, so persistent sessions
  are always on when Mongo is configured.
- `APOLLO_SESSION_SECRET` and `APOLLO_CLIENT_SECRET` are required. In
  production a missing one throws at boot; outside production it is auto-filled
  with a fresh random value and listed under
  `[!] auto-defaulted secrets (set before production)` in the startup banner.
  A random session secret means every restart invalidates every cookie, so
  everyone gets logged out.
:::

## Getting a valid token for every backend call

Every collection-api call from GraphQL goes through
[`AuthRESTDataSource`](https://github.com/inuits/elody-base-graphql/blob/master/auth/AuthRESTDataSource.ts),
whose `willSendRequest` asks
[`AuthTokenManager.getValidToken()`](https://github.com/inuits/elody-base-graphql/blob/master/auth/authTokenManager.ts)
for a bearer token, and also forwards `X-tenant-id` and a per-request
`X-request-id`.

`getValidToken()` tries these in order and returns the first that works:

1. **The session's access token**, if present and not expired (expiry read
   from the JWT's `exp`).
2. **A refresh**, if there is a refresh token — see below.
3. **The IP whitelist token**, if `features.ipWhiteListing` is configured and
   the client IP matches.
4. **The domain whitelist token**, if `features.domainWhiteListing` is
   configured and the request origin matches.
5. **An empty token** (`''`), if `ALLOW_ANONYMOUS_USERS=true`.
6. Otherwise it throws `AUTH | NO VALID TOKEN` with status 401.

### Two refresh paths

Refresh happens in two independent places, and it helps to know which one
you're looking at:

**Proactive** — `AuthTokenManager` decodes the access token before each
outgoing request and refreshes it if `exp` has passed. Concurrent GraphQL
requests on the same session are a real risk here (one page load fires many),
so refreshes are serialised through a per-session lock: a `WeakMap` keyed on
the session object holds the in-flight refresh promise, and any other request
that arrives mid-refresh awaits the same promise instead of starting a second
refresh. On failure, `session.auth` is set to `null`.

**Reactive** — `AuthRESTDataSource.withRetry()` wraps every HTTP verb. If
collection-api answers `401` anyway (clock skew, a token revoked mid-flight),
it refreshes once and replays the request. If that refresh yields nothing, it
throws `AUTH | REFRESH FAILED`.

Underneath both sits
[`AuthManager.refresh()`](https://github.com/inuits/elody-base-graphql/blob/master/auth/auth-manager.ts),
which does the `grant_type=refresh_token` call and, on a `400`/`401` from
Keycloak, triggers a logout — the refresh token itself is dead, so there is
nothing left to recover.

## Logout

Two ways a user gets logged out.

**Explicitly**, via `performLogout()` in
[`useAuth.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useAuth.ts),
which calls `GET /api/logout` and then cleans up the frontend: resets cached
permissions, clears local/session storage, clears the selected tenant, closes
open modals, and redirects to login if the current route needs auth.

Server-side, `/api/logout` revokes the tokens at Keycloak's logout endpoint,
clears `session.auth`, destroys the session and clears the `connect.sid`
cookie (with the same cookie options it was set with — otherwise the browser
keeps it).

**Implicitly**, when the server says the session is gone. An Apollo Server
plugin in
[`main.ts`](https://github.com/inuits/elody-base-graphql/blob/master/main.ts)
tags every GraphQL response that has no `session.auth` with
`extensions.authStatus = 'UNAUTHENTICATED'`. In the PWA, the `authCheckLink`
Apollo link watches for that value and, if the frontend still thinks it is
authenticated, logs out and (unless anonymous access is allowed) redirects to
login. This is what catches a session that expired server-side while a tab sat
open.

## Cross-tab auth sync

Without this, logging out in one tab leaves other tabs showing a UI they can
no longer use.
[`useCrossTabAuthSync.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useCrossTabAuthSync.ts)
uses a `BroadcastChannel("auth")` to keep tabs consistent:

- It watches `auth.isAuthenticated` and broadcasts `login` or `logout` on
  every change.
- On receiving `logout`, a tab runs `performLogout()`.
- On receiving `login` while it is *not* authenticated, a tab resets cached
  permissions, re-runs `verifyServerAuth()` and re-initialises the app — so
  logging in on one tab lights up the others.

The channel is closed on unmount. Turn the whole thing off with
`features.enableCrossTabAuthSync: false` in the client's app config; it
defaults to `true` and is passed through `/api/app-configs`.

## Route guards

Guards live in
[`src/routerNavigationGuards.ts`](https://github.com/inuits/elody-pwa/blob/master/src/routerNavigationGuards.ts).
Routes come from the GraphQL-driven router config, and the auth-relevant
`meta` keys are `requiresAuth`, `can` (a permission) and `alternativeRoutes`.

**`beforeEach`** runs, in order:

1. `checkAlternativeRoutes` — if the route declares `can`, the permission is
   fetched; when it fails and the route declares `alternativeRoutes`, the user
   is sent to the route mapped to their `auth.user.role` (falling back to a
   `fallback` key). This is how different roles land on different landing
   pages instead of just being denied.
2. `checkRequiresAuthFromOverview` — for entity-type routes, checks whether
   that type requires auth and redirects to `/unauthorized` if so.
3. `checkTenantParameter` — syncs the `:tenant` URL segment with the selected
   tenant, redirecting or prefixing the path as needed.

Any error thrown by a guard is logged and navigation continues, so a failing
permission fetch cannot lock a user out of the whole app.

**`afterEach`** does the `requiresAuth` check:

```ts
if (route.meta.requiresAuth && !auth.isAuthenticated.value)
  router.push("/unauthorized");
```

Note that this runs *after* navigation, not before — the target route mounts
briefly and is then replaced. `afterEach` also keeps
`auth.config.redirectUri` in sync with the current URL, which is what makes
the post-login redirect land the user back where they started. Error routes
(`Unauthorized`, `AccessDenied`) are deliberately excluded so you never get
redirected back to the error page after logging in.

The `/unauthorized` page
([`src/views/errorViews/Unauthorized.vue`](https://github.com/inuits/elody-pwa/blob/master/src/views/errorViews/Unauthorized.vue))
shows a log-in button that redirects to the IdP, and bounces to Home on mount
if the user turns out to be authenticated after all.

## Anonymous access

With `ALLOW_ANONYMOUS_USERS=true`, an unauthenticated visitor is not forced to
log in: `getValidToken()` returns an empty token instead of throwing,
`initApp` boots the app without a session, and neither `main.ts` nor
`authCheckLink` triggers a login redirect. Individual routes can still require
auth via `meta.requiresAuth`. Note this variable is read in two places — as
`environment.allowAnonymousUsers` (passed to the frontend via app-config) and
directly from `process.env` in `AuthTokenManager` — so it must be set on the
GraphQL service, not only in the client config.

## Whitelisting (static tokens)

Some deployments need to serve users who cannot log in — a reading-room kiosk,
an embedded public viewer. Rather than disabling auth, Elody **substitutes a
pre-minted static JWT** when there's no session, so collection-api still
receives a real token with real, deliberately limited permissions.

This is checked in `getValidToken()` only *after* the session and refresh
paths fail, so a logged-in user on a whitelisted IP still acts as themselves.

### IP whitelisting

Enabled by adding `features.ipWhiteListing` to a client's app config:

```ts
features: {
  ipWhiteListing: {
    whiteListedIpAddresses: ["<ip>", "<ip>"],
    tokenToUseForWhiteListedIpAddresses: process.env.<YOUR_STATIC_JWT_VAR>,
  },
}
```

A request coming from one of those addresses without a session gets that
static token. Keep the token itself in an env var, never in the config file.
It should be minted with only the permissions such a visitor may have: it is
handed out to anyone on the network, and nothing downstream narrows it further.

Hardcoding the address list means adding one needs a rebuild; reading it from a
comma-separated env var and `.split(",")` avoids that, and is the better
pattern for lists that change.

Matching happens in `isIpAddressWhitelisted()`
([`helpers/helpers.ts`](https://github.com/inuits/elody-base-graphql/blob/master/helpers/helpers.ts)).
Two things to know:

- **`*` is a glob, anchored at both ends.** An entry without `*` must match the
  client IP exactly. An entry containing `*` is compiled to an anchored regex
  where `*` means "any characters" and every other character — dots included —
  is literal. So `10.0.*` matches `10.0.1.1` but not `210.0.1.1`, and `10.0.*.1`
  matches `10.0.42.1`. The wildcard is textual, not CIDR-aware: `10.0.*` also
  matches `10.0.999.1`, and it says nothing about netmasks. Prefer exact
  addresses where you can.
- **The client IP is only as good as your proxy config.** The value comes from
  `req.ip`, and baseGraphql sets `app.set('trust proxy', 1)` — so it depends on
  Traefik (or whatever fronts it) sending a correct `X-Forwarded-For`. Get that
  wrong and every request looks like it comes from the proxy. When
  `ipWhiteListing` is configured, baseGraphql logs the resolved client IP per
  GraphQL request, and a whitelist miss is logged with the IP it actually saw
  — start debugging there.

### Domain whitelisting

Same mechanism, keyed on the request's origin rather than its IP:

```ts
features: {
  domainWhiteListing: {
    whiteListedDomainAddresses:
      process.env.<YOUR_DOMAIN_LIST_VAR>?.split(",") || [],
    tokenToUseForWhiteListedDomainAddresses:
      process.env.<YOUR_STATIC_JWT_VAR>,
  },
}
```

The origin is derived by `getClientOrigin()` from the `Origin` header, falling
back to `Referer`, reduced to a lowercased hostname. `isDomainWhitelisted()`
then compares hostnames (both sides normalised through `new URL()`, so
`https://example.org/` and `example.org` are equivalent). Requests with neither
header (server-to-server calls, some privacy settings) never match.

Entries support the same anchored glob as the IP list, so `*.example.com`
whitelists every subdomain in one entry. Two things follow from `*` meaning
"any characters":

- `*.example.com` matches `a.b.example.com` as well as `museum.example.com`,
  but **not** the apex `example.com` — list that separately if you need it.
- Keep the dot in the pattern. `*example.com` matches `notexample.com` too,
  which is almost certainly not what you want.

::: tip Don't confuse whitelist tokens with `STATIC_JWT`
The whitelist tokens are named by whichever env vars a client's config points
at — there is no fixed name for them. `STATIC_JWT` is a separate, base-level
variable with nothing to do with whitelisting: it is used by the SEO endpoint
to server-render entity metadata for crawlers.
:::

## What collection-api does with the token

Everything above is about *obtaining* a token. Validating it and deciding what
it may do happens in collection-api (a separate GitLab repo), which uses the
`inuits-policy-based-auth` package. `api/policy_factory.py` initialises a
`PolicyFactory` and loads policies — per-client ones from `apps.permissions`
when that module exists, otherwise the defaults. Resources call
`apply_policies()` and read the resulting user context via
`get_user_context()`. That is authorization rather than authentication, and is
worth a page of its own.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `OAUTH_BASE_URL` | IdP realm URL as reachable from the GraphQL service |
| `OAUTH_BASE_URL_FRONTEND` | Same realm as reachable from the browser |
| `OAUTH_CLIENT_ID` | OIDC client ID |
| `APOLLO_CLIENT_SECRET` | OIDC client secret (never leaves the server) |
| `APOLLO_SESSION_SECRET` | `express-session` signing secret |
| `OIDC_DISCOVERY_URL` | Optional; auto-populates the endpoints below |
| `OAUTH_TOKEN_ENDPOINT` / `OAUTH_AUTH_ENDPOINT` / `OAUTH_LOGOUT_ENDPOINT` | Endpoint paths; default to Keycloak's shape |
| `ALLOW_ANONYMOUS_USERS` | Allow browsing without a session |
| `APOLLO_TOKEN_LOGGING` | `true` enables auth logging (token tails, user email, refresh calls) — debugging only |

Whitelisting adds its own variables for the static token and (optionally) the
address list, but their names are chosen per client in that client's app config
— see [Whitelisting](#whitelisting-static-tokens).

## Debugging checklist

- **Redirect loop on login** — `redirect_uri` mismatch. Compare the
  `redirect_uri` in the Keycloak URL against the client's valid redirect URIs
  in Keycloak, and check `OAUTH_BASE_URL_FRONTEND`.
- **Logged out on every refresh** — session not persisted. Check the Mongo
  config and that `APOLLO_SESSION_SECRET` is actually set (an auto-defaulted
  random secret invalidates every cookie on restart).
- **Logged in, but collection-api returns 401** — a token problem, not a login
  problem. Set `APOLLO_TOKEN_LOGGING=true` on the GraphQL service to log auth
  activity (`auth/debug.ts` gates every log line on it): the token tail plus the
  user's email on each request, the full token at authentication and refresh,
  and the refresh request body with the client secret stripped. Then look for
  `AUTH | REFRESH FAILED` and `REFRESH FAILED => logout` in the logs. Leave it
  off in production — it prints tokens.
- **Whitelisted IP not recognised** — look for the
  `[AuthTokenManager] IP whitelist miss:` log line; it prints the IP the
  service actually saw, which tells you whether the problem is the list or
  `X-Forwarded-For`.
- **One tab logs out, others don't** — `enableCrossTabAuthSync` is disabled,
  or the tabs aren't same-origin (`BroadcastChannel` is origin-scoped).
