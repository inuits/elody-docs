# Advanced Filtering

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

An example
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

