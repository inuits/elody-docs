---
title: Import browser
---

# Import browser

Pick a folder on a network drive and start importing it.

<StoryEmbed id="components-importbrowser--folder-selected" height="440px" />

## When to use

- Importing a folder that already sits on a mounted network drive, such as a
  scanned batch or a magazine with its CSV or METS file.

## When not to use

- **Files on the user's own computer:** use [upload](./upload).

## Anatomy

1. **Folder list:** the drive's top-level folders as a
   [folder tree](./folder-tree). It scrolls when it is taller than three
   quarters of the window.
2. **Footer:** a full-width _Start import_ button that sticks to the bottom
   of the list. It stays disabled until a folder is selected.

The import browser is a field of a form: it sits in the form's dialog, under
any other fields that form has.

## Variants

| Variant | Lists | On _Start import_ |
|---|---|---|
| Folder import | folders on the drive | imports the selected folder |
| Magazine with CSV | magazine folders | imports the folder with its CSV file |
| Magazine with METS | magazine folders | checks the form's other fields first, then imports the folder with its METS file |

Which variant shows depends on the form's field type.

## States

| State | What you see | Trigger |
|---|---|---|
| Loading | a spinner instead of the list | opening |
| Folders | the folder tree; _Start import_ disabled | folders loaded |
| Folder selected | the folder's row highlighted; _Start import_ enabled | clicking a folder |
| No folders | _No import directories available_ | the drive has no folders |
| Started | a notification, then the import's job page | the import starts |
| Failed | an error notification with the reason | the import cannot start |

<StoryEmbed id="components-importbrowser--loading" height="200px" />
<StoryEmbed id="components-importbrowser--no-folders" height="180px" />

When the import starts, the form closes and the job page opens, so people can
follow the import there. If there is no job to open, the jobs list opens.

## Keyboard & accessibility

- _Start import_ is a native button: Tab reaches it, Enter or Space starts
  the import, and it is disabled until a folder is selected.
- Folders are selected and opened with the pointer; see the
  [folder tree](./folder-tree).

## Content

- Error messages name the folder and what is wrong: _Expected exactly 1 CSV
  file in {folder}, found {count}_.
- Translation keys: `import.start-import`, `import.no-directories`,
  `import.error-csv-count`.

## Related

[Folder tree](./folder-tree) · [Upload](./upload) · [Modal](./modal)
