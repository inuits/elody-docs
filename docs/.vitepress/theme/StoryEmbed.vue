<template>
  <figure ref="figure" class="story-embed">
    <ClientOnly>
      <div class="story-frame" :style="{ height }">
        <iframe
          :src="src"
          :title="title ?? `Storybook story ${id}`"
          :style="frameStyle"
        />
      </div>
    </ClientOnly>
    <figcaption>
      <code>{{ id }}</code>
      <a :href="src" target="_blank" rel="noreferrer">Open in Storybook ↗</a>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { armScrollGuard } from "./storyScrollGuard";

const props = withDefaults(
  defineProps<{
    /** Storybook story id, e.g. base-basebutton--variants. */
    id: string;
    title?: string;
    height?: string;
    /** Applies a [data-elody-client] tenant scope to the embedded story. */
    client?: string;
    /** Renders the story this many px wide and scales it down to fit, so
     * layouts that switch on the window width show their desktop form. */
    width?: number;
  }>(),
  { height: "320px" },
);

// Set VITE_STORYBOOK_BASE at build time to point the docs at the published
// Storybook; the default is the local workshop on its usual port.
const base =
  import.meta.env.VITE_STORYBOOK_BASE ?? "http://localhost:6006";

const figure = ref<HTMLElement>();
const available = ref(0);
let observer: ResizeObserver | undefined;

onMounted(() => {
  armScrollGuard();
  if (!props.width || !figure.value) return;
  observer = new ResizeObserver(([entry]) => {
    available.value = entry.contentRect.width;
  });
  observer.observe(figure.value);
});
onBeforeUnmount(() => observer?.disconnect());

const frameStyle = computed(() => {
  if (!props.width || !available.value) return { height: "100%" };
  const scale = Math.min(1, available.value / props.width);
  return {
    width: `${props.width}px`,
    height: `${100 / scale}%`,
    transform: `scale(${scale})`,
    transformOrigin: "0 0",
  };
});

const src = computed(() => {
  const params = new URLSearchParams({ id: props.id, viewMode: "story" });
  if (props.client) params.set("globals", `elodyClient:${props.client}`);
  return `${base}/iframe.html?${params.toString()}`;
});
</script>

<style scoped>
.story-embed {
  margin: 20px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.story-frame {
  overflow: hidden;
}

.story-embed iframe {
  display: block;
  width: 100%;
  border: 0;
  background: #fff;
}

.story-embed figcaption {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

.story-embed figcaption code {
  color: var(--vp-c-text-2);
}
</style>
