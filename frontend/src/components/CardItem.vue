<template>
  <div class="card">
    <div class="card-header" @click="$emit('toggle-expand')">
      <span class="drag-handle">&#x283F;</span>
      <span class="card-title">{{ card.title }}</span>
      <span class="expand-icon">{{ card.expanded ? '−' : '+' }}</span>
    </div>
    <div class="card-body" :style="{ maxHeight: card.expanded ? h + 'px' : '0' }">
      <div ref="contentEl" class="card-body-inner">
        <p v-for="i in 3" :key="i">
          这是 {{ card.title }} 的占位内容。可拖拽手柄（⠿）调整卡片顺序。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  card: { type: Object, required: true }
})

defineEmits(['toggle-expand'])

const contentEl = ref(null)
const h = ref(0)

onMounted(() => {
  h.value = contentEl.value?.scrollHeight ?? 0
})
</script>

<style scoped>
.card {
  width: 340px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  overflow: hidden;
  user-select: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  cursor: pointer;
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
}

.expand-icon {
  font-size: 18px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.card-body {
  overflow: hidden;
  transition: max-height 0.35s ease;
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
</style>
