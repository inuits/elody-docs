---
outline: [2, 3]
---

# From GraphQL to TTL <Badge type="warning" text="in development" />

::: warning In development
SHACL UI support and the `elody:` ontology are in development and not part of
a release yet. The declarations of the clients live in `elody-declarations`
(at the root of elody-common, next to
[elody-ontology](https://github.com/inuits/elody-ontology) and
[elody-generator](https://github.com/inuits/elody-generator)); no client runs
on a declaration in production yet. Terms and this page may still change.
:::

::: tip For whom
For developers who know how an Elody client is configured in GraphQL and want
to write, read or review the same configuration as a declaration. The
[SHACL UI](./index.md) page explains the pipeline around it.
:::

You know how an Elody client is configured today: a `*.queries.ts` file per
type under `src/queries/entities/`, with a `minimal<Type>` fragment for the
listing, a `full<Type>` fragment for the detail page, filters, sort options,
bulk operations, forms and the queries that fetch them. A declaration says
exactly the same things, once, in Turtle (TTL), and the generator renders the
GraphQL from it. Nothing about the PWA or baseGraphql changes: the generated
documents are the documents you would have written.

This guide maps what you write in GraphQL to what you write in TTL, with
pairs side by side. The pairs below are adapted from a golden example in
elody-generator's tests, where the generator proves that the TTL
renders exactly that GraphQL.

## In one sentence

A type's GraphQL file becomes one `elody:EntityUi` node: its properties are the
`intialValues` and the card, its `elody:detail` is the `entityView`, its
`elody:filter` list is the filters fragment, and the documents a type needs
(`Get<Type>Entities`, forms, flows, pickers) are named nodes next to it.

## Turtle in five minutes

```turtle
@prefix elody: <https://elody.eu/ns/ui#> .        # the vocabulary: what a declaration may say
@prefix ui:    <https://elody.eu/clients/garage/ui#> .   # your client's own names
@prefix em:    <https://elody.io/ns/metadata#> .   # your metadata keys (em:vin = the key "vin")

ui:CarUi                         # a subject: a thing with a name
  a elody:EntityUi ;             # "a" = is of type; ";" = same subject, next predicate
  elody:graphqlType "Car" ;      # a string value
  elody:relationValues true ;    # a boolean
  sh:property                    # a predicate with two values, separated by ","
    [ sh:path em:licence_plate ; sh:order 1 ] ,   # "[ ... ]" = an anonymous node, like an object literal
    [ sh:path em:vin ; sh:order 2 ] ;
  elody:paginationLimit ( 25 50 100 ) .    # "( ... )" = an ordered list; "." ends the subject
```

Names are global: `ui:CarUi` declared in one file is referenced from any other
file. Order never comes from position in the file; it comes from `sh:order`.
Labels are the same i18n keys as in GraphQL (`metadata.labels.vin`).

## The Rosetta table

| You write in GraphQL | You write in TTL |
|---|---|
| `fragment minimalCar on Car { ... }` | `ui:CarUi a elody:EntityUi ; elody:graphqlType "Car"` with `sh:property` entries |
| `vin: keyValue(key: "vin", source: metadata)` | `[ sh:path em:vin ; sh:order 1 ]` |
| `label(input: "metadata.labels.vin")` on the field | nothing: the conventional key `metadata.labels.&lt;key&gt;` is the default; `elody:labelKey` only when it differs |
| `owned_by: keyValue(key: "owned_by", source: relations, keyAsLabel: { origin: metadata, key: "last_name" })` | `[ sh:path em:owned_by ; elody:relationType "owned_by" ; elody:valueLabelKey "last_name" ]` |
| `slug: keyValue(key: "id", source: root)` | `[ sh:path em:id ; elody:alias "slug" ; elody:source elody:RootSource ]` |
| a value read on the detail page but not in the listing | `elody:detailOnly true` on the property |
| `teaserMetadata { title: metaData { label key } }` | the property is on the card unless `elody:teaser false` |
| `formatter: "pill"` | `shui:viewer elody:PillViewer` |
| `allowedViewModes { viewModes(input: [...]) }` | `elody:viewMode [ sh:order 1 ; elody:mode elody:ListView ]` |
| `contextMenuActions { ... }` | `elody:contextMenu [ elody:action [...] ]` |
| `fragment fullCar on Car { entityView { column { ... } } }` | `elody:detail [ elody:column [ sh:order ; elody:size ; elody:element ... ] ]` |
| `windowElement { label panels { ... } }` | `[ a elody:WindowElement ; rdfs:label ; elody:panel ui:CarUi-info ]` |
| `info: panels { panelHeaderContent ... vin: metaData {...} }` | `ui:CarUi-info a elody:Panel ; elody:alias "info" ; elody:field em:licence_plate , em:vin` |
| `inputField(type: baseTextField)` on a panel field or form field | `sh:datatype xsd:string` (a standard SHACL type picks the widget) |
| `inputField(type: baseDateField)` | `shui:editor shui:DatePickerEditor` |
| `inputField(type: ownedByTypeField)` (a client input field) | `elody:clientInputField "ownedByTypeField"` |
| `validation(input: { value: required })` | `sh:minCount 1` |
| `validation(input: { value: has_required_relation, ... })` | `elody:validationRule "has_required_relation" ; elody:validationRelationType ; elody:validationAmount` |
| `entityListElement { ... customQuery customQueryFilters }` | `[ a elody:ListElement ; elody:entityTypes ; elody:relationType ; elody:customQuery ; elody:customQueryFilters ]` |
| `fragment filtersForCar on Car { advancedFilters { ... } }` | `elody:filter [ sh:order ; elody:alias ; elody:key ; elody:filterKind elody:TextFilter ]` |
| `type: advancedFilter(type: type) { defaultValue hidden }` | `[ elody:alias "type" ; dash:hidden true ; sh:defaultValue "car" ; elody:filterKind elody:TypeFilter ]` |
| `fragment carSortOptions on Car { sortOptions { ... } }` | `elody:sortable true` on the property (its label and key become the option) |
| `fragment carBulkOperations on Car { bulkOperationOptions { ... } }` | `elody:bulkOperation [ elody:operationKind ; elody:context ; elody:modal ]`, or `elody:bulkOperations true` for the empty set |
| `query GetBulkOperationsForX { CustomBulkOperations { ... } }` | `ui:GetBulkOperationsForX elody:queryName ; elody:operation [...]`, referenced by `elody:customBulkOperations` |
| `query GetCarEntities`, `GetCarFilters`, `GetCarSortOptions`, `GetCarBulkOperations` | `elody:documents "entities" , "filters" , "sortOptions" , "bulkOperations"` |
| a list element's own `query GetWorkOrders { Entities { results { ... on WorkOrder { ...minimalWorkOrder } } } }` | `ui:GetWorkOrders a elody:ListQuery ; elody:queryName ; elody:result [ elody:graphqlType "WorkOrder" ; elody:fragment "minimalWorkOrder" ]` |
| `query GetEntityPickerListFor...` + its filters | `ui:GetEntityPickerListFor... a elody:Picker ; elody:result [...] ; elody:filter [...]` |
| `query GetCarCreateForm { GetDynamicForm { label formTab { formFields { ... } } } }` | `ui:GetCarCreateForm a elody:Form ; elody:fieldsFrom ui:CarUi ; elody:fields ( em:licence_plate [ sh:path em:vin ; sh:minCount 1 ] ) ; elody:submit [...]` (or its own `elody:shape`) |
| `query GetRepetitiveFormForX { GetRepetitiveForm { steps ... } }` | `ui:GetRepetitiveFormForX a elody:GuidedFlow ; elody:step [...] ; elody:finalize [...]` |
| `queries/<client>.queries.ts` (`fullEntity`, `getEntities`, the menu, the constants) | `ui:<client>App a elody:App ; elody:platformDocument ... ; elody:menuItem [...]` |

The full list of terms, with a comment on each, is `elody-ontology/ui/elody-ui.ttl`;
which terms a node may carry is `elody-ontology/ui/elody-ui.shapes.ttl`. The
generator's README lists the detail elements and the type-wide documents.

## The pairs

### The listing: `minimal<Type>` becomes the properties

GraphQL (`workOrder.queries.ts`):

```graphql
fragment minimalWorkOrder on WorkOrder {
  intialValues {
    ...typePillsIntialValues
    title: keyValue(key: "title", source: metadata)
    planned_date: keyValue(key: "planned_date", source: metadata)
    description: keyValue(key: "description", source: metadata)
    status: keyValue(key: "status", source: metadata, formatter: "pill|auto")
  }
  relationValues
  allowedViewModes {
    viewModes(input: [
      { viewMode: ViewModesList, config: [{ key: "multiLine", value: true }, { key: "multiLineColumns", value: 3 }] }
      { viewMode: ViewModesGrid }
    ]) { ...viewModes }
  }
  teaserMetadata {
    ...typePillsTeaserMetadata
    forceShowContextMenuActions(input: true)
    contextMenuActions {
      ...basicContextMenuActions
      changeStatus: doElodyAction {
        action(input: UpdateMetadata)
        formQuery(input: "WorkOrderStatusForm")
        formFlow(input: Update)
        formTitle(input: "modals.changeStatus.title")
        label(input: "contextMenu.contextMenuElodyAction.changeStatus")
        icon(input: "Settings")
      }
    }
    title: metaData { label(input: "metadata.labels.title") key(input: "title") colSpan(input: "2") }
    description: metaData { label(input: "metadata.labels.description") key(input: "description") colSpan(input: "3") }
  }
  ...minimalBaseEntity
}
```

TTL (`entities/workOrder.ui.ttl`):

```turtle
ui:WorkOrderUi
  a elody:EntityUi ;
  elody:graphqlType "WorkOrder" ;
  elody:emit "file" ;
  elody:documents "entities" , "filters" , "sortOptions" , "bulkOperations" ;
  elody:typePills true ;
  elody:relationValues true ;
  sh:property
    [ sh:path em:title ; sh:name "title"@en ; sh:order 1 ;
      shui:propertyRole shui:LabelRole ; elody:labelKey "metadata.labels.title" ; elody:colSpan 2 ; elody:sortable true ] ,
    [ sh:path em:description ; sh:order 2 ; elody:labelKey "metadata.labels.description" ; elody:colSpan 3 ] ,
    [ sh:path em:planned_date ; sh:order 3 ; elody:labelKey "metadata.labels.planned_date" ; elody:teaser false ] ,
    [ sh:path em:status ; sh:order 4 ; elody:labelKey "metadata.labels.status" ;
      shui:viewer elody:PillViewer ; elody:viewerArgument "auto" ; elody:detailFormatter false ; elody:teaser false ] ;
  elody:viewMode
    [ sh:order 1 ; elody:mode elody:ListView ; elody:config [ elody:key "multiLine" ; elody:value true ] , [ elody:key "multiLineColumns" ; elody:value 3 ] ] ,
    [ sh:order 2 ; elody:mode elody:GridView ] ;
  elody:contextMenu
    [ elody:forceShow true ;
    elody:includeBasicActions true ;
    elody:action
      [ sh:order 1 ; elody:alias "changeStatus" ;
      rdfs:label "contextMenu.contextMenuElodyAction.changeStatus" ;
      elody:actionKind elody:UpdateMetadataAction ; elody:icon "Settings" ;
      elody:formFlow "Update" ; elody:formTitle "modals.changeStatus.title" ;
      elody:formSourceRef ui:WorkOrderStatusForm ] ] ;
  elody:formSource ui:WorkOrderStatusForm .
```

What to notice:

- One property shape per value. Its `sh:path em:title` is the `key`; the alias
  is only written when it differs from the key (`elody:alias`).
- A property is read in the listing and shown on the card by default. Leave
  it off the card with `elody:teaser false`; read it on the detail page only
  with `elody:detailOnly true`.
- `shui:propertyRole shui:LabelRole` marks the title of the entity.
- `...typePillsIntialValues` and `...typePillsTeaserMetadata` are one flag,
  `elody:typePills true`. `...minimalBaseEntity` is spread by default.
- `formatter: "pill|auto"` is a viewer: a standard SHACL-UI term with an
  argument. The formatter is read in the listing only here, so the detail
  says `elody:detailFormatter false`.
- A context-menu action that opens a runtime form names its document with
  `elody:formSourceRef`; the document itself is an `elody:FormSource` node.

### The detail page: `full<Type>` becomes `elody:detail`

GraphQL:

```graphql
fragment fullWorkOrder on WorkOrder {
  intialValues { title: keyValue(key: "title", source: metadata) ... }
  relationValues
  entityView {
    column {
      size(size: seventy)
      elements {
        windowElement {
          label(input: "window-element-labels.info-window")
          expandButtonOptions { shown(input: true) }
          intake: panels {
            panelHeaderContent(panelHeaderContentInput: { label: "panel-labels.intake" }) { label }
            panelType(input: metadata)
            isCollapsed(input: false)
            isEditable(input: false)
            title: metaData { label(input: "metadata.labels.title") key(input: "title") }
            planned_date: metaData { label(input: "metadata.labels.planned_date") key(input: "planned_date") }
          }
        }
      }
    }
    column2: column {
      size(size: thirty)
      elements { windowElement { ... progress: panels { ... status: metaData { ... } } } }
    }
  }
}
```

TTL:

```turtle
ui:WorkOrderUi
  ...
  elody:detail
    [ elody:column
      [ sh:order 1 ; elody:size elody:Width70 ;
      elody:element
        [ a elody:WindowElement ; rdfs:label "window-element-labels.info-window" ; sh:order 1 ;
        elody:expandButton true ;
        elody:panel ui:WorkOrderUi-intake , ui:WorkOrderUi-labour ] ] ,
      [ sh:order 2 ; elody:size elody:Width30 ;
      elody:element
        [ a elody:WindowElement ; rdfs:label "window-element-labels.progress" ; sh:order 1 ;
        elody:expandButton true ;
        elody:panel ui:WorkOrderUi-progress ] ] ] .

ui:WorkOrderUi-intake
  a elody:Panel ;
  rdfs:label "panel-labels.intake" ;
  sh:order 1 ;
  elody:alias "intake" ;
  elody:collapsed false ;
  dash:readOnly true ;
  elody:panelKind elody:MetadataPanel ;
  elody:field em:title , em:planned_date , em:description , em:mileage_at_intake .
```

What to notice:

- The detail's `intialValues` are not repeated: the same property shapes
  serve the listing and the detail. The detail reads every property unless it
  is `elody:listingOnly true`.
- A panel is a named node, `ui:<Type>Ui-<alias>`, so a long detail page stays
  readable. It lists its fields by key; the label and input field of each
  field come from the property shape.
- `isEditable(input: false)` is `dash:readOnly true`, a standard term.
- An editable panel field with `inputField(type: baseTextField)` needs nothing
  on the panel: the property shape's `sh:datatype xsd:string` renders it.
  A client input field is `elody:clientInputField "..."` on the property.
- Other elements sit next to windows the same way: `elody:ListElement`,
  `elody:MediaElement`, `elody:MapElement`, `elody:GraphElement`, and so on
  (see "Detail elements" in the generator's README).

### A list inside the detail page, with its own documents

GraphQL (`car.queries.ts`):

```graphql
workOrders: entityListElement {
  label(input: "element-labels.work-order-element")
  isCollapsed(input: false)
  entityTypes(input: [workOrder])
  relationType: label(input: "has_work_order")
  customQuery(input: "GetEntities")
  customQueryFilters(input: "GetRelatedWorkOrderFilter")
  searchInputType(input: "AdvancedInputType")
  customBulkOperations(input: "GetWorkOrderOnCarOperations")
  customQueryEntityPickerList(input: "GetEntityPickerListForWorkOrdersOnCar")
  customQueryEntityPickerListFilters(input: "GetEntityPickerFiltersForWorkOrdersOnCar")
}
```

TTL:

```turtle
[ a elody:ListElement ;
  rdfs:label "element-labels.work-order-element" ;
  sh:order 2 ;
  elody:alias "workOrders" ;
  elody:collapsed false ;
  elody:entityTypes "workOrder" ;
  elody:relationType "has_work_order" ;
  elody:searchInput elody:AdvancedSearchInput ;
  elody:customQuery "GetEntities" ;
  elody:customQueryFilters "GetRelatedWorkOrderFilter" ;
  elody:customBulkOperations ui:GetWorkOrderOnCarOperations ;
  elody:picker ui:GetEntityPickerListForWorkOrdersOnCar ]
```

The documents the element names are nodes of their own: the picker's list and
filters queries (`elody:Picker`, with `elody:result` per type and
`elody:filter`), and the custom bulk operations set (`elody:operation`). When
a list element has its own `Get<X>` entities query instead of the platform's
`GetEntities`, that query is an `elody:ListQuery` node declared on the type
(`elody:listQuery ui:GetWorkOrders`) and named by `elody:customQuery`.

### Filters

GraphQL:

```graphql
fragment filtersForWorkOrder on WorkOrder {
  advancedFilters {
    type: advancedFilter(type: type) { type defaultValue(value: "workOrder") hidden(value: true) }
    title: advancedFilter(type: text, key: ["elody:1|metadata.title.value"], label: "metadata.labels.title", isDisplayedByDefault: true) {
      type key label isDisplayedByDefault tooltip(value: true)
    }
  }
}
```

TTL:

```turtle
  elody:filter
    [ sh:order 1 ; elody:alias "type" ; dash:hidden true ; sh:defaultValue "workOrder" ; elody:filterKind elody:TypeFilter ] ,
    [ sh:order 2 ; elody:alias "title" ; rdfs:label "metadata.labels.title" ;
      elody:key "elody:1|metadata.title.value" ; elody:displayedByDefault true ;
      elody:filterKind elody:TextFilter ; elody:showTooltip true ] ;
```

A selection filter that fetches its options carries `elody:optionsType`,
`elody:optionsKey` and, when needed, `elody:optionsInput` entries; the fields
asked back are derived from the kind.

### Sort options and bulk operations

`workOrderSortOptions` with one option on `title` is
`elody:sortable true` on the `em:title` property: the option's label and value
come from the property. An option that is not a property, or a sort document
of the client's own, is `elody:sortOption` on the type.

An empty `bulkOperationOptions { options(input: []) }` is
`elody:bulkOperations true`. Operations are `elody:bulkOperation` entries:

```turtle
  elody:bulkOperation
    [ rdfs:label "bulk-operations.create-work-order" ; sh:order 1 ; elody:icon "Create" ;
    elody:operationKind elody:CreateEntityOperation ; elody:primary true ;
    elody:context [ elody:activeViewMode elody:ReadMode ; elody:selection elody:NoneSelected ;
      elody:tooltipLabel "tooltip.bulkOperationsActionBar.readmode-noneselected" ] ;
    elody:modal [ elody:modalKind elody:DynamicFormModal ; elody:form ui:GetWorkOrderCreateForm ;
      elody:formRelationType "for_car" ; elody:closeConfirmation true ; elody:permission elody:CanCreate ] ] ;
```

### A form: `GetDynamicForm` becomes a shape

GraphQL:

```graphql
query GetWorkOrderCreateForm {
  GetDynamicForm {
    label(input: "navigation.create-work-order")
    workOrder: formTab {
      formFields {
        title: metaData {
          label(input: "metadata.labels.title")
          key(input: "title")
          inputField(type: baseTextField) { ...inputfield validation(input: { value: required }) { ...validation } }
        }
        description: metaData {
          label(input: "metadata.labels.description")
          key(input: "description")
          inputField(type: baseTextField) { ...inputfield }
        }
        createAction: action {
          label(input: "actions.labels.create")
          icon(input: Create)
          actionType(input: submit)
          actionQuery(input: "CreateEntity")
          creationType(input: workOrder)
          showsFormErrors(input: true)
        }
      }
    }
  }
}
```

TTL:

```turtle
ui:GetWorkOrderCreateForm
  a elody:Form ;
  rdfs:label "navigation.create-work-order" ;
  elody:queryName "GetWorkOrderCreateForm" ;
  elody:shape
    [ sh:property
      [ sh:path em:title ; sh:name "title"@en ; sh:order 1 ; sh:datatype xsd:string ; sh:maxCount 1 ; sh:minCount 1 ;
        elody:labelKey "metadata.labels.title" ] ,
      [ sh:path em:description ; sh:order 2 ; sh:datatype xsd:string ; sh:maxCount 1 ;
        elody:labelKey "metadata.labels.description" ] ] ;
  elody:submit
    [ rdfs:label "actions.labels.create" ; elody:actionQuery "CreateEntity" ;
    elody:creationType "workOrder" ; elody:icon "Create" ; elody:showsFormErrors true ] .
```

A form is plain SHACL: `sh:datatype xsd:string` is the text field,
`sh:minCount 1` is `required`, `shui:editor shui:DatePickerEditor` is the date
field, `shui:editor shui:EnumSelectEditor` with `elody:option` entries (each a
`elody:labelKey` and an `elody:value`) is a dropdown, and
`elody:MetadataSelectEditor` or `elody:RelationSelectEditor` select metadata
or relations (the bindings file maps every editor to its input field type). The type references the
form with `elody:form ui:GetWorkOrderCreateForm`; several tabs are
`elody:tab` entries, each with its own shape.

### A guided flow: `GetRepetitiveForm`

```turtle
ui:GetRepetitiveFormForWorkOrder
  a elody:GuidedFlow ;
  rdfs:label "repetitiveForm.add-work-order-title" ;
  elody:queryName "GetRepetitiveFormForWorkOrder" ;
  elody:repeatable true ;
  elody:refetchOnFinish true ;
  elody:finalize [ elody:fromStep "workOrder" ; elody:relationType "has_work_order" ] ;
  elody:step
    [ sh:order 1 ; elody:key "workOrder" ; rdfs:label "repetitiveForm.step-work-order" ;
    elody:entityType "workOrder" ;
    elody:form ui:GetWorkOrderCreateForm ;
    elody:picker ui:GetEntityPickerListForWorkOrdersOnCar ;
    elody:acceptedTypes "workOrder" ; elody:maxSelection 1 ;
    elody:overviewField [ sh:order 1 ; elody:key "title" ; rdfs:label "metadata.labels.title" ] ,
                        [ sh:order 2 ; elody:key "description" ; rdfs:label "metadata.labels.description" ] ] .
```

Each `steps` entry is an `elody:step`; `createForm` and `pickerQuery` point
at the form and picker nodes instead of naming strings, so a typo is a
validation error rather than a runtime surprise.

### The platform file

`queries/<client>.queries.ts` holds the documents the PWA needs for every
client (`fullEntity`, `getEntities`, `getEntityById`, the menu, the mutations).
Its declaration is one `elody:App` node in `<client>.ui.ttl`:

```turtle
ui:garageApp
  a elody:App ;
  elody:documentName "garage" ;
  elody:filePath "queries/garage.queries.ts" ;
  elody:platformDocument "fullEntity" , "getEntities" , "getTenants" , "getEntityById" , "getAdvancedFilters" , "getFilterOptions" , ... ;
  elody:paginationLimit ( 25 50 100 ) ;
  elody:preferredLanguage true ;
  elody:menuItem
    [ sh:order 1 ; elody:alias "workOrders" ; elody:labelKey "navigation.work-orders" ; elody:entityType "workOrder" ; elody:icon "CalendarAlt" ; elody:requiresAuth true ] ,
    [ sh:order 2 ; elody:alias "customers" ; elody:labelKey "navigation.customers" ; elody:entityType "customer" ; elody:icon "User" ; elody:requiresAuth true ] .
```

The type-wide documents are derived from the types: `fullEntity` spreads
every type's detail fragment, `getEntities` every type's listing. You name
which platform documents the client carries and the settings they vary by;
you never write their bodies.

## The workflow

1. **Start from your GraphQL.** Do not write TTL from a blank page:

   ```bash
   node ../elody-generator/bin/elody-ui.js extract <checkout>/src --out clients/<client>/ui --namespace https://elody.eu/clients/<client>/ui#
   ```

   This writes one `.ui.ttl` per query file, laid out like your `queries/`
   directory, and `extract-notes.txt` with everything it could not place.
   Read the notes first: they name the document and the construct.

2. **Compare.** The declaration is right when the generated GraphQL equals
   yours, definition by definition:

   ```bash
   pnpm compare <client>        # validates against the meta-shapes, generates, compares
   ```

   The report lists each definition as `equal`, `differs` (with the path of
   the first difference), `missing` or `extra`. `report.json` next to the
   declaration keeps the last run.

3. **Edit the TTL, not the GraphQL.** From here on the TTL is the source.
   Change a label, add a property, reorder a panel: edit the node, run
   `pnpm compare`, and read the diff the generator reports.

4. **Generate into the client** when the client runs on the declaration:
   `elody-ui generate --root <checkout>` writes `src/queries/entities/*.queries.ts`
   from `src/ui/`; `elody-ui check` reports drift in CI.

## Finding the term

- **Start from the [reference](./reference/):** one section per kind of node, with every term it
  carries, its type, how many values it takes and what it means, plus the
  enumerations with Elody's binding for each value.
- **Is there a standard term?** Prefer `sh:` (SHACL core: path, datatype,
  minCount, order, defaultValue, in) over `shui:` (SHACL-UI: editor, viewer,
  propertyRole) over `dash:` (hidden, readOnly) over `elody:`. The ontology
  binds the standard terms to Elody's components (`elody-ui.bindings.ttl`).
- **Search the vocabulary.** Every `elody:` term in
  `elody-ontology/ui/elody-ui.ttl` has an `rdfs:comment` that names the GraphQL
  it stands for, so grep for the GraphQL field name:

  ```bash
  grep -n -B3 "canBeMultipleColumns" ../elody-ontology/ui/elody-ui.ttl
  ```

  finds `elody:multipleColumns`.
- **See what a node may carry.** `elody-ontology/ui/elody-ui.shapes.ttl` lists
  the terms per node kind (`meta:EntityUiShape`, `meta:PanelShape`,
  `meta:FilterShape`, ...). `pnpm compare` reports a term a node may not carry
  as a validation issue with its path.
- **Look at a client that does it.** `grep -rn "elody:term" clients/*/ui`
  shows the term in use.
- **Nothing fits?** Do not bend the generator for one client. Record the
  construct in `gaps.md`, put the definition out of scope in `scope.json` with
  the gap id, and resolve gaps in batches, test first (a fixture in
  `elody-ontology/tests/fixtures/ui/`, a test in `elody-generator/tests/`,
  then the term and the render). Today every construct of the eight declared
  clients has a term; what stays out of scope is a client's own resolver.

## Conventions

- Node names: `ui:<Type>Ui` for a type, `ui:<Type>Ui-<alias>` for its panels,
  documents by their query name (`ui:GetCarCreateForm`,
  `ui:GetWorkOrders`). One node is declared in exactly one file.
- Files: `clients/<client>/ui/entities/<type>.ui.ttl` mirrors
  `src/queries/entities/<type>.queries.ts`, including subdirectories;
  `clients/<client>/ui/<client>.ui.ttl` mirrors the platform file.
- Keys are `em:<key>`; the metadata namespace is the client's. `source` follows
  the client's schema: `metadata` (v1) or `properties` (v2) is the default,
  `elody:source elody:RootSource` reads a root field.
- Labels and tooltips are i18n keys, exactly as in GraphQL. `sh:name` is the
  human name the extractor derives from the key; it is documentation.
- `elody:emit "file"` generates the whole query file; `"regions"` keeps a
  hand-written file and fills the `# >>> generated:<id>` regions; `"inline"`
  is a listing rendered inside another document's results.
- English only, in comments and labels alike; the i18n keys resolve the
  languages.

## Defaults and the compact form

A declaration says what differs from the norm. The norm is in the meta-shapes:
a constant default is `sh:defaultValue` on the term's entry, a derived one is
`elody:defaultRule`, and the [reference](./reference/) shows both in its
Default column. What is left out:

- **The label key.** A property shape without `elody:labelKey` and without a
  label text (`sh:name`) is labelled by the key itself when the key carries one
  (`em:computed_title elody:labelKey "metadata.labels.title"`, once per client
  in `keys.ui.ttl`), else `metadata.labels.<key>`, the key in kebab-case
  (`labourHours`, `labour_hours` and the v2 schema's
  `properties.labour_hours.value` all give `labour-hours`). Write the key
  on the shape only where it differs from both.
- **Open panels and elements.** `elody:collapsed` defaults to `false`: write
  it only for a panel or element that starts collapsed.
- **No `sh:name`.** It is documentation derived from the key; the extractor
  no longer writes it. Write it when you want a label text generated into the
  translation bundles instead of a key.

The extractor writes this form: a short node on one line, the defaults left
out. Across the eight clients that is a quarter fewer lines than the explicit
form, with every document still comparing equal. When a tool outside the
generator needs the explicit graph, `elody-ui expand <file or directory>`
writes every default back, as the meta-shapes state them:

```bash
node ../elody-generator/bin/elody-ui.js expand clients/<client>/ui --out /tmp/<client>-explicit.ui.ttl
```

An explicit declaration stays valid and renders the same documents; a default
never overrides what a declaration says.

Three more things the compact form leaves out, each stated in the ontology:

- **What is read and shown, as lists.** Instead of a flag on every property
  (`elody:detailOnly`, `elody:listingOnly`, `elody:readsValue`,
  `elody:teaser`), the type says it once: `elody:listingFields ( em:a em:b )`
  for the values the listing reads, `elody:detailFields` for the detail page,
  `elody:cardFields` for the card. Left out, every property is read everywhere
  and shown on the card; an explicit flag on a property wins. The extractor
  writes the lists when they are shorter than the flags. Two shapes of one key
  (an alias twin: the listing reads `name` as `title`, the detail reads `name`
  as itself) are declared by name, `sh:property ui:GarageUi-field-title`, and a
  list names that node; a list item that is a path matches the shapes declared
  inline.
- **The platform's contexts as presets.** A bulk operation's context is one of
  four named nodes of the vocabulary when it is the platform's:
  `elody:ReadModeNoneSelectedContext`, `elody:NoneSelectedContext`,
  `elody:ReadModeSomeSelectedContext`, `elody:SomeSelectedContext`. A context
  with other settings stays a node of its own.
- **A form's fields from the type's properties.** Instead of repeating a
  property shape in the form, the form lists the type's properties:
  `elody:fieldsFrom ui:CarUi ; elody:fields ( em:licence_plate [ sh:path em:vin ;
  sh:minCount 1 ] )`. An item takes its input (`sh:datatype`, `shui:editor`,
  `elody:clientInputField`, `sh:class`, as a group) and its label, unit and
  relation from the type's shape unless it says its own; `sh:minCount` and
  validations never flow in, a form decides those. The order is the position
  in the list. The extractor writes the list where inheriting gives the field
  back exactly, and keeps the shape where it does not.
- **Operations several types share, once.** An operation two types declare
  identically is a named node, `ui:DeleteSelectedOperation`, in
  `_shared.ui.ttl`, and each type says `elody:bulkOperation ui:DeleteSelectedOperation`.
  RDF lets any node be referenced from anywhere; the extractor finds the
  identical ones.

## Things that trip people up

- **The detail reads `relationValues` by default, the listing does not.**
  Declare `elody:relationValues true` on the type when the listing reads them
  too, `false` when the detail does not.
- **`elody:detailOnly` is a property flag, `elody:detailAlone` a type flag.**
  The first keeps a value out of the listing; the second renders a type's
  detail fragment alone (an overview page's layout).
- **A form field's validation lives on the form's shape**, a panel field's on
  the property shape. A read-only panel renders no input field and no
  validation.
- **A fragment name that is not `minimal<Type>` or `full<Type>`** is declared,
  not renamed: `elody:cardName`, `elody:detailName`, `elody:filtersFragmentName`,
  `elody:sortFragmentName`, `elody:bulkFragmentName`.
- **A document nothing references** is declared by the extractor on the type
  whose file holds it, with a note. If nothing uses it, delete it in the
  client instead.
- **Order is `sh:order`**, never the position in the file. Two entries with
  the same order render in file order, which the next extraction may change.
- **A client whose comparison runs against a `ref`** is extracted
  from the export under `out/<client>/source/src`, not from its checkout.

## Adding a new type: the checklist

1. Write `clients/<client>/ui/entities/<type>.ui.ttl` with `ui:<Type>Ui`:
   `elody:graphqlType`, `elody:emit "file"`, the `elody:documents` it needs,
   its `sh:property` list (one entry per value, `sh:order`, `elody:labelKey`,
   one `shui:propertyRole shui:LabelRole`).
2. Add `elody:viewMode` entries and, when the card has a menu,
   `elody:contextMenu`.
3. Add `elody:detail` with its columns, windows and panels; declare the
   panels as `ui:<Type>Ui-<alias>` nodes with `elody:field`.
4. Add `elody:filter` entries, starting with the hidden type filter.
5. Add the type to the platform file: a `elody:menuItem` on the App node when
   it has a page, and a `elody:typeEntry` when the type-wide documents list it.
6. Forms, flows and pickers are nodes next to the type, referenced by name.
7. `pnpm compare <client>`; when the client has no GraphQL for the type yet,
   `elody-ui generate` writes it.
