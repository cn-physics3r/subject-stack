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
      <CardItem :card="element" @toggle-expand="toggleExpand(element.id)" />
    </template>
  </draggable>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
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
const { duration: animDuration, isAnimating } = useAnimationDuration()
let suppressClick = false
let suppressTimer = null
let activeAnim = null

onUnmounted(() => {
  if (activeAnim) cancelAnimationFrame(activeAnim.raf)
  if (suppressTimer) clearTimeout(suppressTimer)
})

function onDragStart() {
  if (activeAnim) {
    cancelAnimationFrame(activeAnim.raf)
    if (activeAnim.targetEl && activeAnim.toH != null) {
      const prevBody = activeAnim.targetEl.querySelector('.card-body')
      if (prevBody) prevBody.style.height = activeAnim.toH + 'px'
    }
    activeAnim = null
    isAnimating.value = false
  }
  getCards().forEach(el => { el.style.transition = ''; el.style.transform = '' })
}

function scheduleSuppressRelease() {
  if (suppressTimer) clearTimeout(suppressTimer)
  suppressTimer = setTimeout(() => {
    suppressClick = false
    suppressTimer = null
  }, animDuration.value)
}

watch(animDuration, () => {
  if (suppressClick) scheduleSuppressRelease()
})

function onDragEnd() {
  suppressClick = true
  scheduleSuppressRelease()
}

function getCards() {
  const container = stackRef.value?.$el
  if (!container) return []
  return [...container.querySelectorAll('.card')]
}

function captureRects() {
  return getCards().map(el => el.getBoundingClientRect())
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function measureFinalRects(targetEl, finalBodyHeight) {
  const els = getCards()
  const body = targetEl.querySelector('.card-body')
  const container = stackRef.value?.$el
  if (!body || !container) return []

  const savedHeight = body.style.height
  body.style.height = finalBodyHeight + 'px'
  void container.offsetHeight

  const rects = els.map(el => el.getBoundingClientRect())

  body.style.height = savedHeight
  void container.offsetHeight

  return rects
}

function animateHeightAndFLIP(targetEl, fromH, toH, prevRects, finalRects) {
  const els = getCards()
  const body = targetEl.querySelector('.card-body')
  if (!body) return

  if (activeAnim) cancelAnimationFrame(activeAnim.raf)

  const duration = animDuration.value
  const start = performance.now()
  const targets = []

  els.forEach((el, i) => {
    const prev = prevRects[i]
    const final = finalRects[i]
    if (!prev || !final) return
    if (Math.abs(final.left - prev.left) < 1 && Math.abs(final.top - prev.top) < 1) return
    el.style.transition = 'none'
    targets.push({
      el,
      prevLeft: prev.left,
      prevTop: prev.top,
      finalLeft: final.left,
      finalTop: final.top,
      currentTx: 0,
      currentTy: 0
    })
  })

  const container = stackRef.value?.$el

  isAnimating.value = true
  body.style.height = fromH + 'px'
  void container.offsetHeight

  function frame(now) {
    const t = Math.min((now - start) / duration, 1)
    const e = easeInOut(t)
    body.style.height = (fromH + (toH - fromH) * e) + 'px'
    void container.offsetHeight

    targets.forEach((tg) => {
      const desiredLeft = tg.prevLeft + (tg.finalLeft - tg.prevLeft) * e
      const desiredTop = tg.prevTop + (tg.finalTop - tg.prevTop) * e
      const cur = tg.el.getBoundingClientRect()
      const naturalLeft = cur.left - tg.currentTx
      const naturalTop = cur.top - tg.currentTy
      tg.currentTx = desiredLeft - naturalLeft
      tg.currentTy = desiredTop - naturalTop
      tg.el.style.transform = `translate(${tg.currentTx}px, ${tg.currentTy}px)`
    })

    if (t < 1) {
      activeAnim.raf = requestAnimationFrame(frame)
    } else {
      isAnimating.value = false
      body.style.height = toH + 'px'
      targets.forEach(({ el }) => {
        el.style.transition = ''
        el.style.transform = ''
      })
      activeAnim = null
    }
  }

  activeAnim = { raf: requestAnimationFrame(frame), targetEl, toH }
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

  if (activeAnim) {
    cancelAnimationFrame(activeAnim.raf)
    if (activeAnim.targetEl && activeAnim.toH != null) {
      const prevBody = activeAnim.targetEl.querySelector('.card-body')
      if (prevBody) prevBody.style.height = activeAnim.toH + 'px'
    }
    activeAnim = null
    isAnimating.value = false
    getCards().forEach(el => { el.style.transition = ''; el.style.transform = '' })
  }

  const prevRects = captureRects()
  const targetHeight = inner.scrollHeight || 0
  const currentHeight = body.offsetHeight || 0

  if (card.expanded) {
    card.expanded = false
    const finalRects = measureFinalRects(targetEl, 0)
    animateHeightAndFLIP(targetEl, currentHeight, 0, prevRects, finalRects)
  } else {
    card.expanded = true
    const finalRects = measureFinalRects(targetEl, targetHeight)
    animateHeightAndFLIP(targetEl, currentHeight, targetHeight, prevRects, finalRects)
  }
}
</script>

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
}

.ghost-card {
  opacity: 0.3;
}
</style>
