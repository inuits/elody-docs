# Linked Open Data

Every entity is addressable at its own frontend URL, and that URL follows the
Linked Open Data convention: what you get back depends on the `Accept` header
you send. A browser asking for HTML gets the app. A harvester asking for
`text/turtle` gets the entity as RDF, at the same address.

```bash
curl https://podiumnet-dev.elody.eu/production/PR-6V8VLIHP0 \
  -H 'Accept: text/turtle' \
  -H 'Authorization: Bearer <token>'
```

```turtle
@prefix : <https://elody.eu/> .

<https://podiumnet-dev.elody.eu/PR-6V8VLIHP0> a :production ;
    :title "Gezelschappen" ;
    :status "archived" ;
    :premiere_date "2026-07-30" ;
    :refBookingAgency <https://podiumnet-dev.elody.eu/ORG-JQGB344X> .
```

This works for every client, with no per-client code and no configuration.

## Supported formats

| `Accept` | Result |
| --- | --- |
| `text/html`, `*/*`, or no header | The frontend, as before |
| `application/json` | The collection-api entity document |
| `text/turtle` | RDF, Turtle |
| `application/ld+json` | RDF, JSON-LD |
| `application/rdf+xml` | RDF, RDF/XML |
| `application/n-triples` | RDF, N-Triples |

Order matters for the two that look alike: a bare `*/*` — what `curl` and
`fetch` send by default — resolves to `text/html` and serves the app, so
existing clients are unaffected. Only an explicit request for one of the data
formats is treated as a data request.

`text/csv` and `text/uri-list` are deliberately **not** negotiated here. Both
are registered as representations in collection-api but have no case in its
accept-header mapping, so on a single entity csv answers `500` and uri-list
returns a JSON body under a `text/uri-list` content type.

## How a request is routed

The negotiation lives in the GraphQL service (baseGraphql), in
`endpoints/linkedOpenDataEndpoint.ts`, and runs from the frontend handler in
`endpoints/frontendEndpoint.ts`. Three things decide what happens:

1. **The negotiated mimetype.** Express' own `req.accepts` picks the best match,
   so q-weighted and multi-type headers work (`text/turtle;q=0.9,
   application/json;q=0.5` resolves to Turtle). Anything resolving to
   `text/html` falls through to the app.
2. **The path.** The last segment is taken as the entity id. A segment
   containing a dot is treated as a file, not an entity, so `/manifest.json`
   and `/sw.js` keep reaching the static assets.
3. **Position.** It is registered *ahead* of the static and Vite middleware.
   Behind them, the SPA fallback only answers html-accepting requests and data
   requests would never arrive.

Client-specific routes registered as `customEndpoints` still take precedence,
because those are registered earlier — digipolis' `/asset/*` and `/iiif/*`
handling is untouched.

The request is then proxied to collection-api's `/entities/<id>` with the
single negotiated mimetype as its `Accept`. That normalisation matters:
collection-api matches the accept header with an exact string comparison and
does not parse q-values, so forwarding the client's raw header would fall
through to JSON.

Entities resolve by **either** identifier — the human id (`PR-6V8VLIHP0`) or
the uuid — because collection-api matches both against the document's
`identifiers`.

## Authentication

The proxy forwards the caller's `Authorization` header and nothing else. It
does not fall back to a service token, so an anonymous request gets whatever
collection-api gives an anonymous caller — on most clients, a `401`. Publishing
a genuinely public dataset needs an anonymous read policy on the entity route.

## What the RDF looks like

collection-api builds the graph in `api/mappers.py` (`build_linked_data_node`).
Four things make the output dereferenceable rather than a mechanical dump of
the entity JSON:

- **Entities are URIs, not blank nodes.** Each subject is `<base>/<id>`, so it
  can be linked to and looked up.
- **`type` is an RDF class.** `production` becomes `rdf:type :production`
  instead of an `:type "production"` literal.
- **Metadata are direct predicates.** `{"key": "title", "value": "x"}` becomes
  `:title "x"` instead of an anonymous node with `:key` and `:value`.
- **Relations point at the related entity's URI**, so the graph can actually be
  followed: dereferencing `:refBookingAgency` returns the organization whose
  subject URI is exactly that reference.

`audit` and `schema` are not published.

Subject URIs are `<base>/<id>` and deliberately **not** `<base>/<type>/<id>`:
a relation only records the target's id, never its type, so a typed URI could
not be built for relation targets. Two URI shapes for one resource would break
linking. Both forms dereference anyway, since only the last path segment is
read as the id.

A metadata key that cannot form a valid IRI — one containing a space, for
instance — is skipped rather than failing the request.

## Configuring the base URI

The base is resolved in this order, first one wins:

| Variable | Purpose |
| --- | --- |
| `ELODY_LD_BASE_URI` | Explicit override |
| `DAMS_FRONTEND_URL` | The frontend origin |
| `ELODY_LD_CONTEXT` | The vocabulary base |
| — | `https://elody.eu/` |

Only values that are **absolute** `http://` or `https://` URIs are accepted;
anything else — empty, or a path like `/` — is skipped as if unset. Without
that guard an empty value produces relative identifiers, which rdflib then
resolves against the process working directory, yielding nonsense like
`<file:///PR-KC6WGSXST> a <file:///app/api/production>`.

In practice none of these need setting.

Locally, `DAMS_FRONTEND_URL` is already defined for every client in
docker-compose and passed to collection-api. It is a docker-compose variable
only, so on Kubernetes the Helm chart fills `ELODY_LD_BASE_URI` from the public
route hostname instead:

```yaml
ELODY_LD_BASE_URI: '{{ .general.elody_ld_base_uri | default (printf "https://%s" $.Values.global.route.hostname) }}'
```

Every deployment therefore publishes identifiers under its own public host —
the address that content-negotiates — with nothing to add per environment.

Set `collection.config.general.elody_ld_base_uri` only to publish identifiers
under a *different* host than the frontend — for example one that stays
stable across environments:

```yaml
collection:
  config:
    general:
      elody_ld_base_uri: https://data.example.org
```

`ELODY_LD_CONTEXT` sets the `@vocab` that predicates resolve against and falls
back to `https://elody.eu/`. Point it at a real published vocabulary when one
exists.

## Local development

Locally this does **not** work at `http://dashboard.<client>.localhost:8000`.
Traefik routes `/` to the PWA's own Vite dev server and only `/api` to the
GraphQL service, so the negotiation never sees the request. Hosted
environments do not split this — there the GraphQL service serves `/` itself.

To try it locally, go straight to the GraphQL service inside the dashboard
container:

```
http://localhost:4001/<type>/<id>
```

## Extension-based formats on digipolis

digipolis additionally serves `/asset/<id>.turtle`, `.json` and `.rdf`, where
the format comes from the file extension instead of the accept header. Those
routes stay, and now share the same proxy and format map; the extension style
is not available on other clients.
