---
title: Comments
---

# Comments

Threads on records for cataloguer coordination · Implemented by the comment components

## When to use / when not
Human notes *about* the record (questions, review remarks) — never metadata.
The cataloguer note surface (`--color-surface-note`) stays separate: notes are
record content, comments are conversation.

## Anatomy
Panel-shell block: thread rows — author (12.5px bold) + timestamp (11px
subtle) eyebrow, comment body 12.5px, actions on hover (Beantwoord, Los op);
replies indent one level (12px) with a left hairline; resolved threads
collapse to one muted line with a check. Composer at bottom: textarea + commit
"Plaats" rect.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | threads newest-first | — |
| composing | textarea focused, Plaats enabled when dirty | click |
| reply | indented composer under thread | Beantwoord |
| resolved | collapsed muted line + check | Los op |
| deleted | row gone; toast + Ongedaan maken | own comment |

<StoryEmbed id="entityelements-comments-commentitem--open-thread-with-replies" />

## Behaviour & keyboard
Ctrl+Enter posts. Resolve is undoable (chip on the collapsed line). Only own
comments are deletable; resolve is open to all editors.

## Accessibility
The block is a `role="log"` "Opmerkingen"; new comments announce politely;
action buttons carry the author+time in their name.

## Content & i18n
"Plaats" / "Post" · "Beantwoord" / "Reply" · "Los op" / "Resolve" ·
"Opgelost" / "Resolved".

## Do & don't
Do keep one thread level (no nested replies of replies). Don't mix comments
into the audit trail; don't use comments for field values.

## Related
[Feedback & undo](./feedback) · [Panel & block shells](./panel-and-block-shells)
