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
    ],

    sidebar: [
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
              { text: 'Policies & Permissions', link: '/services/elody-collection/policies-and-permissions' },
            ],
          },
          {
            text: 'Elody Frontend',
            link: '/services/elody-frontend/',
            items: [
              { text: 'GraphQL-Driven UI', link: '/services/elody-frontend/graphql-driven-ui' },
              { text: 'Translations', link: '/services/elody-frontend/translations' },
              { text: 'Build Pipeline', link: '/services/elody-frontend/build-pipeline' },
              { text: 'Production Serving', link: '/services/elody-frontend/production-serving' },
              { text: 'Auth & Session', link: '/services/elody-frontend/auth-session' },
              { text: 'Proxy Endpoints', link: '/services/elody-frontend/proxy-endpoints' },
              { text: 'Dynamic Tailwind Classes', link: '/services/elody-frontend/dynamic-tailwind-classes' },
              { text: 'Comments & Threads', link: '/services/elody-frontend/features/comments' },
              { text: 'Rounded Counts', link: '/services/elody-frontend/features/rounded-counts' },
              { text: 'Bulk Edit', link: '/services/elody-frontend/features/bulk-edit' },
              { text: 'External URL Mediafiles', link: '/services/elody-frontend/features/external-url-mediafiles' },
              { text: 'Embedded Viewer', link: '/services/elody-frontend/features/embedded-viewer' },
              { text: 'Media Viewers', link: '/services/elody-frontend/features/media-viewers' },
            ],
          },
        ],
      },
    ],

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
