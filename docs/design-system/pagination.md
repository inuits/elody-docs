---
title: Pagination
---

# Pagination

Moves through the pages of a long list.

<StoryEmbed id="base-basepagination--default" />

## When to use

- Every list with more than one page of results. The pager sits in the list's
  results band, after the result count.
- Choosing how many results a page shows, with the page size control next to
  the sort.

## When not to use

- **A list that fits on one page:** the pager hides itself.
- **Views that show everything at once,** such as a map or a grouped table:
  they do not page.
- **The total number of results:** the count at the start of the band shows
  it. The pager only shows the number of pages.

## Anatomy

1. **First and previous page:** « and ‹ icon buttons, `--pager-button-size`
   square, `--radius-input` corners, with the row-hover fill on hover.
2. **Page box:** _page_ followed by a number field, `--pager-input-width` wide,
   bold and centred.
3. **Page count:** _of 12_. A capped count reads _of 50+_ with a help icon.
4. **Next and last page:** › and » icon buttons, as in 1.

The parts are `--pager-gap` apart, in `--text-label` and
`--color-text-panel-header`.

5. **Page size:** a separate dropdown in the list toolbar that reads
   _Items: 20_.

## Variants

| Variant | What changes |
|---|---|
| Default | _page [n] of N_ |
| Capped | _of 50+_ and a help icon; the tooltip explains that there are more pages |
| Small screen | the pager takes its own full-width row in the band; the page size becomes a row of chips in the sort sheet |

## States

| State | What you see | Trigger |
|---|---|---|
| Middle page | every step available | — |
| First page | « and ‹ faded and disabled | on page 1 |
| Last page | › and » faded and disabled | on the last page |
| Capped | _of 50+_ with a help icon | there are more results than the platform counts |
| Out of range | the box shows the current page again | Enter, or leaving the box, with a number outside the pages |
| One page | no pager | all results fit on one page |
| No page size | no page size control | all results fit on the smallest page size |
| Page size changed | back to page 1 | a new page size is chosen |

<StoryEmbed id="base-basepagination--states" />

With a capped count, the pager stops at the last counted page. Once the exact
total is shown from the result count, the pager offers all pages.

## Keyboard & accessibility

| Key | Effect |
|---|---|
| Tab | moves through first, previous, page box, next and last; disabled buttons are skipped |
| Enter / Space | on a button: goes to that page |
| Enter | in the page box: goes to the typed page |

Leaving the page box also goes to the typed page.

- The pager is a `<nav>` named _Pagination_.
- The buttons are named _First page_, _Previous page_, _Next page_ and
  _Last page_. At the edges they are real disabled buttons.
- The page box is named _Page number_.
- The page size dropdown has a visually hidden label, _Results per page_. On a
  small screen the chips are a group with that name, and the chosen chip is
  `aria-pressed="true"`.

## Content

- The pager reads _page 5 of 12_; _page_ and _of_ are lowercase.
- The page size reads _Items: 20_.
- Translation keys: `pagination.*` and `library.items`.

## Related

[Dropdown](./dropdown) · [Tooltip](./tooltip) · [Chip & badge](./chip-and-badge) ·
[Accessibility](./accessibility)
