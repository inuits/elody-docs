---
title: Import browser
---

# Import browser

Network-drive browsing for media import · Implemented by the import browser components

## When to use / when not
Selecting files/folders from mounted network drives for import. Not for local
uploads (dropzone).

## Anatomy
Two-pane modal (10px radius): left the [folder tree](./hierarchy-tree), right
a file list (table rows: checkbox · name · size · type · datum) with the list
header showing the current path as a breadcrumb pill. Footer: selection count
+ "Importeer {n} bestanden" commit + Annuleer.

## States
| State | Visual cue | Trigger |
|---|---|---|
| browsing | tree + list | open |
| loading dir | skeleton rows | folder click |
| selected | wash rows + count | checkboxes |
| importing | modal swaps to upload progress list | commit |
| drive error | inline alert row, retry link | mount fail |

<StoryEmbed id="components-importbrowser--default" todo />

## Behaviour & keyboard
Tree and list are separate tab stops; Space selects, Enter descends. Import
hands off to the [upload](./upload) progress anatomy.

## Accessibility
Modal `role="dialog"` "Importeer van netwerkschijf"; the path breadcrumb is a
`nav`; file checkboxes named by filename.

## Content & i18n
"Importeer {n} bestanden" / "Import {n} files" · "Kan schijf niet bereiken —
Probeer opnieuw" / "Cannot reach drive — Retry".

## Do & don't
Do preserve selection while browsing folders. Don't import silently on
double-click; don't flatten folder choice into a text path input.

## Related
[Upload](./upload) · [Hierarchy & folder trees](./hierarchy-tree) · [Modal](./modal)
