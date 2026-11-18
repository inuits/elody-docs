---
title: Colour
---

# Colour

Colour in Elody is defined as **role tokens**: each token says what a colour is
for (`--color-text-field-label`), not what it looks like. Components only use
role tokens, so a client theme can change the brand colours in one place.

## Accent
The brand colours of a deployment: the colours a
[client theme](./client-theming) usually changes.

| Token | Use |
|---|---|
| `--color-accent` | section headers, primary buttons, active markers |
| `--color-accent-hover` | hover on accent-filled elements |
| `--color-accent-light` | panel headers, chosen values |
| `--color-accent-light-strong` | panel borders |
| `--color-accent-ink` | text on `--color-accent-light` |
| `--color-accent-wash` | hover on editable values and options; selected rows |
| `--color-accent-tint` | background of grouped fields |

## Surfaces
| Token | Use |
|---|---|
| `--color-surface` | cards, panels, inputs |
| `--color-surface-app` | page background |
| `--color-surface-muted` | disabled fills, subtle chips |
| `--color-surface-sunken` | pressed and open states |
| `--color-surface-panel-header` | panel header band |
| `--color-surface-row-hover` | hover on list and table rows |
| `--color-surface-inverted` | tooltips and notifications |

## Text
| Token | Use |
|---|---|
| `--color-text-body` | default text |
| `--color-text-strong` | emphasised titles |
| `--color-text-secondary` | field values, secondary lines |
| `--color-text-muted` | meta information, counts, hints |
| `--color-text-field-label` | field labels |
| `--color-text-link` | links |
| `--color-text-placeholder` | placeholder text only |
| `--color-text-disabled` | disabled text |

## Borders
| Token | Use |
|---|---|
| `--color-border-default` | inputs, secondary buttons |
| `--color-border-subtle` | menus and listboxes |
| `--color-border-faint` | separators inside panels |
| `--color-border-panel` | panel outlines |
| `--color-border-dashed` | add buttons, drop zones, editable values |

## Fixed colours
These are the same on every deployment.

| Token | Use |
|---|---|
| `--color-commit` | save buttons, checks, spinners |
| `--color-focus-ring` | the keyboard focus ring |
| `--color-danger` | errors and destructive actions |
| `--color-success` | success feedback |
| `--color-warning` | warnings |
| `--color-info` | information |
| `--color-scrim` | the backdrop behind a modal |

### Entity badges
Each entity type gets one of three badge tones, plus a grey chip for
subtypes. The deployment's configuration decides which type gets which tone,
and it never changes once set. There is no fourth tone.

## Rules
- Never use a colour as the only signal: badges carry a label, statuses carry
  text and errors carry a message.
- Text must reach a 4.5:1 contrast ratio with its background (see
  [accessibility](./accessibility)).
- Don't add a new role for a single component. Use an existing role, or a
  component token that points to one.

## All colour tokens
Every colour token with its current value, read live from the interface.
Scroll inside the frame, or open it in Storybook.

<StoryEmbed id="foundations-tokens--colour" title="All colour tokens with their current values" height="720px" />

## Related
[Client theming](./client-theming) · [Accessibility](./accessibility)
