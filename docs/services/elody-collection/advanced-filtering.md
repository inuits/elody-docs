# Advanced Filtering

The advanced filtering API lets you search a collection for entities that match
one or more filter criteria. You send a `POST` request to the filter endpoint
with a JSON body that describes the criteria you want to apply, and the API
returns the matching entities together with pagination and count information.

Each criterion describes a **filter type** (what kind of data you are matching:
text, number, date, ...), a **key** (which field to look at), and a **value**
(what to match). A set of **matchers** determines how the value is compared to
the data. This document is the complete reference: the endpoint and its query
parameters, every filter type and matcher, every request field, the response
format, and a set of worked examples.

## Endpoint

```
POST /entities/filter
```

This searches the `entities` collection. Other collections can be searched by
substituting the collection name, for example `POST /mediafiles/filter`. Some
installations expose versioned routes (for example `/<spec>/v1/entities/filter`);
check the API documentation of your deployment (`/api/docs`) for the exact path.

The request body must be a JSON array. The `Content-Type` header must be
`application/json`. The endpoint is protected by the same authentication and
authorization rules as the rest of the collection API.

### Query parameters

| Parameter    | Type   | Description                                                        |
| :----------- | :----- | :----------------------------------------------------------------- |
| `skip`       | int    | Number of results to skip. Default `0`.                            |
| `limit`      | int    | Maximum number of results to return. Default `20`.                 |
| `order_by`   | string | Comma-separated list of fields to sort on.                         |
| `asc`        | 0/1    | Sort ascending (`1`, default) or descending (`0`).                 |
| `field`      | string | Restrict the returned fields. Repeatable, `field[]` also accepted. |
| `history`    | 0/1    | Query the history collection instead of the current collection.    |
| `soft`       | 0/1    | Dry run; validates the request without executing the query.        |
| `exact_count`| 0/1    | Bypass the count cap and return the true total. Default `0`.       |

## Request body

The body is always a JSON array of filter criteria:

```json
[
  { "type": "type", "value": "asset" },
  {
    "type": "text",
    "key": "properties.title.value",
    "value": "Portret",
    "match_exact": true
  }
]
```

This returns every asset whose title property equals `Portret`.

