# Advanced Filtering

The advanced filtering system is a service provided by the collection-api which
allows people to look for specific entities which answer to a specific filter.

This service provides a set of filter types that can be easily used to
filter data. Each filter type has a set of matchers that define the different
filter criteria that can be used with that filter type. These matchers are used
to generate the appropriate query for the filter criteria.

One of the advantages of the filter types in this code is their extendability
and dynamic nature. Each filter type is composed of a set of matchers, which
are responsible for performing the actual filtering operation. The matchers
are defined separately from the filter types, and can be reused across
different filter types. This means that you can easily add new matchers to the
system, or remove existing ones, without having to modify the filter types
themselves.

Furthermore, because the matchers are defined separately, it is easy to
customize and extend the filtering functionality to suit your specific needs.
For example, you could create a new matcher to perform a fuzzy text search, or
a new range matcher that uses a different comparison operator. Once the new
matcher is defined, it can be added to any filter type that requires it,
without having to modify any of the existing code.

This approach also makes it easy to maintain the codebase, since each filter
type is responsible for a single, well-defined task, and the matchers can be
reused across multiple filter types. This means that changes or bug fixes to a
particular matcher will be applied consistently across all the filter types
that use it, without requiring any additional work.

Overall, the dynamic and extensible nature of this code makes it a powerful
tool for filtering data, and allows you to easily customize and adapt the
filtering functionality to suit your specific needs.

## Filter types & matchers
Here is some explanation about the filter types and some of their matchers.
For a complete overview of all filter types and their matchers, see the following
links:<br/>
[filter_matcher_mapping.py](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-collection/-/blob/master/api/filters/filter_matcher_mapping.py)<br/>
[filter_types.py](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-collection/-/blob/master/api/filters/types/filter_types.py)<br/>
[matchers.py](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-collection/-/blob/master/api/filters/matchers/matchers.py)

Here is a full-fledged example of a filter request body in advance
(explanation follows below), you can play with this and use it as a template:
```json
[
  {
    "type": "text",
    "parent_key": "metadata",
    "key": "description",
    "value": "teamwork",
    "match_exact": false,
    "metadata_key_as_label": "",
    "provide_value_options_for_key": false
  }
]
```

### IdFilterType
The IdFilterType is used to filter data based on a unique identifier, such as a
primary key, by looking at the values of the `identifiers` key of a dataset.
It provides three matchers: `id, exact, and contains`. The id matcher is used to
match a specific identifier, the exact matcher matches values that are equal to a
given value, and the contains matcher matches values that contain a given substring.

#### Some matcher query examples
##### IdMatcher
```json
[
  {
    "type": "id",
    "parent_key": "",
    "key": "identifiers",
    "value": ["R 53.5", "Bg9DTJPNRjLQmViHTb72qGeR"]
  }
]
```
This query is searching for entities that match either the identifier "R 53.5"
or the identifier "Bg9DTJPNRjLQmViHTb72qGeR".

##### ExactMatcher
```json
[
  {
    "type": "id",
    "parent_key": "",
    "key": "identifiers",
    "value": "R 53.5",
    "match_exact": true,
    "item_types": ["asset", "manifest"]
  }
]
```
This query is searching for an entity that matches the identifier "R 53.5".
Exact matching is caused by the `match_exact` field (this is set to false by
default). It only searches within the entity types `asset` and `manifest`.

##### ContainsMatcher
```json
[
  {
    "type": "id",
    "parent_key": "",
    "key": "identifiers",
    "value": "R",
    "match_exact": false
  }
]
```
This query is searching for entities that match an identifier containing the
letter "R".

### TextFilterType
The TextFilterType is used to filter data based on text values, such as names or
descriptions. It provides four matchers: `any, none, exact, and contains`. The any
matcher matches any non-empty value, the none matcher matches any empty value, the
exact matcher matches values that are equal to a given value, and the contains
matcher matches values that contain a given substring.

