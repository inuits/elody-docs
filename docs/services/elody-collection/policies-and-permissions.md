# Policies and Permissions

The policy and permission system secures every API endpoint in the Elody
collection service. You define which roles can create, read, update, and delete
which entity types, and the framework enforces those rules on every request
before it reaches your business logic.

The system is built in three layers. The first layer is the generic
`inuits-policy-based-auth` engine, which provides the `PolicyFactory`, the
`@apply_policies` decorator, and the `PolicyContext` / `UserContext` objects
that all policies share. The second layer is the Elody SDK
(`elody-python-sdk/src/elody/policies`), which implements concrete
authentication and authorization policies on top of that engine. The third
layer is the per-client permission configuration, a set of Python dictionaries
(one per role) that declare exactly what each role may do and to which entity
types and fields.

This document is the complete reference: the request lifecycle and verdict
semantics, the authentication and authorization policies, the permission
configuration format and every restriction type, all key-syntax modifiers,
placeholder substitution, schema versioning, and a set of worked examples.

It covers enforcement only. For how the user interface decides which buttons,
panels and routes to render — which probes these same restrictions ahead of
time and omits the config a user may not have — see
[UI Permissions](/services/elody-frontend/permissions).

## How authorization works

Every protected endpoint is decorated with `@policy_factory.apply_policies(...)`.
When a request arrives, the factory runs two sequential passes.

**Authentication pass.** Each registered authentication policy is applied in
order. Policies populate the `UserContext` object: they set the user id, the
current tenant, and the roles extracted from the token. Later policies in the
chain can read what earlier ones have written.

**Authorization pass.** Each registered authorization policy is then applied in
order. Every policy inspects the request and the `UserContext` and sets
`policy_context.access_verdict` to `True`, `False`, or `None`. The factory
uses the following decision rule:

- **`True`** — access is allowed; the factory stops and lets the request
  through.
- **`False`** — access is denied; the factory stops and returns 403.
- **`None`** — this policy does not apply to the current request; continue to
  the next policy.

**The first policy that returns a non-`None` verdict wins.** If no policy
returns a verdict, the request is denied. A role may be permitted to access an
entity by one policy even if a later policy would have denied it; the first
allow ends evaluation.

Inside each authorization policy the same logic is applied per role. The user's
roles are iterated, and the first role that produces a truthy verdict ends the
loop. An explicit `False` from a rule breaks the inner loop but allows the
outer role loop to continue to the next role.

