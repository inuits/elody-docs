import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import mediumZoom from 'medium-zoom'

import 'medium-zoom/dist/style.css'
import './custom.css'

export default {
  extends: DefaultTheme,
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
