---
title: Preview panel
---

# Preview panel

The panel a list opens beside itself instead of navigating · Implemented by `PreviewWrapper.vue`

## When to use / when not
When a query declares a `previewComponent` for an entity type (ColumnList,
MediaViewer, Map, History). Not as a general sidebar — it exists only next to
a list.

## Anatomy
Composes the shared [panel shell](./panel-and-block-shells): accent-light
header with the entity title, actions right — optional **Open detailpagina**
(primary rect button) + close cross. Body per type: columnlist = label/value
rows with optional thumbnail on top; media = viewer; map = map.

## States
| State | Visual cue | Trigger |
|---|---|---|
| closed | list full width | default (unless openByDefault) |
| open | split per container tier | eye / row click |
| loading | centered spinner | fetch |
| columnlist | dl rows, em-dash for empty values | type |
| media | viewer with toolbar | type |

<StoryEmbed id="components-previewwrapper--column-list" todo />

## Behaviour & keyboard
Opening moves focus to the panel header; Escape closes and returns focus to
the originating row. Coverage "one": a new row replaces the panel content.

## Accessibility
Panel is `role="complementary"` named by the entity title. Close: accessible
name "Sluit preview". Content swaps announce via `aria-live="polite"`.

## Content & i18n
"Open detailpagina" / "Open detail page" · "Sluit preview" / "Close preview" ·
empty value: "—".

## Do & don't
Do keep the panel chrome identical to detail-screen panels. Don't stack two
previews; don't put destructive actions in the header.

## Related
[Entity list element](./entity-list-element) · [Panel & block shells](./panel-and-block-shells) · [Media viewer](./media-viewer)