**The order in which authorization policies are evaluated is defined by the
`policies.authorization` array in `app_list.json`.** See
[Enabling policies (app_list.json)](#enabling-policies-app_listjson).

## The user context

The `UserContext` object is created fresh for every request and populated by
the authentication policies. Authorization policies read from it and may write
additional values to `bag` and `access_restrictions`.

| Field | Type | Description |
| :---- | :--- | :---------- |
| `id` | string | Authenticated user id (from token claim). |
| `email` | string | Lowercased user e-mail (from token claim). |
| `preferred_username` | string | Lowercased preferred username (from token claim). |
| `x_tenant.id` | string | Tenant id from the `X-Tenant-Id` request header. |
| `x_tenant.roles` | list | Roles for the current tenant, extracted from the token. |
| `x_tenant.scopes` | list | Scopes derived from roles via `role_scope_mapping.json`. |
| `x_tenant.raw` | dict | Full tenant document as stored in the database. |
| `tenants` | list | All tenants associated with the user. |
| `bag` | dict | Free-form key-value store shared between policies and the API. |
| `access_restrictions.filters` | list | Filter criteria injected by the policy (see [How restrictions become filters](#how-restrictions-become-filters)). |
| `access_restrictions.post_request_hook` | callable | Hook called on the response to mask fields the role may not read. |

## Authentication policies

Authentication policies run first. They read the incoming request and populate
the `UserContext`. Each policy is responsible for a single concern; they are
stacked in a chain.

### AuthlibFlaskOauth2Policy

Validates the bearer JWT. It extracts the issuer from the unverified token
header, then verifies the signature against the issuer's JWKS endpoint (or
a configured static public key). On success it maps token claims onto
`user_context` via a configurable `token_schema`.

| Item | Detail |
| :--- | :----- |
| Reads | `Authorization: Bearer <token>` header |
| Token claims | `exp`, `azp`, `sub`, `iss`; schema-mapped `id`, `email`, `preferred_username` |
| Sets | `user_context.id`, `user_context.email`, `user_context.preferred_username`, `user_context.auth_objects["token"]` |
| Env vars | `STATIC_ISSUER`, `STATIC_PUBLIC_KEY`, `ALLOWED_ISSUERS`, `ALLOW_ANONYMOUS_USERS` |

**Anonymous users.** When `ALLOW_ANONYMOUS_USERS=true` and the token is absent
or cannot be acquired, the policy returns the context unchanged (no id set).
An invalid token (bad signature, expired) is always rejected regardless of that
flag.

**JWKS key rotation.** If signature verification fails, the cached JWKS is
cleared and fetched once more before a second attempt.

### TenantTokenRolesPolicy

Reads the roles claim from the already-validated token and stores them on
`x_tenant`.

| Item | Detail |
| :--- | :----- |
| Reads | `user_context.auth_objects["token"]` (set by `AuthlibFlaskOauth2Policy`) |
| Sets | `user_context.x_tenant.roles`, `user_context.x_tenant.scopes` |
| Env vars | `ROLE_SCOPE_MAPPING` (path to `role_scope_mapping.json`), `ALLOW_ANONYMOUS_USERS` |

Scopes are derived by looking up each role in `role_scope_mapping.json`. See
[Scopes and role-scope mapping](#scopes-and-role-scope-mapping).

### MultiTenantPolicy

Resolves the tenant from the `X-Tenant-Id` request header and populates
`x_tenant.id` and `x_tenant.raw`.

| Item | Detail |
| :--- | :----- |
| Reads | `X-Tenant-Id` header (configurable), `api_key_hash` query param |
| Sets | `user_context.x_tenant.id`, `user_context.x_tenant.raw` |
| Env vars | `TENANT_DEFINING_HEADER`, `TENANT_DEFINING_TYPES`, `AUTO_CREATE_TENANTS` |

**Header absent.** The policy falls back to `api_key_hash` but only for `GET`
requests to a small allow-listed set of paths (`/download/...`, `/media/...`,
`/mediafiles/<id>`, `.../copyright`, `/tickets/<id>`). Any other request
without the header receives a 403.

**Tenant not found.** When `AUTO_CREATE_TENANTS=false` (the default), a missing
tenant returns 403. When true, the tenant is created automatically.

**`TENANT_DEFINING_TYPES`.** When this env var is set, the policy short-circuits
and returns immediately, deferring tenant resolution to a type-based mechanism
elsewhere.

### XUserHeadersPolicy

Service-to-service impersonation policy. When the `Authorization` header
carries the value of the `STATIC_JWT` environment variable exactly, the policy
trusts the `X-User-Email` header to identify the user and looks the user up in
storage.

| Item | Detail |
| :--- | :----- |
| Reads | `Authorization` header, `X-User-Email` header, `STATIC_JWT` env var |
| Sets | `user_context.id`, `user_context.email` |

If any precondition fails (no matching token, no header, user not found) the
policy is a no-op; it does not raise an error.

### BaseUserTenantValidationPolicy

An abstract base that implements shared logic for loading the user document,
computing combined roles across multiple tenants, and building an anonymous
context when no authenticated user is found.

**Anonymous context.** When no user is resolved, `user_context.id` is set to
`"anonymous"` and `x_tenant.roles` to `["anonymous"]`.

**Multiple tenants.** `x_tenant.id` may be a comma-separated string of tenant
ids. Roles from each tenant are accumulated and deduplicated. A Forbidden raised
for one tenant is tolerated as long as at least one tenant already contributed
roles; otherwise it is re-raised.

## Authorization policies

Authorization policies run after authentication. Each policy is responsible for
one URL pattern and one or more HTTP methods. A policy returns `None` for any
request that does not match its pattern, leaving it to the next policy in the
chain.

The table below lists every policy with the request-path regular expression it
matches and the HTTP methods it handles.

| Policy | Path regex | Methods |
| :----- | :--------- | :------ |
| `GenericObjectRequestPolicyV2` | `^(/[^/]+/v[0-9]+)?/[^/]+$` | POST, GET |
| `GenericObjectDetailPolicy` | `^(/[^/]+/v[0-9]+)?/[^/]+/[^/]+$` | POST, GET, PUT, PATCH, DELETE |
| `FilterGenericObjectsPolicyV2` | `^(/[^/]+/v[0-9]+)?/[^/]+/filter$` | POST |
| `GenericObjectMediafilesPolicy` | `^(/[^/]+/v[0-9]+)?/[^/]+/[^/]+/mediafiles$` | POST, GET |
| `GenericObjectMetadataPolicy` | `^(/elody/v[0-9]+)?/[^/]+/[^/]+/metadata$` | GET, PUT, PATCH |
| `GenericObjectRelationsPolicy` | `^(/elody/v[0-9]+)?/[^/]+/[^/]+/relations$` | POST, GET, PUT, PATCH, DELETE |
| `MediafileDownloadPolicy` | `^(/elody/v[0-9]+)?/mediafiles/[^/]+/download$` | GET |
| `MediafileDerivativesPolicy` | `^(/elody/v[0-9]+)?/mediafiles/[^/]+/derivatives$` | POST, GET |
| `MultiTenantPolicy` (authz) | all paths | all |
| `TenantRequestPolicy` | `^(/[^/]+/v[0-9]+)?/tenants$` | all |
| `ScopeBasedPolicy` | all paths | all |
| `SuperAdminPolicy` | all paths | all |

All of the object policies ultimately call into the `permission_handler`
module, which evaluates `object_restrictions` and `key_restrictions` against
the current user's role permissions. See
[Permission configuration](#permission-configuration) for how those are defined.

**v1 vs v2 policies.** The `GenericObjectRequestPolicy` and
`FilterGenericObjectsPolicy` also have legacy v1 variants. The v2 variants
are preferred for all new clients:

- v2 `FilterGenericObjectsPolicyV2` raises a `BadRequest` when no type filter
  is present in the request body; v1 silently injects a hard-coded default
  type list.
- v2 policies emit abstracted `selection` filter objects (the same format as
  [Advanced Filtering](advanced-filtering.md)) with `lookup` support and
  `policy_signature` tagging. v1 policies emit raw MongoDB query fragments.
- v2 `GenericObjectRequestPolicyV2` requires the `type` query parameter on GET
  requests; v1 falls back to a tenant-relation filter when `type` is absent.

## Permission configuration

Permissions are defined as a plain Python dictionary and registered on
application startup. The collection API looks for a module at
`apps.permissions` and calls `load_policies` with the `PERMISSIONS` dict and
a `PLACEHOLDERS` list.

```python
# clients/<client>/client-collection-module/api/apps/permissions.py

from apps.roles.admin import ADMIN
from apps.roles.anonymous import ANONYMOUS
from apps.roles.user import USER

PERMISSIONS = {
    **ADMIN,
    **ANONYMOUS,
    **USER,
}

PLACEHOLDERS = []
```

Each role file exports a single dict with the role name as the only top-level
key.

### Enabling policies (app_list.json)

Before permission dictionaries take effect, the policies that enforce them must
be registered. This is done through `app_list.json`, the application manifest
for the collection-api. The file lives at:

```
clients/<client>/client-collection-module/api/apps/app_list.json
```

It is mounted into the Docker container and referenced by the `APPS_MANIFEST`
environment variable (set to `/app/api/apps/app_list.json` in every client
`.env`). The `load_policies` and `load_apps` functions in `elody.loader` read
it **once, at application startup**, to register API blueprints and the policy
chain.

The file contains one entry per app. Each entry declares a `resources` list
(the Flask blueprints to register) and a `policies` block with two ordered
arrays — `authentication` and `authorization`:

```json
{
  "garage": {
    "name": "Garage",
    "description": "Garage specific extensions",
    "version": 0.1,
    "author": "Inuits",
    "author_email": "developers@inuits.eu",
    "license": "Proprietary",
    "resources": ["garage", "elody", "mediafile", "label"],
    "policies": {
      "authentication": [
        "external_api_key_policy",
        "token_based_policies.authlib_flask_oauth2_policy",
        "token_based_policies.tenant_token_roles_policy",
        "user_tenant_validation_policy"
      ],
      "authorization": [
        "super_admin_policy",
        "job_request_policy",
        "generic_object_request_policy_v2",
        "filter_generic_objects_policy_v2",
        "generic_object_metadata_policy",
        "generic_object_relations_policy",
        "generic_object_detail_policy"
      ]
    }
  }
}
```

This registers four authentication policies (applied in listed order) and seven
authorization policies (evaluated in listed order — first allow wins, as
described in [How authorization works](#how-authorization-works)).

Each string in the policy arrays is a module name. The loader resolves it
through the search order described in
[Writing and overriding policies](#writing-and-overriding-policies): a
client-local module at `apps.<app>.policies.<auth_type>.<name>` takes
precedence over the SDK default at `elody.policies.<auth_type>.<name>`.

> **Warning: changing anything in `app_list.json` requires a restart of the
> collection-api Docker container.** The manifest is read only once, during
> application startup. Edits to the file — adding or removing policies,
> reordering them, or changing resource lists — are not picked up by a running
> container and will have no effect until the container is restarted.

### Permission dict shape

The full permission dictionary has the following nested structure:

```python
{
    "<role-name>": {
        "create": {
            "<entity-type>": {
                "<schema>:<version>": {
                    "object_restrictions": { ... },
                    "key_restrictions":    { ... },
                    "error_messages":      { ... },
                }
            }
        },
        "read":   { ... },
        "update": { ... },
        "delete": { ... },
    }
}
```

- **`<role-name>`** — the role string as it appears in the JWT (e.g. `"admin"`,
  `"manager"`, `"mechanic"`).
- **CRUD operations** — `create`, `read`, `update`, `delete`. A role that has
  no key under an operation cannot perform that operation at all.
- **`<entity-type>`** — the document `type` field (e.g. `"car"`,
  `"workOrder"`, `"mediafile"`). An entity type present but mapping to an
  empty dict `{}` means the role has **unrestricted access** to that type for
  that operation.
- **`<schema>:<version>`** — a schema identifier such as `"elody:1"`,
  `"iot:1"`, `"dams:1"`, `"pim:1"`. The permission handler resolves the
  correct schema block for each document (see
  [Schemas and version resolution](#schemas-and-version-resolution)).

A simple unrestricted admin role looks like this:

```python
ADMIN = {
    "admin": {
        "create": {
            "car":       {},
            "mediafile": {},
            "user":      {},
        },
        "read": {
            "car":       {},
            "mediafile": {},
            "user":      {},
        },
        "update": {
            "car":       {},
            "mediafile": {},
            "user":      {},
        },
        "delete": {
            "car":       {},
            "mediafile": {},
            "user":      {},
        },
    },
}
```

This grants the `admin` role full, unrestricted access to `car`, `mediafile`,
and `user` entities across all four CRUD operations.

### Object restrictions

`object_restrictions` gate access to the **entire document**. If any
restriction fails, the request is denied for that role. The key of each
restriction entry follows the format `"<index>:<field-path>"`.

```python
"read": {
    "workOrder": {
        "pim:1": {
            "object_restrictions": {
                "0:properties.status.value":      ["planned", "in_progress"],
                "1:properties.assigned_to.value": ["EMPLOYEE_ID"],
            }
        }
    }
}
```

The mechanic role above may only read `workOrder` documents whose
`properties.status.value` is `"planned"` or `"in_progress"` **and** whose
`properties.assigned_to.value` field contains the runtime value of
`EMPLOYEE_ID` (a placeholder; see
[Placeholders](#placeholders)).

**Index semantics.** The integer prefix (e.g. `0:`, `1:`) is an index that
groups restriction entries across schemas. Two entries with the same index but
in different schema blocks are combined with **OR** at query time: either the
`elody:1` version of the field matches, or the `pim:1` version does. Entries
with different indices are combined with **AND**.

```python
"read": {
    "workOrder": {
        "elody:1": {
            "object_restrictions": {
                "0:properties.assigned_to.value": ["EMPLOYEE_ID"],
            }
        },
        "pim:1": {
            "object_restrictions": {
                "0:properties.assigned_to.value": ["EMPLOYEE_ID"],
            }
        },
    }
}
```

This emits a single filter criterion with key
`["elody:1|properties.assigned_to.value", "pim:1|properties.assigned_to.value"]`,
matched with OR. See [Advanced Filtering](advanced-filtering.md) for the
schema-prefixed key format.

**Error messages.** An optional `error_messages` block maps restriction entry
keys to a custom 403 message:

```python
"object_restrictions": {
    "0:properties.visibility.value": ["public"],
},
"error_messages": {
    "0:properties.visibility.value": "This document is not publicly accessible.",
},
```

When the `0:properties.visibility.value` restriction fails, the custom message
is surfaced in `g.permission_error_message` and returned in the 403 response.

### Key restrictions

`key_restrictions` operate at the **field level**. They do not gate the entire
document; instead they control which individual fields a role may read or write.

```python
"update": {
    "part": {
        "pim:1": {
            "object_restrictions": {
                "0:tenants": ["X_TENANT_ID"]
            },
            "key_restrictions": {
                "0:id":                             {},
                "1:properties.part_number.value":   {},
                "2:properties.category.value":      {},
                "3:properties.date_created.value":  {},
                "4:properties.stock_quantity.value": {
                    "properties.stock_quantity.value": [
                        "properties.reorder_level.value"
                    ]
                },
            },
        }
    }
}
```

Each `key_restrictions` entry is `"<index>:<field-path>": {<condition>}`.

**Empty condition `{}`** means the restriction applies unconditionally — this
role can never modify that field.

**Non-empty condition** specifies when the restriction applies. The condition
is a dict of `{ condition_key: [allowed_values] }`. The restriction fires only
when the document's `condition_key` field matches one of the `allowed_values`.
In the example above, `properties.stock_quantity.value` is protected only when
`properties.stock_quantity.value` is currently equal to
`properties.reorder_level.value` (a self-referencing value lookup; see
[Placeholders](#placeholders) for the value-reference mechanism).

**Read behaviour.** When a `key_restriction` fires on a `read` request, the
restricted field is **silently stripped** from the response. The caller receives
the document without the field; no error is raised.

**Write behaviour.** When a `key_restriction` fires on a `create`, `update`, or
`delete` request, and the request body attempts to set the restricted field to
a different value than the stored document already has, the request is denied
with a 403. The response body lists the offending fields:

```json
{
  "message": "...[INSUFFICIENT_PERMISSIONS]... You don't have the permission
    to create/update/delete the following fields: ['properties.part_number.value'].",
  "restricted_keys": ["properties.part_number.value"]
}
```

### Restricting a key inside a list of objects

A field path may contain the element marker `[]` to restrict a key on **each
element of a list separately**, instead of deleting the list. Without it, a
path such as `properties.ref_garages.roles` would strip the whole
`properties.ref_garages` property, because the path is resolved two
levels deep only.

```python
"read": {
    "user": {
        "pim:1": {
            "key_restrictions": {
                "0:properties.ref_garages[].roles": {
                    "!properties.ref_garages[].value": "GARAGE_IDS"
                },
            }
        }
    }
}
```

Given a document like:

```python
"properties": {
    "ref_garages": [
        {"value": "garage-1", "roles": ["manager"],  "department": ["workshop"]},
        {"value": "garage-2", "roles": ["mechanic"], "department": ["workshop"]},
    ]
}
```

a caller whose `GARAGE_IDS` contains only `garage-2` reads back both
elements with their `value` and `department` intact, but only `garage-2` keeps its
`roles`.

**Condition scope.** A condition key carrying the same `<list>[].` prefix is
evaluated against *the element being considered*, so its value is a scalar
rather than the flattened list of every element's values. This is what makes
`!` behave per element. A condition key **without** the marker is evaluated
against the document as a whole, as usual — the two can be combined.

**Missing keys never raise.** An element the condition cannot be evaluated
against (the condition key is absent from that element) is restricted rather
than raised over: a read restriction that blew up on one malformed element
would take down the whole listing, and leaking the key is the worse failure.
A document that does not have the list at all is left untouched.

**Read only.** `[]` restrictions are rejected with an explicit error on
`create`, `update` and `delete` — the write-side check compares flat request
body keys, which a per-element path cannot address. Do not use `[]` in
`object_restrictions` either; those keys are compiled into database filters.

### Optional, negated and relation keys

Both `object_restrictions` and `key_restrictions` (and their condition keys)
support a set of prefix modifiers that change how missing keys and relation
lookups are handled.

| Prefix | Applied to | Meaning |
| :----- | :--------- | :------ |
| `?`    | key        | **Optional.** The restriction is skipped when the key is absent from the document (access is allowed). |
| `!`    | key        | **Negate.** The restriction passes when the field value is *not* in the allowed list. |
| `!?`   | key        | **Optionally strict.** If the key is present it must match; if absent, access is *denied*. |
| `@`    | key        | **Relation lookup.** Resolve a related document and check a field on it. |
| `[]`   | key        | **Per element.** Restrict a key on each element of a list separately (read only). See [Restricting a key inside a list of objects](#restricting-a-key-inside-a-list-of-objects). |

Prefix characters appear between the index colon and the field path:

```
"0:?properties.colour.value"
"0:!properties.visibility.value"
"0:!?properties.vin.value"
"0:?relations.isMediafileFor.key@car-?properties.archived.value"
```

**`?` — optional key.** The most common prefix. Use it whenever a field may
legitimately be absent on older or partially migrated documents:

```python
"object_restrictions": {
    "0:?properties.archived.value": [False],
}
```

This denies access to archived documents when the `properties.archived.value`
field is present and set to a truthy value, but allows access when the field is
missing entirely.

**`!` — negate.** Passes when the document's value is *not* in the list:

```python
"key_restrictions": {
    "0:!properties.category.value": ["brakes"],
}
```

This protects `properties.category.value` for every document whose category is
not `"brakes"`.

**`!?` — optionally strict.** The field is optional to exist, but if it does
exist it must match. If it is absent, access is denied. This is the inverse of
plain `?`. The error message from the permission handler guides you:

> Either prefix the key with `?` to make it an optional restriction (allows
> access if key does not exist), or prefix with `!?` to deny access if the key
> does not exist.

**`@` — relation lookup.** Resolves a related document and checks a field on
it. The syntax is:

```
<local-field>@<RelatedType>-<remote-key>
```

The value of `<local-field>` on the current document is used as the id to look
up a document of type `<RelatedType>`. Then `<remote-key>` is evaluated on that
related document.

Prefixes may be stacked. `?` before `@` makes the relation optional on the
source document; `!` or `?` before `<remote-key>` modifies how the remote key
is evaluated.

```python
# service_advisor.py — read workOrder
"object_restrictions": {
    "0:relations.for_car.key@car-?properties.archived.value": [False],
}
```

This reads the `workOrder`'s `relations.for_car.key` field (the id of the
car), fetches that car, and checks whether its
`properties.archived.value` is `False`. The `?` before `properties…` makes
the remote key optional (allows access if the car has no `archived`
field).

```python
# part_configuration.py — key_restrictions condition
"?properties.ref_superseded_by.value@part-!properties.category.value": [
    "properties.category.value"
]
```

The restriction condition on `ref_superseded_by` fires only when the linked
replacement `part`'s category is *not* the current part's category (the `!`
on the remote key).

### Combined restriction values

An `object_restrictions` value list may contain a nested list of
`{value: {condition_key: [values]}}` dicts. This expresses a combined
condition: the restriction passes if the field value matches **and** an
additional condition on a different field also matches.

```python
# service_advisor.py — read mediafile
"object_restrictions": {
    "0:properties.visibility.value": [
        "public",
        "internal",
        [
            {
                "private": {
                    "relations.uploaded_by.key": "USER_IDS"
                }
            }
        ],
    ]
}
```

This grants access to a `mediafile` document when its `properties.visibility.value` is
`"public"` or `"internal"` (straightforward values in the list), **or** when
it is `"private"` *and* its `relations.uploaded_by.key` contains the user's id
(the `USER_IDS` placeholder; see [Placeholders](#placeholders)). The nested
list is the combined branch; plain string entries in the same list are
independent alternatives.

The permission handler processes the combined branches first (`__matches_combined_expected_values`),
removes them from the list, and then evaluates the remaining plain values
(`__matches_expected_values`).

### Placeholders

Placeholder strings in restriction values are replaced at runtime with
context-specific values. Replacement happens in `get_permissions` before any
restriction is evaluated.

The following placeholders are available without any additional configuration:

| Placeholder | Replaced with |
| :---------- | :------------ |
| `X_TENANT_ID` | `user_context.bag["x_tenant_id"]` — the current tenant id. |
| `TENANT_DEFINING_ENTITY_ID` | `user_context.bag["tenant_defining_entity_id"]` — the id of the entity that defines the tenant (IoT use-case). |

Clients register additional placeholders in `apps/permissions.py`:

```python
# permissions.py
PLACEHOLDERS = ["EMPLOYEE_ID", "GARAGE_IDS"]
```

```python
# manager.py
"object_restrictions": {
    "0:relations.works_at.key": "GARAGE_IDS"
}
```

At runtime `GARAGE_IDS` is replaced with the list of garage ids stored in
`user_context.bag["garage_ids"]`.

**String-replace vs. list substitution.** When the placeholder value is a
string, it replaces the placeholder wherever it appears inside another string.
When the placeholder value is a **list** and the restriction value is the
placeholder string verbatim (not embedded in a larger string), the entire
string is replaced with the list:

```python
# restriction value before substitution
"GARAGE_IDS"

# user_context.bag["garage_ids"] = ["garage-1", "garage-2"]

# restriction value after substitution
["garage-1", "garage-2"]
```

**Value references.** A restriction value may also be the dotted path of
another field on the same document. The permission handler resolves the value
at check time:

```python
"key_restrictions": {
    "6:properties.stock_quantity.value": {
        "properties.stock_quantity.value": [
            "properties.reorder_level.value"
        ]
    }
}
```

Here `"properties.reorder_level.value"` is not a literal string to match; the
handler looks up `flat_item["properties.reorder_level.value"]` and uses that as
the expected value. This makes it possible to express cross-field equality
rules without hard-coding tenant-specific values.

### Schemas and version resolution

Each entity document carries a `schema.type` and `schema.version` field. The
permission handler uses these to select the correct restriction block:

1. It builds the key `"<schema.type>:<schema.version>"` (e.g. `"pim:1"`).
2. It looks up that key directly in the entity-type's schema dict.
3. If not found, it walks backwards through the registered schema keys looking
   for one matching `^<schema.type>:[0-9]{1,3}?$` and uses the last match.
4. If still not found, it returns an empty restrictions dict (no restrictions
   apply).

Documents that have no `schema` field are treated as `"elody:1"`. This means
`"elody:1"` is the baseline schema and its restrictions apply to all documents
that have not been migrated to a more specific schema.

```python
"read": {
    "user": {
        "elody:1": {
            "object_restrictions": {
                "0:relations.hasTenant.key": ["tenant:super", "X_TENANT_ID"]
            }
        }
    }
}
```

This restriction applies to all `user` documents regardless of their schema
version, because the fallback always resolves to `"elody:1"`.

### Reusing restrictions from object configurations

Object configurations (`BaseObjectConfiguration` subclasses) may export
restriction dicts from their `document_info()` method. This keeps shared rules
in one place and lets multiple roles reference them without duplication.

```python
# part_configuration.py (excerpt)
def document_info(self):
    return {
        "create_object_restrictions": {
            "100:?properties.ref_superseded_by.value@part-properties.category.value": [
                "properties.category.value"
            ],
        },
        "crud_key_restrictions": {
            "100:id":                                {},
            "101:properties.part_number.value":      {},
            ...
        },
    }
```

A role file imports the configuration mapper and spreads the shared dict:

```python
# mechanic.py (excerpt)
from configuration import get_object_configuration_mapper

part_crud_key_restrictions = (
    get_object_configuration_mapper()
    .get("part")
    .document_info()["crud_key_restrictions"]
)

MECHANIC = {
    "mechanic": {
        "update": {
            "part": {
                "pim:1": {
                    "object_restrictions": {
                        "0:tenants":                   ["X_TENANT_ID"],
                        "1:properties.category.value": ["brakes", "filters", "tyres"],
                    },
                    "key_restrictions": part_crud_key_restrictions,
                },
            }
        }
    }
}
```

Spreading with `**` is also valid when the configuration-provided dict needs to
be combined with role-specific entries.

### How restrictions become filters

For list endpoints (`/entities`, `/entities/filter`), the permission handler
translates `object_restrictions` into additional filter criteria that are
injected into the database query. The caller never sees them; they are enforced
transparently.

The generated filters follow the same format as the
[Advanced Filtering](advanced-filtering.md) request body. Each restriction
entry becomes a `selection` filter:

```python
{
    "lookup":          { ... },        # present for @ relation keys
    "type":            "selection",
    "key":             ["pim:1|properties.category.value"],
    "value":           ["brakes"],
    "match_exact":     True,
    "or":              [],
    "policy_signature": "<STATIC_JWT>",
}
```

**`policy_signature`.** Policy-injected filters carry a `policy_signature`
field set to the value of the `STATIC_JWT` environment variable. The filter
pipeline (`filters_v2/stages/match_stage.py`) identifies these signed filters
and applies them as a mandatory `$and` condition that cannot be overridden by
user-supplied filters. This prevents a caller from circumventing
object-restriction filters by sending a conflicting filter in the request body.

**Post-request hook.** For single-item and filter responses, the policy
registers a `mask_protected_content_post_request_hook`. After the database
returns results, the hook iterates each item and applies `key_restrictions` for
the read operation, stripping any restricted fields before the response is
serialised.

**Type filter requirement (v2).** `FilterGenericObjectsPolicyV2` requires that
the request body contain a type filter (`{"type": "type", "value": "..."}` or
a `selection` on the `type` key). A request without one receives a 400:

```json
{
  "message": "Filter with type 'type', or a filter with type 'selection'
    and 'key' equal to 'type' is required"
}
```

### Scopes and role-scope mapping

Scopes are a finer-grained permission layer used by `ScopeBasedPolicy`.
A role maps to a list of scopes in `role_scope_mapping.json`:

```json
{
  "regular_user": [
    "create-entity",
    "read-entity",
    "patch-entity",
    "delete-entity"
  ],
  "super_admin": [
    "has-full-control"
  ]
}
```

`TenantTokenRolesPolicy` loads this file (path from `ROLE_SCOPE_MAPPING` or
the default `role_scope_mapping.json`) and extends `x_tenant.scopes` for each
role the user holds.

Endpoints declare the scopes they require via `RequestContext`:

```python
@policy_factory.apply_policies(
    RequestContext(request, ["create-entity", "read-entity"])
)
def get(self):
    ...
```

`ScopeBasedPolicy` grants access when any of the required scopes appears in
`user_context.x_tenant.scopes`.

### Writing and overriding policies

The policy loader resolves a policy module by searching the following locations
in order:

1. `<policy_module_name>` (absolute import)
2. `apps.<app>.policies.<auth_type>.<policy_module_name>`
3. `elody.policies.<auth_type>.<policy_module_name>`
4. `inuits_policy_based_auth.<auth_type>.policies.<policy_module_name>`

To override an existing policy for a specific client, create the module at
location 2. Because the loader tries client-local paths before the SDK paths,
the client version wins.

**Required folder structure:**

```
api/
└── apps/
    └── <app>/
        └── policies/
            ├── authentication/
            │   └── my_auth_policy.py
            └── authorization/
                └── open_data_policy.py   ← overrides SDK OpenDataPolicy
```

**Class name convention.** The loader derives the class name from the module
file name: it title-cases the stem and removes underscores. A file named
`open_data_policy.py` must export a class named `OpenDataPolicy`.

**Minimal custom authorization policy:**

```python
from inuits_policy_based_auth import BaseAuthorizationPolicy


class OpenDataPolicy(BaseAuthorizationPolicy):
    def authorize(self, policy_context, user_context, request_context):
        request = request_context.http_request
        if request.method == "GET":
            policy_context.access_verdict = True
        return policy_context
```

This overrides the SDK's `OpenDataPolicy` for the current app and allows all
GET requests unconditionally. For any other method it returns `None` (abstain),
letting the next policy in the chain decide.

## Errors

The collection API returns the following error responses related to policies
and permissions.

- **401 Unauthorized.** The bearer token is absent, expired, revoked, or
  otherwise invalid. The `ALLOW_ANONYMOUS_USERS` flag does not exempt invalid
  tokens from this error; only the absence of a token is subject to that flag.

- **403 Forbidden — restricted keys.** The request body attempts to set one or
  more fields the role is not permitted to modify. The response body includes a
  `restricted_keys` array:

  ```json
  {
    "message": "...[INSUFFICIENT_PERMISSIONS]... You don't have the permission
      to create/update/delete the following fields: ['properties.part_number.value'].",
    "restricted_keys": ["properties.part_number.value"]
  }
  ```

- **403 Forbidden — no access.** The role has no permission to access the
  requested entity type or the `object_restrictions` for the document do not
  match. When an `error_messages` block is configured for the failing
  restriction, that custom message is returned instead of the default.

- **403 Forbidden — missing tenant.** The `X-Tenant-Id` header is absent
  and no `api_key_hash` fallback applies. Or the user has no relation to the
  requested tenant.

- **400 Bad Request — missing type filter.** The `FilterGenericObjectsPolicyV2`
  requires a type filter in every filter request body. Omitting it returns 400.

- **`METADATA_KEY_UNDEFINED` error.** A restriction key references a field that
  does not exist on the document and the key was not prefixed with `?`. The
  error message guides you to the fix:

  > Key `<key>` not found in document `<id>`. Either prefix the key with `?`
  > to make it an optional restriction (allows access if key does not exist),
  > or patch the document to include the key. `?` will allow access if key
  > does not exist, `!?` will deny access if key does not exist.

## Worked examples

### Simple read-only role

A role that may only read a fixed set of entity types, with no restrictions on
which specific documents are visible:

```python
ANONYMOUS = {
    "anonymous": {
        "create": {},
        "read": {
            "carModel":  {},
            "part":      {},
            "mediafile": {},
        },
        "update": {},
        "delete": {},
    }
}
```

This grants the `anonymous` role read access to `carModel`, `part`, and
`mediafile` documents. The empty `create`, `update`, and `delete` dicts mean
those operations are not available at all. Because each entity-type value is an
empty dict, no further restrictions apply; every document of those types is
readable.

### Object-restricted read with a placeholder

A role that may only read the `workOrder` documents assigned to the user:

```python
MECHANIC = {
    "mechanic": {
        "create": {},
        "read": {
            "workOrder": {
                "pim:1": {
                    "object_restrictions": {
                        "0:properties.status.value":      ["planned", "in_progress"],
                        "1:properties.assigned_to.value": ["EMPLOYEE_ID"],
                    }
                }
            }
        },
        "update": {},
        "delete": {},
    }
}

PLACEHOLDERS = ["EMPLOYEE_ID"]
```

The `EMPLOYEE_ID` placeholder is replaced at runtime with the employee id stored
in `user_context.bag["employee_id"]`. A mechanic with employee id
`"employee-42"` will only ever see `workOrder` documents whose
`properties.assigned_to.value` contains `"employee-42"` **and** whose
`properties.status.value` is `"planned"` or `"in_progress"`.
This is enforced both at query time (via the injected filter) and at single-item
fetch time (via `handle_single_item_request`).

### Key-restricted update with a conditional

A role that may update the `workOrder` documents assigned to it but cannot
modify certain fields, except when a cross-field condition applies:

```python
MECHANIC = {
    "mechanic": {
        "update": {
            "workOrder": {
                "pim:1": {
                    "object_restrictions": {
                        "0:properties.assigned_to.value": ["EMPLOYEE_ID"]
                    },
                    "key_restrictions": {
                        "0:id":                               {},
                        "1:properties.title.value":           {},
                        "2:properties.assigned_to.value":     {},
                        "3:properties.date_created.value":    {},
                        "4:properties.date_modified.value":   {},
                        "5:properties.labour_hours.value": {
                            "properties.labour_hours.value": [
                                "properties.planned_labour_hours.value"
                            ]
                        },
                    },
                }
            }
        }
    }
}
```

`id`, `title`, `assigned_to`, `date_created`, and `date_modified` are
unconditionally protected — the mechanic can never change them. The
`labour_hours` field is protected only when its current value equals
`properties.planned_labour_hours.value` on the same document (a cross-field equality
guard). If a request body attempts to change any of these fields, the response
is 403 with `restricted_keys` listing the offending fields.

### Relation lookup with combined values

A role that may read `mediafile` documents based on visibility, with special
handling for private mediafiles where ownership is checked via a relation:

```python
SERVICE_ADVISOR = {
    "service_advisor": {
        "read": {
            "workOrder": {
                "pim:1": {
                    "object_restrictions": {
                        "0:relations.for_car.key@car-?properties.archived.value": [
                            False
                        ],
                    }
                }
            },
            "mediafile": {
                "pim:1": {
                    "object_restrictions": {
                        "0:properties.visibility.value": [
                            "public",
                            "internal",
                            [
                                {
                                    "private": {
                                        "relations.uploaded_by.key": "USER_IDS"
                                    }
                                }
                            ],
                        ]
                    }
                }
            },
        },
    }
}
```

For `workOrder`: the permission handler fetches the `car` via
`relations.for_car.key` and checks `properties.archived.value` on it.
The `?` before `properties…` allows access when the field is absent on the
car. Access is denied only when the car explicitly has
`archived` set to `True`.

For `mediafile`: plain values `"public"` and `"internal"` are checked first. If
the mediafile's visibility is `"private"`, the combined branch fires: access is
granted only when `relations.uploaded_by.key` contains one of the user's ids
(the `USER_IDS` placeholder). Private mediafiles uploaded by someone else are
not visible.
