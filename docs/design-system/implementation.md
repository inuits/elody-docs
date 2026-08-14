# Implementation guide — elody design system in `inuits-dams-pwa`

For an agent (Claude Code) or developer implementing this system end to end in
the Vue 3 + Tailwind 4 PWA. Work the phases in order: each one leaves the app
in a shippable state, and later phases assume the earlier tokens exist.

**Sources of truth, in this order:** `tokens.css` (values) → `docs/*.md`
(component contracts, states, a11y, copy) → `specimens/*.dc.html` (visual
reference, every state side by side) → `MANIFEST.md` (which Vue file
implements what) → `CHANGES.md` (what changed and why). Where code and docs
disagree, the docs win — they encode decisions taken after the audit.

---

## Phase 0 — Ground rules (read before writing code)

1. **Never hard-code a colour, radius, duration or font size.** Everything
   comes from a `--color-*` / `--radius-*` / `--text-*` / `--spacing-*`
   token. A component with a hex literal cannot be client-themed and will fail
   review.
2. **The five legacy variable names stay**: `--color-accent-light`,
   `--color-accent-accent`, `--color-accent-normal`, `--color-accent-dark`,
   `--color-text-light`. New roles reference them; nothing renames them.
3. **Exact values, no rounding.** If the spec says 5px, write 5px — not 4px,
   not `rounded`. Row paddings are tuned in 1–2px steps on purpose.
4. **Two elevation levels only.** Cards: 1px border, no shadow. Overlays:
   shadow. There is no third.
5. **Shape encodes role.** Pill (14px) = starts something, always safe and
   reversible (add, search, breadcrumb, stepper). Rectangle (5–6px) = executes
   immediately (Bewaar, Open record). Never a pill on a mutating action.
6. **Structural accessibility is part of "done"**, not a later pass: role,
   accessible name, focus order, `role="alert"` for errors and
   `role="status"` for confirmations, per each docs page's Accessibility
   section.
7. **Copy is Dutch, sentence case, verbs on buttons.** Each docs page lists
   NL + EN strings — put them in the i18n files, never inline.

## Phase 1 — Tokens (blocking for everything else)

1. Merge `tokens.css`'s `@theme` block into `src/assets/main.css`. Keep the
   existing `@theme` keys; add the new roles alongside.
2. Append the `[data-elody-client]` scope blocks verbatim. Set
   `data-elody-client` on `<body>` from the tenant config at boot.
3. **Critical**: inside every client scope, re-declare the seven
   accent-derived aliases (`--color-surface-panel-header`,
   `--color-surface-section-header`, `--color-surface-editable-hover`,
   `--color-surface-group-tint`, `--color-text-panel-header`,
   `--color-text-link-hover`, `--color-border-panel`). CSS custom properties
   resolve `var()` where they are **defined** — aliases declared only on
   `:root` freeze to vlacc's accent and every other client silently renders
   vlacc blue.
4. Verify per client (pza, podiumnet, damsv2, vliz, aicap): panel headers,
   section headers, hover washes and primary buttons all shift; commit teal,
   focus ring, semantic colours and badge tones do **not**.
5. Acceptance: a grep for hex literals in `src/components` returns only
   third-party overrides.

## Phase 2 — Primitives (everything above depends on these)

Order: `BaseButton` → `base/BaseInputCheckbox` → text/number/textarea input →
`Tooltip` → `SpinnerLoader` → `Badge` → relation chip → `AdvancedDropdown`.

- **Buttons**: variants primary / secondary / ghost / danger / commit, sizes
  sm+md, states resting/hover/focus/active(`scale(.97)`)/disabled/loading
  (label keeps its width). **Deprecate** the grey `default` variant (→
  secondary) and the mint `accentNormal` variant (→ commit); codemod the call
  sites rather than leaving both.
- **Inputs**: one focus treatment everywhere — 2px `--color-focus-ring`, 1px
  offset, on `:focus-visible`. Number inputs right-align without spinners.
- **Badges**: implement the **generic three tones**
  (`--color-badge-tone1|2|3-*`) assigned per entity type **in config order and
  never reshuffled**, plus the grey subtype chip. W/E/M is vlacc's mapping, not
  the API.
