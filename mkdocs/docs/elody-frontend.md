# Elody frontend

## Introduction

The Elody frontend is written in Typescript using the Vue.js framework.

## Architecture Overview

The frontend consists of two main components:
   1. **Progressive Web Application (PWA)**: Built with Vue 3 and TypeScript, this component contains all the UI components and composables. It serves as the actual frontend for every client.
   2. **Backend for Frontend (BFF) with GraphQL**: This component acts as an intermediary between the frontend and the backend services. It includes schemas, queries, resolvers, endpoints, parsers, and more. Each client has its own GraphQL repository to extend or customize the base functionality.


## Detailed technical information

### Graphql

GraphQL plays a crucial role in our frontend by providing the necessary data for building the user interface. The frontend gets build up through Graphql queries. It fetches data from the Elody backend services and defines various aspects of the layout, such as menu items, entity types, routes, entity detail pages, visibility, bulk operations, sort options, and more.

#### Data Fetching
The backend for frontend is also responsible for fetching data from our Elody backend services. The frontend will never fetch data directly from the Collection API, Storage API, ... this would result in a `CORS` error.

Data fetching for the frontend can be done in two ways:
1. **GraphQL Queries/Mutations**: These are defined in the base module and can be used for all Elody instances. Client-specific queries and mutations are defined in the respective client GraphQL repositories.
2. **Express Proxy**: Running on the GraphQL service, this proxy handles specific data fetching scenarios.


#### Key Concepts
The GraphQL implementation contains three important parts:
1. Schemas
2. Queries
3. Resolvers


#### Schema's
The `base graphql` contains a `baseSchema.schema.ts` file that gives the initial architecture for an Elody application. This can be extended in the client specific graphql repository. There you can add a ${client}Schema.schema.ts with customer specific entities, types, interfaces, queries and mutations definitions.

