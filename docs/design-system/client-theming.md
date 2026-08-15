---
title: Client theming
---

# Client theming

Per-client accent scopes · Implemented by dashboard `theme.txt` → CSS injection; scopes in `tokens.css`

## When to use / when not
Theme a deployment, never a screen. A client may swap **only** the accent pair
(+ its five derivations); neutrals, semantic colours, commit teal, focus ring
and badges are platform-fixed. aicap is the sole sanctioned exception.

## Accent table (product triples, verbatim)
| Client | accent-light | accent | Panel-header ink | Notes |
|---|---|---|---|---|
| vlacc | #DEF1FA | #3BA6CB | dark (#1D5C7A) | reference values (redesign) |
| pza | #DCF4F9 | #2A97E2 | dark (#0B5F87) | hover #0057B7 |
| podiumnet | #164C85 | #0057b1 | **white** | dark accent-light |
| damsv2 | #164C85 | #0057b1 | **white** | same triple as podiumnet today; own scope so they can diverge |
| vliz | #465DAA | #354D9B | **white** | teal #65C9CD stays for commit/focus |
| aicap | #F2EFEC | #9F8332 | dark (#6E5A22) | + warm surfaces #FAF8F4/#FFFEFE, own ink #343a40 |

## Anatomy
A scope is `[data-elody-client="…"]` on `<body>` overriding the accent set
**and re-declaring the seven accent-derived aliases** (surface-panel-header,
surface-section-header, editable-hover, group-tint, text-panel-header,
link-hover, border-panel) — CSS custom properties resolve `var()` where
defined, so :root-only aliases freeze to vlacc's accent.

## States
| State | Visual cue | Trigger |
|---|---|---|
| light accent-light | dark accent ink on pale header | default |
| dark accent-light | white header ink (`--color-accent-ink:#FFF`) | podiumnet, damsv2, vliz |
| media-first | viewer occupies the wide column | DAMS-type clients |

<StoryEmbed id="entityelements-entityelementwindow--default" />

## Behaviour & keyboard
None — theming is declarative.

## Accessibility
Dark-header clients must keep `--color-text-accent-strong` dark for text on
white; verify 4.5:1 for every new accent against white and accent-light.

## Content & i18n
Client names are lowercase identifiers (pza, podiumnet, damsv2, vliz, aicap).

## Do & don't
Do derive hover as a darkened accent. Don't theme the commit teal, focus ring
or badges; don't let two clients share one scope.

## Related
[Foundations](./foundations)
