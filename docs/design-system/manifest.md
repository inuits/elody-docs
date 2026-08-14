# Manifest — design system → specimen → docs → code → stories

The audit contract. One row per design-system component. Story IDs marked † do
not exist yet — see STORYBOOK_TODO.md.

| DS component | Specimen | Docs page | Vue component(s) | Story ID(s) |
|---|---|---|---|---|
| Colour/type/spacing/radii/motion tokens | Foundations.dc.html | foundations.md | tokens.css (@theme) | — |
| Badge (entity, 3-tone) + subtype chip | Foundations.dc.html | foundations.md §Entity badges | config-driven, ListItem.vue | library-viewmodes-listitem--default † |
| Button / IconButton / AddButton | Foundations.dc.html | primitives.md | BaseButton.vue | base-basebutton--variants † |
| Checkbox | Foundations.dc.html | primitives.md | base/BaseInputCheckbox.vue | base-baseinputcheckbox--default † |
| Pill (relation chip) | Foundations.dc.html | primitives.md | ListItem.vue chips | — |
| Icon | Foundations.dc.html | primitives.md | CustomIcon.vue / unicon | — |
| Spinner (+ skeletons: code-side only) | Foundations.dc.html | primitives.md | SpinnerLoader.vue, ListItemSkeleton.vue, EntityDetailSkeleton.vue | components-spinnerloader--default |
| Client theme scopes (6) | Foundations.dc.html | client-theming.md | theme.txt → CSS injection | — |
| FieldRow | Components - Fields - Editing.dc.html | field-row.md | MetadataWrapper.vue | metadata-metadatawrapper--default † |
| InlineEditor | Components - Fields - Editing.dc.html | inline-editor.md | InlineFieldEditor.vue | metadata-inlinefieldeditor--editing † |
| GroupFormCard | Components - Fields - Editing.dc.html | group-form-card.md | EntityElementWindowPanel.vue, useBlockEditor.ts | entityelements-entityelementwindowpanel--group-editing † |
| RepeatableRowGroup | Components - Fields - Editing.dc.html | repeatable-row-group.md | EntityElementWindowPanel.vue (repeatable) | entityelements-entityelementwindowpanel--repeatable † |
| EntityListElement (table/list/grid + preview split) | Components - Lists - Actions.dc.html | entity-list-element.md | BaseLibrary.vue, ViewModesList.vue, ListItem.vue, TableViewRow.vue | library-viewmodes-viewmodeslist--default † |
| PreviewPanel + PreviewColumnList | Components - Lists - Actions.dc.html | preview-panel.md | PreviewWrapper.vue | components-previewwrapper--column-list † |
| SplitButton | Components - Lists - Actions.dc.html | split-button.md | ContextMenuActionsShell.vue | contextmenuactions-contextmenuactionsshell--split-button † |
| OverflowMenu | Components - Lists - Actions.dc.html | overflow-menu.md | ContextMenuActionsShell.vue | contextmenuactions-contextmenuactionsshell--overflow-menu † |
| SelectionActionBar | Components - Lists - Actions.dc.html | selection-action-bar.md | BulkOperations* components | bulkoperations-selectionactionbar--default † |
| PanelShell / BlockShell / SectionHeader / StatusChip | Components - Lists - Actions.dc.html | panel-and-block-shells.md | EntityElementWindow.vue | entityelements-entityelementwindow--default † |
| FilterSection / TextFilter / CheckboxListFilter / FilterActionBar | Components - Filters - Modals.dc.html | filter-panel.md | FiltersBase.vue, FiltersListItem*.vue, matcher components | filters-filtersbase--default † |
| EntityPicker | Components - Filters - Modals.dc.html | entity-picker.md | search/relation modal components | modals-entitypicker--default † |
| ModalShell | Components - Filters - Modals.dc.html | modal.md | Modals components | modals-basemodal--default † |
| MediaViewer + ViewerToolbar | Viewers.dc.html | media-viewer.md | MediaViewerNew.vue, IIIFViewer.vue | components-mediaviewer--with-toolbar † |
| MapView | Viewers.dc.html | map-viewer.md | PointMap.vue, WktMap.vue, HeatMap.vue, ViewModesMap.vue, EntityElementMapViewer.vue | components-pointmap--default † |
| Breadcrumb / RecordStepper / NavRail / WizardSteps | Patterns.dc.html | navigation.md | breadcrumb + stepper chrome in detail view | components-breadcrumb--default † |
| Toast / AuditEntry | Patterns.dc.html | feedback.md | notification components, audit trail | components-toast--undo † |
| Per-field editing pattern | Patterns.dc.html | per-field-editing.md | MetadataWrapper.vue + useBlockEditor.ts | — |
| Action discovery pattern | Patterns.dc.html | action-discovery.md | ContextMenuActionsShell.vue | — |

