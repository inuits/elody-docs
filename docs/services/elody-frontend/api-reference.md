---
layout: page
title: GraphQL Service API Reference
sidebar: false
aside: false
footer: false
---

<script setup>
import { ref, onMounted } from 'vue'
import ScalarApiReference from '../../.vitepress/components/ScalarApiReference.vue'

const isClient = ref(false)
onMounted(() => { isClient.value = true })
</script>

<div class="scalar-fullpage">
  <ScalarApiReference v-if="isClient" spec-url="/api/graphql-service-api.json" />
</div>

<style>
.scalar-fullpage {
  position: fixed;
  top: var(--vp-nav-height);
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background: var(--vp-c-bg);
  z-index: 10;
}
</style>
