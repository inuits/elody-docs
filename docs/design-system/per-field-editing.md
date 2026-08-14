---
title: Per-field editing
---

# Per-field editing

The system's core pattern: edit scope = save scope = validation scope · Implemented by `MetadataWrapper.vue` + `useBlockEditor.ts`

## When to use / when not
All metadata editing. The pattern replaces the v1 whole-form edit mode; there
is no page-level "Bewerk" toggle anywhere.

## Anatomy
Three scopes, one rule each: **field** (field row + inline editor — saves
alone), **group** (group form card — one gesture opens all, saves as one),
**row** (repeatable row — each row is a field). Editability is signalled
structurally: dashed underline + hover wash + pencil; empty non-required
values at 45% opacity. Showing empty fields behind a toggle was evaluated and
rejected as the default.

## States
| State | Visual cue | Trigger |
|---|---|---|
| readable | plain values, dashed underlines | default |
| one field editing | that row only | click value |
| one group editing | that card only | click any member |
| saving | spinner at the edited scope | commit |
| conflict | error at the edited scope, others untouched | server |

<StoryEmbed id="metadata-metadatawrapper--read-only" />

## Behaviour & keyboard
Only one scope edits at a time; opening a second commits nothing and prompts
nothing — the first stays open if dirty. Validation never crosses the scope
boundary.

## Accessibility
Every editable value is a named button; state changes announce at the scope
that changed (`role="alert"` errors, `role="status"` saves).

## Content & i18n
See [field row](./field-row) and [inline editor](./inline-editor) for copy.

## Do & don't
Do keep save latency visible at the scope. Don't add a global save bar; don't
validate untouched fields.

## Related
[Field row](./field-row) · [Group form card](./group-form-card) · [Repeatable row group](./repeatable-row-group)
