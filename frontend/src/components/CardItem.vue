<template>
  <div class="card">
    <button
      type="button"
      class="card-header"
      :aria-expanded="card.expanded"
      :aria-controls="bodyId"
      @click="$emit('toggle-expand')"
    >
      <span class="drag-handle" aria-hidden="true" @click.stop>&#x283F;</span>
      <span :id="titleId" class="card-title">{{ card.title }}</span>
      <span class="expand-icon" aria-hidden="true">{{ card.expanded ? '−' : '+' }}</span>
    </button>
    <div
      :id="bodyId"
      ref="bodyEl"
      class="card-body"
      role="region"
      :aria-labelledby="titleId"
      :aria-hidden="!card.expanded"
    >
      <div ref="contentEl" class="card-body-inner">
        <p v-for="i in 3" :key="i">
          这是 {{ card.title }} 的占位内容。可拖拽手柄（⠿）调整卡片顺序。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  card: { type: Object, required: true },
  isAnimating: Boolean
})

defineEmits(['toggle-expand'])

const bodyEl = ref(null)
const contentEl = ref(null)
const titleId = `card-title-${props.card.id}`
const bodyId = `card-body-${props.card.id}`
let resizeObserver = null

function syncExpandedHeight() {
  if (!props.card.expanded || !bodyEl.value || !contentEl.value) return
  bodyEl.value.style.height = contentEl.value.scrollHeight + 'px'
}

onMounted(() => {
  if (contentEl.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (!props.isAnimating) syncExpandedHeight()
    })
    resizeObserver.observe(contentEl.value)
  }
})

watch(
  () => props.isAnimating,
  (isAnimating) => {
    if (!isAnimating) syncExpandedHeight()
  },
  { flush: 'post' }
)

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.card {
  width: min(340px, calc(100vw - 48px));
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  overflow: hidden;
  user-select: none;
  flex-shrink: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 18px;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.card-header:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: -3px;
}

.drag-handle {
  cursor: grab;
  color: rgba(255, 255, 255, 0.35);
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

.drag-handle:active {
  cursor: grabbing;
}

.card-title {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-align: left;
}

.expand-icon {
  font-size: 18px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.card-body {
  overflow: hidden;
  height: 0;
}

.card-body-inner {
  padding: 4px 18px 16px;
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}

.card-body-inner p {
  margin-bottom: 6px;
}

.card-body-inner p:last-child {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .card {
    width: calc(100vw - 32px);
  }
}
</style>
