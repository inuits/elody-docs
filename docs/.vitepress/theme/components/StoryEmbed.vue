<template>
  <div v-if="todo" class="story-embed">
    <div class="story-embed-fallback">
      No Storybook story for this component yet — see
      <code>.storybook/DESIGN_SYSTEM_TODO.md</code> in <code>inuits-dams-pwa</code>
      (planned id: <code>{{ id }}</code>).
    </div>
  </div>
  <div v-else class="story-embed">
    <iframe
      v-if="reachable !== false"
      :src="storyUrl"
      :style="{ height: `${height}px` }"
      loading="lazy"
      :title="`Storybook story ${id}`"
    />
    <div v-else class="story-embed-fallback">
      Storybook is not reachable at <code>{{ base }}</code>. Start it with
      <code>pnpm storybook</code> in <code>inuits-dams-pwa</code>, or set
      <code>VITE_STORYBOOK_BASE</code> when building the docs.
    </div>
    <a class="story-embed-link" :href="canvasUrl" target="_blank" rel="noreferrer">
      Open in Storybook ↗
    </a>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  height: { type: Number, default: 240 },
  // Story does not exist yet; render a pointer to the TODO list instead of a
  // broken iframe.
  todo: { type: Boolean, default: false },
})

const base = (import.meta.env.VITE_STORYBOOK_BASE ?? 'http://localhost:6006').replace(/\/$/, '')
const storyUrl = computed(() => `${base}/iframe.html?id=${props.id}&viewMode=story`)
const canvasUrl = computed(() => `${base}/?path=/story/${props.id}`)

// null = unknown (render the iframe optimistically), false = definitely down.
const reachable = ref<boolean | null>(null)

onMounted(async () => {
  try {
    await fetch(`${base}/iframe.html`, { mode: 'no-cors' })
    reachable.value = true
  } catch {
    reachable.value = false
  }
})
</script>

<style scoped>
.story-embed {
  margin: 16px 0;
}
.story-embed iframe {
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: #fff;
}
.story-embed-fallback {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.story-embed-link {
  display: inline-block;
  margin-top: 4px;
  font-size: 12px;
}
</style>
