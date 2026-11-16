---
title: Upload
---

# Upload

A drop zone that collects files, with one row per file showing each step of
its upload.

<StoryEmbed id="components-dropzone--progress" />

## When to use

- Adding media files, a CSV or an Excel file in an upload form or import
  flow.
- Uploading several files at once, where people need to see which file is
  where in the process.

## When not to use

- **Picking a record that already exists:** use an
  [autocomplete](./autocomplete) or [dropdown](./dropdown).
- **Pasting text or a link:** use a [text input](./text-input).

## Anatomy

1. **Zone:** a dashed `--color-border-dashed` border, `--radius-card`
   corners and a white fill. Its minimum
   height is `--dropzone-height-small`, `--dropzone-height-normal` (default) or
   `--dropzone-height-big`; it grows with its rows.
2. **Label:** a real button with the field's prompt, such as _Drag your
   files, or click here to add your files_. Centred while the zone is empty;
   above the rows once it has files.
3. **File row:** `--color-border-subtle` border; a file icon tile, the file
   name, its size in `--color-text-light`, one status glyph per step, and a
   remove button (trash icon). Rows are sorted by file name.
4. **Status glyph:** a small round step marker; its icon and colour show the
   status (see [States](#states)). In a row it shows no text; its tooltip
   gives the status.
5. **Message lines (optional):** warnings on `--color-warning-bg` and errors
   on `--color-danger-bg` in `--color-danger-ink`, as a bulleted list under
   the row.

Outside the zone, the upload form shows a banner while files upload:
_{done} of {total} uploaded_ with a progress bar for the whole batch. Some
flows also show the batch steps as labelled status pills.

## Variants

| Variant | Steps in each row | Used for |
|---|---|---|
| Media upload | validate, prepare, upload | media files, alone or with a CSV |
| Validation file | validate | a CSV or Excel file that is checked first (dry run) |
| Reorder upload | upload | uploads that only reorder existing records |

| Step | Tooltips |
|---|---|
| Validate | _No CSV_, _Validating CSV_, _OK_, _Error in CSV_ |
| Prepare | _No mediafiles_, _Loading mediafiles_, _OK_, _Mismatch between mediafiles and CSV_ |
| Upload | _Not uploading_, _Uploading_, _Uploaded_, _Something went wrong while uploading_ |

A media file's validate step turns complete as soon as the file is added.
There is no percentage bar per file; a row shows which step a file is in.

## States

**Zone**

| State | What you see | Trigger |
|---|---|---|
| Empty | dashed zone, label centred | — |
| Drag over | `--color-accent` border, `--color-accent-wash` fill | dragging files over the zone |
| With files | label at the top, one row per file | files added |
| Full | no change; drops and clicks are ignored | the maximum number of files is reached |
| Locked | no change; drops and clicks are ignored | the upload has finished |

**Step glyph**

| State | What you see | Trigger |
|---|---|---|
| Empty | outline circle on grey | step not started |
| Loading | spinning cog on teal | step in progress |
| Complete | green check on light green | step done |
| Failed | ban icon on red; the row gets a `--color-danger` border and an error list | step failed |
| Incomplete | image-plus icon on orange | mediafiles missing (not used in file rows) |
| Paused | pause icon on orange | upload paused (not used in file rows) |

<StoryEmbed id="base-baseprogressstep--all-statuses" />

Files beyond the maximum number are removed again straight away, without a
message. Removing a file makes room again. A failed file keeps its row.

## Keyboard & accessibility

| Key | Action |
|---|---|
| Tab | reaches the zone's label, then each row's remove button |
| Enter / Space | on the label: opens the file dialog; on a remove button: removes that file |

- Dragging is optional: the label is a native `<button>`, and clicking an
  empty part of the zone also opens the file dialog. The dialog filters on
  the accepted file types.
- Each row has a `role="progressbar"` named by the file name. Its value is
  the number of steps done, and its `aria-valuetext` is the status of the
  last step that changed, such as _Uploading_.
- A row's error list is a `role="alert"`.
- The remove button is named _Remove file_; the name does not include the
  file name.
- The status glyphs carry their status only in a `title` tooltip, which
  pointer users see on hover.
- The loading cog keeps spinning when reduced motion is requested.
- The upload banner is a `role="status"`, so each new count is announced.

## Content

- The label says both ways in: drag, or click. Use the field's configured
  prompt, such as _Drag your files, or click here to add your files_.
- Error lines name the file or row and the problem: _scan-003.tiff is
  missing_, _2 row(s) could not be updated, see the details on the file_.
- Translation keys: `upload-fields.labels.*`, `upload-fields.errors.*`,
  `upload-fields.remove-file`, `upload-fields.uploaded-of` and
  `actions.progress-steps.*`.

## Related

[Loading](./loading) · [Button](./button) · [Tooltip](./tooltip) ·
[Accessibility](./accessibility)
