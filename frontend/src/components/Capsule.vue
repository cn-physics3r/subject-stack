<template>
  <div class="capsule">
    <span class="name">{{ config.name }}</span>
    <span class="separator">|</span>
    <span class="version">{{ config.version }}</span>
  </div>
</template>

<script setup>
import cfg from '../../../config.json'

const config = cfg
</script>

<style scoped>
.capsule {
  position: fixed;
  top: 20px;
  left: 24px;
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

.name {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.95);
}

.separator {
  font-size: 15px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
}

.version {
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
}
</style>
