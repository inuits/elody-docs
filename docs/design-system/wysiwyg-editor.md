---
title: WYSIWYG editor
---

# WYSIWYG editor

Rich-text field editor + virtual keyboard for diacritics · Implemented by the WYSIWYG + virtual-keyboard components

## When to use / when not
HTML-typed field values (annotations, descriptions). Not for plain text
(textarea) and never for titles or identifiers.

## Anatomy
Bordered input surface (5px radius) with a compact toolbar strip on top:
26px icon buttons — bold, italic, list, link, clear-format — plus the
**virtual-keyboard trigger** (⌨). Active format = sunken button. The virtual
keyboard opens as a popover (10px radius, overlay shadow) with diacritic
characters in 28px key buttons, locale tabs on top (cataloguers enter
Ç, ǧ, ř… daily).

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | value rendered rich | — |
| editing | toolbar visible, teal ring | focus |
| format active | sunken toolbar button | cursor in styled run |
| keyboard open | popover under trigger | ⌨ |
| error/saving | per inline-editor rules | commit |

<StoryEmbed id="components-wysiwyg--toolbar" todo />

## Behaviour & keyboard
Ctrl+B/I work; toolbar buttons toggle at the cursor. Virtual-keyboard keys
insert at the cursor and keep the popover open; Escape closes it. Commit is
Bewaar, like every editor.

## Accessibility
Toolbar `role="toolbar"` "Opmaak"; buttons pressed-state via
`aria-pressed`; keyboard popover `role="dialog"` "Speciale tekens"; every key
named by its character + description ("c met cedille").

## Content & i18n
"Speciale tekens" / "Special characters" · toolbar tooltips: "Vet" / "Bold" …

## Do & don't
Do keep the toolbar minimal (5–7 buttons). Don't allow pasted styling beyond
the toolbar's set (sanitise); don't hide the keyboard trigger — diacritics are
a primary need.

## Related
[Inline editor](./inline-editor) · [Inputs & tooltips](./inputs-and-tooltips)
