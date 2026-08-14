---
title: Foundations
---

# Foundations

The token layer · Implemented by `tokens.css` (Tailwind 4 `@theme`)

## When to use / when not
Consume role tokens (`--color-surface-panel-header`), never raw palette values;
a component that hard-codes a hex cannot be client-themed. Do not add new roles
without adding them to every client scope.

## Colour roles
Accent set (client-swappable): light / light-strong / accent / hover / ink /
wash / tint. Text set: body `#003A52`, strong, secondary, muted, subtle,
field-label `#355BA9`, disabled, placeholder. Border set: default / subtle /
faint / panel / dashed. Semantic: danger `#D11800`, success `#16a34a`,
warning `#B95000`, info `#355BA9` — platform-fixed. Commit teal `#0CB2BC`
doubles as the focus ring and is never themed. Colour is never the only signal.

## Type
Lato 400/700/900 only. Chrome sizes 10.5–15px: micro 10.5 · hint 11 ·
label 11.5 · ui 12 · table 12.5 · value 13 (the reading size) · base 14 ·
heading 15. Nothing below 10.5px anywhere. Dutch UI, sentence case; uppercase
only on the audit-trail eyebrow (.4px tracking).

## Spacing, radii, elevation, motion
Spacing steps by 2px under 12px — rows are tuned in 1–2px increments; never
snap to a 4/8 grid. Radii: 4 chips · 5 inputs · 6 commit buttons · 8 cards ·
10 overlays · 14 pills — **a pill starts something (safe, reversible), a
rectangle executes something immediately**. Two elevation levels: card = 1px
border, no shadow; overlay = shadow. Motion: one duration `.13s ease`,
press `scale(.97)` (`.92` on 22px stepper buttons); nothing bounces or
slides. Focus: 2px `#0CB2BC` ring, 1px offset.

## Entity badges
A generic concept: every entity type a client's config declares gets one of
**three fixed tones** — tone1 green, tone2 blue, tone3 orange — assigned in
config order and never reshuffled, plus a grey subtype chip. The badge is
identical on list rows, breadcrumbs, side panels and wizard steps. vlacc maps
W→tone1, E→tone2, M→tone3. Green is spoken for twice (tone1 + saved check), so
success feedback never appears as a green pill.

## States
| State | Visual cue | Trigger |
|---|---|---|
| resting | role token values | — |
| hover | wash/darker per component | pointer |
| focus | 2px commit-teal ring, 1px offset | keyboard |
| active | scale(.97) | press |
| disabled | `--color-text-disabled`, no hover | prop |

<StoryEmbed id="components-listitem--list-mode" />

## Behaviour & keyboard
Tokens have no behaviour; the focus ring must survive `:focus-visible` only.

## Accessibility
Contrast: body ink on white 10.9:1; field-label blue 6.7:1; all badge
text/background pairs ≥ 4.5:1. Never encode meaning in tone alone — badges
always carry their letter/label.

## Content & i18n
Token names are English; UI copy NL first (EN in parentheses where docs need
both). Sentence case everywhere: "Bewaar" (Save), "Voeg persoon toe" (Add person).

## Do & don't
Do derive new colours with oklch from the accent. Don't introduce a fourth
badge tone; don't shadow a card; don't uppercase labels.

## Related
[Primitives](./primitives) · [Client theming](./client-theming)
