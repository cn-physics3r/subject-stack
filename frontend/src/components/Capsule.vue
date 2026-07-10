<template>
  <div class="capsule capsule-base">
    <span class="name">{{ config.name }}</span>
    <span class="separator">|</span>
    <span class="version">{{ config.version }}</span>
  </div>
</template>

<script setup>
import config from 'virtual:app-config'
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
