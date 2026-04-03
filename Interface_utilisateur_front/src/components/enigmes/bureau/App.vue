<template>
  <IntroScreen v-if="showIntro" @finish="finishIntro" />
  <template v-else>
  <CapybaraLoader v-if="isLoading" :progress="loadingProgress" />
  <div id="experience">
    <canvas ref="canvasRef" class="experience-canvas"></canvas>
    <button class="night-mode-btn" @click="toggleNightMode"><svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg></button>
  </div>


  <HintSystem :hints="['Regarde bien les plantes ', 'Date de naissance ', 'Maladie et allergies ']" />




<DocumentInventory
  :documents="inventoryDocs"
  :z-index="1100"
  @open-document="openDocFromInventory"
/>


  <ComputerOverlay
    :visible="overlays.computer"
    :iframe-src="computerSrc"
    @close="closeOverlay('computer')"
  />


  <ImageOverlay
    :visible="overlays.dog"
    image-src="/enigmes/bureau/images/oslo.png"
    frame-style="wood"
    close-style="wood-close"
    @close="closeOverlay('dog')"
  />


  <ImageOverlay
    :visible="overlays.draw"
    image-src="/enigmes/bureau/images/lea.png"
    frame-style="white"
    @close="closeOverlay('draw')"
  />


  <ImageOverlay
    :visible="overlays.anniv"
    image-src="/enigmes/bureau/images/anniv.png"
    frame-style="white"
    @close="closeOverlay('anniv')"
  />


  <ImageOverlay
    :visible="overlays.chest"
    iframe-src="/enigmes/bureau/combo-lock/index.html"
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
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useThreeScene } from './composables/useThreeScene.js'
import CapybaraLoader from './components/CapybaraLoader.vue'
import IntroScreen from './components/IntroScreen.vue'
import DocumentInventory from './components/DocumentInventory.vue'

import HintSystem from './components/HintSystem.vue'
import ComputerOverlay from './components/ComputerOverlay.vue'
import ImageOverlay from './components/ImageOverlay.vue'
import ServerOverlay from './components/ServerOverlay.vue'
import SkeletonOverlay from './components/SkeletonOverlay.vue'

const canvasRef = ref(null)

const showIntro = ref(true)
function finishIntro() {
  showIntro.value = false
}

const gamePassed = ref(false)
const finalTime = ref('00:00')
const finalScore = ref(0)
const discovered = reactive({ dog: false, draw: false, anniv: false, server: false, chest: false })

const inventoryDocs = computed(() => [
  { id: 'dog', label: 'Photo d\'Oslo', sub: 'Le chien de la famille', icon: 'image', discovered: discovered.dog },
  { id: 'draw', label: 'Dessin de Léa', sub: 'Cadre blanc', icon: 'image', discovered: discovered.draw },
  { id: 'anniv', label: 'Photo de mariage', sub: 'Sur le mur', icon: 'image', discovered: discovered.anniv },
  { id: 'chest', label: 'Coffre fort', sub: 'Combinaison', icon: 'lock', discovered: discovered.chest },
  { id: 'server', label: 'Serveur secret', sub: 'Surchauffe', icon: 'computer', discovered: discovered.server }
])

function openDocFromInventory(id) {
  overlays[id] = true
  sceneApi.setControlsEnabled(false)
}

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
    computerSrc.value = '/enigmes/bureau/Cabinet Deckard/Enigme Cabinet Deckard.html'
  }
  if (['dog', 'draw', 'anniv', 'server', 'chest'].includes(objectType)) {
    discovered[objectType] = true
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
  gamePassed.value = true
  if (window.getTimerValue) finalTime.value = window.getTimerValue()
  if (window.getScoreValue) finalScore.value = window.getScoreValue()
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
  window.addEventListener('keydown', onEscapeKey)
  window.addEventListener('message', onMessage)
  if (!showIntro.value) sceneApi.init()
})

const onMessage = (event) => {
  if (event.data?.type === 'ENIGMA_COMPLETED') {
    onGameCompleted()
    closeOverlay('computer')
  }
}

watch(showIntro, async (newVal) => {
  if (!newVal) {
    await nextTick()
    sceneApi.init()
  }
})

onBeforeUnmount(() => {
  sceneApi.dispose()
  window.removeEventListener('keydown', onEscapeKey)
  window.removeEventListener('message', onMessage)
})
</script>

<style>
@import './style.css';

.night-mode-btn {
  position: absolute;
  top: 80px;
  right: 24px;
  z-index: 10;
  padding: 10px;
  border: none;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}
</style>







