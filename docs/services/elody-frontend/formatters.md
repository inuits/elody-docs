# Formatters

A formatter changes how a value is *rendered* without changing which value it
is. It is set on the `intialValues` key — not on the
[teaser or panel item](/services/elody-frontend/inputs-and-teaser-metadata.md) —
because the same formatted value feeds a listing column and a detail panel
alike:

```graphql
status: keyValue(key: "status", source: metadata, formatter: "pill|status")
```

Without a formatter the resolver returns a bare string. With one it returns a
display object, always shaped `{ label, formatter, … }`, and the frontend
routes on the part of the formatter string **before** the `|`:

| Formatter | Renders |
| --- | --- |
| `pill` / `pill\|<type>` | one coloured pill per value |
| `link\|<type>` | a link (or a chip-shaped link) to another page |
| `regexpMatch\|<type>` | values scraped out of a JSON blob, as pills |

Most `source`s accept a formatter: `metadata`, `repeatableMetadata`, `root`,
`relations`, `relationMetadata`, `relationRootdata` and `typePillLabel`.

## Where the colours come from

The string after the `|` is a **lookup key into the client's formatters
config**, exported from the client's GraphQL service and passed as
`customFormatters`:

```ts
// clients/<client>/client-frontend/inuits-dams-graphql-service/src/<client>FormattersConfig.ts
export const clientFormattersConfig: FormattersConfig = {
  [CustomFormatterTypes.Pill]: {
    concept: { background: "#e6e6e6", text: "#4a4a4a" },
    queued: { background: "#eee", text: "#444", icon: DamsIcons.Process, spin: true },
  },
  [CustomFormatterTypes.Link]: {
    production: {
      link: "/production/$value",
      value: "id",
      label: "title",
      icon: DamsIcons.Link,
      background: "#d4edda",
      text: "#2d7a4f",
    },
  },
};
```

The PWA fetches this once at startup, so **a GraphQL service restart is enough
to change a colour** — no frontend rebuild.

## Pills

`formatter: "pill"` with no type looks the config up by the **value itself**,
lowercased — which is why a status pill needs one entry per status. Colours are
always keyed on the raw value, never on the translated text, so a Dutch UI
still finds `member` and not `medewerker`.

```ts
[CustomFormatterTypes.Pill]: {
  member: { background: "#daecdd", text: "#0b8319" },
}
```

`formatter: "pill|<type>"` pins every value of that field to one entry, and
`pill|auto` skips the config entirely and uses a built-in blue.

A pill entry takes `background`, `text`, an optional `icon` (a `DamsIcons`
member, rendered left of the label) and `spin`. A value with no matching entry
renders as plain text — no chrome — so a missing entry looks like a missing
feature rather than an error.

Translate the label with `valueTranslationKey(input: "…$value")` on the teaser
or panel item; `$value` is replaced with the raw value. A field whose values
have no single key pattern can instead rely on its `inputField`'s `options`,
which the pill falls back to.

Arrays render as one pill per entry.

## Links

`formatter: "link|<type>"` turns a value into a link. The config entry says how
to build it:

- `value` — the property of the entity to substitute into the URL;
- `link` — the URL template, with `$value` replaced;
- `label` — the *metadata key* whose value becomes the link text
  (`customLabel` for a fixed string);
- `openInNewTab`, plus `icon` / `background` / `text` to render it as a chip.

When no label resolves, the link falls back to `/not-found` rather than
rendering a dead link. On `source: relations` the related entity is fetched to
build the link, and several relations are joined into one plain string — so a
link formatter is for single-valued relations in practice.

## Regexp match

`formatter: "regexpMatch|<type>"` pulls every occurrence of one key out of a
JSON value and renders the results as pills. The config entry is just the key
to scrape:

```ts
[CustomFormatterTypes.RegexpMatch]: {
  wears: { value: "@value" },
}
```

Useful for JSON-LD-ish metadata where the interesting values are nested at
unpredictable depths.

## Relation pills

`source: relations` with `nestedMetadataKeys` renders one pill per related
entity with that relation's **edge metadata** as chips inside it, instead of
joining the labels into one string. That is the way to keep "which function in
which organization" visible in a single column — see
[Relation Pills](/services/elody-frontend/features/relation-pills.md).

## Gotcha: formatters and editable fields

A formatted value is an object, not a string, so for an **editable** field the
form path gains a `.label` segment. Read
[Writing back](/services/elody-frontend/graphql-driven-ui.md#writing-back)
before putting a formatter on a field that also has an `inputField`.
