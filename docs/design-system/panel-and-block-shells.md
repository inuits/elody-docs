---
title: Panel & block shells
---

# Panel & block shells

The three chrome layers of a detail screen · Implemented by `EntityElementWindow.vue`

## When to use / when not
Every detail-screen region. Maximum nesting: panel → block heading → rows —
three chrome layers around a row, never a fourth bordered box.

## Anatomy
**PanelShell**: 8px card, 1px `--color-border-panel`, no shadow; accent-light
header (10/16px padding) with panel-header ink title (14px bold) + actions
slot. **BlockShell**: unboxed section inside a panel — 12.5px bold heading with
hairline. **SectionHeader**: full-width accent fill bar, white 14px bold — top-
level page sections. **StatusChip**: quality status (kwaliteitsstatus) chip in
the panel header; click opens an explanation popover (10px radius).

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | as above | — |
| dark-header client | white header ink | theme scope |
| status ok/warn/error | chip in success/warning/danger bg | data quality |
| popover open | overlay shadow, arrow to chip | click chip |

<StoryEmbed id="entityelements-entityelementwindow--default" todo />

## Behaviour & keyboard
Panels are landmarks, not accordions — no collapse on desktop. StatusChip is a
button; Escape closes its popover.

## Accessibility
Panel = `role="region"` + `aria-labelledby` its heading; heading levels
h2 (section) → h3 (panel) → h4 (block). Popover `role="dialog"` named
"Kwaliteitsstatus".

## Content & i18n
Panel titles are plural nouns ("Titels", "Personen"). Status copy:
"Volledig" / "Complete", "Onvolledig" / "Incomplete".

## Do & don't
Do reuse this exact chrome for previews and pickers. Don't shadow a panel;
don't nest a bordered box inside a block.

## Round 2 — expand & quality popover
Panels that support a wide view get an expand button (⤢, icon button in the
header actions slot, name "Vergroot paneel") opening the panel as a modal at
overlay elevation. The quality-status popover lists the failing fields as
links — clicking one closes the popover and focuses that field row
(jump-to-field). Empty panels may offer an action menu (labelled overflow) in
place of content, per the action-discovery ladder.

## Related
[Preview panel](./preview-panel) · [Client theming](./client-theming)
