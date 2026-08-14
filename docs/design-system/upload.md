---
title: Upload
---

# Upload

Dropzone + per-file progress, end to end · Implemented by the dropzone family, `BaseProgressStep.vue`, `ProgressBar.vue`, upload status banner

## When to use / when not
Media upload everywhere (detail panels, import). Not for tiny single-value
file fields inside forms (those use a compact input variant of this spec).

## Anatomy
**Dropzone**: dashed 2px `--color-border-dashed` border, 8px radius, pale
surface; centred copy "Sleep bestanden hierheen of <u>blader</u>" (browse is a
real button). **File list**: one row per file — name + size, thin ProgressBar
(commit teal fill), per-file state glyph, cancel ✕. **Status banner**: panel-
top strip summarising "{n} van {m} geüpload"; **BaseProgressStep** shows the
pipeline (uploaden → verwerken → klaar) per file where relevant.

## States
| State | Visual cue | Trigger |
|---|---|---|
| idle | dashed zone | — |
| dragover | accent border + wash | drag |
| uploading | per-file bar + % | files |
| processing | step 2 active (spinner) | server |
| done | green check per file, banner success | complete |
| error | danger row + "Opnieuw" retry link, others continue | per-file fail |
| rejected | toast: type/size reason | invalid file |

<StoryEmbed id="components-uploadinterfacedropzone--mediafiles-upload" />

## Behaviour & keyboard
Browse opens the file dialog; the zone is focusable and Enter opens it too.
Per-file cancel aborts only that file. Failures never abort the batch.

## Accessibility
Zone is a button "Upload bestanden"; per-file progress uses
`role="progressbar"` with `aria-valuenow`; the banner is `role="status"`;
errors `role="alert"` per row.

## Content & i18n
"Sleep bestanden hierheen of blader" / "Drag files here or browse" ·
"{n} van {m} geüpload" / "{n} of {m} uploaded" · "Opnieuw" / "Retry".

## Do & don't
Do keep per-file progress visible (no single aggregate bar only). Don't block
the page during upload; don't clear failed rows automatically.

## Related
[Media viewer](./media-viewer) · [Import browser](./import-browser) · [Feedback & undo](./feedback)