**A type filter is strictly required for every request.** Every request body
must contain at least one criterion that filters on the entity type: either a
`type` filter (a single type) or a `selection` filter on the `type` key (one or
more types). See [Type](#type).

All criteria in the array are combined with a logical **AND** by default. See
[Combining filters](#combining-filters) for how to build OR expressions.

Every example body in this document is a JSON array of filter criteria and
always includes a type filter.

## Filter types and matchers

The table below lists every filter type and the matchers it supports.

| Filter type | Matchers                                             | `value` format                    |
| :---------- | :--------------------------------------------------- | :-------------------------------- |
| `text`      | `any`, `none`, `exact`, `contains`, `contains_not`, `regex` | string, `"*"`, or `""`     |
| `number`    | `exact`, `min_included`, `max_included`, `in_between`        | number, or `{min/max, included}`  |
| `date`      | `any`, `none`, `exact`, `min_included`, `max_included`, `in_between` | date string, or `{min/max}` |
| `selection` | `any`, `none`, `exact`, `contains`, `contains_not`   | array of values, `"*"`, or `""`   |
| `boolean`   | `any`, `none`, `exact`                               | `true` / `false`                  |
| `geo`       | `geo`                                                | GeoJSON geometry                  |
| `type`      | `any`, `none`, `exact`                               | entity type string                |

Which matcher is applied is decided by the value and the modifier flags on the
criterion (`match_exact`, `match_not`, `regex`, ...). The sections below
describe each filter type, the matchers it supports, and how to trigger them.

### Text

Filters on text values. Applies to any field that stores a string.

| Matcher       | Trigger                                            | Description                                    |
| :------------ | :------------------------------------------------- | :--------------------------------------------- |
| `any`         | `"value": "*"`                                     | Field has a non-empty value.                   |
| `none`        | `"value": ""`                                      | Field is empty or absent.                      |
| `exact`       | `"value": "..."`, `"match_exact": true`            | Exact (case-sensitive) match.                  |
| `contains`    | `"value": "..."` (default)                         | Case-insensitive substring match.              |
| `contains_not`| `"value": "..."`, `"match_not": true`              | Field does not contain the substring.          |
| `regex`       | `"value": "..."`, `"regex": true`, `"regex_options": "i"` | Regular expression match.              |

Contains matches are case-insensitive. The characters `*`, `^` and `$` are
treated as wildcards (`.` and anchors), so `^lpa1:` matches any value starting
with `lpa1:`.

```json
[
  { "type": "type", "value": "IotDevice" },
  { "type": "text", "key": "properties.name.value", "value": "*" },
  { "type": "text", "key": "properties.serial_number.value", "value": "^lpa1:" },
  { "type": "text", "key": "properties.description.value", "value": "" }
]
```

Regular expressions are triggered with `regex: true`; `regex_options` sets the
flags (for example `i` for a case-insensitive match):

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "text",
    "key": "properties.serial_number.value",
    "value": "^(lpa1|lpb2)-[0-9]{4}$",
    "regex": true
  }
]
```

### Number

Filters on numeric values. Range bounds use the `included` flag to mark the
boundary as inclusive; the flag must be present for a boundary matcher to
apply.

| Matcher         | Trigger                                      | Description                      |
| :-------------- | :------------------------------------------- | :------------------------------- |
| `exact`         | scalar `value`                               | Value is exactly equal.          |
| `min_included`  | `{ "min": N, "included": true }`             | Value is `>=` N.                 |
| `max_included`  | `{ "max": N, "included": true }`             | Value is `<=` N.                 |
| `in_between`    | `{ "min": A, "max": B }`                     | Value is between A and B (inclusive). |

```json
[
  { "type": "type", "value": "asset" },
  {
    "type": "number",
    "key": "properties.width.value",
    "value": { "min": 4137, "included": true }
  },
  {
    "type": "number",
    "key": "properties.height.value",
    "value": { "min": 800, "max": 1200, "included": true }
  }
]
```

### Date

Filters on date and datetime values. Values are ISO 8601 strings.

| Matcher         | Trigger                                         | Description                          |
| :-------------- | :---------------------------------------------- | :----------------------------------- |
| `any`           | `"value": "*"`                                  | Field has a non-empty value.         |
| `none`          | `"value": ""`                                   | Field is empty or absent.            |
| `exact`         | full timestamp `"2022-04-14T15:00:00"`          | Value is exactly that instant.       |
| `min_included`  | `{ "min": "...", "included": true }`            | Value is `>=` the given datetime.    |
| `max_included`  | `{ "max": "...", "included": true }`            | Value is `<=` the given datetime.    |
| `in_between`    | `{ "min": "...", "max": "..." }`                | Value is between (inclusive).        |

A bare date (`"2022-04-14"`, no time component) is interpreted as the **whole
calendar day** rather than a single instant:

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "date",
    "key": "properties.date_last_reported.value",
    "value": { "min": "2022-04-13", "max": "2022-04-14T15:00:00" }
  },
  {
    "type": "date",
    "key": "properties.created.value",
    "value": { "max": "2022-04-14T15:00:00", "included": true }
  }
]
```

### Selection

Filters on a field against one or more pre-defined values. This is also the
recommended filter type for IDs and identifiers: an array of values is treated
as an OR (any value in the list matches).

| Matcher         | Trigger                              | Description                            |
| :-------------- | :----------------------------------- | :------------------------------------- |
| `exact`         | array (or scalar) `value`            | Field equals any of the given values.  |
| `any`           | `"value": "*"`                       | Field has a non-empty value.           |
| `none`          | `"value": ""`                        | Field is empty or absent.              |
| `contains`      | `"value": "..."`, `"match_exact": false` | Field contains the substring.      |
| `contains_not`  | `"value": "..."`, `"match_not": true`    | Field does not contain the substring.  |

```json
[
  { "type": "type", "value": "mediafile" },
  {
    "type": "selection",
    "key": "properties.filesize.value",
    "value": ["482978", "13525477"],
    "match_exact": true
  },
  {
    "type": "selection",
    "key": "identifiers",
    "value": ["R 53.5", "Bg9DTJPNRjLQmViHTb72qGeR"],
    "match_exact": true
  }
]
```

### Boolean

Filters on boolean fields.

```json
[
  { "type": "type", "value": "asset" },
  {
    "type": "boolean",
    "key": "properties.is_original.value",
    "value": true
  }
]
```

### Type

Filters on the entity type. The simple form takes a single type:

```json
[
  { "type": "type", "value": "asset" }
]
```

To match one of several types, use a `selection` filter on the `type` key:

```json
[
  {
    "type": "selection",
    "key": "type",
    "value": ["asset", "asset_part"],
    "match_exact": true
  }
]
```

**A type filter is strictly required for every request.** Every request body
must contain at least one criterion that filters on the entity type: either a
`type` filter (a single type) or a `selection` filter on the `type` key (one or
more types). The type filter lets the API route the request to the correct
underlying collection, and every request without one is rejected. There is no
restriction on where the type filter appears in the array; it simply needs to
be present. Every example body in this document includes a type filter.

