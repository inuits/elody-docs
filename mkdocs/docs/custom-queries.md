# Custom queries with graphql

Queries in Graphql allow us to write pieces of code that we can execute that allow us to dynamically build up an application.

Queries are highly reusable and therefore allows us an approach in which we can define custom queries.
Custom queries are stored in the graphql, and we can pass along the name of the custom queries to our frontend.

With graphql we build our frontend and lay out the different components. The custom queries are then available in the frontend itself, in the components, because we passed along the name of the custom query.
With the name of the query in the frontend, we can fetch the full query, pass parameters to the query and execute it.
We have created a way in our frontend component flow to execute these custom queries. This allows us to fetch entities or insert different components in certain parts of the application. 

We have a few different ways in which we use custom queries to layout different parts of our application:


## Custom queries on EntityListElement

This is for sure the most important way of using our custom queries.

**EntityListElements** are elements placed on detail pages of entities. In a detail page we can see all the metadata and the relations of the parent.
For example an *Asset* has a relation with *Mediafiles*. 
Every type of relation is shown in a **base libary**, so the mediafiles are shown in a base library on the screen.
A base library is just a component that fully shows a list of items and actions on these items (such as reordering, sorting, bulk operations on items, ...).
A base library derives from the *EntityListElements* defined in the graphql.

The way we fetch these relations is through custom queries, we need custom queries to fetch entities.
The first one is to **call our backend** and **define the fields** we want to show. The second one **defines filters**:
1. We can define `customQuery` in `EntityListElement` that accepts parameters (including filters) and goes through specific resolvers that call upon our AuthRestDataSource that in it's turn can execute calls to our backend.
   Results returned from the backend are then poured into implementations of schema's of the entity type that is fetched.
   By this we mean that we can define which **specific fields we are going to show** in the query.

An example on how to link the name of the query to the **EntityListElement** (7th & 8th line are important)
```
Mediafiles: entityListElement {
   label(input: "element-labels.media-element")
   isCollapsed(input: false)
   type(input: media)
   entityTypes(input: [mediafile])
   relationType: label(input: "hasMediafile")
   customQuery(input: "GetMediafilesInAsset")
   customQueryFilters(input: "GetMediafilesInAssetFilters")
   searchInputType(input: "AdvancedInputMediaFilesType")
   allowedActionsOnRelations(input: [addRelation, removeRelation])
   customBulkOperations(input: "GetBulkOperationsForMediafilesInAsset")
}
```

An example of the query itself:
```
query getMediafilesInAsset(
    $type: Entitytyping!
    $limit: Int
    $skip: Int
    $searchValue: SearchFilter!
    $advancedSearchValue: [FilterInput]
    $advancedFilterInputs: [AdvancedFilterInput!]!
    $searchInputType: SearchInputType
    $userUuid: String!
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
        ... on MediaFileEntity {
          ...minimalBaseEntity
          intialValues {
            id
            filename: keyValue(key: "filename", source: root)
            publicationStatus: keyValue(
              key: "publication_status"
              source: metadata
            )
            thumbnail: keyValue(key: "filename", source: root)
            __typename
          }
          teaserMetadata {
            thumbnail: thumbnail {
              key(input: "thumbnail")
              __typename
            }
            filename: metaData {
              label(input: "metadata.labels.filename")
              key(input: "filename")
              __typename
            }
            publicationStatus: metaData {
              label(input: "metadata.labels.publication-status")
              key(input: "publicationStatus")
              __typename
            }
            contextMenuActions {
              doLinkAction {
                label(input: "contextMenu.contextMenuLinkAction.followLink")
                icon(input: "AngleRight")
                __typename
              }
              __typename
            }
          }
          allowedViewModes {
            viewModes(input: [ViewModesList, ViewModesGrid, ViewModesMedia])
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
```


2. We can define `customQueryFilters` in `EntityListElement`. In this query we can define different filters that are needed to fetch the correct entities/relations/... .
   To fetch relations we need a **type filter** and a **relation filter** in the customQueryFilters. The value of the relation filter is the ID of the entity's relations we want to fetch, and is filled in dynamically in the frontend.
