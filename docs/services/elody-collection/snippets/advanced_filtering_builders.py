"""
Builder functions for Advanced Filtering criteria — see advanced-filtering.md.

Plain `typing.TypedDict`s and functions, no runtime dependency. Each
function is named after a (filter type, matcher) pair from the doc and
bakes in the trigger flags for that matcher, so the shape of a filter is
encoded in which function you call rather than in flag combinations you
have to remember and look up.

    filter_json = [
        type_exact("asset"),
        text_regex("properties.serial_number.value", r"^lpa1:"),
    ]

This is deliberately just structural typing for editor autocomplete and
static checking (pyright/mypy) — nothing here validates a filter body at
runtime.
"""

from __future__ import annotations

from typing import Any, Literal, NotRequired, TypedDict, Unpack

KeyType = str | list[str]

Lookup = TypedDict(
    "Lookup",
    {
        "from": str,
        "local_field": str,
        "foreign_field": str,
        "as": str,
    },
)


class Facet(TypedDict):
    key: str
    lookups: NotRequired[list[Lookup]]


class CommonKwargs(TypedDict, total=False):
    """Modifiers shared by every criterion, regardless of filter type.

    Nested `or` groups aren't covered here since `or` isn't a valid Python
    keyword-argument name. Build those by merging a plain dict literal
    over a builder's result: `{**text_exact(...), "or": [...]}`.
    """

    operator: Literal["and", "or"]
    inner_exact_matches: dict[str, Any]
    lookup: Lookup
    aggregation: Literal["size"]
    distinct_by: str
    facets: list[Facet]


class _Common(TypedDict, total=False):
    match_exact: bool
    match_not: bool
    regex: bool
    regex_options: str
    operator: Literal["and", "or"]
    inner_exact_matches: dict[str, Any]
    lookup: Lookup
    aggregation: Literal["size"]
    distinct_by: str
    facets: list[Facet]


# ---------------------------------------------------------------------------
# Filter-criterion shapes (one per filter type)
# ---------------------------------------------------------------------------


class TextFilterDict(_Common):
    type: Literal["text"]
    key: KeyType
    value: str


class NumberRangeDict(TypedDict, total=False):
    min: float
    max: float
    included: bool


class NumberFilterDict(_Common):
    type: Literal["number"]
    key: KeyType
    value: float | int | NumberRangeDict


class DateRangeDict(TypedDict, total=False):
    min: str
    max: str
    included: bool


class DateFilterDict(_Common):
    type: Literal["date"]
    key: KeyType
    value: str | DateRangeDict


class SelectionFilterDict(_Common):
    type: Literal["selection"]
    key: KeyType
    value: str | list[str]


class BooleanFilterDict(_Common):
    type: Literal["boolean"]
    key: KeyType
    value: bool


class GeoFilterDict(_Common):
    type: Literal["geo"]
    key: KeyType
    value: dict[str, Any]  # GeoJSON geometry
    bucket: NotRequired[int]


class TypeFilterDict(_Common):
    type: Literal["type"]
    value: str


Criterion = (
    TextFilterDict
    | NumberFilterDict
    | DateFilterDict
    | SelectionFilterDict
    | BooleanFilterDict
    | GeoFilterDict
    | TypeFilterDict
)


# ---------------------------------------------------------------------------
# text
# ---------------------------------------------------------------------------


def text_any(key: KeyType, **common: Unpack[CommonKwargs]) -> TextFilterDict:
    """Field has a non-empty value."""
    return {"type": "text", "key": key, "value": "*", **common}


def text_none(key: KeyType, **common: Unpack[CommonKwargs]) -> TextFilterDict:
    """Field is empty or absent."""
    return {"type": "text", "key": key, "value": "", **common}


def text_exact(
    key: KeyType, value: str, **common: Unpack[CommonKwargs]
) -> TextFilterDict:
    """Exact (case-sensitive) match."""
    return {"type": "text", "key": key, "value": value, "match_exact": True, **common}


def text_contains(
    key: KeyType, value: str, **common: Unpack[CommonKwargs]
) -> TextFilterDict:
    """Case-insensitive substring match (default text behaviour)."""
    return {"type": "text", "key": key, "value": value, **common}


def text_contains_not(
    key: KeyType, value: str, **common: Unpack[CommonKwargs]
) -> TextFilterDict:
    """Field does NOT contain the substring."""
    return {"type": "text", "key": key, "value": value, "match_not": True, **common}


def text_regex(
    key: KeyType, pattern: str, options: str = "", **common: Unpack[CommonKwargs]
) -> TextFilterDict:
    """Regular expression match. `options`, e.g. "i" for case-insensitive."""
    return {
        "type": "text",
        "key": key,
        "value": pattern,
        "regex": True,
        "regex_options": options,
        **common,
    }


# ---------------------------------------------------------------------------
# date
# ---------------------------------------------------------------------------


def date_any(key: KeyType, **common: Unpack[CommonKwargs]) -> DateFilterDict:
    """Field has a non-empty value."""
    return {"type": "date", "key": key, "value": "*", **common}


def date_none(key: KeyType, **common: Unpack[CommonKwargs]) -> DateFilterDict:
    """Field is empty or absent."""
    return {"type": "date", "key": key, "value": "", **common}


def date_exact(
    key: KeyType, value: str, **common: Unpack[CommonKwargs]
) -> DateFilterDict:
    """`value` is a full timestamp ("2022-04-14T15:00:00") or a bare date
    ("2022-04-14"), interpreted as that whole calendar day."""
    return {"type": "date", "key": key, "value": value, **common}


