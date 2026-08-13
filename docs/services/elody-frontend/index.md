# Elody Frontend

The Vue 3 PWA that renders the GraphQL-driven UI.

## Architecture

- [Production Serving](production-serving.md) — how the PWA is built in the
  pipeline and served by Express in production.
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
