<template>
  <div class="anim-control capsule-base">
    <label class="label" for="animation-duration">动画速度</label>
    <input
      id="animation-duration"
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
import { useAnimationDuration } from '../composables/useAnimationDuration'

const { duration, setDuration } = useAnimationDuration()

function onInput(e) {
  setDuration(Number(e.target.value))
}
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

input[type="range"]:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.9);
  outline-offset: 5px;
}

@media (max-width: 640px) {
  .anim-control {
    bottom: 12px;
    width: calc(100% - 32px);
    gap: 10px;
    padding: 10px 16px;
  }

  input[type="range"] {
    flex: 1;
    min-width: 0;
    width: auto;
  }
}
</style>
