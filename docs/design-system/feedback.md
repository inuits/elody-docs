---
title: Feedback & undo
---

# Feedback & undo

Toast, undo-over-confirm, audit entry · Implemented by the notification components + audit trail

## When to use / when not
All mutation feedback. Confirmation modals only for true, unrecoverable loss;
everything else executes immediately and offers undo.

## Anatomy
**Toast**: inverted surface `#172B4D`, white 12.5px text, 10px radius, toast
shadow, bottom-left; optional action link ("Ongedaan maken", accent-on-inverted
`#7DE3EA`); auto-dismisses 6s (with action: 8s), hover pauses. **AuditEntry**:
trail row — uppercase eyebrow (10.5px, .4px tracking) with actor + timestamp,
12.5px change line (field: old → new).

## States
| State | Visual cue | Trigger |
|---|---|---|
| status toast | inverted, `role="status"` | success/undoable action |
| error toast | danger accent bar, `role="alert"`, no auto-dismiss | failure |
| undo pending | countdown implicit (8s) | destructive-ish action |
| undone | follow-up toast "Hersteld" | undo click |
| audit resting | eyebrow + change line | history panel |

<StoryEmbed id="components-toast--undo" todo />

## Behaviour & keyboard
Undo is a real button reachable via F6/landmark cycling before dismiss; Escape
dismisses the focused toast. Undo restores the exact prior value and writes
its own audit entry.

## Accessibility
Status toasts `role="status"` (polite), errors `role="alert"`. Toasts never
trap focus. Audit trail is a `role="log"`.

## Content & i18n
"{Ding} verwijderd — Ongedaan maken" / "{Thing} removed — Undo" ·
"Hersteld" / "Restored" · "Opslaan mislukt" / "Saving failed".

## Do & don't
Do pause dismissal on hover/focus. Don't stack more than 3 toasts; don't use
a toast for validation errors (those belong at the field).

## Related
[Selection action bar](./selection-action-bar) · [Repeatable row group](./repeatable-row-group)
