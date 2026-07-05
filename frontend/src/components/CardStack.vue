<template>
  <draggable
    v-model="cards"
    item-key="id"
    :animation="250"
    handle=".drag-handle"
    ghost-class="ghost-card"
    class="card-stack"
  >
    <template #item="{ element }">
      <CardItem :card="element" @toggle-expand="toggleExpand(element.id)" />
    </template>
  </draggable>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import CardItem from './CardItem.vue'

const cards = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `卡片 ${i + 1}`,
    expanded: false
  }))
)

function toggleExpand(id) {
  const card = cards.value.find(c => c.id === id)
  if (card) card.expanded = !card.expanded
}
</script>

<style>
.card-stack {
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
  height: 100%;
  padding: 84px 24px 20px;
  position: relative;
  z-index: 1;
  gap: 14px;
}

.ghost-card {
  opacity: 0.3;
}
</style>
