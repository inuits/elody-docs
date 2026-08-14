---
title: Dynamic form
---

# Dynamic form

Config-driven form layout: tabs, ordering, validation, submit zone · Implemented by `DynamicForm.vue`

## When to use / when not
Whole-record forms the config generates (creation, import mapping). Not for
in-place metadata editing (per-field pattern) — a dynamic form is a distinct,
deliberate surface.

## Anatomy
Optional tab row (12.5px bold labels, active = accent underline 2px, error tab
gets a danger dot); fields in config order in the responsive field grid
(2-col ≤1100px→1-col ≤800px); every input per its primitive spec; a sticky
**submit zone** bottom-right: "Bewaar" commit rect + "Annuleer" ghost, with a
validation summary line left of the buttons when errors exist.

## States
| State | Visual cue | Trigger |
|---|---|---|
| pristine | Bewaar disabled | open |
| dirty | Bewaar enabled | any change |
| submitting | Bewaar spinner, form locked | commit |
| field errors | per-field messages + summary "Controleer {n} velden" + tab dots | validate |
| server reject | summary `role="alert"`, form stays editable | response |

<StoryEmbed id="repetitiveform-dynamicform--tabs" todo />

## Behaviour & keyboard
Validation runs on submit, then per-field on change (never on first focus).
The summary links to fields (click focuses). Tab order = config order.

## Accessibility
Tabs follow the tabs pattern; summary is `role="alert"` and lists linked
field names; the submit zone is a `role="group"` "Formulier-acties".

## Content & i18n
"Controleer de gemarkeerde velden ({n})" / "Check the highlighted fields
({n})" · tab labels are config nouns.

## Do & don't
Do keep one submit zone. Don't validate untouched fields on load; don't nest
tabs; don't scatter save buttons per section.

## Related
[Guided flow](./guided-flow) · [Inputs & tooltips](./inputs-and-tooltips) · [Per-field editing](./per-field-editing)
