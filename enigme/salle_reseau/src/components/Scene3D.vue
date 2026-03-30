<template>
  <div class="scene-wrapper">
    <div ref="container" class="scene-container"></div>
    <CapybaraLoader v-if="isLoading" :progress="loadingProgress" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useThreeScene } from '../composables/useThreeScene.js'
import CapybaraLoader from './CapybaraLoader.vue'

const props = defineProps({
  wifiConnected: {
    type: Boolean,
    default: false
  },
  safeOpened: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onWifiConnected', 'onMonitorClick', 'onSafeClick'])

const container = ref(null)

const {
  isLoading,
  loadingProgress,
  initThree,
  cleanup,
  updateMonitorState,
  openSafeDoor
} = useThreeScene(container, props, emit)

onMounted(() => {
  initThree()
})

onBeforeUnmount(() => {
  cleanup()
})

watch(() => props.wifiConnected, (newVal) => {
  updateMonitorState(newVal)
})

watch(() => props.safeOpened, (newVal) => {
  if (newVal) {
    openSafeDoor()
  }
})
</script>

<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}
.scene-container {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
