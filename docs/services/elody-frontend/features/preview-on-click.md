# Preview on Click

By default, clicking an item in an overview list opens that entity's detail
page. While a preview is open, a click previews the item instead, and an arrow
at the end of each row navigates to the detail page.

A route can make previewing the default, so the first click already opens the
preview. Podiumnet uses this on its notifications overview.

## Enabling it

Set `openPreviewOnClick` in the route's `meta` in the client's router config:

```ts
{
  path: "/notifications",
  name: RouteNames.Notifications,
  component: "Home",
  meta: {
    type: Collection.Entities,
    entityType: Entitytyping.Notification,
    openPreviewOnClick: true,
  },
},
```

The listed entity type also needs a preview, a `previewComponent` in its
`previewFor<Type>` fragment. Without one, the flag does nothing and a click
still navigates, so a route can't end up with list items that do nothing.

## Behaviour

- Clicking an item opens its preview. Clicking another item moves the preview
  to that item.
- The arrow at the end of each row still opens the detail page.
- Items are rendered as plain elements instead of links, so ctrl-click or
  middle-click no longer opens the entity in a new tab. That was already the
  case on every list while a preview is open.
- Only the overview list of that route is affected. Entity lists on detail
  pages, entity pickers and the search modal keep their normal click
  behaviour, even when they render on the same route.

## Why a route flag

The setting lives on the route rather than on the entity type's preview or
list query, because those are shared. A notification's `previewComponent` and
`minimalNotification` fragment also drive notification lists embedded in other
entities' detail pages, and those should keep navigating.

The PWA's overview wrapper (`AssetLibrary.vue`) is the only place that reads
`route.meta.openPreviewOnClick`. It passes the flag down to the list and table
view modes as a prop.
