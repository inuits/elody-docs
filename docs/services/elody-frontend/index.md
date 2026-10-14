# Elody Frontend

The Elody frontend is what a user sees and clicks: the listings, the detail
pages, the forms, the media viewers. It is made of two parts that ship in one
image:

- **The PWA**: a Vue 3 single-page app. It holds no knowledge of any data
  model, so there is no `CarDetail.vue` and no `WorkOrderForm.vue`.
- **The GraphQL service**: a Node/Express app running Apollo Server. It is
  built from the shared modules (`baseGraphql` and friends) plus the client's
  own queries, resolvers and translations. It tells the PWA what to render,
  holds the user's session, and talks to collection-api on the PWA's behalf.

```
browser ──▶ PWA ──/api/graphql──▶ GraphQL service ──▶ collection-api
              ▲                        │
              └── "render these fields,│
                   with these inputs"  ┘
```

The GraphQL service doesn't just return data. It also returns the shape of the
UI. When a garage wants a fuel type on the car page, someone edits a query in
its GraphQL service; nobody touches the PWA.

## Where to start

New to the frontend? Read these in order:

1. [GraphQL-Driven UI](graphql-driven-ui.md) follows one field from a query to
   an editable input. Everything else builds on it.
2. [Inputs & Teaser Metadata](inputs-and-teaser-metadata.md) covers how an
   entity appears in a listing and on its detail page.
3. Pick a feature below that you need, such as
   [Pipeline View Mode](features/pipeline-view-mode.md), and enable it.
4. [Build Pipeline](build-pipeline.md) explains how your change gets from the
   repo to a running app, and why a green pipeline doesn't mean it's deployed
   yet.

The examples use [the garage network](/example-domain): garages, their
employees, customers, cars, parts and work orders.

## Core concepts

| Page | What it covers |
| --- | --- |
| [GraphQL-Driven UI](graphql-driven-ui.md) | How a query describes a page; `intialValues`, columns, labels and writing back |
| [Inputs & Teaser Metadata](inputs-and-teaser-metadata.md) | Listing rows and cards, detail panels, and the input fields behind them |
| [Formatters](formatters.md) | Rendering a value as a pill, a link or a chip without changing the value |
| [Translations](translations.md) | Where labels come from and how base and client translations merge |

## Features

Each feature page says what the feature does, and then how a client turns it on.

**Lists & views**

| Page | What it covers |
| --- | --- |
| [List Item Click Actions](features/list-item-click-actions.md) | Navigate, preview, open in a modal, or do nothing on click |
| [Pipeline View Mode](features/pipeline-view-mode.md) | A list laid out as a left-to-right flow along relations |
| [Rounded Counts](features/rounded-counts.md) | Capped result counts, shown as `1,000+` with an exact count on demand |
| [Bulk Edit](features/bulk-edit.md) | Change metadata and relations on many entities at once |
| [Merge Entities](features/merge-entities.md) | Turn two duplicate records into one |

**Detail pages**

| Page | What it covers |
| --- | --- |
| [Relation Pills](features/relation-pills.md) | A related entity as a pill, with the relation's own metadata inside it |
| [Comments & Threads](features/comments.md) | Threaded discussions on an entity, with `@` and `#` tagging |
| [History Viewer](features/history-viewer.md) | Two versions of an entity side by side, with every change marked |

**Media**

| Page | What it covers |
| --- | --- |
| [Media Viewers](features/media-viewers.md) | The IIIF, audio, video, PDF and text viewers, picked by mimetype |
| [External URL Mediafiles](features/external-url-mediafiles.md) | A mediafile that stands in for a link instead of a stored file |
| [Embedded Viewer](features/embedded-viewer.md) | A chrome-less IIIF viewer other sites can put in an `<iframe>` |

**Data exchange**

| Page | What it covers |
| --- | --- |
| [Linked Open Data](features/linked-open-data.md) | Every entity URL returns RDF when it is asked for it |

## Security

| Page | What it covers |
| --- | --- |
| [Auth & Session](auth-session.md) | OIDC login, server-side tokens and refresh, route guards, whitelisting |
| [UI Permissions](permissions.md) | Hiding config a user may not use, and how that relates to the backend policies |

## GraphQL service

| Page | What it covers |
| --- | --- |
| [Proxy Endpoints](proxy-endpoints.md) | `/api/...` endpoints for files, streams and exports that don't fit in GraphQL |

## Build & deploy

| Page | What it covers |
| --- | --- |
| [Build Pipeline](build-pipeline.md) | The three pipelines, Nexus releases, codegen, and what to rebuild after a change |
| [Production Serving](production-serving.md) | One Express process serving both the PWA and the GraphQL API |
| [Dynamic Tailwind Classes](dynamic-tailwind-classes.md) | Why runtime-built class names work locally and break once deployed |
