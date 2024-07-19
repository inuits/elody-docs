# Elody frontend

## Introduction

The Elody frontend is written in Typescript using the Vue.js framework.

## Essentials

### Graphql

The most important thing for our frontend is the Graphql. The frontend gets build up through Graphql queries. The whole layout depends on them. Things like menu items, entity types, routes, entity detail pages, visibility, bulk operations, sort options, ... all get declared in our backend for frontend.

The backend for frontend is also responsible for fetching data from our Elody backend services. The frontend will never fetch data directly from the Collection API, Storage API, ... this would result in a `CORS` error.

There are multiple ways to fetch data for our frontend. Either through Graphql queries/mutations or our `Express` proxy running on the Graphql service. The base Elody queries that can be used for all Elody instances are declared in our base-module. Other client specific things get declared in a client graphql. Here we can add queries, mutations, custom proxy endpoints, routes, inputfield types, ...

### Vue router

The vue router configuratin gets build up in `router.ts` in our frontend. When you open the frontend in your browser it fetches the routes configuration through a dedicated `config` endpoint in our Graphql instance.

These routes are declared in the client graphql, an example of such route looks like this:

```js
{
        path: "assets",
        name: RouteNames.Assets,
        component: "Home",
        meta: {
          title: "navigation.assets",
          requiresAuth: false,
          showEntityTitle: true,
          type: Collection.Entities,
          entityType: Entitytyping.Asset,
        },
      },
```

| Property           | Type           | Description                                                                                                                         |
|--------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **path**           | `string`       | The url path where this route is shown                                                                                              |
| **name**           | `RouteNames`   | Name of the route                                                                                                                   |
| **component**      | `string`       | The component the frontend should show when navigating to this route. You can find the list of available components in `router.ts`. |
| **meta**           |                |                                                                                                                                     |
| **title**          | `string`       | Title for the route                                                                                                                 |
| **requiresAuth**   | `boolean`      | If the user needs to be logged in to access this route                                                                              |
| **showEntityType** | `boolean`      | /                                                                                                                                   |
| **type**           |  `Collection`  | The collection where the entity type belongs.                                                                                       |
| **entityType**     | `Entitytyping` | The type of entity that gets displayed on this route                                                                                |

### Composables

We try to put most of the extensive logic for the elody frontend in composables. This way we can access the data inside of the composable in any component. It also makes it easy to write unit tests. We try to write tests for all the functions inside a composable this way we can make sure that the correct state is returned to our Vue.js components.

The composables live in our `composables` folder in the frontend and their name alsways starts with *use*, for example `useBaseLibrary` to keep the state and functionality for our `baseLibrary` component.
