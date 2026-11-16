---
title: Button
---

# Button

Runs an action straight away.

<StoryEmbed id="base-basebutton--variants" />

## When to use

- Any action that happens when it is clicked: save, open, export, delete.
- Pick the variant by the role of the action on the screen, not by how
  prominent you want it to look.

## When not to use

- **One main action with alternatives:** use a [split button](./split-button).
- **Several secondary actions:** put them in an [overflow menu](./overflow-menu).

## Variants

| Variant | Use for | Colour |
|---|---|---|
| `primary` | the one action a screen leads with (_Open record_) | client accent; follows the [client theme](./client-theming) |
| `commit` | writing a change (_Save_, confirm) | platform teal; never themed |
| `secondary` | everything alongside (_Cancel_) — the default | white with a border |
| `ghost` | dense toolbars and low-emphasis actions (_Show more_) | no border, muted ink |
| `danger` | destructive actions (_Delete_) | red |

Two sizes: `md` (default) and `sm`, for toolbars, panel headers and menus.

Keep one `primary` or `commit` button per group of actions.

## Anatomy

1. **Container:** a rectangle. `secondary` uses `--radius-input`; the others
   use `--radius-button`. Padding comes from `--button-md-padding` or
   `--button-sm-padding`.
2. **Icon (optional):** before the label, `--button-gap` apart. An icon-only
   button uses `--button-md-padding-icon` or `--button-sm-padding-icon`.
3. **Label:** bold, `--text-button-md` or `--text-button-sm`, on one line.
4. **Reason icon (optional):** a help icon after the label on a disabled
   button; its tooltip says why the action is unavailable.

## States

| State | What you see | Trigger |
|---|---|---|
| Resting | per variant | — |
| Hover | darker or washed fill; `primary` also gets an accent shadow | pointer |
| Focus | `--focus-ring-width` ring in `--color-focus-ring` | keyboard |
| Pressed | the button shrinks slightly | press |
| Loading | disabled look; a spinner replaces the icon (or covers the label) and the width stays the same | async action |
| Disabled | disabled ink on a neutral fill | action unavailable |
| Disabled with a reason | disabled look plus a help icon with a tooltip | action unavailable, with an explanation |

<StoryEmbed id="base-basebutton--states" />

In narrow containers a button with an icon hides its label visually and keeps
it as the accessible name, so it becomes icon-only. Buttons that must always
show their label opt out of this.

## Keyboard & accessibility

- It is a native `<button type="button">`: Tab reaches it, Enter and Space run
  it.
- **Icon-only buttons need a name:** a label (hidden visually) or an
  `aria-label` such as _Edit field_.
- A **disabled** button is skipped by Tab.
- A **disabled button with a reason** stays reachable by Tab
  (`aria-disabled="true"`), so keyboard and screen-reader users can find out
  why. Clicks do nothing.
- A **loading** button is disabled and has `aria-busy="true"`.

<StoryEmbed id="base-basebutton--icon-only" />

## Content

- Start with a verb, in sentence case: _Save_, _Add person_, _Open record_.
- Say what happens, not what the control is: _Export_, not _Export button_.
- Keep labels short; they never wrap.
- A disabled reason says what to do: _Select at least one item first_.

## Related

[Split button](./split-button) · [Overflow menu](./overflow-menu) ·
[Colour](./colour) · [Accessibility](./accessibility)
