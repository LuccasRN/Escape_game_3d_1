<template>
  <div v-if="notification" class="notification">
    <span v-html="notification"></span>
  </div>
</template>

<script setup>
defineProps({
  notification: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.notification {
  position: absolute;
  top: 10%; left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 20, 20, 0.85);
  border: 1px solid cyan;
  color: cyan;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 4px;
  box-shadow: 0 0 15px cyan;
  pointer-events: none;
  z-index: 50;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 5px cyan; }
  50% { box-shadow: 0 0 20px cyan; }
  100% { box-shadow: 0 0 5px cyan; }
}
</style>
