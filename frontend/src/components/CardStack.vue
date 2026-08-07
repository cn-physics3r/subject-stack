<template>
  <draggable
    v-model="cards"
    item-key="id"
    :animation="animDuration"
    handle=".drag-handle"
    ghost-class="ghost-card"
    @start="onDragStart"
    @end="onDragEnd"
    ref="stackRef"
    class="card-stack"
  >
    <template #item="{ element }">
      <CardItem :card="element" :is-animating="isAnimating" @toggle-expand="toggleExpand(element.id)" />
    </template>
  </draggable>
</template>

<script setup>
import { ref, nextTick, onUnmounted } from 'vue'
import draggable from 'vuedraggable'
import CardItem from './CardItem.vue'
import { useAnimationDuration } from '../composables/useAnimationDuration'

const cards = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `卡片 ${i + 1}`,
    expanded: false
  }))
)

const stackRef = ref(null)
const { duration: animDuration } = useAnimationDuration()
const isAnimating = ref(false)
let suppressClick = false
let suppressTimer = null
let activeAnim = null
const DRAG_CLICK_GUARD_MS = 100

function cancelActiveAnim() {
  if (!activeAnim) return
  const transition = activeAnim
  activeAnim = null
  transition.skipTransition()
  isAnimating.value = false
}

onUnmounted(() => {
  cancelActiveAnim()
  if (suppressTimer) clearTimeout(suppressTimer)
})

function onDragStart() {
  cancelActiveAnim()
}

function scheduleSuppressRelease() {
  if (suppressTimer) clearTimeout(suppressTimer)
  suppressTimer = setTimeout(() => {
    suppressClick = false
    suppressTimer = null
  }, DRAG_CLICK_GUARD_MS)
}

function onDragEnd() {
  suppressClick = true
  scheduleSuppressRelease()
}

function getCards() {
  const container = stackRef.value?.$el
  if (!container) return []
  return [...container.querySelectorAll('.card')]
}

function toggleExpand(id) {
  if (suppressClick) return
  const card = cards.value.find(c => c.id === id)
  if (!card) return

  const els = getCards()
  const cardIdx = cards.value.indexOf(card)
  const targetEl = els[cardIdx]
  if (!targetEl) return

  const body = targetEl.querySelector('.card-body')
  const inner = targetEl.querySelector('.card-body-inner')
  if (!body || !inner) return

  cancelActiveAnim()

  const willExpand = !card.expanded
  const finalHeight = willExpand ? inner.scrollHeight : 0

  document.documentElement.style.setProperty('--card-animation-duration', `${animDuration.value}ms`)
  isAnimating.value = true

  const transition = document.startViewTransition(async () => {
    card.expanded = willExpand
    body.style.height = finalHeight + 'px'
    await nextTick()
  })

  activeAnim = transition
  transition.finished.then(
    () => finishTransition(transition),
    () => finishTransition(transition)
  )
}

function finishTransition(transition) {
  if (activeAnim !== transition) return
  activeAnim = null
  isAnimating.value = false
}
</script>

<style>
::view-transition {
  pointer-events: none;
}

::view-transition-group(*),
::view-transition-old(*),
::view-transition-new(*) {
  animation-duration: var(--card-animation-duration, 350ms);
  animation-timing-function: cubic-bezier(0.455, 0.03, 0.515, 0.955);
}
</style>

<style scoped>
.card-stack {
  display: flex;
  flex-flow: column wrap;
  align-content: flex-start;
  height: 100%;
  padding: 84px 24px 20px;
  position: relative;
  z-index: 1;
  gap: 14px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.ghost-card {
  opacity: 0.3;
}

@media (max-width: 640px) {
  .card-stack {
    flex-flow: column nowrap;
    align-items: flex-start;
    height: 100%;
    padding: 118px 16px 88px;
    gap: 12px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
