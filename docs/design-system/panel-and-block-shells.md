---
title: Panel & block shells
---

# Panel & block shells

The card that holds one region of a detail page, and the unboxed blocks that
group fields inside it.

<StoryEmbed id="entityelements-entityelementwindow--default" height="460px" />

## When to use

- Every region of a detail page: a panel of fields, a list of relations, a
  media viewer, a map.
- Grouping related fields inside a panel: use blocks, each with a short
  heading.

## When not to use

- **A box inside a block:** a panel holds blocks, a block holds rows. Never add
  a fourth bordered layer.
- **Stand-alone content outside a detail page:** use a [modal](./modal) or a
  plain page section.

## Anatomy

1. **Panel:** `--color-surface`, a `--color-border-panel` border,
   `--radius-card` corners, no shadow.
2. **Panel header:** a band in `--color-surface-panel-header`,
   `--panel-header-pad`, with a `--color-border-panel` line below. The title
   is a heading in `--text-panel-title`, `--color-text-panel-header`. The
   header can also hold a status, an edit button and an _Actions_
   [overflow menu](./overflow-menu), in that order.
3. **Panel body:** `--panel-body-pad`.
4. **Block:** an unboxed group inside the panel, `--block-pad-y` above and
   below, with a `--color-border-faint` hairline between blocks.
5. **Block heading:** `--text-table`, bold, body ink. It can carry a count
   [chip](./chip-and-badge) and a status. A collapse icon sits on the right.
6. **Expand button (optional):** a tab on the panel's outer edge, on a
   `--color-tag-neutral` fill, with an arrow. On a detail page with two
   columns it widens this panel's column to half the page; clicking it again
   restores the default split. It is set per panel in the configuration.

## Variants

| Variant | What it holds | Header |
|---|---|---|
| Fields panel | blocks of label and value rows | title, status, edit button, _Actions_ |
| Element panel | one list, viewer or map | title and a chevron that collapses the panel |
| In a preview | the same content without a card | none; an element panel's title becomes a block heading |

<StoryEmbed id="base-entityelementwrapper--default" height="300px" />

In a [preview panel](./preview-panel) the preview itself is the card: panels
inside it drop their border and header band. An element panel keeps its
title as a block heading.

## States

| State | What you see | Trigger |
|---|---|---|
| Block open | heading, then its rows; the icon shows two arrows pointing in | default |
| Block collapsed | heading only; the icon shows two arrows pointing out | click on the heading or its icon; can start collapsed by configuration |
| Panel collapsed | header only, with rounded corners; the chevron points down | click on the header or the chevron of an element panel |
| Expanded | the page's two columns split 50/50; the expand arrow flips | click on the expand button |

<StoryEmbed id="entityelements-entityelementwindow--states" height="340px" />
<StoryEmbed id="base-entityelementwrapper--collapsed" height="320px" />

The expand button on a detail page with two columns, before and after a
click:

<StoryEmbed id="entityelements-entitycolumn--default" height="380px" :width="1100" />
<StoryEmbed id="entityelements-entitycolumn--expanded" height="380px" :width="1100" />

Opening and collapsing animate the height.

## Keyboard & accessibility

- A fields panel is a `role="region"` named by its title.
- Headings follow the nesting: the panel title is an `h3`, a block heading an
  `h4`.
- The collapse icon of a block and the chevron of a panel are buttons, named
  by the block or panel title, with `aria-expanded`. Tab reaches them; Enter
  and Space open or collapse.
- The expand button is a button named _Expand_ or _Collapse_, with
  `aria-expanded`.
- The edit button and the _Actions_ menu in the header are buttons, reachable
  with Tab. See [overflow menu](./overflow-menu) for the menu's keys.

## Content

- Panel and block titles are short nouns: _Information_, _Description_,
  _Publication_.
- Don't repeat the panel title in its first block heading.

## Related

[Preview panel](./preview-panel) · [Field row](./field-row) ·
[Repeatable row group](./repeatable-row-group) ·
[Client theming](./client-theming)
