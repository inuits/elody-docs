# Relation Pills

A relation pill shows a related entity as a coloured pill with the metadata
stored *on that relation edge* rendered as small chips inside it.

The case it solves: a user belongs to several organizations, and their
*function* is stored on the `refOrganizations` edge rather than on either
entity. Listing the organizations gives `Org A, Org B`, and listing the
functions gives `programmer, technician` — with no way to tell which function
belongs to which organization. One pill per relation, carrying its own
metadata, keeps the pairing visible:

```
[ Bruges Arts Centre  (communicatie) (technieker) ]  [ Kantoor  (programmator) ]
```

It is a [formatter](/services/elody-frontend/formatters.md) — a display shape,
not a view mode — so the same configuration works in list, grid and table
teasers **and** in detail-page window panels. The value is
read-only; editing relation metadata still goes through
`teaserMetadata { … relationMetaData { inputField } }`.

## Configuring the value

Add `nestedMetadataKeys` to an existing `relations` value in the client's
GraphQL service — see [`intialValues`](/services/elody-frontend/graphql-driven-ui.md#intialvalues-where-the-data-comes-from)
for the surrounding query shape:

```graphql
intialValues {
  organization: keyValue(
    key: "refOrganizations"          # the relation type
    source: relations
    metadataKeyAsLabel: "name"       # which metadata of the related entity is the pill label
    nestedMetadataKeys: ["function"] # which relation-edge metadata becomes the chips
    formatter: "pill|organization"   # "organization" is the colour lookup key
  )
}
```

and point a teaser or panel item at that alias:

```graphql
teaserMetadata {
  organization: metaData {
    label(input: "metadata.labels.organization")
    key(input: "organization")
    valueTranslationKey(input: "metadata.labels.user-function.$value")
  }
}
```

`valueTranslationKey` applies to the **chips only** — a relation label is a
name and is never translated.

Each chip carries a `title`, so hovering it says what the value *is*
(`Functie: Programmator`). The name comes from `metadata.labels.<key>` of the
metadata key the chip was read from, falling back to the raw key when there is
no translation for it — so listing a key here is enough, there is nothing extra
to configure.

Listing several keys merges them into that relation's chips, so
`nestedMetadataKeys: ["roles", "function"]` shows both per organization — each
chip keeps the key it came from, which is what its tooltip names.

Without `nestedMetadataKeys` the value behaves exactly as before: the labels of
all relations joined into one string.

## Configuring the colours

Colours come from the client's formatters config (`customFormatters` in the
GraphQL service's `main.ts`), which the PWA fetches once at startup — a
GraphQL service restart is enough, no frontend rebuild.

### The relation pill

The lookup key is the part after the `|` in the formatter. With
`formatter: "pill|organization"`, add an `organization` entry:

```ts
export const clientFormattersConfig: FormattersConfig = {
  [CustomFormatterTypes.Pill]: {
    organization: {
      background: "#d6e2f0",
      text: "#1f3a5f",
      icon: DamsIcons.Building,   // optional, rendered left of the label
    },
  },
};
```

Leave it out and the pill falls back to a built-in default, so a relation pill
is always visible without any client config.

Since the key is arbitrary, one entity can carry differently coloured relation
pills — `pill|contactOrganization` next to `pill|organization`, each with its
own entry.

**Per relation, not per type:** drop the `|type` (`formatter: "pill"`) and the
lookup key becomes each relation's own lowercased label, so an entry named
after an organization colours only that organization. Relations without a
matching entry keep the default. Useful for a small fixed set of relations;
fragile if the labels are user-editable, since renaming the entity silently
drops its colour.

### The metadata chips

Chips default to white with a hairline border, deliberately distinct from the
relation pill (rounded-full, lighter weight, inset). A chip is coloured by an
entry named after **its own value**, never by the relation's pill type:

```ts
[CustomFormatterTypes.Pill]: {
  programmer:    { background: "#e3f0d6", text: "#2d5a1f" },
  technician:    { background: "#f2e0cc", text: "#b35200" },
},
```

Values without an entry keep the white default, so colouring one function and
leaving the rest alone is fine.

## Gotchas

- **`metadataKeyAsLabel` (or `rootKeyAsLabel`) is required.** It is what makes
  the resolver fetch the related entity; without it the pill label falls back
  to the relation key.
- **A relation whose entity cannot be fetched is skipped**, exactly as the
  plain relations value already skips it — a dangling relation shows nothing
  rather than an empty pill.
- **A relation with none of the listed metadata renders as a bare pill**, no
  placeholder chip.
- **`link|…` and `nestedMetadataKeys` are mutually exclusive.** A link renders
  one label and one href and has nowhere to put chips, so the nested shape is
  ignored for link formatters.
- **One `getEntity` call per relation per row.** This is not new — labelling a
  relation already costs that — but it is worth knowing before putting a
  relation pill on a listing whose rows have many relations.
