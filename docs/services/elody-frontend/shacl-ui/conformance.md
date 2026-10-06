# SHACL UI conformance

This page states, feature by feature, what Elody supports of
[SHACL 1.2 UI](https://w3c.github.io/data-shapes/shacl12-ui/). It follows the
feature set proposed to the W3C Data Shapes Working Group in
[w3c/data-shapes#1173](https://github.com/w3c/data-shapes/pull/1173): 36
features, each proposed as **Required**, **Recommended** or **Optional**.
The working group discusses that a conformance claim should always say which
features it covers ([#1164](https://github.com/w3c/data-shapes/issues/1164));
this table is that list for Elody.

::: warning Status
The SHACL 1.2 UI specification is a W3C Editor's Draft and has no
conformance section yet. The feature set and its levels are a proposal (pull
request #1173, open), and the working group votes on how conformance is
defined ([#1304](https://github.com/w3c/data-shapes/issues/1304)). The
results below are measured against the Editor's Draft of 2 October 2026.

Several results depend on platform changes that are not released yet:
`languageIn` and form sections in baseGraphql and the PWA, and the fix that
keeps the language of metadata items when they are read. Until those are
merged, rows 1, 13 (create forms), 21, 22 and 30 hold on those branches only.
:::

## Claim

Elody builds its interface from SHACL 1.2 UI shapes and supports **all
Required features of the proposed feature set except three in part**: label
resolution for value nodes (4), and inverse paths (31, 32), which depend on
the client storing the mirrored relation.

| Level | Supported | In part | Not supported |
|---|---|---|---|
| Required (20) | 17 | 3 | 0 |
| Recommended (13) | 3 | 3 | 7 |
| Optional (3) | 0 | 1 | 2 |

## How Elody renders SHACL UI

Elody does not interpret shapes in the browser. Shapes become an Elody
declaration (`fromShacl`), the declaration is generated into the GraphQL
documents that drive the PWA (`elody-ui generate`), and the PWA renders those.
The widget choice, labels, order and groups are therefore decided when
generating, by the specification's own algorithms; values and languages are
resolved at run time. See [SHACL UI in Elody](./) for the pipeline.

## Features

| # | Feature | Level | Elody | How |
|---|---|---|---|---|
| 1 | Language preference via `sh:languageIn` | Required | ✅ | Labels: every translation bundle gets the text in the `sh:languageIn` order first. Values: the field carries `languageIn`; the PWA shows the first declared language that has a value, before the interface language, and offers only those languages. |
| 2 | Application and browser language preference | Recommended | ◐ | The application language (the interface locale) is used after `sh:languageIn`, tags matched by RFC 4647 basic filtering. The browser's languages are not used as a default. |
| 3 | Cross-language fallback | Optional | ◐ | Labels fall back to the default bundle (English). A value without a text in the selected language shows empty. |
| 4 | Label resolution | Required | ◐ | Property labels: `sh:name` per language, else the local name of `sh:path`. Value nodes: a related Elody entity is labelled by its metadata (`elody:valueLabelKey`, default `title`, `name`, `label`), not by the spec's chain (`rdfs:label`, `shui:labelPreference`); another IRI is shown as the IRI. |
| 5 | Local name humanization | Recommended | ❌ | The local name is shown as it is (`givenName`). |
| 6 | Direct role annotation | Required | ✅ | `shui:propertyRole shui:LabelRole` makes the property the card title. |
| 7 | Qualified role annotation | Recommended | ✅ | Qualified roles set the precedence by `sh:order`; RDF 1.2 triple annotations are read and written in the RDF 1.1 qualified form. |
| 8 | Explicit `sh:order` | Required | ✅ | On property shapes and property groups, in detail panels and create forms. |
| 9 | Default order configuration | Required | ✅ | `shui:defaultOrder` of the global `shui:Configuration`. |
| 10 | Unordered-member fallback | Recommended | ✅ | Members without an order come after those with one. |
| 11 | Deterministic tie-breaking | Required | ✅ | Identical inputs give identical documents; `elody-ui check` fails the build on any drift. |
| 12 | Standard tie-breaking algorithm | Recommended | ◐ | Ties are broken by the metadata key, then the identifier, not by the resolved label. |
| 13 | Grouping (`sh:group`) | Required | ✅ | A group is a panel on the detail page and a titled section of the create form; ungrouped properties stay ungrouped. |
| 14 | Nested groups | Recommended | ❌ | Panels and form sections are one level deep. |
| 15 | IRI values — view | Required | ✅ | A related Elody entity by its label, `shui:HyperlinkViewer` as a link, any other IRI as text. |
| 16 | IRI values — edit | Required | ✅ | `shui:IRIEditor` as a text field; `shui:InstancesSelectEditor` and `shui:AutoCompleteEditor` as a relation dropdown on the `sh:class`. |
| 17 | Blank node values — view | Required | ✅ | A blank node with a nested shape (`sh:node`, `shui:DetailsViewer`) as a table, one column per nested property. |
| 18 | Blank node values — edit | Required | ✅ | `shui:DetailsEditor` as a field with sub-fields (`inputFieldWithSubFields`). A blank node inside a nested value is entered as text. |
| 19 | Literal values — view | Required | ✅ | `xsd:string`, `boolean`, `integer`, `decimal`, `double`, `float`, `date`, `dateTime`. |
| 20 | Literal values — edit | Required | ✅ | Text field, check box, number field, date and date-time picker, chosen by the scoring system; all eight types are kept with their type on save (round trip below). |
| 21 | Language-tagged strings — view | Required | ✅ | One multilingual field: the value per language, with a language selector. |
| 22 | Language-tagged strings — edit | Required | ✅ | Edited per language; the language is chosen from the `sh:languageIn` list, else from the client's interface languages. |
| 23 | HTML values — view | Recommended | ❌ | `shui:HTMLViewer` is not implemented. |
| 24 | HTML values — edit | Recommended | ❌ | `shui:RichTextEditor` has no create-form field; rich text exists only as a page element. |
| 25 | Image values — view | Recommended | ◐ | Images that are Elody media files; not arbitrary image IRIs. |
| 26 | Widget scoring | Required | ✅ | The specification's scoring system on the working group's own scoring graph. |
| 27 | Default widget selection | Recommended | ✅ | The highest-scoring widget Elody implements. |
| 28 | Declared widgets | Required | ✅ | `shui:editor` and `shui:viewer` score 40 and win; Elody's own widgets are `shui:Editor` and `shui:Viewer` instances. |
| 29 | Widget switching | Optional | ❌ | The widget is fixed per field. |
| 30 | Value preservation | Required | ✅ | Existing values are shown, including unbounded ones, and a save keeps every value it does not change, every language and each value's type (round trip below). Values of an unbounded property are a set: collection-api stores them sorted. |
| 31 | Predicate and inverse paths — view | Required | ◐ | A predicate path is a metadata key or a relation. An inverse path reads the mirrored relation on the entity (`is<X>For`). collection-api stores that mirror on its classic storage path only; for entity types with an object configuration it is up to the client (vlacc keeps it, DiSHACLed does not), so there the inverse path shows nothing. |
| 32 | Predicate and inverse paths — edit | Required | ◐ | Predicate paths and, with `sh:class`, inverse paths are edited on the detail page and in the create form with a relation dropdown. Writing an inverse path stores `is<X>For` on the entity; the other entity gets `has<X>` only where the mirror is kept (see 31). |
| 33 | Alternative paths — view | Recommended | ❌ | An Elody field reads one metadata key or one relation. |
| 34 | Alternative paths — edit | Recommended | ❌ | As 33. |
| 35 | Complex paths — view | Recommended | ❌ | As 33. |
| 36 | Complex paths — edit | Optional | ❌ | As 33. |

✅ supported · ◐ in part · ❌ not supported

## Evidence

Every ✅ is backed by a test that runs in `modules/uiDeclarationModule`:

- **The specification's examples.** All 34 examples of the Editor's Draft go
  through the whole pipeline; the [spec examples](./examples.md) page shows the
  declaration, the GraphQL, the result of baseGraphql's own resolvers and a
  screenshot for each. 24 render fully, 7 in part, 3 not (alternative and
  complex paths).
- **Unit tests** for each feature: scoring on the official scoring graph,
  ordering, groups and form sections, roles, `sh:languageIn`, multilingual and
  nested fields, inverse paths, editable panels.
- **The value-preservation round trip** (`scripts/roundtrip/roundtrip.sh`):
  collection-api stores an entity with values of all eight literal types, an
  unbounded property, a text in three languages and a value no form shows;
  baseGraphql reads it, the PWA's own form code saves it from the detail page
  with one edit, and the stored entity must equal the original plus that edit.

## Open points for the specification

Points that came up while measuring, worth raising with the working group:

- Language resolution lets `sh:languageIn` win over the application's
  language, while the specification's own example says the French label is
  shown "unless the application has been configured to use a different
  language". Elody follows the normative text.
- The scoring graph's permissible-datatype scores test `sh:datatype` with
  `sh:hasValue`, so a property whose `sh:datatype` is a list gets no datatype
  score (see [SHACL UI in Elody](./#findings-for-the-specification)).
- Build-time generators such as Elody cannot be tested by rendering the
  shapes in a browser; a conformance test on an abstract rendering model
  ([#1165](https://github.com/w3c/data-shapes/issues/1165)) would cover them.
