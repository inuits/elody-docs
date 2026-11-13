---
title: Client theming
---

# Client theming

Each Elody deployment can carry its own brand colours. A theme belongs to a
deployment, never to a single screen: every page of that deployment uses the
same colours.

## What a client can change

### Accent colours (the usual theme)
Setting these seven colours gives a complete theme. Everything built on them
follows automatically.

| Token | What it colours |
|---|---|
| `--color-accent` | section headers, primary buttons, active markers, link hover |
| `--color-accent-hover` | hover on primary buttons and other accent-filled controls |
| `--color-accent-light` | panel headers, chosen values in dropdowns |
| `--color-accent-light-strong` | panel borders |
| `--color-accent-ink` | text on panel headers and on chosen values |
| `--color-accent-wash` | selected rows; hover on options, editable values and secondary buttons |
| `--color-accent-tint` | background of grouped fields |

### Text and backgrounds (optional)
Only for a client with its own neutral colours: body text, field labels,
links, panel and page backgrounds, and the text-selection highlight.

### Save button and focus ring (fixed by default)
The save (commit) colour and the keyboard focus ring are the same on every
deployment, so users always recognise them. Change them only when a brand
really requires it.

## What stays the same everywhere
- Status colours: error, success, warning and info.
- Entity-type badges and chips.
- Borders and greys.

## How to set a theme
A deployment's colours are part of its app configuration, under
`customization.theme`. The app applies them when it starts.

```ts
customization: {
  theme: {
    "--color-accent": "#7A4FB5",
    "--color-accent-hover": "#5E3A8E",
    "--color-accent-light": "#F1EAFA",
    "--color-accent-light-strong": "#DCCDF0",
    "--color-accent-ink": "#4A2C73",
    "--color-accent-wash": "#F6F1FC",
    "--color-accent-tint": "#F8F4FD",
  },
},
```

Only `--color-…` tokens with colour values (hex, `rgb()`, `hsl()`, `var()` or
`transparent`) are accepted. Anything else is ignored.

<StoryEmbed id="entityelements-entityelementwindow--default" title="Detail panel in the accent colours" />

## Checklist for a new theme
- Every text colour reaches a 4.5:1 contrast ratio on white and on
  `--color-accent-light`.
- Set `--color-accent-light` and `--color-accent-ink` together. A dark panel
  header needs light text, and the reverse.
- Make hover colours a darker shade of the accent.
- Check panel headers, section headers, primary buttons, row hover, links,
  labels and the focus ring in the running app.

## Related
[Foundations](./foundations)
