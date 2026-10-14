# Elody Collection

collection-api is where the data lives. It is a Flask REST service that
stores entities and mediafiles in MongoDB, validates every write, decides who
may read or change what, and tells the rest of the platform when something
changed.

```
GraphQL service ─┐
importers, OCR, ─┼──REST──▶ collection-api ──▶ MongoDB
transcoder       ┘                │
                                  └──events──▶ RabbitMQ ──▶ history, transcode, …
```

Every client runs the same collection-api image. What makes it a garage
network rather than anything else is the client module mounted into
`api/apps/`: the object configurations that define each entity type, their
validators, the roles and the `permissions.py` that ties them together. See
[how a client extends the core](/services/#how-a-client-extends-the-core).

## Where to start

New to collection-api? Read these in order:

1. [Collection API Reference](api-reference.md) lists every endpoint, and
   shows what an entity looks like on the wire.
2. [Advanced Filtering](advanced-filtering.md) is how you find anything: the
   filter language behind `POST /entities/filter`.
3. [Policies & Permissions](policies-and-permissions.md) explains why a
   request gets a `403`, and how to give a role access.

The examples use [the garage network](/example-domain): garages, their
employees, customers, cars, parts and work orders.

## Reference

| Page | What it covers |
| --- | --- |
| [Collection API Reference](api-reference.md) | The base REST endpoints, with request and response examples |

## Querying

| Page | What it covers |
| --- | --- |
| [Advanced Filtering](advanced-filtering.md) | Filter types and matchers, relation filters, facets, aggregation and count limits |

## Security

| Page | What it covers |
| --- | --- |
| [Policies & Permissions](policies-and-permissions.md) | Roles, create/read/update/delete rules, object and key restrictions, and how policies are wired |

## Services

| Page | What it covers |
| --- | --- |
| [Emails](emails.md) | Templated HTML emails over SMTP, and extending the base email service for a client |
