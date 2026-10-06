# SHACL UI in Elody

Elody can build its user interface from a [SHACL 1.2 UI](https://w3c.github.io/data-shapes/shacl12-ui/)
description. A set of SHACL shapes — written for Elody or taken unchanged from
an external application profile — becomes an Elody declaration in Turtle, the
declaration is generated into the GraphQL documents that drive the PWA, and the
PWA renders them like any hand-written client.

This page explains that pipeline and what it supports. The
[spec examples](./examples.md) page runs every example of the SHACL 1.2 UI
specification through it and shows what Elody renders for each one. The
[conformance](./conformance.md) page states, feature by feature, which parts
of SHACL 1.2 UI Elody supports.

::: info Status
Developed for the DiSHACLed project (WP3) under epic #165964. The SHACL 1.2 UI
specification is a W3C Editor's Draft; the results here were measured against
the draft of 2 October 2026.
:::

## The pipeline

1. **SHACL UI shapes.** Node shapes, property shapes and property groups, with
   `sh:` constraints and, where the author wants, `shui:` editors and viewers.
2. **Elody declaration.** `fromShacl` reuses the property shapes as they are and
   adds what the platform needs around them: an `elody:EntityUi`, a view mode,
   the property groups as detail panels, and a create form over the same
   property shapes. The result is a `*.ui.ttl` file a client keeps, edits and
   commits.
3. **GraphQL.** `elody-ui generate` turns the declaration into the client's
   query documents, the custom input fields for dropdowns, and the label texts
   for the translation bundles. `elody-ui check` fails the build when a document
   drifts from the declaration or the declaration breaks the profile.
4. **baseGraphql.** The documents are ordinary Elody documents: the same
   resolvers execute them as for any client.
5. **PWA.** The create form and the detail page render with the standard
   components (`DynamicForm`, `EntityElementWindow`).

The declaration is the step a person looks at. Everything after it is generated
and checked in CI.

## What is supported

| Area | Standard terms | In Elody |
|---|---|---|
| Widget choice | `shui:editor`, `shui:viewer`, the scoring system | The spec's scoring system, run on the W3C working group's own scoring graph. An explicit `shui:editor` wins (score 40); otherwise the widget follows from `sh:datatype`, `sh:in`, `sh:class`, `sh:node`, `sh:nodeKind` and `sh:singleLine`. |
| Editors | text field, text area, text with language, number, boolean, date, date and time, IRI, enum select, instances select, auto complete, details | Each maps to an Elody input type. `sh:in` and `sh:class` become generated custom input fields: a dropdown with the listed options, or a relation dropdown on the class. |
| Language-tagged text | `rdf:langString`, `shui:TextFieldWithLangEditor`, `shui:TextAreaWithLangEditor` | One multilingual field (`isMultilingual`): the detail page edits and shows it per language, the create form stores the text in the interface language. The client needs the `supportsMultilingualMetadataEditing` feature. |
| Nested shapes | `sh:node` with `shui:DetailsEditor` | A field with sub-fields (`inputFieldWithSubFields`): the value is a list of objects under the metadata key, one column per property shape of the nested node shape, in the create form and on the detail page. A related resource (`sh:class`) inside a nested value is entered as its identifier. |
| Viewers | literal, hyperlink, language string, details | Elody's metadata display and its link formatter. Elody's own pill and regular-expression formatters are `shui:Viewer` instances in the `elody:` ontology. |
| Labels | `sh:name` per language, `rdfs:label` on groups | Label texts go to the client's translation bundles under an Elody translation key. Without a label, the local name of `sh:path` is shown, as the spec prescribes. |
| Ordering | `sh:order`, `sh:group`, `shui:defaultOrder` | Groups and ungrouped properties in one sequence, unordered last, ties by label; `shui:defaultOrder` from the global configuration. |
| Groups | `sh:PropertyGroup` | Each group is a panel on the detail page and a titled section of the create form (`formSection`). Groups and ungrouped properties are one sequence; an ungrouped property stays a plain form field and is shown in a "Details" panel (`elody:showsUngrouped`). |
| Paths | predicate paths, `sh:inversePath` | A predicate path is a metadata key, or a relation when the values are instances of a class (`sh:class`, relation `has<X>`). An inverse path is the mirrored relation on the entity (`is<X>For`): shown on the detail page, and a relation dropdown when the shape has `sh:class`. collection-api keeps that mirror on its classic storage path; an entity type with an object configuration switches it on with `RelationMirroring` (see [conformance](./conformance.md), rows 31 and 32). `elody:relationType` names the relation when the client uses another name; `elody:valueLabelKey` the related entity's label metadata. |
| Language preference | `sh:languageIn` | The spec's order: the label and the value in the first language of `sh:languageIn` that has one, then the interface language. Labels are resolved when generating (every translation bundle gets the text in that order); values in the PWA, which also offers only the declared languages in the field's language selector. Tags match by basic filtering (`en-US` for `en`). |
| Editing and value preservation | `dash:readOnly`, `sh:minCount` | The detail panels are editable: each writable property is edited with the create form's widget, and a save writes back only what changed. Values the form does not show, every language of a multilingual field and the values of an unbounded property are kept, each in its own type. Relation-valued properties are shown through the relation and edited in the create form; `dash:readOnly` keeps a property read-only. |
| Cardinality | `sh:minCount`, `sh:maxCount` | Required fields; single or multiple dropdowns. |
| Property roles | `shui:propertyRole shui:LabelRole`, direct and qualified | The label role is the card title. Qualified roles, also in RDF 1.2 annotation form, set the precedence. |

Elody adds what SHACL UI does not describe — listings, view modes, filters,
actions, guided flows — in its own `elody:` ontology, layered on `shui:` and
DASH. A standard SHACL UI tool reading an Elody declaration sees the standard
subset and ignores the rest.

## What is not supported

| Spec feature | Why |
|---|---|
| Alternative and complex paths (`sh:alternativePath`, sequence paths) | An Elody field reads and writes one metadata key or one relation of one entity. |
| Inverse paths without `sh:class` in a create form | Shown on the detail page; picking a value needs the related type, so the field is left out of the form. |
| `shui:searchQuery` | It is SPARQL; Elody searches its own index. The relation dropdown is generated, the query is left out. |
| `shui:RichTextEditor`, `shui:SubClassEditor`, `shui:BlankNodeEditor` as form fields | Elody has no such create-form field. Rich text exists as a page block, not as a field. |
| `shui:ValueTableViewer` | Elody renders a table of related entities, not of nested values. |
| `shui:timeZone`, `shui:defaultNamespace`, `shui:readOnlyGraph` | Elody stores documents, not triples. |
| Third-party widgets | A widget only its author's renderer knows, such as the spec's `ex:MyCustomEditor`, is left to the scoring system. |

## Results on the spec examples

| Result | Examples |
|---|---|
| Rendered | 24 |
| Rendered in part | 7 |
| Not rendered | 3 |

Every generated document is valid against the platform schema, and all of them
execute without errors on baseGraphql. The three examples that are not rendered
use only alternative or complex paths. See the [spec examples](./examples.md)
for the shapes, the declaration, the GraphQL and a screenshot per example.

## Findings for the specification

Two points came up while running the working group's own scoring graph. They are
worth raising with the W3C Data Shapes Working Group:

- The scoring graph uses a SHACL 1.2 list as the value of `sh:datatype`
  (`( rdf:langString rdf:dirLangString )`). A SHACL Core validator does not
  understand it; Elody rewrites it to an `sh:or` of the datatypes when it loads
  the graph.
- The scores for "the property has this datatype among the permissible
  datatypes" test `sh:datatype` with `sh:hasValue`. A property whose
  `sh:datatype` is a list, such as the "alt labels" column in the spec's own
  `shui:ValueTableViewer` example, therefore gets no datatype score at all.

## Reproduce

The pipeline and this documentation are generated from
`modules/uiDeclarationModule`:

```bash
cd modules/uiDeclarationModule
scripts/showcase.sh <pwa checkout on feat/storybook> ../../elody-docs/docs/public/images/shacl-ui
npx tsx scripts/showcase-docs.ts showcase-out ../../elody-docs/docs/services/elody-frontend/shacl-ui
```

The value-preservation round trip stores an entity, reads it through
baseGraphql, saves it from the detail page with the PWA's own form code (one
edit) and compares what collection-api holds afterwards with the original:

```bash
scripts/roundtrip/roundtrip.sh <pwa checkout with node_modules>
```

`showcase.sh` needs a running local Elody stack (it executes the documents in the
dashboard container) and Storybook from the PWA's `feat/storybook` branch on
port 6016. The spec's examples and scoring graph are vendored in
`modules/uiDeclarationModule/spec/`; refresh them when the draft changes.

## Where the pieces live

| Piece | Location |
|---|---|
| `elody:` ontology and profile shapes | `modules/uiDeclarationModule/ontology/` |
| Scoring system | `modules/uiDeclarationModule/src/score.ts` |
| SHACL UI shapes → Elody declaration | `modules/uiDeclarationModule/src/fromShacl.ts` |
| Declaration → GraphQL (`elody-ui generate`, `check`, `migrate`) | `modules/uiDeclarationModule/src/` |
| Spec examples and scoring graph | `modules/uiDeclarationModule/spec/` |
