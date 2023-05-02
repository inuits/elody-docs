# Advanced Filtering

The advanced filtering system is a service provided by the collection-api which
allows people to look for specific assets which answer to a specific filter.

This service provides a set of filter types that can be easily used to
filter metadata. Each filter type has a set of matchers that define the different
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

## IdFilterType
The IdFilterType is used to filter data based on a unique identifier, such as a
primary key, by looking at the values of the `identifiers` key of a dataset.
It provides three matchers: `id, exact, and contains`. The id matcher is used to
match a specific identifier, the exact matcher matches values that are equal to a
given value, and the contains matcher matches values that contain a given substring.

### Some matcher query examples
#### IdMatcher
```
[
  {
    "type": "IdInput",
    "key": "identifiers",
    "value": ["R 53.5", "Bg9DTJPNRjLQmViHTb72qGeR"]
  }
]
```
This query is searching for entities that match either the identifier "R 53.5"
or the identifier "Bg9DTJPNRjLQmViHTb72qGeR".

#### ExactMatcher
```
[
  {
    "type": "IdInput",
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

#### ContainsMatcher
```
[
  {
    "type": "IdInput",
    "key": "identifiers",
    "value": "R",
    "match_exact": false
  }
]
```
This query is searching for entities that match an identifier containing the
letter "R".

## TextFilterType
The TextFilterType is used to filter data based on text values, such as names or
descriptions. It provides four matchers: `any, none, exact, and contains`. The any
matcher matches any non-empty value, the none matcher matches any empty value, the
exact matcher matches values that are equal to a given value, and the contains
matcher matches values that contain a given substring.

### Some matcher query examples
#### AnyMatcher
```
[
  {
    "type": "TextInput",
    "key": "title",
    "value": "*",
    "item_types": ["asset"]
  }
]
```
This query is searching for entities of type "asset" that have a non-empty title
metadata field.

#### NoneMatcher
```
[
  {
    "type": "TextInput",
    "key": "description",
    "value": ""
  }
]
```
This query is searching for entities that have an empty description metadata field.

## DateFilterType
The DateFilterType is used to filter data based on datetime values. It provides
six matchers: `any, none, exact, min, max, and in_between`. The any matcher matches
any non-empty value, the none matcher matches any empty value, the exact matcher
matches values that are equal to a given value, the min matcher matches values that
are greater than a given value, the max matcher matches values that are less than a
given value, and the in_between matcher matches values that fall within a specific
range.

### Some matcher query examples
#### MinMatcher
```
[
  {
    "type": "DateInput",
    "key": "created",
    "value": {
        "min": "2022-04-14 15:00:00"
    }
  }
]
```
This query is searching for entities where the metadata field "created" has a
minimum datetime value of "2022-04-14 15:00:00". It is a "greater then" match, so
the minimum value itself is not included in the result.

#### MaxMatcher
```
[
  {
    "type": "DateInput",
    "key": "created",
    "value": {
        "max": "2022-04-14 15:00:00"
    }
  }
]
```
This query is searching for entities where the metadata field "created" has a
maximum datetime value of "2022-04-14 15:00:00". It is a "less then" match, so
the maximum value itself is not included in the result.

#### InBetweenMatcher
```
[
  {
    "type": "DateInput",
    "key": "created",
    "value": {
        "min": "2022-04-13 00:00:00",
        "max": "2022-04-14 15:00:00"
    }
  }
]
```
This query is searching for entities where the metadata field "created" has a
datetime value which is between "min" and "max". In this matcher the min and max
values are included in the result.

## NumberFilterType
The NumberFilterType is used to filter data based on numerical values. It provides
six matchers: `any, none, exact, min_included, max_included, and in_between`. The
any matcher matches any non-empty value, the none matcher matches any empty value,
the exact matcher matches values that are equal to a given value, the min_included
matcher matches values that are greater than or equal to a given value, the
max_included matcher matches values that are less than or equal to a given value,
and the in_between matcher matches values that fall within a specific range.

### Some matcher query examples
#### MinIncludedMatcher
```
[
  {
    "type": "NumberInput",
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

#### MaxIncludedMatcher
```
[
  {
    "type": "NumberInput",
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

## SelectionFilterType
The SelectionFilterType is used to filter data based on a pre-defined set of values.
It provides three matchers: `any, none, and exact`. The any matcher matches any non-empty
value, the none matcher matches any empty value, and the exact matcher matches against
multiple values that are equal to the given values, treating them as an OR operation.

### Some matcher query examples
#### ExactMatcher
```
[
  {
    "type": "SelectionInput",
    "key": "filesize",
    "value": ["482978", "13525477"]
  }
]
```
This query is searching for mediafiles where the metadata field "filesize" matches a
value of either "482978" or "13525477".

## BooleanFilterType
The BooleanFilterType is used to filter data based on boolean values. It provides one
matcher: `exact`. The exact matcher matches values that are equal to a given value.

### Some matcher query examples
#### ExactMatcher
```
[
  {
    "type": "BooleanInput",
    "key": "is_original",
    "value": true
  }
]
```
This query is searching for mediafiles where the (example) metadata field "is_original"
is set to true.

By using these filter types and matchers, you can easily filter data based on a variety
of criteria and retrieve the specific subset of data that you need.

# Note
Quering relations, searching within the context of an entity by using the `parent` field
in the query, and combined queries are either not tested, or not yet supported because
testing it was not possible during development. In any urgent case, the previous filter
implementation does still exist in the codebase.
