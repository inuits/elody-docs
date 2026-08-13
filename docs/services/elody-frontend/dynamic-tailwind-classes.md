# Dynamic Tailwind Classes

Tailwind classes that are assembled at runtime work locally and then break once
deployed. This is the most common "it worked on my machine" failure in the
frontend, and it fails *silently* — no build error, no console warning, just an
unstyled element.

## Why it happens

Tailwind only generates CSS for utilities it finds as **complete literal
strings** while scanning the source. A class name assembled from a variable is
never a literal, so it is never generated:

```vue
<!-- Broken: `bg-accent-normal` never appears as a literal anywhere -->
<button :class="`bg-${bgColor} text-${txtColor} hover:bg-${bgHoverColor}`">
```

```vue
<!-- Works: the full class names are literals the scanner can see -->
<button :class="bgColor === 'accent' ? 'bg-accent-normal' : 'bg-gray-200'">
```

The reason it survives locally is that the local dev build and the production
build do not generate the same stylesheet. Locally the class often happens to
be emitted anyway — because the same literal appears somewhere else in the
scanned tree, or because the browser is still holding earlier dev CSS. The
[production build](production-serving.md) regenerates the stylesheet from
scratch inside the client image, where that coincidence does not hold, and the
utility is dropped.

## How to fix it

- Prefer mapping a prop to whole class names — a lookup object or a ternary —
  so every possible class exists literally in the file.
- If a class genuinely has to be dynamic, make Tailwind aware of it explicitly
  with `@source inline(...)` in `main.css` so it is always generated.
- To confirm before deploying, build the PWA the way production does
  (`NODE_ENV=production pnpm run build`) and grep the generated CSS in `dist/`
  for the class. If it is not in there, it will not be in the browser.

## Existing examples to avoid copying

There are real instances of this shape in the PWA today, e.g.
[`BaseButton.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/BaseButton.vue)
and
[`InputField.vue`](https://github.com/inuits/elody-pwa/blob/master/src/components/base/InputField.vue),
which build `bg-${bgColor}` and `text-${txtColor}`. Treat them as a pattern to
avoid rather than one to copy — reaching for the nearest existing button
component is how this spreads.

## Client theming

The same rule applies to client theme customisation. The client Dockerfile
patches the `--color-accent-*` **CSS variables** in `main.css`, which is safe:
variables are not affected by class scanning. But any utility that consumes
them (`bg-accent-normal`) still has to appear literally in the source to be
generated.