Here is the link to the official [documentation](https://graphql.org/learn/schema/).

In the schema we define **types** that represent UI elements, such as `EntityListElement`, `EntityListViewMode`, `Form`, `FormFields`, `FormTab`, ...

Other types are our entities that we work with, we have a base set of entities and every client can customize/add more entities based on their needs. They all implement the interface Entity, which enforces the Elody frontend structure of an entity.

We also define return types, such as `EntitiesResults`. This represents a schema on how the data should be structed/formatted when returned to our pwa:

````graphql
type EntitiesResults {
    results: [Entity]
    sortKeys(sortItems: [String]): [String]
    count: Int
    limit: Int
}
````

Another important type is `Query`, this type contains all the names of queries that can be used in the queries files. When a query is executed, they return a type that is defined in this query section.

```graphql
type Query {
    Entities(
        type: Entitytyping
        limit: Int
        skip: Int
        searchInputType: SearchInputType
        searchValue: SearchFilter!
        advancedSearchValue: [FilterInput]
        advancedFilterInputs: [AdvancedFilterInput!]!
        fetchPolicy: String
    ): EntitiesResults
}
```

Same goes for the other important type `mutation`, the only difference is that queries return information and mutations can edit data or are mutation requests on data.

#### Queries

Here is the documentation for [queries](https://graphql.org/learn/queries/) and for [mutations](https://graphql.org/learn/mutations/).

Most query files are located in customer-specific GraphQL repositories.
These queries can be invoked from the frontend to return UI elements such as menus or a detail entity page. Additionally, they can retrieve or modify data by making calls to the backend, with the logic for these operations residing within the resolvers.

Each entity has its own query file, which includes a standard set of queries and fragments. These are also utilized in the generic queries file of the client's GraphQL repository.
For instance, one of the most important queries, `getEntities`, accept some parameters from our frontend and returns fragments of our entities. It follows an enforced return structure `EntitiesResults` that looks like this:

The query:
```graphql
  query getEntities(
    $type: Entitytyping!
    $limit: Int
    $skip: Int
    $searchValue: SearchFilter!
    $advancedSearchValue: [FilterInput]
    $advancedFilterInputs: [AdvancedFilterInput!]!
    $searchInputType: SearchInputType
  ) {
    Entities(
        type: $type
        limit: $limit
        skip: $skip
        searchValue: $searchValue
        advancedSearchValue: $advancedSearchValue
        advancedFilterInputs: $advancedFilterInputs
        searchInputType: $searchInputType
    ) {
        count
        limit
        results {
            id
            uuid
            type
            ... on Asset {
                ...minimalAsset
            }
            ... on AssetPart {
                ...minimalAssetPart
            }
        }
    }
}
```

An example result:
```json
{
  "count": 21976,
  "limit": 2,
  "results": [
    {
      "id": "id of entity one",
      "uuid": "uuid of entity one",
      "type": "type of entity one",
      "intialValues": {
        ...
      },
      "allowedViewModes": {
       ... 
      },
      "teaserMetadata": {
        ...
      }
    },
    {
      "id": "id of entity two",
      "uuid": "uuid of entity two",
      "type": "type of entity two",
      "intialValues": {
        ...
      },
      "allowedViewModes": {
        ...
      },
      "teaserMetadata": {
        ...
      }
    }
  ]
}
```

So, queries get executed and their main goal is to return data to our frontend (pwa). Besides that, we also have mutations in our queries file. 
As already discussed, their goal is to mutate the data we are working with. For example here is a mutation for deleting an entity. It accepts some required (!) variables from our pwa such as the id, the collection the entity belongs to and if we have to delete its mediafiles as well.

The schema for this mutation looks like this:
```graphql
type Mutation {
    deleteData(
        id: String!
        path: Collection!
        deleteMediafiles: Boolean!
    ): String
}
```

The mutation implements the schema:
```graphql
  mutation deleteData(
    $id: String!
    $path: Collection!
    $deleteMediafiles: Boolean!
  ) {
    deleteData(id: $id, path: $path, deleteMediafiles: $deleteMediafiles)
  }
```

#### Resolvers
Resolvers are the core components that contain the logic and code for handling queries and mutations in a GraphQL setup. They can perform various tasks, ranging from simply returning the input provided in a query to making calls to backend services through datasources to retrieve, modify, or add data from the database.

[Resolvers](https://www.apollographql.com/docs/apollo-server/data/resolvers) are a part of the [apollo-client of apollographql](https://github.com/apollographql/apollo-client), a caching GraphQL client used to interact with graphql.
Apollo Client facilitates querying the backend and setting up [DataSources](https://www.apollographql.com/docs/apollo-server/data/fetching-data), which are APIs, databases, or services that a GraphQL server uses to handle client requests.

For a comprehensive understanding, please refer to the [official Apollo GraphQL](https://www.apollographql.com/docs), as this is a key part of our frontend setup that handles the interaction with Graphql.

An example of the Menu and MenuItem resolver that returns the input that is given to it in the query and then returns the correct variable per menuItem resolver:
```typescript
export const baseResolver: Resolvers<ContextValue> = {
    Menu: {
        menuItem: async (
            _source,
            { label, entityType, icon, isLoggedIn, typeLink, requiresAuth, can },
            { dataSources }
        ) => {
            return {
                label,
                entityType,
                icon,
                isLoggedIn,
                typeLink,
                requiresAuth,
                can,
            };
        },
    },
    MenuItem: {
        label: async (parent, {}, { dataSources }) => {
            return parent.label;
        },
        entityType: async (parent, {}, { dataSources }) => {
            return parent.entityType as Entitytyping;
        },
        subMenu: async (parent, { name }, { dataSources }) => {
            return { name };
        },
        icon: async (parent, {}, { dataSources }) => {
            return parent.icon as MenuIcons;
        },
        isLoggedIn: async (parent, {}, { dataSources }) => {
            return parent.isLoggedIn as boolean;
        },
        typeLink: async (parent, {}, { dataSources }) => {
            return parent.typeLink as MenuTypeLink;
        },
        requiresAuth: async (parent, {}, { dataSources }) => {
            return parent.requiresAuth as boolean;
        },
        can: async (parent, {}, { dataSources }) => {
            return parent.can as string[];
        },
    },
}
```

Graphql resolvers are responsible for fetching data from specific datasources. Each datasource represents a unique origin from which data is retrieved. In the context of Elody, examples of datasources include the CollectionAPI, StorageAPI, and ImportAPI.

The CollectionAPI and StorageAPI are backend microservices that operate within separate Docker containers locally. These microservices are represented in our graphql as distinct datasources that can be queried to retrieve the necessary data.

By utilizing these datasources, Elody ensures efficient and organized data retrieval, enhancing the overall performance and reliability of the system.

An example to delete data:
```typescript
Mutation: {
    deleteData: async (
        _source,
        { id, path, deleteMediafiles },
        { dataSources }
    ) => {
        return dataSources.CollectionAPI.deleteData(id, path, deleteMediafiles);
    }   
}
```
The CollectionAPI datasource contains a method deleteData that looks like this:
```typescript
  async deleteData(
    id: string,
    path: Collection,
    deleteMediafiles: boolean
): Promise<any> {
    if (id == null) {
        return 'no id was specified';
    } else {
        const idSplit = id.split('/');
        if (idSplit.length > 1) id = idSplit[1];
        await this.delete(
            `${path}/${id}?delete_mediafiles=${deleteMediafiles ? 1 : 0}`
        );
        return 'data has been successfully deleted';
    }
}
```

### Datasources and how to add them
[Datasources](https://www.apollographql.com/docs/apollo-server/data/fetching-data) are created in the `client specific graphql` repositories.



### Configurations
Each client has its own configuration, which can be defined in the `${client-name}AppConfig` file. In the client's `main.ts` file, you can import this configuration and pass it to the `start()` method from the **base-graphql** package. This configuration is accepted as the second parameter to the `start()` method.

The configuration adheres to an **interface** called `Environment`, which can be found in the base graphql repository. To add more general configuration options, you can extend the base graphql's Environment interface.

For client-specific configurations, create a `${client-name}Environment` interface that extends the `Environment` interface in the client's graphql setup. Ensure that the configuration implements the client's interface.


### Endpoints

Our base graphql provides several endpoints with various functionalities:
1. **configEndpoint**: Allows the pwa to fetch important configuration settings for the application.
2. **uploadEndpoint**: Handles image uploads, as GraphQL is not designed for sending images. This endpoint is part of our base graphql and uses datasources to call backend services.
3. ...

Many application configurations are activated and added through this process.
For a comprehensive overview, please refer to the `main.ts` files in the base graphql and client graphql.



### Pwa

#### Components

Components represent individual UI elements and actions on them. A component consist of three parts:
1. **< template />**: Here comes the vue3 html, as this defines the UI of your component. Here you can reference other components, html elements, bind attributes to components, etc... Here is [vue3's official documentation](https://vuejs.org/guide/essentials/template-syntax) for detailed information.
2. **< script />**: Here comes all the logic for that component. These can be queries to the graphql, click events, adding variables (refs) or other methods concerning this component.
3. **< style />**: Here comes the styling for the UI. In Elody we don't use this as much because we use [Tailwind]https://tailwindcss.com/docs/utility-first for adding css directly in the template.


#### Composables

We try to put most of the extensive logic for the elody frontend in composables. This way we can access the data inside of the composable in any component. It also makes it easy to write unit tests. We try to write tests for all the functions inside a composable this way we can make sure that the correct state is returned to our Vue.js components.

The composables live in our `composables` folder in the frontend and their name alsways starts with *use*, for example `useBaseLibrary` to keep the state and functionality for our `baseLibrary` component.


#### Vue router

The vue router configuration gets build up in `router.ts` in our frontend. When you open the frontend in your browser it fetches the routes configuration through a dedicated `config` endpoint in our Graphql instance.

These routes are declared in the client graphql, an example of such route looks like this:

```json
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
}
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

