import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Elody Docs',
  description: 'Documentation for the Elody semantic data platform',

  base: '/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#165c74' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:site_name', content: 'Elody Docs' }],
  ],

  themeConfig: {
    logo: {
      src: '/images/logo.svg',
      alt: 'Elody',
    },
    siteTitle: 'Elody',
    logoLink: '/',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' },
      { text: 'Services', link: '/services/' },
      { text: 'Design system', link: '/design-system/' },
    ],

    // Keyed by path: the design system carries its own sidebar so its 38
    // pages do not sink the rest of the docs.
    sidebar: {
      '/design-system/': [
        {
          text: "Design system",
          collapsed: false,
          items: [
            { text: "Introduction", link: "/design-system/" },
          ],
        },
        {
          text: "Foundations",
          collapsed: false,
          items: [
            { text: "Foundations", link: "/design-system/foundations" },
            { text: "Primitives", link: "/design-system/primitives" },
            { text: "Client theming", link: "/design-system/client-theming" },
            { text: "Inputs & tooltips", link: "/design-system/inputs-and-tooltips" },
            { text: "Toggle & slider", link: "/design-system/toggle-and-slider" },
          ],
        },
        {
          text: "Forms & flows",
          collapsed: false,
          items: [
            { text: "Dropdown select", link: "/design-system/dropdown-select" },
            { text: "Autocomplete tag input", link: "/design-system/autocomplete-tag-input" },
            { text: "Date picker", link: "/design-system/date-picker" },
            { text: "Dynamic form", link: "/design-system/dynamic-form" },
            { text: "Guided flow", link: "/design-system/guided-flow" },
            { text: "Upload", link: "/design-system/upload" },
            { text: "WYSIWYG editor", link: "/design-system/wysiwyg-editor" },
          ],
        },
        {
          text: "Fields & editing",
          collapsed: false,
          items: [
            { text: "Field row", link: "/design-system/field-row" },
            { text: "Inline editor", link: "/design-system/inline-editor" },
            { text: "Group form card", link: "/design-system/group-form-card" },
            { text: "Repeatable row group", link: "/design-system/repeatable-row-group" },
          ],
        },
        {
          text: "Lists & actions",
          collapsed: false,
          items: [
            { text: "Entity list element", link: "/design-system/entity-list-element" },
            { text: "Preview panel", link: "/design-system/preview-panel" },
            { text: "Split button", link: "/design-system/split-button" },
            { text: "Overflow menu", link: "/design-system/overflow-menu" },
            { text: "Selection action bar", link: "/design-system/selection-action-bar" },
            { text: "Panel & block shells", link: "/design-system/panel-and-block-shells" },
            { text: "Pagination", link: "/design-system/pagination" },
          ],
        },
        {
          text: "Filters & overlays",
          collapsed: false,
          items: [
            { text: "Filter panel", link: "/design-system/filter-panel" },
            { text: "Entity picker", link: "/design-system/entity-picker" },
            { text: "Modal", link: "/design-system/modal" },
            { text: "Saved searches", link: "/design-system/saved-searches" },
          ],
        },
        {
          text: "Viewers",
          collapsed: false,
          items: [
            { text: "Media viewer", link: "/design-system/media-viewer" },
            { text: "Map viewer", link: "/design-system/map-viewer" },
          ],
        },
        {
          text: "Navigation",
          collapsed: false,
          items: [
            { text: "Navigation chrome", link: "/design-system/navigation" },
            { text: "Hierarchy & folder trees", link: "/design-system/hierarchy-tree" },
            { text: "Import browser", link: "/design-system/import-browser" },
          ],
        },
        {
          text: "Patterns",
          collapsed: false,
          items: [
            { text: "Per-field editing", link: "/design-system/per-field-editing" },
            { text: "Action discovery", link: "/design-system/action-discovery" },
            { text: "Feedback & undo", link: "/design-system/feedback" },
            { text: "History diff", link: "/design-system/history-diff" },
            { text: "Comments", link: "/design-system/comments" },
          ],
        },
      ],
      '/': [
      {
        text: 'Introduction',
        collapsed: false,
        items: [
          { text: 'Getting Started', link: '/getting-started' },
        ],
      },
      {
        text: 'Services',
        link: '/services/',
        collapsed: true,
        items: [
          {
            text: 'Elody Collection',
            link: '/services/elody-collection/',
            items: [
              { text: 'Advanced Filtering', link: '/services/elody-collection/advanced-filtering' },
            ],
          },
          {
            text: 'Elody Frontend',
            link: '/services/elody-frontend/',
            items: [
              { text: 'Build Pipeline', link: '/services/elody-frontend/build-pipeline' },
              { text: 'Production Serving', link: '/services/elody-frontend/production-serving' },
              { text: 'Auth & Session', link: '/services/elody-frontend/auth-session' },
              { text: 'Dynamic Tailwind Classes', link: '/services/elody-frontend/dynamic-tailwind-classes' },
              { text: 'Comments & Threads', link: '/services/elody-frontend/features/comments' },
              { text: 'Rounded Counts', link: '/services/elody-frontend/features/rounded-counts' },
            ],
          },
        ],
      },
      ],
    },

    outline: {
      label: 'On this page',
      level: [2, 3],
    },

    footer: {
      message: 'Powered by Elody - Open Source Semantic Data Platform',
      copyright: '© 2026 Inuits',
    },

    search: {
      provider: 'local',
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
  },
})
