# Services

![Services architecture](/images/services-architecture.svg)

Elody Common is a microservice platform. This section documents each service
and the features it exposes.

- [Elody Collection](/services/elody-collection/) — the Flask REST + GraphQL
  API backing entity storage, filtering, and relations.
- [Elody Frontend](/services/elody-frontend/) — the Vue 3 PWA that renders the
  GraphQL-driven UI.

## How a deployment is composed

A running Elody environment is assembled from four layers.

**Shared infrastructure** (`docker-compose.yml` in the repository root) is
started once per machine with `task start-root` and shared by every client:
Traefik, Keycloak + its MariaDB, MongoDB, ArangoDB, RabbitMQ, MinIO, Dozzle and
this documentation site.

::: warning ArangoDB is deprecated
The ArangoDB path is no longer maintained. The container still runs so existing
deployments keep working, but it does not receive updates and new work targets
MongoDB. Do not pick `DB_ENGINE=arango` for a new client.
:::

**The per-client core** is declared inline in
`clients/<client>/docker-compose.yml`. It is never an include, because every
client needs it:

| Service | Notes |
| --- | --- |
| `dashboard` | One container serving two things: the Apollo GraphQL server on `PathPrefix(/api)` and the Vue 3 PWA on `PathPrefix(/)`. |
| `collection-api` | Flask REST + GraphQL. Also carries the `job-api` network alias and Traefik router, which is what the add-on services call for job tracking. |
| `storage-api` | Uploads, downloads and tickets against MinIO. Usually pulled in via `docker-compose-include-storage-api.yml`, but `digipolis-asset-engine` and `pza-iot` declare their own. |

**Opt-in add-ons** live in `docker-compose-include-*.yml` at the repository
root. A client includes only the ones it needs. They communicate over the
RabbitMQ topic exchange and call back into `collection-api` / `job-api`.

**Client-specific services** are declared inside the client repository itself. A
client can also ship its own include file — `vliz-dams` provides
`docker-compose-include-vocab.yml` next to its compose file.

## How a client extends the core

Every client runs the same two core images. Only the mounted code differs, so
there is no fork of `collection-api` or the PWA.

- **Backend** — `clients/<client>/client-collection-module` is bind-mounted over
  `collection-api/api/apps/`: `app_list.json`, `mappers.py`, `permissions.py`,
  `roles/` and a `<client>/` package holding the object configurations and
  validators.
- **Frontend** — `clients/<client>/client-frontend` supplies the
  `inuits-dams-graphql-service` (queries, resolvers, translations, schema). It
  is combined at build time with the six shared GraphQL modules in `modules/`
  (`baseGraphql`, `advancedFiltersModule`, `advancedSearchModule`,
  `importModule`, `mediafileModule`, `savedSearchModule`) and the
  `inuits-dams-pwa` source.

## Which client runs what

`inc` = pulled in through the shared include file, `own` = declared in the
client's own compose file.

| Client | iiif + cantaloupe | storage-api | transcode | ocr | antivirus | filesystem-importer | csv-exporter | canopy | mailpit | Client-specific |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | --- |
| amvb-dams | inc | inc | inc | inc | | inc | | | | drupal, apache, mysql |
| coghent-dams | inc | inc | inc | | | | | | | csv-import, ldes-import, data-seed, image jobs |
| digipolis-asset-engine | inc | own | | | inc | | | | | — (headless, no dashboard) |
| digipolis-dams | inc | inc | inc | inc | inc | inc | inc | | | — |
| dishacled-wp3-prototype | | | | | | | | | | — (collection-api + dashboard only) |
| hairoad-elody | inc | inc | inc | | | inc | | | | — |
| podiumnet | inc | inc | inc | | | inc | | | inc | typesense |
| pza-iot | inc | own | | | | | | | | — |
| ugent-aicap | inc | inc | | | | own | | | | — |
| vlacc-dams | | inc | | | | inc | | | | typesense, docs |
| vliz-dams | inc | inc | inc | | | inc | | inc | | vocab, minio-setup, docs |

## Runtime flow

Requests go browser → Traefik → `dashboard` (PWA and Apollo) → `collection-api`
→ MongoDB. Binary data goes through `storage-api` to MinIO. The client's
`DB_ENGINE` still selects the store, but ArangoDB is deprecated and only
existing deployments should be on it.

`collection-api` publishes domain events on the RabbitMQ topic exchange
(`entity_changed`, `child_relation_changed`, `mediafile_changed`,
`file_uploaded`, `file_scanned`, `job_created`, `ocr_request`). Add-on services
consume those, do their work, and report back to `collection-api` / `job-api`.
All containers share the `elody` docker network.