#### Some matcher query examples
##### AnyMatcher
```json
[
  {
    "type": "text",
    "parent_key": "metadata",
    "key": "title",
    "value": "*",
    "item_types": ["asset"]
  }
]
```
This query is searching for entities of type "asset" that have a non-empty title
metadata field.

##### NoneMatcher
```json
[
  {
    "type": "text",
    "parent_key": "metadata",
    "key": "description",
    "value": ""
  }
]
```
This query is searching for entities that have an empty description metadata field.

### DateFilterType
The DateFilterType is used to filter data based on datetime values. It provides
six matchers: `any, none, exact, min, max, and in_between`. The any matcher matches
any non-empty value, the none matcher matches any empty value, the exact matcher
matches values that are equal to a given value, the min matcher matches values that
are greater than a given value, the max matcher matches values that are less than a
given value, and the in_between matcher matches values that fall within a specific
range.

#### Some matcher query examples
##### MinMatcher
```json
[
  {
    "type": "date",
    "parent_key": "metadata",
    "key": "created",
    "value": {
        "min": "2022-04-14T15:00:00"
    }
  }
]
```
This query is searching for entities where the metadata field "created" has a
minimum datetime value of "2022-04-14T15:00:00". It is a "greater then" match, so
the minimum value itself is not included in the result.

##### MaxMatcher
```json
[
  {
    "type": "date",
    "parent_key": "metadata",
    "key": "created",
    "value": {
        "max": "2022-04-14T15:00:00"
    }
  }
]
```
This query is searching for entities where the metadata field "created" has a
maximum datetime value of "2022-04-14T15:00:00". It is a "less then" match, so
the maximum value itself is not included in the result.

##### InBetweenMatcher
```json
[
  {
    "type": "date",
    "parent_key": "metadata",
    "key": "created",
    "value": {
        "min": "2022-04-13T00:00:00",
        "max": "2022-04-14T15:00:00"
    }
  }
]
```
This query is searching for entities where the metadata field "created" has a
datetime value which is between "min" and "max". In this matcher the min and max
values are included in the result.

### NumberFilterType
The NumberFilterType is used to filter data based on numerical values. It provides
six matchers: `any, none, exact, min_included, max_included, and in_between`. The
any matcher matches any non-empty value, the none matcher matches any empty value,
the exact matcher matches values that are equal to a given value, the min_included
matcher matches values that are greater than or equal to a given value, the
max_included matcher matches values that are less than or equal to a given value,
and the in_between matcher matches values that fall within a specific range.

#### Some matcher query examples
##### MinIncludedMatcher
```json
[
  {
    "type": "number",
    "parent_key": "metadata",
    "key": "width",
    "value": {
        "min": 4137,
        "included": true
    }
  }
]
```
This query is searching for mediafiles where the metadata field "width" has a
minimum value of 4137. The `included` field indicates that it should use the
MinIncludedMatcher, which does a "greater then or equal" match.

##### MaxIncludedMatcher
```json
[
  {
    "type": "number",
    "parent_key": "metadata",
    "key": "width",
    "value": {
        "max": 799,
        "included": true
    }
  }
]
```
This query is searching for mediafiles where the metadata field "width" has a
maximum value of 799. The `included` field indicates that it should use the
MaxIncludedMatcher, which does a "less then or equal" match.

### SelectionFilterType
The SelectionFilterType is used to filter data based on a pre-defined set of values.
It provides three matchers: `any, none, and exact`. The any matcher matches any non-empty
value, the none matcher matches any empty value, and the exact matcher matches against
multiple values that are equal to the given values, treating them as an OR operation.

#### Some matcher query examples
##### ExactMatcher
```json
[
  {
    "type": "selection",
    "parent_key": "metadata",
    "key": "filesize",
    "value": ["482978", "13525477"]
  }
]
```
This query is searching for mediafiles where the metadata field "filesize" matches a
value of either "482978" or "13525477".

### BooleanFilterType
The BooleanFilterType is used to filter data based on boolean values. It provides one
matcher: `exact`. The exact matcher matches values that are equal to a given value.