## Round 2 additions

| DS component | Specimen | Docs page | Vue component(s) | Story ID(s) |
|---|---|---|---|---|
| Dropdown/select popup | Forms - Inputs.dc.html | dropdown-select.md | AdvancedDropdown.vue | components-advanceddropdown--multi-search † |
| Autocomplete tag input | Forms - Inputs.dc.html | autocomplete-tag-input.md | BaseInputAutocomplete.vue (+ relation/metadata variants) | base-baseinputautocomplete--tags † |
| Date picker | Forms - Inputs.dc.html | date-picker.md | BaseDatePicker.vue | base-basedatepicker--default † |
| Input & tooltip primitives | Forms - Inputs.dc.html | inputs-and-tooltips.md | base input components | base-baseinputtext--states † |
| Toggle group + slider | Forms - Inputs.dc.html | toggle-and-slider.md | toggle/slider primitives | base-basetogglegroup--default † |
| Dynamic form | Flows - Upload.dc.html | dynamic-form.md | DynamicForm.vue | repetitiveform-dynamicform--tabs † |
| Guided flow (record creation) | Flows - Upload.dc.html | guided-flow.md | RepetitiveFlow, StepModal, StepField, Overview | repetitiveform-stepmodal--step † |
| Table input field | — (merged) | repeatable-row-group.md §Table input | tableInputFields/* | — |
| Pagination + page size | Flows - Upload.dc.html | pagination.md | BasePagination.vue, LibraryBar footer | base-basepagination--default † |
| Saved searches | Flows - Upload.dc.html | saved-searches.md | rail menu + create modal + picker modal | modals-savedsearches--picker † |
| History / version diff | Flows - Upload.dc.html | history-diff.md | HistoryDiffPreview.vue | components-historydiffpreview--two-column † |
| Upload dropzone + progress | Flows - Upload.dc.html | upload.md | dropzone family, BaseProgressStep, ProgressBar | components-dropzone--progress † |
| WYSIWYG editor + virtual keyboard | Forms - Inputs.dc.html | wysiwyg-editor.md | WYSIWYG + keyboard components | components-wysiwyg--toolbar † |
| Comments / threads | Flows - Upload.dc.html | comments.md | comment components | components-comments--thread † |
| Hierarchy + folder trees | Flows - Upload.dc.html | hierarchy-tree.md | hierarchy/folder tree blocks | components-hierarchytree--default † |
| Network-drive import browser | Flows - Upload.dc.html | import-browser.md | import browser components | components-importbrowser--default † |
| PDF / AV / text / IIIF viewer modes | Viewers.dc.html (r2) | media-viewer.md §Viewer modes | PdfToolbar (unify), AV/text viewers, IIIF manifest viewer | components-mediaviewer--pdf † |
| Busy/blocking overlay | Flows - Upload.dc.html | feedback.md §Busy overlay | blocking overlay | — |
| Environment pill, header extras, expanded nav | — | navigation.md §Round 2 | nav flyout, env indicator, language/tenant | — |
