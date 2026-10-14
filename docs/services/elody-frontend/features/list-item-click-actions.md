# List Item Click Actions

`actionOnClick` decides what happens when a user clicks an item in an entity
list. It can be set on an overview route and on an `entityListElement`, and
takes one of four values:

| Value | Click | Item is a link |
|---|---|---|
| `navigate` (default) | Opens the entity's detail page. While a preview is open, previews the clicked item instead. | yes, unless a preview is open |
| `openPreview` | Toggles the entity's preview. Does nothing if the type has no `previewComponent`. | no |
| `openInModal` | Opens the entity in the entity detail modal, on top of the current page. | no |
| `none` | Nothing. | no |

Anything other than `navigate` renders the items as plain elements instead of
links. A click then never leaves the page, but ctrl-click or middle-click no
longer opens the entity in a new tab.

The arrow at the end of a row, which opens the detail page while a preview is
open, only shows with `navigate`.

## On an overview route

Set `actionOnClick` in the route's `meta` in the client's router config:

```ts
import { ActionOnClick } from "../generated-types/type-defs";

{
  path: "/notifications",
  name: RouteNames.Notifications,
  component: "Home",
  meta: {
    type: Collection.Entities,
    entityType: Entitytyping.Notification,
    actionOnClick: ActionOnClick.OpenPreview,
  },
},
```

Only the overview list of that route is affected. Entity lists on detail
pages, entity pickers and the search modal keep their own setting, even when
they render on the same route.

With `openPreview` the items have no link and no arrow. To still offer the
detail page, give the rows a context menu with a link action. It opens the
entity in a new tab:

```graphql
fragment minimalNotification on Notification {
  teaserMetadata {
    forceShowContextMenuActions(input: true)
    buttons {
      contextMenu {
        doLinkAction {
          label(input: "contextMenu.contextMenuLinkAction.followLink")
          icon(input: "AngleRight")
        }
      }
    }
  }
}
```

An overview list hides row context menus unless `forceShowContextMenuActions`
is set, because they normally only show for lists inside a parent entity.

## On an entity list element

`entityListElement` takes the same field. A notification preview can list the
related work order and open it in a modal:

```graphql
entityListElement {
  label(input: "element-labels.work-order")
  isCollapsed(input: false)
  entityTypes(input: [workOrder])
  baseLibraryMode(input: previewBaseLibrary)
  actionOnClick(input: openInModal)
  customQuery(input: "GetWorkOrderForNotification")
}
```

## Why a route setting

The overview setting lives on the route rather than on the entity type's
preview or list query, because those are shared. A notification's
`previewComponent` and `minimalNotification` fragment also drive notification
lists embedded in other entities' detail pages, and those should keep
navigating.

## Migrating from enableNavigation

`actionOnClick` replaces `enableNavigation` on `entityListElement`, which has
been removed:

| Before | After |
|---|---|
| `enableNavigation(input: true)` | nothing, `navigate` is the default |
| `enableNavigation(input: false)` | `actionOnClick(input: openPreview)` |
