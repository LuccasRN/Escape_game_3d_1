<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="game-overlay"
      @click.self="$emit('close')"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false }
})
defineEmits(['close'])
</script>

<style scoped>
.game-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
