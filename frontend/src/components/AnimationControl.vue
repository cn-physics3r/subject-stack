<template>
  <div class="anim-control">
    <span class="label">动画速度</span>
    <input
      type="range"
      min="50"
      max="1500"
      step="50"
      :value="duration"
      @input="onInput"
    />
    <span class="value">{{ duration }}ms</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const duration = ref(350)

function apply() {
  document.documentElement.style.setProperty('--anim-duration', `${duration.value}ms`)
}

function onInput(e) {
  duration.value = Number(e.target.value)
  apply()
}

onMounted(apply)
</script>

<style scoped>
.anim-control {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 0.5px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  user-select: none;
}

.label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

.value {
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  min-width: 52px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 160px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 0.5px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 0.5px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}
</style>
