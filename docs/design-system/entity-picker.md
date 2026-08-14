---
title: Entity picker
---

# Entity picker

Search-and-pick overlay for relation values · Implemented by the relation/search modal components

## When to use / when not
Setting a relation field (auteur, uitgever, onderwerp). Not for enum values
(inline select) or free text.

## Anatomy
Modal on scrim: panel-shell header ("Kies {type}"), search pill (14px radius,
search icon), result rows (title bold + badges + secondary line, count chip
in header), footer with "Voeg toe" commit + "Annuleer".

## States
| State | Visual cue | Trigger |
|---|---|---|
| open | scrim + modal shadow | add/edit relation |
| searching | spinner in pill | typing (debounced) |
| results | rows with hover wash | response |
| selected | accent wash + check on row(s) | click |
| no results | text line + "Maak nieuw" if config allows | empty |

<StoryEmbed id="modals-entitypicker--default" todo />

## Behaviour & keyboard
Focus lands in the search pill; ↓ enters results, Enter selects, Escape
closes. Multi-select keeps the modal open; single-select commits on Enter.

## Accessibility
Modal `role="dialog"` named by its title, focus trapped. Results are a
`listbox`; count announces via `role="status"`.

## Content & i18n
"Kies persoon" / "Choose person" · "Zoek…" / "Search…" · "Geen resultaten" /
"No results" · "Voeg toe" / "Add".

## Do & don't
Do reuse entity badges in rows. Don't nest a second picker; don't clear the
query on select in multi-select mode.

## Related
[Modal](./modal) · [Filter panel](./filter-panel) · [Repeatable row group](./repeatable-row-group)
