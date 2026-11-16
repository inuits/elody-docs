import { defineConfig } from 'vitepress'
import referenceSidebar from '../services/elody-frontend/shacl-ui/reference/sidebar.json'

export default defineConfig({
  title: 'Elody Docs',
  description: 'Documentation for the Elody semantic data platform',

  base: '/',

  srcExclude: ['design-system/{action-discovery,autocomplete-tag-input,comments,date-picker,dropdown-select,dynamic-form,entity-list-element,entity-picker,feedback,field-row,filter-panel,group-form-card,guided-flow,hierarchy-tree,history-diff,import-browser,inline-editor,inputs-and-tooltips,map-viewer,media-viewer,modal,navigation,pagination,panel-and-block-shells,per-field-editing,preview-panel,primitives,repeatable-row-group,saved-searches,selection-action-bar,toggle-and-slider,upload,wysiwyg-editor}.md'],

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
      { text: 'Services', link: '/services/', activeMatch: '^/services/(?!.*api-reference)' },
      {
        text: 'API Reference',
        items: [
          { text: 'Collection API', link: '/services/elody-collection/api-reference' },
          { text: 'GraphQL Service API', link: '/services/elody-frontend/api-reference' },
        ],
      },
      { text: 'Design system', link: '/design-system/' },
      { text: 'Changelog', link: '/changelog' },
    ],

    sidebar: {
      '/design-system/': [
        {
          text: "Get started",
          collapsed: false,
          items: [
            { text: "Introduction", link: "/design-system/" },
          ],
        },
        {
          text: "Foundations",
          collapsed: false,
          items: [
            { text: "Principles", link: "/design-system/principles" },
            { text: "Colour", link: "/design-system/colour" },
            { text: "Typography", link: "/design-system/typography" },
            { text: "Spacing, shape & motion", link: "/design-system/spacing-shape-motion" },
            { text: "Icons", link: "/design-system/icons" },
            { text: "Accessibility", link: "/design-system/accessibility" },
            { text: "Content & language", link: "/design-system/content" },
            { text: "Client theming", link: "/design-system/client-theming" },
          ],
        },
        {
          text: "Components",
          collapsed: false,
          items: [
            { text: "Button", link: "/design-system/button" },
            { text: "Checkbox", link: "/design-system/checkbox" },
            { text: "Chip & badge", link: "/design-system/chip-and-badge" },
            { text: "Split button", link: "/design-system/split-button" },
            { text: "Overflow menu", link: "/design-system/overflow-menu" },
          ],
        },
      ],
      '/services/elody-collection/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/services/elody-collection/' },
            { text: 'The Running Example', link: '/example-domain' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'Collection API Reference', link: '/services/elody-collection/api-reference' },
          ],
        },
        {
          text: 'Querying',
          collapsed: false,
          items: [
            { text: 'Advanced Filtering', link: '/services/elody-collection/advanced-filtering' },
          ],
        },
        {
          text: 'Security',
          collapsed: false,
          items: [
            { text: 'Policies & Permissions', link: '/services/elody-collection/policies-and-permissions' },
          ],
        },
        {
          text: 'Services',
          collapsed: false,
          items: [
            { text: 'Emails', link: '/services/elody-collection/emails' },
          ],
        },
      ],
      '/services/elody-frontend/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/services/elody-frontend/' },
            { text: 'The Running Example', link: '/example-domain' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'GraphQL-Driven UI', link: '/services/elody-frontend/graphql-driven-ui' },
            { text: 'Inputs & Teaser Metadata', link: '/services/elody-frontend/inputs-and-teaser-metadata' },
            { text: 'Formatters', link: '/services/elody-frontend/formatters' },
            { text: 'Translations', link: '/services/elody-frontend/translations' },
          ],
        },
        {
          text: 'Page Elements',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/services/elody-frontend/elements/' },
            { text: 'Window Element', link: '/services/elody-frontend/elements/window' },
            { text: 'Entity Lists & BaseLibrary', link: '/services/elody-frontend/elements/entity-list' },
            { text: 'Media Elements', link: '/services/elody-frontend/elements/media' },
            { text: 'Maps', link: '/services/elody-frontend/elements/map' },
          ],
        },
        {
          text: 'Lists & Views',
          collapsed: false,
          items: [
            { text: 'List Item Click Actions', link: '/services/elody-frontend/features/list-item-click-actions' },
            { text: 'Pipeline View Mode', link: '/services/elody-frontend/features/pipeline-view-mode' },
            { text: 'Rounded Counts', link: '/services/elody-frontend/features/rounded-counts' },
            { text: 'Bulk Edit', link: '/services/elody-frontend/features/bulk-edit' },
            { text: 'Merge Entities', link: '/services/elody-frontend/features/merge-entities' },
          ],
        },
        {
          text: 'Detail Pages',
          collapsed: false,
          items: [
            { text: 'Relation Pills', link: '/services/elody-frontend/features/relation-pills' },
            { text: 'Comments & Threads', link: '/services/elody-frontend/features/comments' },
            { text: 'History Viewer', link: '/services/elody-frontend/features/history-viewer' },
          ],
        },
        {
          text: 'Media',
          collapsed: false,
          items: [
            { text: 'Media Viewers', link: '/services/elody-frontend/features/media-viewers' },
            { text: 'External URL Mediafiles', link: '/services/elody-frontend/features/external-url-mediafiles' },
            { text: 'Embedded Viewer', link: '/services/elody-frontend/features/embedded-viewer' },
          ],
        },
        {
          text: 'Data Exchange',
          collapsed: false,
          items: [
            { text: 'Linked Open Data', link: '/services/elody-frontend/features/linked-open-data' },
          ],
        },
        {
          text: 'Security',
          collapsed: false,
          items: [
            { text: 'Auth & Session', link: '/services/elody-frontend/auth-session' },
            { text: 'UI Permissions', link: '/services/elody-frontend/permissions' },
          ],
        },
        {
          text: 'GraphQL Service',
          collapsed: false,
          items: [
            { text: 'GraphQL Modules', link: '/services/elody-frontend/graphql-modules' },
            { text: 'Building a Module', link: '/services/elody-frontend/building-a-module' },
            { text: 'GraphQL Service API Reference', link: '/services/elody-frontend/api-reference' },
            { text: 'Proxy Endpoints', link: '/services/elody-frontend/proxy-endpoints' },
          ],
        },
        {
          text: 'Build & Deploy',
          collapsed: false,
          items: [
            { text: 'Build Pipeline', link: '/services/elody-frontend/build-pipeline' },
            { text: 'Production Serving', link: '/services/elody-frontend/production-serving' },
            { text: 'Dynamic Tailwind Classes', link: '/services/elody-frontend/dynamic-tailwind-classes' },
          ],
        },
        {
          text: 'SHACL UI (in development)',
          link: '/services/elody-frontend/shacl-ui/',
          collapsed: true,
          items: [
            { text: 'Spec Examples', link: '/services/elody-frontend/shacl-ui/examples' },
            { text: 'Conformance', link: '/services/elody-frontend/shacl-ui/conformance' },
            { text: 'From GraphQL to TTL', link: '/services/elody-frontend/shacl-ui/from-graphql-to-ttl' },
            {
              text: 'Reference',
              link: '/services/elody-frontend/shacl-ui/reference/',
              collapsed: true,
              items: referenceSidebar.slice(1),
            },
          ],
        },
      ],
      '/': [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            { text: 'Getting Started', link: '/getting-started' },
            { text: 'The Running Example', link: '/example-domain' },
          ],
        },
        {
          text: 'Services',
          link: '/services/',
          collapsed: false,
          items: [
            { text: 'Elody Collection', link: '/services/elody-collection/' },
            { text: 'Elody Frontend', link: '/services/elody-frontend/' },
            { text: 'Elody Storage', link: '/services/elody-storage/' },
            { text: 'Elody Transcode Service', link: '/services/elody-transcode-service/' },
            { text: 'Elody OCR Service', link: '/services/elody-ocr-service/' },
            { text: 'Elody Antivirus Service', link: '/services/elody-antivirus-service/' },
            { text: 'Elody Filesystem Importer Service', link: '/services/elody-filesystem-importer-service/' },
            { text: 'Elody Cantaloupe', link: '/services/elody-cantaloupe/' },
            { text: 'Elody IIIF Manifest Mapper', link: '/services/elody-iiif-manifest-mapper/' },
            { text: 'Elody CSV Exporter', link: '/services/elody-csv-exporter/' },
            { text: 'Elody Canopy Generator', link: '/services/elody-canopy-generator/' },
          ],
        },
        {
          text: 'About',
          collapsed: false,
          items: [
            { text: 'Changelog', link: '/changelog' },
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
