# Manifest — design system → specimen → docs → code → stories

The audit contract. One row per design-system component. Story IDs were reconciled against the
actual Storybook on 2026-08-14; IDs marked † do not exist yet — see
`.storybook/DESIGN_SYSTEM_TODO.md` in `inuits-dams-pwa`.

| DS component | Specimen | Docs page | Vue component(s) | Story ID(s) |
|---|---|---|---|---|
| Colour/type/spacing/radii/motion tokens | Foundations.dc.html | foundations.md | tokens.css (@theme) | — |
| Badge (entity, 3-tone) + subtype chip | Foundations.dc.html | foundations.md §Entity badges | config-driven, ListItem.vue | components-listitem--list-mode |
| Button / IconButton / AddButton | Foundations.dc.html | primitives.md | BaseButton.vue | base-basebutton--default |
| Checkbox | Foundations.dc.html | primitives.md | BaseCheckbox.vue | base-basecheckbox--default † |
| Pill (relation chip) | Foundations.dc.html | primitives.md | ListItem.vue chips | — |
| Icon | Foundations.dc.html | primitives.md | CustomIcon.vue / unicon | — |
| Spinner (+ skeletons: code-side only) | Foundations.dc.html | primitives.md | SpinnerLoader.vue, ListItemSkeleton.vue, EntityDetailSkeleton.vue | components-spinnerloader--default |
| Client theme scopes (6) | Foundations.dc.html | client-theming.md | theme.txt → CSS injection | — |
| FieldRow | Components - Fields - Editing.dc.html | field-row.md | MetadataWrapper.vue | metadata-metadatawrapper--read-only |
| InlineEditor | Components - Fields - Editing.dc.html | inline-editor.md | InlineFieldEditor.vue | metadata-inlinefieldeditor--resting |
| GroupFormCard | Components - Fields - Editing.dc.html | group-form-card.md | EntityElementWindowPanel.vue, useBlockEditor.ts | windowpanel-entityelementwindowpanel--default |
| RepeatableRowGroup | Components - Fields - Editing.dc.html | repeatable-row-group.md | EntityElementWindowPanel.vue (repeatable) | entityelements-entityelementwindowpanel--repeatable † |
| EntityListElement (table/list/grid + preview split) | Components - Lists - Actions.dc.html | entity-list-element.md | BaseLibrary.vue, ViewModesList.vue, ListItem.vue, TableViewRow.vue | library-viewmodes-tableviewrow--default |
| PreviewPanel + PreviewColumnList | Components - Lists - Actions.dc.html | preview-panel.md | PreviewWrapper.vue | components-previewwrapper--column-list † |
| SplitButton | Components - Lists - Actions.dc.html | split-button.md | ContextMenuActionsShell.vue | components-contextmenuactionsshell--promoted-and-overflow |
| OverflowMenu | Components - Lists - Actions.dc.html | overflow-menu.md | ContextMenuActionsShell.vue | components-contextmenuactionsshell--overflow-only |
| SelectionActionBar | Components - Lists - Actions.dc.html | selection-action-bar.md | BulkOperations* components | bulkoperations-bulkoperationsactionsbar--with-selection |
| PanelShell / BlockShell / SectionHeader / StatusChip | Components - Lists - Actions.dc.html | panel-and-block-shells.md | EntityElementWindow.vue | entityelements-entityelementwindow--default † |
| FilterSection / TextFilter / CheckboxListFilter / FilterActionBar | Components - Filters - Modals.dc.html | filter-panel.md | FiltersBase.vue, FiltersListItem*.vue, matcher components | filters-filtersbase--expanded |
| EntityPicker | Components - Filters - Modals.dc.html | entity-picker.md | search/relation modal components | modals-entitypicker--default † |
| ModalShell | Components - Filters - Modals.dc.html | modal.md | Modals components | base-basemodal--center |
| MediaViewer + ViewerToolbar | Viewers.dc.html | media-viewer.md | MediaViewerNew.vue, IIIFViewer.vue | previews-mediaviewerpreview--no-mediafiles (with-toolbar story †) |
| MapView | Viewers.dc.html | map-viewer.md | PointMap.vue, WktMap.vue, HeatMap.vue, ViewModesMap.vue, EntityElementMapViewer.vue | maps-pointmap--markers |
| Breadcrumb / RecordStepper / NavRail / WizardSteps | Patterns.dc.html | navigation.md | breadcrumb + stepper chrome in detail view | components-breadcrumbs--with-history (record-stepper †) |
| Toast / AuditEntry | Patterns.dc.html | feedback.md | notification components, audit trail | components-toast--undo † |
| Per-field editing pattern | Patterns.dc.html | per-field-editing.md | MetadataWrapper.vue + useBlockEditor.ts | — |
| Action discovery pattern | Patterns.dc.html | action-discovery.md | ContextMenuActionsShell.vue | — |
