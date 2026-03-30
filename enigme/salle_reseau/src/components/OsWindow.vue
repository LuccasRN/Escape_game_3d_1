<template>
  <div class="os-window">
    <div class="os-window-header">
      <span class="window-title">{{ title }}</span>
      <button class="window-close" @click="$emit('close')"></button>
    </div>
    <div class="os-window-content">
      <div class="window-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.os-window {
  position: absolute; top: 15%; left: 20%; right: 20%; bottom: 15%;
  background: rgba(0, 10, 15, 0.9);
  border: 1px solid cyan;
  box-shadow: 0 0 20px rgba(0,255,255,0.2);
  display: flex; flex-direction: column;
}
.os-window-header {
  background: #06101f; padding: 10px; display: flex; justify-content: space-between;
  border-bottom: 1px solid cyan; align-items: center;
}
.window-title { font-size: 0.9rem; font-family: monospace; color: cyan; font-weight: bold; }
.window-close { background: none; border: none; font-size: 1rem; cursor: pointer; color: red; opacity: 0.7; }
.window-close::after { content: 'X'; }
.window-close:hover { opacity: 1; text-shadow: 0 0 5px red; }
.os-window-content { flex: 1; padding: 20px; overflow-y: auto; }
.window-inner { box-sizing: border-box; }
</style>
