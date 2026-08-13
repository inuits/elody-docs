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
            ],
          },
          {
            text: 'Elody Frontend',
            link: '/services/elody-frontend/',
            items: [
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
