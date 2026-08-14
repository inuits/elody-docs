# Elody Frontend

The Vue 3 PWA that renders the GraphQL-driven UI.

## Architecture

- [Build Pipeline](build-pipeline.md) — the three pipelines behind a deployed
  frontend: modules publishing to Nexus, the PWA source image, and the client
  build that compiles them into one image.
- [Production Serving](production-serving.md) — how that image serves the
  compiled PWA and the GraphQL API from a single Express process.
- [Auth & Session](auth-session.md) — OIDC login/logout, server-side tokens
  and refresh, cross-tab sync, route guards and whitelisting.

## Styling

- [Dynamic Tailwind Classes](dynamic-tailwind-classes.md) — why runtime-built
  class names work locally and break once deployed.

## Features

- [Comments & Threads](features/comments.md) — threaded discussions on an
  entity, with `@` user tagging and `#` entity links.
- [Rounded Counts](features/rounded-counts.md) — how capped result counts are
  displayed to the user.
