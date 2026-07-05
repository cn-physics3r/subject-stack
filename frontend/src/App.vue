<template>
  <div id="app">
    <Capsule />
    <DateTimeCapsule />
    <CardStack />
  </div>
</template>

<script setup>
import Capsule from './components/Capsule.vue'
import DateTimeCapsule from './components/DateTimeCapsule.vue'
import CardStack from './components/CardStack.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

#app {
  background-image: url('/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

#app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 0;
}
</style>