#### Some matcher query examples
##### ExactMatcher
```json
[
  {
    "type": "boolean",
    "parent_key": "metadata",
    "key": "is_original",
    "value": true
  }
]
```
This query is searching for mediafiles where the (example) metadata field "is_original"
is set to true.

By using these filter types and matchers, you can easily filter data based on a variety
of criteria and retrieve the specific subset of data that you need.

## How to define and use the filters in the frontend?
Filters are defined in the `*.queries.ts` file within the customer specific GraphQL module.
But before defining the filters themselves, make sure the following queries are in place:
```graphql
query getFilterMatcherMapping {
  FilterMatcherMapping {
    id
    text
    date
    number
    selection
    boolean
    relation
  }
}
```
=> this makes sure the [filter_matcher_mapping.py](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-collection/-/blob/master/api/filters/filter_matcher_mapping.py)
can be queried, which is crutial for the frontend as it provides the ability to:

- list the available matchers based on the filter type per filter, so the end user
can choose how to match a value
- dynamically load the correct component when selecting a matcher, as each matcher has its
own component which provides the correct UI and the correct request body for the backend
call

For more info:<br/>
[FiltersBase.vue](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-frontend/-/blob/master/src/components/filters/FiltersBase.vue)<br/>
[matchers](https://gitlab.inuits.io/rnd/inuits/dams/inuits-dams-frontend/-/tree/master/src/components/filters/matchers)

```graphql
query getFilterOptions($input: AdvancedFilterInput!, $limit: Int!) {
  FilterOptions(input: $input, limit: $limit)
}
```
=> this makes sure filter options can be retrieved when using an IdFilterType or
SelectionFilterType. When those options are 10 or less, the UI will show a list of
checkboxes where you can check the ones you want to filter on. Otherwise an autocompletebox
is shown which completes the user input when 3 or more characters are typed.

Now you can define filters. First provide the base:
```graphql
query getAdvancedFilters($entityType: String!) {
  EntityTypeFilters(type: $entityType) {
    ... on IotDevice {
        # define your filters here within the IotDevice filter set
    }
    ... on PoliceZone {
        # define your filters here within the PoliceZone filter set
    }
  }
}
```
Here you see that filters are defined per entity. These entity types **must** also be
defined in each route that contains filters. So, in the `*Routes.ts` file wihtin the
customer specific GraphQL module, you should provide an `entityType` meta field. The value
of this field determines which filter set is being loaded on which route. An example:
```typescript
export const pzaIotRoutes = [
  {
    path: "/",
    name: RouteNames.Home,
    component: "HomeWrapper",
    meta: {
      title: "Home",
      type: Collection.Entities,
      requiresAuth: true,
      entityType: Entitytyping.Iotdevice
    },
    children: [
      {
        path: "iotDevices",
        name: RouteNames.IotDevices,
        component: "Home",
        meta: {
          title: "Iot Devices",
          requiresAuth: true,
          showEntityTitle: true,
          type: Collection.Entities,
          entityType: Entitytyping.Iotdevice // => "IotDevice"
        },
      },
      {
        path: "zones",
        name: RouteNames.Zones,
        component: "Home",
        meta: {
          title: "Police Zones",
          requiresAuth: true,
          showEntityTitle: true,
          type: Collection.Entities,
          entityType: Entitytyping.Policezone // => "PoliceZone"
        },
      },
    ],
  },
  { path: "/home", redirect: "/" },
];
```
=> this will make sure that:

- when you visit `/` or `/iotDevices`, the filters you defined under `IotDevice` are loaded
- when you visit `/zones`, the filters you defined under `PoliceZone` are loaded

The second thing you should do is actually defining the filters, here you find an example
of all different variations a filter definition can look like:
```graphql
name: advancedFilter(type: text, parentKey: "metadata", key: "name", label: "name") {
  type
  parentKey
  key
  label
}
```
=> This is the most basic form of a filter definition. It will provide you a text filter
which filters on the key `name`. You can also define the same structure for filters of
type `date`, `number` and `boolean`.

```graphql
name: advancedFilter(key: "name", label: "name", type: text, isDisplayedByDefault: true) {
  type
  parentKey
  key
  label
  isDisplayedByDefault
}
```
=> Although this is optionally, it is recommended to add the `isDisplayedByDefault` parameter.
Filters are not displayed unless you add them through the UI. This property will make sure
the filter is displayed by default.

```graphql
type: advancedFilter(type: type) {
  type
  defaultValue(value: "IotDevice")
  hidden(value: true)
}
```
=> This is a hidden filter. You will not see this in the UI, but it will be performed each
time you apply filters as an end user.

```graphql
id: advancedFilter(
  type: id
  parentKey: ""
  key: "identifiers"
  label: "ID"
  isDisplayedByDefault: true
  advancedFilterInputForRetrievingOptions: {
    type: text
    parent_key: ""
    key: "identifiers"
    value: "*"
    item_types: ["IotDevice"]
  }
) {
  type
  parentKey
  key
  label
  isDisplayedByDefault
  advancedFilterInputForRetrievingOptions {
    type
    parent_key
    key
    value
    item_types
  }
}

name: advancedFilter(
  type: selection
  parentKey: "metadata"
  key: "name"
  label: "Name"
  isDisplayedByDefault: true
  advancedFilterInputForRetrievingOptions: {
    type: text
    parent_key: "metadata"
    key: "name"
    value: "*"
    item_types: ["IotDevice"]
  }
) {
  type
  parentKey
  key
  label
  isDisplayedByDefault
  advancedFilterInputForRetrievingOptions {
    type
    parent_key
    key
    value
    item_types
  }
}
```
=> Filters of type `id` and `selection` are more complex because you also have to define
`advancedFilterInputForRetrievingOptions`, which always has `value: "*"` and `type: text`.
The `key` within this field should match the key you want to filter on. This will perform
a query in the background and return a list of all values for the `key` you provide. These
list of values is then used in the UI to provide a list of checkboxes where you can select
the values you want to filter on, or used to provide completion for your input in the
autocompletebox. Optionally, you can also provide `item_types` within
`advancedFilterInputForRetrievingOptions`. What this does is making sure only the values
of the key of specific entities are queried as options. Using the name filter defined
above as an example, this will make sure you only get names of Iot Devices as completion
for your input.

Here is a complete example about defining filters:
```graphql
query getAdvancedFilters($entityType: String!) {
  EntityTypeFilters(type: $entityType) {
    ... on IotDevice {
      name: advancedFilter(
        type: selection
        parentKey: "metadata"
        key: "name"
        label: "metadata.labels.name"
        isDisplayedByDefault: true
        advancedFilterInputForRetrievingOptions: {
          type: text
          parent_key: "metadata"
          key: "name"
          value: "*"
          item_types: ["IotDevice"]
        }
      ) {
        type
        parentKey
        key
        label
        isDisplayedByDefault
        advancedFilterInputForRetrievingOptions {
          type
          parent_key
          key
          value
          item_types
        }
        tooltip(value: true)
      }
      lastReported: advancedFilter(
        type: date
        parentKey: "metadata"
        key: "date_last_reported"
        label: "metadata.labels.date-last-reported"
      ) {
        type
        parentKey
        key
        label
        tooltip(value: true)
      }
      type: advancedFilter(type: type) {
        type
        defaultValue(value: "IotDevice")
        hidden(value: true)
      }
    }
    ... on PoliceZone {
      code: advancedFilter(
        type: text
        parentKey: "metadata"
        key: "code"
        label: "metadata.labels.code"
        isDisplayedByDefault: true
      ) {
        type
        parentKey
        key
        label
        isDisplayedByDefault
        tooltip(value: true)
      }
      type: advancedFilter(type: type) {
        type
        defaultValue(value: "PoliceZone")
        hidden(value: true)
      }
      relation: advancedFilter(
        type: selection
        parentKey: "relations"
        key: "zoneServedBy"
      ) {
        type
        parentKey
        key
        defaultValue(value: [])
        hidden(value: true)
      }
    }
  }
}
```

## Special filters
### TypeFilterType
Filtering on types is special in the sense that it is much simpler then other filters.
The main way of filtering on types is as follows:
```json
[
  {
    "type": "type",
    "value": "PoliceZone"
  }
]
```
```graphql
type: advancedFilter(type: type) {
  type
  defaultValue(value: "PoliceZone")
  hidden(value: true)
}
```

This is an alternative way to filter on types which allows you to filter on multiple types:
```json
[
  {
    "type": "selection",
    "parent_key": "",
    "key": "type",
    "value": ["IotDevice", "PoliceZone"],
    "match_exact": true
  }
]
```

## Relation filters
Relation filters are special because the `key` and `value` you specify do **not** reflect
to the `key` and `value` of a relation object. Relation filters are used to filter on
relation types, which results in the following:

- `key` => searches in relation.type
- `value` => searches in relation.key

Here is an example:
```json
[
  {
    "type": "selection",
    "parent_key": "relations",
    "key": "zoneServedBy",
    "value": ["urn:ngsi-ld:IotDevice:5345ANT664ADJ1"],
    "match_exact": true
  }
]
```

Relation filters in the graphql are more complex, sadly. This is because each entity type
can only have 1 relation filter, which can then be used by all entity types other then
itself. A relation filter should be hidden and should be defined as the very last filter
of the entity type. Here is an example:
```graphql
query getAdvancedFilters($entityType: String!) {
  EntityTypeFilters(type: $entityType) {
    ... on PoliceZone {
      code: advancedFilter(
        type: text
        parentKey: "metadata"
        key: "code"
        label: "metadata.labels.code"
        isDisplayedByDefault: true
      ) {
        type
        parentKey
        key
        label
        isDisplayedByDefault
        tooltip(value: true)
      }
      type: advancedFilter(type: type) {
        type
        defaultValue(value: "PoliceZone")
        hidden(value: true)
      }
      relation: advancedFilter(
        type: selection
        parentKey: "relations"
        key: "zoneServedBy"
      ) {
        type
        parentKey
        key
        defaultValue(value: [])
        hidden(value: true)
      }
    }
  }
}
```
=> This relation filter can only be used in the detail view of some other entity, like for
example IotDevice. How it works in the frontend using an example:

1. You open the details of an entity, for example IotDevice
2. On the details page, there is collapsible view which loads the baseLibrary with a fixed
entity type, for example PoliceZone
3. The baseLibrary in this collapsible view will detect that it is on a details page of
some other entity and will load the filters of PoliceZone (because that is what the
baseLibrary is fixated on in step 2, this is defined in the graphql)
4. Since it knows it is on a details page, it will pay special attention to the hidden
relation filter by using the IotDevice's id as `value` for the relation filter
5. It will apply the filter and send a request body to the api that looks exactly like the
json example I gave above, together with a type filter


### Relation filter for multiple different entity types
In some cases different entity types can have the same relation types. In order to show
these, add item types to the filter:
```json
[
  {
    "type": "selection",
    "parent_key": "relations",
    "key": "isControlledAssetFor",
    "value": ["urn:ngsi-ld:IotDevice:5345ANT664ADJ1"],
    "item_types": ["PoliceAsset", "PoliceVehicle"]
    "match_exact": true
  }
]
```
```graphql
relation: advancedFilter(
  type: selection
  parentKey: "relations"
  key: "isControlledAssetFor"
  itemTypes: ["PoliceAsset", "PoliceVehicle"]
) {
  type
  parentKey
  key
  itemTypes
  defaultValue(value: [])
  hidden(value: true)
}
```
=> This will show all controlled assets of an IotDevice in 1 collapsible view, with related
entities of both PoliceAsset and PoliceVehicle types

## Filter options
TODO
