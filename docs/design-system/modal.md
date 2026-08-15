---
title: Modal
---

# Modal

The base overlay dialog · Implemented by the Modals components

## When to use / when not
Pickers, wizards, true-loss confirmations. Not for field editing (inline), not
for group editing (in-place card), not for reversible deletes (toast + undo).

## Anatomy
Scrim `rgba(9,30,66,.45)`; dialog 10px radius, modal shadow, panel-shell
header with close cross, body, footer: commit rect right + "Annuleer" ghost
left of it.

## States
| State | Visual cue | Trigger |
|---|---|---|
| open | scrim, focus trapped | trigger |
| busy | commit spinner, footer locked | commit |
| error | inline `role="alert"` above footer | reject |

<StoryEmbed id="modals-basemodal--default" />

## Behaviour & keyboard
Escape closes (unless busy); focus trapped; on close focus returns to the
trigger. Backdrop click closes only pristine dialogs.

## Accessibility
`role="dialog"` + `aria-modal="true"`, named by its title. First focus on the
first interactive element, not the close cross.

## Content & i18n
Title = the task ("Kies persoon"), commit = the verb ("Voeg toe"), never
"OK". True-loss confirm: "Definitief verwijderen?" / "Delete permanently?".

## Do & don't
Do keep one commit per modal. Don't stack modals; don't use a modal where a
toast + undo suffices.

## Round 2 — footerless variant
Overlays whose only action is choosing (simple-search overlay, saved-search
pick) may drop the footer: Escape/scrim close, selection commits directly.
Footerless modals never contain destructive actions.

## Related
[Entity picker](./entity-picker) · [Feedback & undo](./feedback)
