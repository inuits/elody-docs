# Inputs & Teaser Metadata

Every field a user reads or edits is declared in the client's GraphQL service —
never in the PWA. Three things have to line up, and they are separate on
purpose:

| | Declares | Lives in |
| --- | --- | --- |
| `intialValues` | **the value** — where it is read from on the document | the entity fragment |
| `teaserMetadata` | how the entity appears **in a listing** (row, card, table column) | the entity fragment |
| `entityView` | how the entity appears **on its detail page** | the entity fragment |

`intialValues` is covered in depth in
[GraphQL-Driven UI](/services/elody-frontend/graphql-driven-ui.md#intialvalues-where-the-data-comes-from);
this page is about the other two and about the input fields they hang off.

## Teaser metadata

A teaser item pairs a value with how to present it. **The alias is the join**:
the frontend walks `teaserMetadata` and looks each alias up in `intialValues`,
so `organization: metaData { … }` displays `intialValues.organization`.

```graphql
fragment minimalUser on User {
  id
  intialValues {
    email: keyValue(key: "email", source: metadata)
    last_name: keyValue(key: "last_name", source: metadata)
  }
  teaserMetadata {
    email: metaData {
      label(input: "metadata.labels.email")
      key(input: "email")
    }
    last_name: metaData {
      label(input: "metadata.labels.last-name")
      key(input: "last_name")
    }
  }
}
```

Three rules worth knowing before debugging a missing column:

- **Order is column order.** Items render in the order the query lists them.
- **`label` is required.** An item without one is silently skipped — it is the
  column header, and in list/grid view the field caption.
- **`permitted(input: [...])` false removes the item**, server-side, so an
  unauthorised field never reaches the browser.

Five kinds of item can appear in `teaserMetadata`:

| Item | Shows |
| --- | --- |
| `metaData` | a value from `intialValues` — the common case |
| `relationMetaData` | metadata stored **on a relation edge**, editable in place |
| `relationRootData` | a plain property on a relation edge |
| `thumbnail` | the entity's thumbnail |
| `link` | the teaser's click target |
| `contextMenuActions` | the per-row context menu |

`relationMetaData` and `relationRootData` are the only way to *edit* relation
edge metadata, and they only work for entities rendered inside a list element
(they write to `relationMetadata.<key>@<relationType>`). For read-only display
of edge metadata, use `source: relationMetadata` on an `intialValues` key
instead — see [Relation Pills](/services/elody-frontend/features/relation-pills.md).

### Common options

`metaData` items accept the same arguments in teasers and detail panels:

```graphql
status: metaData {
  label(input: "metadata.labels.status")
  key(input: "status")
  unit(input: DATE_DEFAULT)                                  # render as a date
  valueTranslationKey(input: "metadata.labels.status.$value") # translate the value
  lineClamp(input: "2")                                       # truncate + tooltip
  colSpan(input: "2")
  copyToClipboard(input: true)
  tooltip(input: "tooltips.status")
  permitted(input: ["read:entity:field:status"])
  readOnly(input: ["update:entity:field:status"])
}
```

`masked(input: true)` with a `revealQuery` hides a value behind a click,
`showOnlyInEditMode` / `nonEditableField` control when it appears at all, and
`onlyForEntityTypes` limits an item to some of the types sharing a fragment.

## Input fields

A field becomes editable by giving it an `inputField`. The same `metaData`
item is read-only without one and an input with one:

```graphql
name: metaData {
  label(input: "metadata.labels.name")
  key(input: "name")
  inputField(type: baseTextField) {
    ...inputfield
    validation(input: { value: required }) {
      ...validation
    }
  }
}
```

The base types are `baseTextField`, `baseTextareaField`,
`baseResizableTextareaField`, `baseNumberField`, `baseCheckbox`,
`baseColorField`, `baseDateField`, `baseDateTimeField`,
`baseEntityPickerField`, and the upload/import fields (`baseFileUploadField`,
`baseCsvUploadField`, `baseXmlUploadField`, `baseExcelUploadField`, …).

**The enum is extensible per client.** A client schema can add its own member —
podiumnet has `userRoleField` and `userFunctionTypeField` — which is how a
field gets a fixed option list without repeating the options in every query.

`InputField` itself carries the behaviour: `validation`, `options`,
`relationType` and `fromRelationType` for pickers, the
`advancedFilterInputForRetrieving*Options` filters that populate a picker,
`fileTypes` / `maxFileSize` / `uploadMultiple` for uploads, and
`canCreateEntityFromOption` / `deferEntityCreation` for creating a related
entity from inside the picker.

### Forms

Create and edit forms are declared the same way, in their own query:

```graphql
query GetUserCreateForm {
  GetDynamicForm {
    label(input: "forms.user.label")
    Fields: formTab {
      formFields {
        name: metaData {
          label(input: "metadata.labels.name")
          key(input: "name")
          inputField(type: baseTextField) { ...inputfield }
        }
        createAction: action {
          label(input: "actions.labels.create")
          actionType(input: submit)
          actionQuery(input: "CreateEntity")
          creationType(input: user)
        }
      }
    }
  }
}
```

Same item shape as a teaser or panel, wrapped in `formTab` → `formFields`, plus
an `action` item for the submit button.

## Presentation: formatters

Everything above decides *which* value is shown and whether it can be edited.
How it *looks* — a coloured pill, a link, a chip — is a separate axis, set with
the `formatter` argument on the `intialValues` key rather than on the teaser
item. See [Formatters](/services/elody-frontend/formatters.md).