An example:

```
  query getMediafilesInAssetFilters($entityType: String!) {
    EntityTypeFilters(type: $entityType) {
      advancedFilters {
        type: advancedFilter(type: type) {
          type
          defaultValue(value: "mediafile")
          hidden(value: true)
        }
        relation: advancedFilter(
          type: selection
          parentKey: "relations"
          key: "hasMediafile"
        ) {
          type
          parentKey
          key
          defaultValue(value: "")
          hidden(value: true)
        }
      }
    }
  }
```


So this approach allows us to define very specific queries that are executed frontend. The logic for that is stored in one component, and that component is reused in a lot of places.

***General conclusion***: We can choose which type(s) of entity(ies) we fetch and what metadata we show of these entities because of these custom queries.


## CustomBulkOperations on EntityListElement

BulkOperations are actions that can be performed on item(s) in a base libary. Normally these are generaly defined for each entity type. 
But we can also write `CustomBulkOperations` to fetch custom bulk operations, also defined on an **EntityListElement**. 

Thanks to this we can define very specific actions on relations.
We can for example add an action to create a new entity from this bulk operations menu in the relations base library screen.
Then a relation is automatically added between the entity of the overview screen and the new one you just created.

An example:

```
query GetBulkOperationsForAssetPartsInAsset {
    CustomBulkOperations {
      bulkOperationOptions {
        options(
          input: [
            {
              icon: Image
              label: "bulk-operations.create-asset-part"
              value: "createEntity"
              actionContext: {
                activeViewMode: readMode
                entitiesSelectionType: noneSelected
              }
              bulkOperationModal: {
                typeModal: DynamicForm
                formQuery: "GetAssetPartCreateFormFromBulkOperations"
                formRelationType: "hasAsset"
                askForCloseConfirmation: true
                neededPermission: cancreate
              }
            }
          ]
        ) {
          icon
          label
          value
          actionContext {
            ...actionContext
          }
          bulkOperationModal {
            ...bulkOperationModal
          }
        }
      }
    }
  }
```



## DeleteQueryOptions on the root of an entity's fragment

Delete query options are also a powerfull way of writing custom queries that we use to give delete suggestions to a user.

For example a user wants to delete an entity.
With these custom queries we can:
1. give suggestions to the user if he/she wants to delete the related entities (we ask to delete the related entity itself, not the relation between them, because relations are automatically deleted between entities when one of them is deleted)
2. define blocking relations that check if the entity to be deleted has a relation with another specific entitytype, and ifso: it is not allowed to delete this entity

If we write a `customQueryDeleteRelations` query and a `customQueryDeleteRelationsFilters` we can fetch the relations of the entity we want to delete.
This works the exact same way as the explanation of fetching entities in the *Custom queries on EntityListElement* chapter. So the implementation of the query is the same.
The way linking the queries to an entity is done like this (with deleteQueryOptions on the root of the fragment of the entity):
```
    deleteQueryOptions {
      customQueryDeleteRelations(input: "GetAssetDeleteQuery")
      customQueryDeleteRelationsFilters(input: "GetAssetFiltersDeleteQuery")
      customQueryEntityTypes(input: [mediafile])
    }
```

On top of this functionality, we can also define the blocking relations to prevent an entity to be deleted if it has certain relations.
The entity can in the future be deleted if the relation between those two or the other entity is deleted.

We can do this with `customQueryBlockingRelations` and `customQueryBlockingRelationsFilters`.
Which also work the same way as the previous examples of fetching entities with custom queries.
We can write blocking queries like this:
```
    deleteQueryOptions {
      customQueryBlockingRelations(input: "GetAssetParts")
      customQueryBlockingRelationsFilters(input: "GetAssetPartsInAssetFilters")
      customQueryBlockingEntityTypes(input: [assetPart])
    }
```

