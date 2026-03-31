<template>
  <CapybaraLoader v-if="isLoading" :progress="loadingProgress" />
  <div id="experience">
    <canvas ref="canvasRef" class="experience-canvas"></canvas>
    <button class="night-mode-btn" @click="toggleNightMode"><svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg></button>
  </div>


  <GameTimer />
  <HintSystem :hints="['Regarde bien les plantes ', 'Date de naissance ', 'Maladie et allergies ']" />


  <ComputerOverlay
    :visible="overlays.computer"
    :iframe-src="computerSrc"
    @close="closeOverlay('computer')"
  />


  <ImageOverlay
    :visible="overlays.dog"
    image-src="/images/oslo.png"
    frame-style="wood"
    close-style="wood-close"
    @close="closeOverlay('dog')"
  />


  <ImageOverlay
    :visible="overlays.draw"
    image-src="/images/lea.png"
    frame-style="white"
    @close="closeOverlay('draw')"
  />


  <ImageOverlay
    :visible="overlays.anniv"
    image-src="/images/anniv.png"
    frame-style="white"
    @close="closeOverlay('anniv')"
  />


  <ImageOverlay
    :visible="overlays.chest"
    iframe-src="/combo-lock/index.html"
    frame-style="chest"
    @close="closeOverlay('chest')"
  />


  <ServerOverlay
    :visible="overlays.server"
    @close="closeOverlay('server')"
  />


  <SkeletonOverlay
    :visible="overlays.skeleton"
    @close="closeOverlay('skeleton')"
    @completed="onGameCompleted"
  />
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useThreeScene } from './composables/useThreeScene.js'
import CapybaraLoader from './components/CapybaraLoader.vue'
import GameTimer from './components/GameTimer.vue'
import HintSystem from './components/HintSystem.vue'
import ComputerOverlay from './components/ComputerOverlay.vue'
import ImageOverlay from './components/ImageOverlay.vue'
import ServerOverlay from './components/ServerOverlay.vue'
import SkeletonOverlay from './components/SkeletonOverlay.vue'

const canvasRef = ref(null)

const overlays = reactive({
  computer: false,
  dog: false,
  draw: false,
  anniv: false,
  chest: false,
  server: false,
  skeleton: false,
})

const computerSrc = ref('')

function onObjectClick(objectType) {
  if (objectType === 'computer') {
    computerSrc.value = '/Cabinet Deckard/Enigme Cabinet Deckard.html'
  }
  overlays[objectType] = true
  sceneApi.setControlsEnabled(false)
}

function closeOverlay(name) {
  overlays[name] = false
  if (name === 'computer') {
    computerSrc.value = ''
  }
  const anyOpen = Object.values(overlays).some(v => v)
  if (!anyOpen) {
    sceneApi.setControlsEnabled(true)
  }
}

function onGameCompleted() {
}


function onEscapeKey(event) {
  if (event.code === 'Escape') {
    for (const key of Object.keys(overlays)) {
      if (overlays[key]) {
        closeOverlay(key)
        return
      }
    }
  }
}


const emitProxy = (event, data) => {
  if (event === 'object-click') onObjectClick(data)
}

const sceneApi = useThreeScene(canvasRef, emitProxy)
const { toggleNightMode, isLoading, loadingProgress } = sceneApi

onMounted(() => {
  sceneApi.init()
  window.addEventListener('keydown', onEscapeKey)
})

onBeforeUnmount(() => {
  sceneApi.dispose()
  window.removeEventListener('keydown', onEscapeKey)
})
</script>

<style>
@import './style.css';

.night-mode-btn {
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 10;
  padding: 10px;
  border: none;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}
</style>

