# Rounded Counts

For performance reasons, collection-api can cap how far it counts the total
number of matches for a listing or [filter](/services/elody-collection/advanced-filtering.md)
request. Counting every match in a large collection means scanning the full
index, which gets expensive on big result sets, so once a cap is configured
the count query stops early after passing it and returns `cap + 1` as a
sentinel meaning "more than `cap`". By default no cap is set, so
collection-api always returns the exact count.

The PWA never shows that raw sentinel. It formats any capped count as
`<cap>+` (for example `1,000+`) and makes the number clickable so a user can
fetch the exact total on demand — that request sets `exact_count=1` on the
filter call, which tells collection-api to skip the cap and count to
completion (see [Count limits](/services/elody-collection/advanced-filtering.md#count-limits)).

## Enabling it

The cap is opt-in and only works if it's configured the same way on both
sides:

- **collection-api**: set the `LISTING_COUNT_CAP` environment variable to the
  desired cap (an integer). Leave it unset (or `0`) to keep counting exact.
- **GraphQL service (baseGraphql)**: set `LISTING_COUNT_CAP` to the same
  value. The GraphQL layer exposes it to the frontend through the app-config
  endpoint.

The PWA reads the cap from that app-config response at startup and uses it to
decide when a count is capped and how to format it. If `LISTING_COUNT_CAP` is
missing on the GraphQL service, the frontend falls back to a default of
`1000`, which can silently disagree with collection-api's actual cap — set the
variable on both services to the same value.