- **AdvancedDropdown**: the custom overlay listbox replaces native `<select>`
  in all edit surfaces. Search above 10 options; option-shaped **skeletons**
  while loading (not per-option spinners); leading "— Geen waarde" option in
  non-required single selects; **choosing never saves**.
- Acceptance: `specimens/Foundations.dc.html` and
  `specimens/Forms - Inputs.dc.html` are reproducible state for state.

## Phase 3 — Fields & editing (the core pattern)

Implements `docs/per-field-editing.md`, `field-row.md`, `inline-editor.md`,
`group-form-card.md`, `repeatable-row-group.md`.

1. **The invariant: edit scope = save scope = validation scope.** A field saves
   and validates alone; an interdependent group saves and validates as one
   card; a repeatable row behaves as a field. Remove any page-level "Bewerk"
   toggle — the legacy whole-form path is deprecated.
2. `MetadataWrapper.vue`: dashed underline on editable values, accent-wash +
   pencil on hover, 45%-opacity "Geen waarde" for empty non-required fields
   ("-" is deprecated), label adornments in order (required `*`, one-of-required
   marker, help tooltip, locale selector, virtual-keyboard trigger).
3. `InlineFieldEditor.vue`: **pick-then-Bewaar** for every type. Enter commits
   (Ctrl+Enter in textarea), Escape restores, keyboard-hint line under the open
   editor ("Enter bewaart · Esc annuleert"). **A failed save always keeps the
   editor open** — a closed row never shows an error state.
4. **Post-save undo is the inline chip** next to the value, alive **until the
   next action**; the undo *toast* is only for removals (the row is gone).
   Implement one shared `useUndo` so both carriers share a single history.
5. Value-type renderings: boolean "Ja/Nee" with glyph, image thumb (48px,
   opens the viewer), URL/HTML (sanitised), coordinates + "Toon op kaart".
   Copy affordance (⧉) on hover with "Gekopieerd" `role="status"`; truncation
   always paired with the full-value tooltip.
6. `EntityElementWindowPanel.vue` + `useBlockEditor.ts`: **one gesture** opens
   the whole interdependent group in place, with a single Bewaar/Annuleer pair;
   focus lands on the clicked member's input.
7. Table input fields (`tableInputFields/*`) are a **variant of the repeatable
   row group** — multi-column rows with per-cell inputs — not a new component.
8. Acceptance: clicking any value never navigates and never opens a modal;
   validation never touches a field outside the edited scope.

## Phase 4 — Lists & actions

Implements `entity-list-element.md`, `preview-panel.md`, `split-button.md`,
`overflow-menu.md`, `selection-action-bar.md`, `panel-and-block-shells.md`,
`pagination.md`.

1. **Row states (decision)**: the **checkbox** owns accent wash + accent row
   shadow; the row whose **preview is open** gets a 3px accent border left and
   no wash. Do not conflate them.
2. Preview split follows the container tiers — <500px stacks, then 40/60,
   35/65, 30/70, 25/75 at 500/630/830/1024px — and the table **collapses to its
   first metadata column** while a preview is open. Use container queries, so
   nested splits recompute against their own container.
3. `PreviewWrapper.vue` reuses the shared **panel shell** chrome (accent-light
   header); close cross and the primary "Open detailpagina" button live in the
   header actions slot.
4. `ContextMenuActionsShell.vue`: labelled split button; **never a bare ⋮**;
   overflow triggers carry a label too. Disabled items stay in the menu with
   their reason (`aria-disabled`, not `disabled`). Destructive items are
   marked by a **schema flag** (`"tone": "danger"` on the action definition),
   never inferred from the verb, and sort last. One submenu level maximum.
5. Grid mode: 300×350 cards, 300×220 media area, no-media placeholder (never a
   blank box). List mode may run multi-line and gets a column-header row.
6. Selection bar: count `role="status"`, "Selecteer pagina", capped-count
   reveal, confirm-selection mode for picker contexts, collapsed-empty variant.
7. Panels: max three chrome layers (panel → block heading → rows). Never nest
   another bordered box; never shadow a card.
8. Acceptance: `specimens/Components - Lists - Actions.dc.html` matches, and
   every action in a menu is reachable and labelled.

## Phase 5 — Filters, overlays, saved searches

Implements `filter-panel.md`, `entity-picker.md`, `modal.md`,
`saved-searches.md`, `autocomplete-tag-input.md`, `date-picker.md`.

