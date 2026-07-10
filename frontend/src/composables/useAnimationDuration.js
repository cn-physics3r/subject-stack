import { ref, inject, provide } from 'vue'

const DURATION_KEY = Symbol('animationDuration')

export function useAnimationDuration() {
  const state = inject(DURATION_KEY)
  if (!state) throw new Error('useAnimationDuration() requires a parent component to call createAnimationState()')
  return state
}

export function createAnimationState() {
  const duration = ref(350)
  function setDuration(ms) {
    duration.value = ms
  }
  provide(DURATION_KEY, { duration, setDuration })
}
