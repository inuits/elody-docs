import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom from 'medium-zoom'

import 'medium-zoom/dist/style.css'
import './custom.css'
import StoryEmbed from './components/StoryEmbed.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('StoryEmbed', StoryEmbed)
  },
  setup() {
    const route = useRoute()
    const enableZoom = () =>
      mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })

    onMounted(enableZoom)
    watch(
      () => route.path,
      () => nextTick(enableZoom),
    )
  },
} satisfies Theme