- Filters apply on **"Pas toe"**, never on keystroke; "Wis alles" and per-filter
  "Wis filter" clear *and* apply immediately (undo via toast). Section
  chevrons: **⌄ closed · ⌃ open**. Option loading uses skeletons.
- Rail chrome: saved-search title chip (with modified dot), global "N actief"
  chip, add-filter autocomplete, saved-searches menu.
- Relations: the **autocomplete tag input** is the in-place gesture (chips,
  async list, create-new); the modal picker stays for deliberate browsing and,
  inside library contexts, reuses the full list element in confirm-selection
  mode.
- Modals: `aria-modal`, focus trap, Escape, focus returns to the trigger; one
  commit per modal; footerless variant for pick-only overlays; confirmation
  modals **only** for true unrecoverable loss.

## Phase 6 — Viewers

Implements `media-viewer.md`, `map-viewer.md`.

- **One `ViewerToolbar`** for all modes — image (zoom/home/fullscreen/rotate),
  PDF (page ‹n/m›, zoom, fullscreen, download), AV (transport, scrubber,
  volume), text (zoom, download). **`PdfToolbar` is deprecated**; migrate its
  buttons into the shared toolbar. IIIF manifest viewing is image mode fed by
  manifest canvases, not separate chrome.
- Maps: fit to feature extent on load, accent stroke + ~25% fill, zoom buttons
  as real buttons, attribution always visible; coordinates must also exist as
  text (the map is never the only carrier).
- DAMS-type tenants (damsv2, vliz): mediafiles occupy the **wide primary
  column** on detail screens with metadata/asset parts narrow beside them.

## Phase 7 — Flows, upload, feedback, chrome

Implements `dynamic-form.md`, `guided-flow.md`, `upload.md`, `feedback.md`,
`history-diff.md`, `comments.md`, `hierarchy-tree.md`, `import-browser.md`,
`navigation.md`, `wysiwyg-editor.md`, `toggle-and-slider.md`,
`inputs-and-tooltips.md`.

- Upload: per-file progress always visible; a failed file never aborts the
  batch; `role="progressbar"` per row, banner `role="status"`.
- Guided flow: "Volgende" validates the current step only; the created-so-far
  rail is a `role="log"`; each saved step is undoable from its row.
- Feedback: status toasts polite, error toasts `role="alert"` and never
  auto-dismiss, warn variant for partial success, and the single sanctioned
  global/service toast (top-centre, whole-toast clickable). Busy overlays block
  the **panel**, not the page, whenever scope allows.
- Trees: checkbox selects, title navigates — never both on one target.
- Navigation: exactly two fixed elements (52px rail + detail header). The
  expanded 320px flyout, environment pill (LOCAL/DEV/TEST), language select and
  tenant switcher follow `navigation.md`.

## Phase 8 — Storybook & audit close-out

1. Create every story listed in `STORYBOOK_TODO.md` (id, component, states).
   Titles follow the existing prefixes so ids resolve as the docs expect.
2. Wire the docs site: copy `docs/*.md` under `/design-system/`, paste
   `docs/sidebar.json` into `.vitepress/config`, and point `<StoryEmbed>` at
   `{STORYBOOK_BASE}/iframe.html?id=<id>&viewMode=story`.
3. Walk `MANIFEST.md` row by row as the audit checklist: component → specimen
   → docs page → Vue file → story. A row is done when the story reproduces
   every state its docs page's state table lists.
4. Remove the deprecations this system retires: native `<select>` in edit
   surfaces, whole-form edit path, `PdfToolbar`, grey `default` + mint
   `accentNormal` button variants, "-" as empty placeholder, right-pointing
   collapsed chevron, auto-save-on-choose.

## Definition of done (per component)

- Values come from tokens; no literals.
- Every state in the docs state table is reachable and matches the specimen.
- Role, accessible name and focus order per the Accessibility section;
  errors `role="alert"`, confirmations `role="status"`.
- NL + EN copy in i18n, sentence case, verbs on buttons.
- A Storybook story shows all states.
- Renders correctly under all six `data-elody-client` scopes.

## Open by design — do not fill

Final iconography set (Unicons is the interim), empty-state illustrations,
data-visualisation palette, dark mode. Where a screen needs one, leave it
text-only and note "Open — see brief". Lato binaries are not in the handoff;
Google Fonts is the interim source.
