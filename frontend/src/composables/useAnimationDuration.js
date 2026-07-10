import { ref, inject, provide } from 'vue'

const DURATION_KEY = Symbol('animationDuration')

export function useAnimationDuration() {
  const state = inject(DURATION_KEY)
  if (state) return state

  const duration = ref(350)
  const isAnimating = ref(false)
  function setDuration(ms) {
    duration.value = ms
  }
  return { duration, setDuration, isAnimating }
}

export function createAnimationState() {
  const duration = ref(350)
  const isAnimating = ref(false)
  function setDuration(ms) {
    duration.value = ms
  }
  provide(DURATION_KEY, { duration, setDuration, isAnimating })
}
