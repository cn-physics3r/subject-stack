<template>
  <div class="capsule">
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
}

onMounted(() => {
  update()
  timer = setInterval(update, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
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
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 0.5px solid rgba(255, 255, 255, 0.35);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  user-select: none;
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