### Geo

Filters on GeoJSON geometry fields. The `value` is a GeoJSON geometry (most
commonly a polygon) and the criterion matches entities whose point lies inside
it.

```json
[
  {
    "type": "type",
    "value": "region"
  },
  {
    "type": "geo",
    "key": "properties.gps_coordinates.geojson",
    "value": {
      "type": "Polygon",
      "coordinates": [
        [
          [-74.006, 40.712],
          [-73.935, 40.712],
          [-73.935, 40.779],
          [-74.006, 40.779],
          [-74.006, 40.712]
        ]
      ]
    }
  }
]
```

Geo filters additionally support a `bucket` option. Setting
`"bucket": <integer>` subdivides the polygon into a grid of that many cells and
returns, instead of every matching entity, one representative entity per cell
together with a `bucket_count` (the number of entities in that cell). This is
useful for map visualisations that need to cluster large result sets.

## Filter criteria fields

Every criterion is a JSON object. Only `type`, `key` and `value` are required
(the `key` is not needed for `type` filters). All other fields are optional
modifiers.

| Field                        | Type             | Description                                                                  |
| :--------------------------- | :--------------- | :--------------------------------------------------------------------------- |
| `type`                       | string           | Filter type: `text`, `number`, `date`, `selection`, `boolean`, `geo`, `type`. |
| `key`                        | string / array   | Field to filter on. See [Keys](#keys-and-document-structure).                |
| `value`                      | varies           | Value(s) to match; format depends on the filter type.                        |
| `match_exact`                | bool             | Switch between exact and contains matching. Default `false`.                 |
| `match_not`                  | bool             | Negate a contains match (`contains_not`). Default `false`.                   |
| `regex`                      | bool             | Treat the value as a regular expression. Default `false`.                    |
| `regex_options`              | string           | Regex flags (e.g. `i` for case-insensitive). Default `""`.                   |
| `operator`                   | `and` / `or`     | Combine this criterion with OR instead of AND. Default `and`.                |
| `or`                         | array            | Nested list of criteria combined as an OR. See [Combining](#combining-filters). |
| `inner_exact_matches`        | object           | Extra equality constraints applied within an object list entry. See [Inner exact matches](#inner-exact-matches). |
| `lookup`                     | object           | Join to another collection (virtual relations). See [Relations](#relation-filters). |
| `aggregation`                | string           | Apply an aggregator to an array field (e.g. `size` to count relations).      |
| `distinct_by`                | string           | Group results by a field; one result per distinct value.                     |
| `facets`                     | array            | Compute facet counts alongside the results. See [Facets](#facets).           |

## Keys and document structure

A `key` is a dotted path into the document. Documents store structured lists of
objects, and the path tells the filter engine how to traverse them. The main
object lists are `metadata`, `properties`, `relations` and `data`.

```
properties.object_number.value   ->  the property entry with key "object_number",
                                     and its "value" field
properties.gps_coordinates.geojson -> the "geojson" field of the "gps_coordinates"
                                     property
properties.ref_words.value      ->  the id of a referenced word entity
```

Parts of a key that are part of an object list need no special syntax. Fields
inside the object list entry are addressed as regular path segments after the
object-list part.

### Schema-prefixed keys

A key can be written as an array of `schema:version|path` strings. The engine
then treats each entry as a separate schema and combines them with an OR:

```json
[
  { "type": "type", "value": "asset" },
  {
    "type": "selection",
    "key": ["dams:1|relations.isAssetFor.key"],
    "value": ["9f7146e4-7aba-5993-8f58-320dc325a2f9"],
    "match_exact": true
  }
]
```

### Optional and required keys

Prefix a key with `?` to make the criterion optional: entities match if they
have the value, or if the field is empty. The `!` prefix can only be used in
combination with `?`, as `!?`, to force an optional criterion to apply
strictly. A boolean criterion with value `false` is treated as optional
automatically.

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "text",
    "key": "?properties.alternate_name.value",
    "value": "POA-ANTHAO-002",
    "match_exact": true
  }
]
```

Forcing an optional criterion to apply strictly:

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "text",
    "key": "!?properties.serial_number.value",
    "value": "^lpa1:",
    "match_exact": true
  }
]
```

## Combining filters

Multiple criteria in the request body are combined with **AND**. Two criteria
are combined with **OR** when at least one of them carries `"operator": "or"`:

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "selection",
    "key": "properties.device_category.value",
    "value": ["tracker"],
    "match_exact": true,
    "operator": "or"
  },
  {
    "type": "selection",
    "key": "properties.alternate_name.value",
    "value": ["POA-ANTHAO-002"],
    "match_exact": true,
    "operator": "or"
  }
]
```

This matches IotDevices whose category is `tracker` **or** whose alternate name
is `POA-ANTHAO-002`.

For a nested OR group inside an otherwise AND-combined request, use the `or`
field on a criterion:

```json
[
  {
    "type": "selection",
    "key": "type",
    "value": ["asset", "asset_part"],
    "match_exact": true
  },
  {
    "type": "selection",
    "key": "relations.isAssetFor.key",
    "value": ["9f7146e4-7aba-5993-8f58-320dc325a2f9"],
    "match_exact": true,
    "or": [
      {
        "type": "selection",
        "key": "relations.isAssetPartFor.key",
        "value": ["9f7146e4-7aba-5993-8f58-320dc325a2f9"],
        "match_exact": true
      }
    ]
  }
]
```

This matches assets (or asset parts) that are an asset for the given entity
**or** an asset part for it.

## Inner exact matches

`inner_exact_matches` adds equality constraints on the entries of an object
list being scanned. For example, to collect keyword relations that have the
`lang` entry set to `en`, add an exact match on that entry field:

```json
[
  { "type": "type", "value": "media" },
  {
    "type": "text",
    "key": "relations.hasKeyword.key",
    "value": "*",
    "inner_exact_matches": { "lang": "en" }
  }
]
```

## Relation filters

Entities are linked to each other through relations. A relation is stored as a
plain property on the document that references the id of another entity. There
is no dedicated relations namespace: such id references can live anywhere in
the document, for example under `relations.<type>.key` or under a property
such as `properties.ref_words.value`, which holds the id of a referenced word
entity. For filtering purposes a relation has no special
meaning: it is filtered on exactly like any other field that stores an id.

Filtering on a relation is therefore just an equality check on its id value:

```json
[
  { "type": "type", "value": "asset" },
  {
    "type": "selection",
    "key": "relations.isAssetFor.key",
    "value": ["9f7146e4-7aba-5993-8f58-320dc325a2f9"],
    "match_exact": true
  }
]
```

This matches every entity that has a relation of type `isAssetFor` pointing to
the given entity.

Counting relations with the `aggregation` modifier (see
[Aggregation](#aggregation)):

```json
[
  { "type": "type", "value": "inscription" },
  {
    "type": "number",
    "key": "properties.ref_words.value",
    "value": { "min": 4, "max": 6, "included": true },
    "match_exact": true,
    "aggregation": "size"
  }
]
```

This matches inscriptions that have between 4 and 6 referenced words.

### Virtual relations (lookup)

Some relations are not stored on the document itself but must be resolved by
joining to another collection. These are addressed through `lookup` and use
keys prefixed with `lookup.virtual_relations.<name>`.

A `lookup` object has the following fields:

| Field                           | Description                                                        |
| :------------------------------ | :----------------------------------------------------------------- |
| `from`                          | The collection to join to.                                         |
| `local_field`                   | Field on the source document.                                      |
| `foreign_field`                 | Field on the target collection.                                    |
| `as`                            | Name of the virtual relation.                                      |

```json
[
  { "type": "type", "value": "PoliceZone" },
  {
    "lookup": {
      "from": "devices_actual",
      "local_field": "id",
      "foreign_field": "tenants",
      "as": "lookup.virtual_relations.zonesServed"
    },
    "type": "selection",
    "key": "lookup.virtual_relations.zonesServed.identifiers",
    "value": ["urn:ngsi-ld:IotDevice:anpr:5345ANT664ADJ1"],
    "match_exact": true
  }
]
```

This returns every police zone that has the given IotDevice among its served
devices, where the relationship lives on the device (`tenants`) rather than on
the zone.

The same mechanism works in the reverse direction, where the joined collection
references the source document:

```json
[
  { "type": "type", "value": "PoliceAsset" },
  {
    "lookup": {
      "from": "assets_actual",
      "local_field": "properties.ref_asset_group.value",
      "foreign_field": "id",
      "as": "lookup.virtual_relations.ref_asset_group"
    },
    "type": "selection",
    "key": "lookup.virtual_relations.ref_asset_group.properties.name.value",
    "value": ["dev"],
    "match_exact": true
  }
]
```

## Distinct values

`distinct_by` groups the result so that only one entity is returned per
distinct value of the given field. It is used to populate dropdowns of
attribute values.

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "text",
    "key": "properties.state.value",
    "value": "*",
    "distinct_by": "properties.state.value"
  }
]
```

## Facets

A `facets` array computes counts per distinct value for one or more fields,
returned alongside the results in the response `facets` list.

```json
[
  {
    "type": "type",
    "value": "point",
    "facets": [
      { "key": "properties.record_completion_status.value" },
      {
        "lookups": [
          {
            "from": "sites_actual",
            "local_field": "properties.ref_site.value",
            "foreign_field": "id",
            "as": "lookup.virtual_relations.ref_site"
          },
          {
            "from": "areas_actual",
            "local_field": "lookup.virtual_relations.ref_site.properties.ref_area.value",
            "foreign_field": "id",
            "as": "lookup.virtual_relations.ref_area"
          }
        ],
        "key": "lookup.virtual_relations.ref_area.properties.name.value"
      }
    ]
  }
]
```

A facet can chain several `lookups` to facet on a field that lives a few
relations away.

## Aggregation

The `aggregation` modifier applies an aggregator to an array-valued field
before comparing. The supported aggregator is `size`, which counts the elements
of an array. This is how you filter on the *number* of relations a document
has:

```json
[
  { "type": "type", "value": "inscription" },
  {
    "type": "number",
    "key": "properties.ref_words.value",
    "value": { "min": 4, "max": 6, "included": true },
    "match_exact": true,
    "aggregation": "size"
  }
]
```

## Response

A normal filter response has the following shape:

```json
{
  "results": [ ... ],
  "count": 1254,
  "skip": 0,
  "limit": 20
}
```

| Field      | Description                                                              |
| :--------- | :----------------------------------------------------------------------- |
| `results`  | The matching entities.                                                       |
| `count`    | Total number of matches.                                                 |
| `skip`     | The `skip` value used for this request.                                  |
| `limit`    | The `limit` value used for this request.                                 |
| `facets`   | Facet counts, present when a facet was requested.                        |
| `next`     | Relative URL to fetch the next page, when one exists.                    |
| `previous` | Relative URL to fetch the previous page, when one exists.                |

### Count limits

On very large result sets the total `count` may be capped. When the number of
matches exceeds the configured cap, `count` reports `<cap>+` (for example
`1000+`), meaning there are more matches than the count shown. The unfiltered
total of a whole collection is always exact. See [Rounded counts](../elody-frontend/features/rounded-counts.md)
for details.

Pass `?exact_count=1` to bypass the cap and get the true total (for example
when a user clicks through on a `1000+` count). This runs the count to
completion instead of stopping early, so it is more expensive on large,
filtered result sets — use it on demand, not on every request.

### Response formats

The endpoint honours the `Accept` header. Besides plain JSON it can return CSV,
`text/uri-list`, and RDF serialisations (`application/ld+json`,
`application/n-triples`, `application/rdf+xml`), which are applied to the
entities in `results`.

## Errors

The endpoint returns HTTP 400 with a JSON error body when the request is
invalid. Common cases:

- The body is not a JSON array.
- A criterion uses an unknown `type` value.
- A number/date range value is missing both `min` and `max`.
- A range's `min` is larger than its `max`.

A `soft` query parameter (`?soft=1`) runs validation without executing the
query, which is useful for testing whether a request body is accepted.

## Worked examples

A search combining an exact match on a category with a contains search on a
serial number:

```json
[
  { "type": "type", "value": "IotDevice" },
  {
    "type": "text",
    "key": "properties.category.value",
    "value": "track&trace",
    "match_exact": true
  },
  {
    "type": "text",
    "key": "properties.serial_number.value",
    "value": "^lpa1:"
  }
]
```

Negating a text match to find creators whose initials do not contain a value:

```json
[
  { "type": "type", "value": "creator" },
  {
    "type": "text",
    "key": "properties.initials.value",
    "value": "zn",
    "match_exact": false,
    "match_not": true
  }
]
```

Filtering mediafiles of a single schema on a technical field:

```json
[
  { "type": "type", "value": "mediafile" },
  {
    "type": "text",
    "key": "technical_origin",
    "value": "original",
    "match_exact": true
  }
]
```

Finding an asset group by its members, using a reverse lookup:

```json
[
  { "type": "type", "value": "AssetGroup" },
  {
    "lookup": {
      "from": "assets_actual",
      "local_field": "id",
      "foreign_field": "properties.ref_asset_group.value",
      "as": "lookup.virtual_relations.assets"
    },
    "type": "selection",
    "key": "identifiers",
    "value": "*",
    "match_exact": true
  }
]
```
