# Window Element

`windowElement` is the metadata box of a detail page. It holds one or more
**panels**, and each panel holds the metadata fields, nested lists or rich
text of the entity. It is also where those fields are edited.

A work order's detail page puts its metadata in a window next to a list:

```graphql
column2: column {
  size(size: forty)
  elements {
    windowElement {
      label(input: "window-element-labels.work-order")
      expandButtonOptions {
        shown(input: true)
      }
      editMetadataButton(input: { hasButton: true }) {
        ...editMetadataButton
      }
      windowElementStatus(
        windowElementStatusInput: {
          label: "metadata.labels.status"
          statusMetadataKey: "status"
          statusInputFieldType: workOrderStatusField
        }
      ) {
        ...windowElementStatus
      }
      info: panels {
        panelHeaderContent(panelHeaderContentInput: { label: "panel-labels.intake" }) {
          label
        }
        isCollapsed(input: false)
        isEditable(input: true)
        title: metaData {
          label(input: "metadata.labels.title")
          inputField(type: baseTextField) { ...inputfield }
        }
        planned_date: metaData {
          label(input: "metadata.labels.planned-date")
          inputField(type: baseDateField) { ...inputfield }
        }
      }
      notes: panels {
        # ...
      }
    }
  }
}
```

`workOrderStatusField` stands for a dropdown field type the client defines
itself; `statusInputFieldType` takes any input field type.

## Window fields

| Field | Effect |
| --- | --- |
| `label` | Header label, an i18n key |
| `panels` | The panels, aliased once per panel. Order follows the selection order; the alias names are free |
| `layout` | `Vertical` (default) stacks the panels; `HorizontalGrid` puts them in two columns |
| `expandButtonOptions { shown orientation }` | A button on the window's side that flips the page's columns to 50/50 and back. `orientation` is `left` (default) or `right` |
| `editMetadataButton(input: { hasButton, readmodeLabel, editmodeLabel, hideIfMetadataNotPresent })` | An "edit metadata" button for logged-in users. It switches the page to edit mode and does not save. `hideIfMetadataNotPresent: "<key>"` hides it while that metadata is empty |
| `contextMenuActions` | A context menu in the header, for logged-in users |
| `windowElementStatus(windowElementStatusInput: { label, statusMetadataKey, statusInputFieldType })` | A status field in the header, always editable. `label` only shows in edit mode |
| `hideInHistory` | Leaves the window out of the [history viewer](../features/history-viewer) |
| `lineClamp` | In the schema, **not read**. Set `lineClamp` on the panel's `metaData` instead |

::: warning Hiding the expand button
`shown(input: false)` still shows the button, because the resolver turns a
falsy input into `true`. Leave `expandButtonOptions` out to hide it.
`orientation: top` and `bottom` are accepted but render no button.
:::

## Panel fields

| Field | Effect |
| --- | --- |
| `panelHeaderContent(panelHeaderContentInput: { label, panelStatus, libraryData })` | The panel header. Clicking it toggles the panel. `panelStatus` adds a status field like the window's; `libraryData { queryName dataKey label }` adds a pill with a value read from a query |
| `isCollapsed` | Starting state |
| `isEditable` | Whether the panel's `metaData` fields are saved. Leaving it out counts as editable |
| `canBeMultipleColumns` | Lays the fields out in an auto-fit grid, at least 250px per field |
| `repetitionConfig(repetitionKey: "...")` | Makes the panel repeatable: "add more" and delete buttons in edit mode |
| `displayCondition { key value }` | Shows the panel only when metadata `key` equals `value`, or, without `value`, when a relation `key` exists |
| `can(input: [...])` | Drops the panel for users without that permission; see [UI Permissions](../permissions) |
| `metaData` | A field, aliased once per field; see [Inputs & Teaser Metadata](../inputs-and-teaser-metadata) |
| `entityListElement`, `wysiwygElement` | A list or rich text field inside the panel |
| `relation` | Shows the entity's relations as a list **instead of** the panel's `metaData` fields, as soon as there are any |
| `bulkData(bulkDataSource)` | Replaces the fields with plain key/value pairs from that source |
| `info`, `panelType` | Not rendered; `panelType` is deprecated |

`info: panels { ... }` in a query is an alias for `panels`, not the `info`
field.

::: warning A collapsed panel needs a header
A panel with `isCollapsed(input: true)` and no `panelHeaderContent` label has
nothing to click, so it can never be opened.
:::

## Editing and saving

A window has no save button of its own. In edit mode its inputs are part of
the entity's form, and the page's save sends only the keys registered as
editable:

- `metaData` fields with an `inputField`, in panels that are editable;
- the window and panel status keys;
- the `metadataKey` of every wysiwyg field.

A field with `readOnly` for the current user is dropped from that list.
`isEditable(input: false)` does not stop a nested wysiwyg field from saving,
because it registers its key itself.

## The pieces

| File | Repo | Role |
| --- | --- | --- |
| [`src/components/entityElements/EntityElementWindow.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/entityElements/EntityElementWindow.vue) | elody-pwa | the window, header, status, expand and edit buttons |
| [`src/components/windowPanel/EntityElementWindowPanel.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/windowPanel/EntityElementWindowPanel.vue) | elody-pwa | a panel: header, collapse, repetition |
| [`src/components/windowPanel/WindowPanelContent.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/windowPanel/WindowPanelContent.vue) | elody-pwa | fields, nested lists and wysiwyg, relations |
| [`src/composables/useFormHelper.ts`](https://github.com/inuits/elody-pwa/blob/master/src/composables/useFormHelper.ts) | elody-pwa | which keys are editable and saved |
| [`baseModule/baseResolver.ts`](https://github.com/inuits/elody-base-graphql/blob/master/baseModule/baseResolver.ts) | elody-base-graphql | `WindowElement` and `WindowElementPanel` resolvers and defaults |
