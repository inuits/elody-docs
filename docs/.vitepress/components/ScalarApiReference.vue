<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  specUrl: {
    type: String,
    required: true,
  },
})

const container = ref(null)
const { isDark } = useData()
const loaded = ref(false)

onMounted(() => {
  const script = document.createElement('script')
  // Pinned: 1.53.x crashes on render (TypeError on null .style).
  script.src = 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.52.6/dist/browser/standalone.min.js'
  script.onload = async () => {
    loaded.value = true
    // Mount after Vue has removed the loading slot, or Scalar's first render races it.
    await nextTick()
    window.Scalar.createApiReference(container.value, {
      url: props.specUrl,
      theme: isDark.value ? 'purple' : 'default',
      layout: 'modern',
      searchHotKey: 'k',
    })
  }
  document.head.appendChild(script)
})
</script>

<template>
  <div ref="container" class="scalar-container">
    <div v-if="!loaded" class="loading">Loading the API reference…</div>
  </div>
</template>

<style scoped>
.scalar-container {
  min-height: 100vh;
  width: 100%;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: var(--vp-c-text-2);
}
</style>
