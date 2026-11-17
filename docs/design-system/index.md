---
title: Get started
---

# Elody design system

The design system is the shared visual language and behaviour of the Elody
interface: the colours, type and spacing it is built from, the components on
every screen, and the patterns that combine them.

## Who it is for

- **Designers** who design screens or features for Elody.
- **Developers** who build on the Elody interface or add components to it.
- **Anyone configuring a deployment**, for example to give it a client's
  brand colours (see [client theming](./client-theming)).

## How it is organised

| Section | What you find there |
|---|---|
| **Foundations** | Principles, colour, typography, spacing, shape, motion, icons, accessibility and content rules that everything else follows. |
| **Components** | Single building blocks, such as buttons, inputs and menus. |
| **Composite components** | Larger parts built from those blocks, such as a field row, the filter panel or the media viewer. |
| **Patterns** | How components work together for a task, such as editing a record or giving feedback after an action. |

Every page describes what Elody does today. Features that are not built yet
are not documented.

## Live examples

The examples on these pages are live components from the
<a href="/storybook/" target="_blank">Elody Storybook</a>. Open a
story in Storybook to see it full size and try its options.

## Building with the design system

- **Use tokens, never raw values.** Every colour, size, radius, shadow and
  duration is a design token: a CSS custom property such as
  `--color-text-body`. A hard-coded colour or size can't follow a client
  theme and drifts from the rest of the interface.
- **Use role tokens.** Pick a token for what the value means
  (`--color-border-default`, `--color-surface-muted`), not for how it looks.
- **Reuse components.** Build screens from the existing components before
  adding a new one, so behaviour and accessibility stay the same everywhere.
- **Follow the [principles](./principles).** They explain why components
  behave the way they do.
