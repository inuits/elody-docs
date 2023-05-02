# Advanced Filtering (deprecated version)

The advanced filtering system is a service provided by the collection-api which
allows people to look for specific assets which answer to a specific filter.

## TextInput filter

The TextInput filter allows you to look for entities matching an exact value.
Unlike the name suggests, this filter can be used for other data types, besides
text. For example; dates and numbers. Some examples:

### Basic example
```
[
  {
    "type": "TextInput",
    "value": "Village",
    "key": "title"
  }
]
```
This query searches for every entity containing the string "Village" in the title.

### A more complex example
```
[
  {
    "type": "TextInput",
    "value": "Scretchbook from Belgium",
    "key": "title",
    "match_exact": true,
    "item_types": ["asset", "manifest"]
  }
]
```
This query searches for every entity containing the exact string "Scretchbook from Belgium".
Exact matching is caused by the `match_exact` field (this is set to false by
default). It only searches within the entity types `asset` and `manifest`.

### Searching for specific dates
```
[
  {
    "type": "TextInput",
    "value": "2023-03-30 09:50",
    "key": "date",
    "match_exact": true,
  }
]
```
This query searches for an entity created exactly on the 30th of March 2023, on
09:50.

### Searching for a number
```
[
  {
    "type": "TextInput",
    "value": "151",
    "key": "height",
    "parent": "123dazm9dza0g",
  }
]
```
This query searches for entities with a height of exactly 151... whatever unit
this refers to. It also searches within the context of the entity "123dazm9dza0g".
So all the results will have "123dazm9dza0g" as their parent.

### Combining multiple queries
```
[
  {
    "type": "TextInput",
    "value": "151",
    "key": "height",
    "match_exact": true,
  },
  {
    "type": "TextInput",
    "value": "cm",
    "key": "unit_height",
    "match_exact": true,
  }
]
```
This query combines two queries, the first looks for entities with a height of
exactly 151... Whatever unit. And in the next query we specify that the unit_height
should be "cm".

## MultiSelect filter

The MultiSelectInput filter allows you to look for entities matching multiple
given values.

### An example
```
[
  {
    "type": "MultiSelectInput",
    "value": [
      "Erfgoedbibliotheek Hendrik Conscience (Antwerpen)",
      "Museum Plantin-Moretus (Antwerpen)"
    ],
    "item_types": ["museum"],
    "key": "publisher"
  }
]
```
This query searches for entities of type museum which have a publisher which is
either "Erfgoedbibliotheek Hendrik Conscience (Antwerpen)" or
"Museum Plantin-Moretus (Antwerpen)".

## MinMax filter

The MinMax filter allows you to search for entities where the value lies between
two set values. These values don't have to be numbers perse. They can also be
dates.

### An example
```
[
  {
    "type": "MinMaxInput",
    "value": {
      "max": 8
    },
    "metadata_field": "width",
    "item_types": ["asset"]
  }
]
```
This query searches for assets with a width with a maximum of 8.

### An example with relations
```
[
  {
    "type": "MinMaxInput",
    "value": {
      "min": 1
    },
    "relation_types": ["mediafiles"],
    "item_types": ["asset"]
  }
]
```
This query searches for asset with at least one mediafile.

### Using dates with a MinMax-filter
```
[
  {
    "type": "MinMaxInput",
    "value": {
      "min": "2023-03-30 09:50",
      "max": "2023-02-15 22:35"
    },
    "metadata_field": "date"
  }
]
```
The MinMax filter can also be abused to filter on date values. In this example
entities dated between the 15th of February, 22:35 and the 30th of March, 2023
on 09:50.
