<template>
  <IntroScreen v-if="showIntro" @finish="finishIntro" />

  <template v-else>
    <CapybaraLoader v-if="isLoading" :progress="loadingProgress" />
    <div id="experience">
      <canvas ref="canvasRef" class="experience-canvas"></canvas>
      <button class="night-mode-btn" @click="toggleNightMode"><svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg></button>
    </div>


    <GameTimer v-if="!gamePassed" />
    <HintSystem :hints="['Regarde bien les plantes ', 'Date de naissance ', 'Maladie et allergies ']" />

    <div v-if="gamePassed" class="overlay success">
      <h2>Félicitations</h2>
      <p>Vous avez terminé le bureau !</p>
      <p class="final-time">Temps final : {{ finalTime }}</p>
      <p class="final-score">Score : {{ finalScore }} / 1000</p>
    </div>

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

    <!-- Quick info modals for inventory -->
    <Teleport to="body">
      <div v-if="infoModal" class="info-modal-overlay" @click.self="closeInfoModal">
        <div class="info-modal-card">
          <button class="info-modal-close" @click="closeInfoModal">&times;</button>
          <div v-if="infoModal === 'server'" class="info-modal-body">
            <div class="info-modal-icon">&#128421;</div>
            <h3>Serveur de fichiers</h3>
            <p class="info-modal-label">Adresse IP</p>
            <p class="info-modal-value">192.168.56.100</p>
          </div>
          <div v-if="infoModal === 'chest'" class="info-modal-body">
            <div class="info-modal-icon">&#128274;</div>
            <h3>Note du coffre</h3>
            <p class="info-modal-label">Port de connexion FTP</p>
            <p class="info-modal-value">21</p>
            <p class="info-modal-hint">connect IP:Port</p>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useThreeScene } from './composables/useThreeScene.js'
import IntroScreen from './components/IntroScreen.vue'
import CapybaraLoader from './components/CapybaraLoader.vue'
import GameTimer from './components/GameTimer.vue'
import HintSystem from './components/HintSystem.vue'
import ComputerOverlay from './components/ComputerOverlay.vue'
import ImageOverlay from './components/ImageOverlay.vue'
import ServerOverlay from './components/ServerOverlay.vue'
import SkeletonOverlay from './components/SkeletonOverlay.vue'
import DocumentInventory from '../../DocumentInventory.vue'

const canvasRef = ref(null)
const showIntro = ref(true)

function finishIntro() {
  showIntro.value = false
  nextTick(() => {
    sceneApi.init()
  })
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
    computerSrc.value = '/Cabinet Deckard/Enigme Cabinet Deckard.html'
  }
  if (['dog', 'draw', 'anniv', 'server', 'chest'].includes(objectType)) {
    discovered[objectType] = true
  }
  overlays[objectType] = true
  sceneApi.setControlsEnabled(false)
}

const discovered = reactive({ dog: false, draw: false, anniv: false, server: false, chest: false })

const inventoryDocs = computed(() => [
  { id: 'dog', label: 'Photo d\'Oslo', sub: 'Le chien de la famille', icon: 'image', discovered: discovered.dog },
  { id: 'draw', label: 'Dessin de L\u00e9a', sub: 'Cadre blanc', icon: 'image', discovered: discovered.draw },
  { id: 'anniv', label: 'Photo d\'anniversaire', sub: 'Cadre blanc', icon: 'image', discovered: discovered.anniv },
  { id: 'doc_server', label: 'IP du serveur', sub: '192.168.56.100', icon: 'pc', discovered: discovered.server },
  { id: 'doc_chest', label: 'Port de connexion', sub: 'Port FTP : 21', icon: 'key', discovered: discovered.chest },
])

const infoModal = ref(null)

function openDocFromInventory(id) {
  if (id === 'doc_server') {
    infoModal.value = 'server'
  } else if (id === 'doc_chest') {
    infoModal.value = 'chest'
  } else {
    overlays[id] = true
  }
  sceneApi.setControlsEnabled(false)
}

function closeInfoModal() {
  infoModal.value = null
  const anyOpen = Object.values(overlays).some(v => v)
  if (!anyOpen) {
    sceneApi.setControlsEnabled(true)
  }
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

const gamePassed = ref(false)
const finalTime = ref('00:00')
const finalScore = ref(0)
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
  if (!showIntro.value) {
    sceneApi.init()
  }
  window.addEventListener('keydown', onEscapeKey)
  window.addEventListener('message', onMessage)
})

const onMessage = (event) => {
  if (event.data?.type === 'ENIGMA_COMPLETED') {
    onGameCompleted()
    closeOverlay('computer')
  }
}

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
  bottom: 24px;
  right: 24px;
  z-index: 10;
  padding: 10px;
  border: none;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
}

.info-modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
}
.info-modal-card {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 32px;
  min-width: 280px; text-align: center;
  font-family: 'Source Code Pro', 'Courier New', monospace;
  color: #e2e8f0;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}
.info-modal-close {
  position: absolute; top: 10px; right: 12px;
  background: none; border: none; color: rgba(255,255,255,0.4);
  font-size: 22px; cursor: pointer; transition: color 0.15s;
}
.info-modal-close:hover { color: #fff; }
.info-modal-icon { font-size: 40px; margin-bottom: 12px; }
.info-modal-body h3 { margin: 0 0 16px; font-size: 15px; color: #94a3b8; font-weight: 600; }
.info-modal-label { margin: 0; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
.info-modal-value {
  margin: 6px 0 0; font-size: 26px; font-weight: 700;
  color: #50ef87; letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(80, 239, 135, 0.3);
}
.info-modal-hint {
  margin: 12px 0 0; font-size: 12px; color: #64748b;
  font-family: monospace;
}

.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40px;
  background: rgba(15, 23, 42, 0.95);
  color: white;
  text-align: center;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  min-width: 400px;
  z-index: 9999;
}
.overlay h2 {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 20px;
}
.overlay.success {
  border: 3px solid #10b981;
}
.final-time, .final-score {
  margin-top: 15px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #38bdf8;
  font-family: 'JetBrains Mono', monospace;
}
</style>

