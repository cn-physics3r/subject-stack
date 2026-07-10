<template>
  <div class="capsule capsule-base">
    <span class="date">{{ dateStr }}</span>
    <span class="separator">|</span>
    <span class="time">{{ timeStr }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const dateStr = ref('')
const timeStr = ref('')
let timer = null

function pad(n) {
  return String(n).padStart(2, '0')
}

function update() {
  const now = new Date()
  dateStr.value = `${pad(now.getMonth() + 1)}/${pad(now.getDate())}`
  timeStr.value = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  timer = setTimeout(update, 1000 - now.getMilliseconds())
}

onMounted(() => {
  update()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
.capsule {
  position: fixed;
  top: 20px;
  right: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 9px 28px 11px 28px;
}

.date {
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}

.separator {
  font-size: 15px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
}

.time {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.95);
}
</style>
