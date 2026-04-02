<template>
  <div ref="containerRef" class="scene3d-container">
    <CapybaraLoader v-if="isLoading" :progress="loadingProgress" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThreeScene } from '../composables/useThreeScene.js'
import CapybaraLoader from './CapybaraLoader.vue'

const containerRef = ref(null)
const { init, isLoading, loadingProgress } = useThreeScene(containerRef)

onMounted(() => {
  init()
})
</script>

<style scoped>
.scene3d-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;
}

.loading-content {
  text-align: center;
  color: #fff;
  font-family: system-ui, sans-serif;
}

.loading-content p {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
