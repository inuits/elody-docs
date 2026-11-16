---
title: Navigation chrome
---

# Navigation chrome

The fixed navigation around every page: the nav rail, the page header's
breadcrumb and the record stepper.

<StoryEmbed id="navigation-navrail--closed" height="420px" />

## When to use

- The nav rail is on every page; its items come from the tenant's main menu.
- The breadcrumb and record stepper sit in the page header and fill
  themselves from where people came from.

## When not to use

- **Switching views within a page:** use tabs or a
  [toggle group](./toggle).
- **Actions on the page or record:** put them in the header's
  [split button](./split-button) or [overflow menu](./overflow-menu), not in
  the rail.

## Anatomy

**Nav rail**

1. **Top:** the logo (`--nav-rail-logo`, links home), an environment chip
   outside production, and the mode button that keeps the menu open or
   collapses it.
2. **Items:** an icon per item (`--nav-rail-item-width` by
   `--nav-rail-item-height`, `--nav-rail-item-radius`), an optional count
   badge, and the label once the menu is open. A group has sub-items.
3. **Account:** the user as a circle with their initials
   (`--nav-rail-avatar-size`) and _Log out_; _Log in_ when signed out.

Closed, the rail is `--nav-rail-width` wide. Kept open it is
`--nav-flyout-width` wide and the page moves aside by the same width, so
nothing is covered.

**Page header**

4. **Breadcrumb:** grey pill capsules (`--crumb-pad`, `--radius-pill`)
   joined by a light ›. With more than one earlier page, a counted … capsule
   opens the list of earlier pages. The previous page is a link; the current
   page ends the trail, unlinked and never cut off, after its type badge when
   it has one.
5. **Record stepper:** _‹ 3 of 128 ›_ in one capsule (`--stepper-pad`), with
   ghost icon buttons (`--stepper-button-size`). It shows on a record opened
   from a list and steps through that list.
6. **Header extras:** the language [dropdown](./dropdown), the tenant
   dropdown where tenants are on, and the search.

## Variants

| Variant | Where | Behaviour |
|---|---|---|
| Closed rail | default from 48rem up | icons only; the label shows in a [tooltip](./tooltip) at once; a group opens a flyout beside its icon |
| Open rail | after _Keep menu open_ | icons with labels; groups open inline under their row |
| Top bar and drawer | below 48rem | a top bar (`--mobile-top-bar-height`) with a menu button, logo and search; the menu opens as a `--nav-drawer-width` drawer over a dimmed page |

<StoryEmbed id="navigation-navrail--open" height="420px" />
<StoryEmbed id="navigation-navrail--mobile-drawer" height="480px" />

The mode is remembered per browser. In the drawer, the language and tenant
dropdowns sit above the account rows, and a dot on the menu button shows when
an item has a badge.

A group's flyout (`--menu-padding`, at least `--menu-min-width`) lists the
group name as a small title and the sub-items below it. When the group has a
page of its own, the title links to it. It closes on Escape, a click outside,
picking a sub-item or navigating.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | muted icon and label | — |
| Hover | `--color-accent-highlight` fill | pointer |
| Current | `--color-accent-light` fill, `--color-accent-ink` | the current page; a group is current when one of its sub-items is |
| Group open | chevron down (open rail) or flyout (closed rail) | clicking the group |
| Badge | count after the label, or on the icon's corner when closed; _99+_ above 99 | the item has new things |
| Stepper at an end | that arrow disabled | first or last record of the list |
| Earlier pages | list of earlier pages under the … capsule | clicking the capsule |

<StoryEmbed id="components-breadcrumb--history-open" height="260px" />

Only one group is open at a time. Clicking a group with a page of its own in
the open rail also goes to that page.

## Keyboard & accessibility

- The rail is a `<nav>` named _Main navigation_. Items are links with
  `aria-current="page"` on the current one; items that open a form are
  buttons.
- Groups are disclosure buttons with `aria-expanded` and `aria-controls`. The
  flyout holds plain links, so Tab moves through them in order. Escape closes
  it and returns focus to the group.
- Closed, each item keeps its label as hidden text, so its name is the label
  plus the badge count.
- The mode button is named after what it does: _Keep menu open_ or _Collapse
  menu_.
- In the drawer, focus moves to the close button on open and back to the menu
  button on close. Escape closes the drawer. The page behind it, and the
  closed drawer, are `inert`.
- The breadcrumb is a `<nav>` named _Breadcrumb_; the current page has
  `aria-current="page"`. The … capsule is a button with `aria-expanded`,
  named _Earlier pages_.
- The stepper is a group named _Position in the result list_. Its arrows are
  named _Open previous_ and _Open next_, and Alt + ← or → steps outside text
  fields. The position is `role="status"`.

## Content

- Menu labels are short nouns for the destination: _Library_, _Media_.
- The stepper reads _{index} of {total}_.
- Translation keys: `navigation.*` and `entity-navigation.*`.

## Related

[Tooltip](./tooltip) · [Dropdown](./dropdown) · [Overflow menu](./overflow-menu) ·
[Chip & badge](./chip-and-badge) · [Accessibility](./accessibility)