def date_min_included(
    key: KeyType, min: str, **common: Unpack[CommonKwargs]
) -> DateFilterDict:
    """Value is >= min (inclusive)."""
    return {
        "type": "date",
        "key": key,
        "value": {"min": min, "included": True},
        **common,
    }


def date_max_included(
    key: KeyType, max: str, **common: Unpack[CommonKwargs]
) -> DateFilterDict:
    """Value is <= max (inclusive)."""
    return {
        "type": "date",
        "key": key,
        "value": {"max": max, "included": True},
        **common,
    }


def date_in_between(
    key: KeyType, min: str, max: str, **common: Unpack[CommonKwargs]
) -> DateFilterDict:
    """Value is between min and max (inclusive)."""
    return {"type": "date", "key": key, "value": {"min": min, "max": max}, **common}


# ---------------------------------------------------------------------------
# number
# ---------------------------------------------------------------------------


def number_exact(
    key: KeyType, value: float, **common: Unpack[CommonKwargs]
) -> NumberFilterDict:
    """Value is exactly equal."""
    return {"type": "number", "key": key, "value": value, **common}


def number_min_included(
    key: KeyType, min: float, **common: Unpack[CommonKwargs]
) -> NumberFilterDict:
    """Value is >= min (inclusive)."""
    return {
        "type": "number",
        "key": key,
        "value": {"min": min, "included": True},
        **common,
    }


def number_max_included(
    key: KeyType, max: float, **common: Unpack[CommonKwargs]
) -> NumberFilterDict:
    """Value is <= max (inclusive)."""
    return {
        "type": "number",
        "key": key,
        "value": {"max": max, "included": True},
        **common,
    }


def number_in_between(
    key: KeyType, min: float, max: float, **common: Unpack[CommonKwargs]
) -> NumberFilterDict:
    """Value is between min and max (inclusive)."""
    return {"type": "number", "key": key, "value": {"min": min, "max": max}, **common}


# ---------------------------------------------------------------------------
# selection
# ---------------------------------------------------------------------------


def selection_any(key: KeyType, **common: Unpack[CommonKwargs]) -> SelectionFilterDict:
    """Field has a non-empty value."""
    return {"type": "selection", "key": key, "value": "*", **common}


def selection_none(key: KeyType, **common: Unpack[CommonKwargs]) -> SelectionFilterDict:
    """Field is empty or absent."""
    return {"type": "selection", "key": key, "value": "", **common}


def selection_exact(
    key: KeyType, values: str | list[str], **common: Unpack[CommonKwargs]
) -> SelectionFilterDict:
    """Field equals any of the given values. Also the recommended matcher
    for IDs/identifiers — a list of values is an OR of exact matches."""
    return {
        "type": "selection",
        "key": key,
        "value": values,
        "match_exact": True,
        **common,
    }


def selection_contains(
    key: KeyType, value: str, **common: Unpack[CommonKwargs]
) -> SelectionFilterDict:
    """Field contains the substring."""
    return {"type": "selection", "key": key, "value": value, **common}


def selection_contains_not(
    key: KeyType, value: str, **common: Unpack[CommonKwargs]
) -> SelectionFilterDict:
    """Field does NOT contain the substring."""
    return {
        "type": "selection",
        "key": key,
        "value": value,
        "match_not": True,
        **common,
    }


# ---------------------------------------------------------------------------
# boolean
#
# The doc's filter-type table also lists `any`/`none` matchers for boolean,
# but the boolean section's value format is only `true`/`false` and there's
# no worked example for `any`/`none` — skipped here rather than guessed.
# Add `boolean_any`/`boolean_none` if you confirm the actual trigger shape
# against a real deployment.
# ---------------------------------------------------------------------------


def boolean_exact(
    key: KeyType, value: bool, **common: Unpack[CommonKwargs]
) -> BooleanFilterDict:
    """Field equals value exactly. A `False` value is treated as optional
    automatically by the API (also matches entities where the field is
    absent)."""
    return {"type": "boolean", "key": key, "value": value, **common}


# ---------------------------------------------------------------------------
# geo
# ---------------------------------------------------------------------------


def geo(
    key: KeyType,
    geometry: dict[str, Any],
    bucket: int | None = None,
    **common: Unpack[CommonKwargs],
) -> GeoFilterDict:
    """Matches entities whose point lies inside the GeoJSON geometry.
    `geo` is the only matcher for this filter type, so there's no
    per-matcher suffix. `bucket` subdivides the geometry into a grid of
    that many cells and returns one representative entity per cell plus a
    `bucket_count`, for map clustering."""
    result: GeoFilterDict = {"type": "geo", "key": key, "value": geometry, **common}
    if bucket is not None:
        result["bucket"] = bucket
    return result


# ---------------------------------------------------------------------------
# type
#
# Same caveat as boolean: the doc's table lists `any`/`none` matchers for
# `type` too, but only `exact` (a single entity type string) has a worked
# example. For multiple types, use `selection_exact("type", [...])` — see
# the doc's "Type" section — rather than a `type_*` builder.
# ---------------------------------------------------------------------------


def type_exact(value: str, **common: Unpack[CommonKwargs]) -> TypeFilterDict:
    """Restrict the search to one entity type. Every request body needs
    exactly this or a `selection_exact("type", [...])` criterion."""
    return {"type": "type", "value": value, **common}
