---
title: Saved searches
---

# Saved searches

Save, recall and manage filter sets — three surfaces · Implemented by the rail menu, create modal and picker modal

## When to use / when not
Daily-recall workflows on any filtered list. Not a substitute for default
query config.

## Anatomy
**Rail menu**: entry in the nav flyout listing saved searches (12.5px rows,
star for default). **Create modal**: name input + "Deel met team" checkbox +
the active filter set as read-only chips. **Picker modal**: searchable list
(picker anatomy) with per-row overflow (Hernoem / Maak standaard / Verwijder).
An applied saved search shows as a title chip in the filter rail header with ✕.

## States
| State | Visual cue | Trigger |
|---|---|---|
| applied | title chip in rail header + "N actief" chip | pick |
| modified | chip gets "•" (gewijzigd) | edit filters |
| default | star, auto-applies on open | Maak standaard |
| shared | team glyph on row | checkbox |
| deleted | row gone; toast + Ongedaan maken | menu action |

<StoryEmbed id="components-savedsearches--with-active-filters" />

## Behaviour & keyboard
Applying replaces the current filter set (undo via toast). Saving over a
modified search asks Save vs Save-as (footerless modal). Delete follows
undo-over-confirm.

## Accessibility
The applied chip is a button "Opgeslagen zoekopdracht: {naam}, verwijderen";
picker rows follow the listbox pattern; modals per [modal](./modal).

## Content & i18n
"Bewaar zoekopdracht" / "Save search" · "Maak standaard" / "Make default" ·
"Gewijzigd" / "Modified" · "Deel met team" / "Share with team".

## Do & don't
Do show the modified dot. Don't auto-overwrite a shared search; don't apply a
default search on lists the user already filtered via URL.

## Related
[Filter panel](./filter-panel) · [Modal](./modal) · [Navigation chrome](./navigation)
