---
title: Folder tree
---

# Folder tree

Folders and their subfolders as a tree, to pick one folder.

<StoryEmbed id="components-hierarchytree--default" height="340px" />

## When to use

- Picking one folder from a folder structure, such as a network drive in the
  [import browser](./import-browser).

## When not to use

- **Records and their relations:** show them as a list on the record's page.
- **A flat list of choices:** use a [dropdown](./dropdown).

## Anatomy

1. **Row:** a dot, the folder name in bold and a light bar at the right
   edge. Clicking the row selects the folder.
2. **Disclosure:** a chevron at the end of the row, only on folders that have
   subfolders. It points down while closed and up while open.
3. **Subfolders:** indented under their folder, joined to it by thin
   connector lines.

## Variants

There is one tree. Each level loads its subfolders the first time it opens.

<StoryEmbed id="components-hierarchytree--collapsed" height="220px" />

## States

| State | What you see | Trigger |
|---|---|---|
| Closed | chevron down, subfolders hidden | — |
| Loading | loading rows under the folder | opening a folder for the first time |
| Open | chevron up, subfolders indented below | clicking the chevron |
| Hover | dot, folder name and the bar at the row's right edge turn blue | pointer |
| Selected | row filled with the selection colour | clicking the row |

Opening a folder again reloads its subfolders. Selecting a folder does not
open it, and opening a folder does not select it.

## Keyboard & accessibility

- Rows and chevrons respond to the pointer.
- The selected folder is shown with colour alone.

## Content

- Folder names show exactly as they are on the drive.

## Related

[Import browser](./import-browser) · [Loading](./loading)
