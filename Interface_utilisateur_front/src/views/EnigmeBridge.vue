<template>
  <div class="enigma-wrapper">
    <!-- Header avec retour et timer -->
    <header class="enigma-header">
      <button @click="confirmExit" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Retour au dashboard
      </button>
      <div class="enigma-title">
        <span class="enigma-label">ENIGME {{ enigmaId }}</span>
        <span class="enigma-name">{{ enigmaName }}</span>
      </div>
      <div class="timer-display">
        <span class="timer-label">TEMPS</span>
        <span class="timer-value">{{ displayTime }}</span>
      </div>
    </header>

    <!-- Iframe contenant l'enigme -->
    <div class="enigma-frame-container">
      <iframe
        ref="enigmaFrame"
        :src="enigmaUrl"
        class="enigma-iframe"
        allow="fullscreen"
        @load="onFrameLoad"
      ></iframe>

      <!-- Overlay de chargement -->
      <div v-if="frameLoading" class="frame-loading">
        <div class="spinner"></div>
        <p>Chargement de l'enigme...</p>
      </div>

      <!-- Overlay si enigme non disponible -->
      <div v-if="frameError" class="frame-error">
        <h3>Enigme non disponible</h3>
        <p>Le serveur de l'enigme (port {{ enigmaPort }}) n'est pas accessible.</p>
        <p class="error-hint">Lancez le projet avec : <code>npm run dev -- --port {{ enigmaPort }}</code></p>
        <div class="dev-buttons">
          <button @click="markCompleted" class="btn-dev-complete">
            ✓ Marquer comme complété (mode test)
          </button>
          <button @click="goBack" class="btn-back-error">
            Retour au dashboard
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation de sortie -->
    <div v-if="showExitModal" class="modal-overlay">
      <div class="modal-box">
        <h3>Quitter l'enigme ?</h3>
        <p>Votre progression sera perdue. La session sera enregistrée comme non complétée.</p>
        <div class="modal-buttons">
          <button @click="exitGame" class="btn-confirm-exit">Quitter</button>
          <button @click="showExitModal = false" class="btn-cancel">Continuer à jouer</button>
        </div>
      </div>
    </div>

    <!-- Modal de félicitations -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-box success-modal">
        <div class="success-icon">🎉</div>
        <h3>Enigme résolue !</h3>
        <p>Félicitations ! Vous avez complété <strong>{{ enigmaName }}</strong></p>
        <p class="time-result">Temps : <strong>{{ displayTime }}</strong></p>
        <button @click="goBack" class="btn-back-success">Retour au dashboard</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { gameService } from '../services/api'

const props = defineProps({
  enigmaId: { type: Number, required: true },
  enigmaName: { type: String, required: true },
  enigmaPort: { type: Number, required: true },
})

const router = useRouter()
const enigmaFrame = ref(null)
const frameLoading = ref(true)
const frameError = ref(false)
const showExitModal = ref(false)
const showSuccessModal = ref(false)

// Timer
const elapsedSeconds = ref(0)
let timerInterval = null

const displayTime = computed(() => {
  const m = Math.floor(elapsedSeconds.value / 60).toString().padStart(2, '0')
  const s = (elapsedSeconds.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

// URL de l'enigme
const enigmaUrl = computed(() => `http://localhost:${props.enigmaPort}`)

function onFrameLoad() {
  frameLoading.value = false
  // Vérification si l'iframe a chargé correctement
  try {
    const iframe = enigmaFrame.value
    if (iframe && iframe.contentDocument && iframe.contentDocument.title) {
      frameError.value = false
    }
  } catch (e) {
    // Cross-origin - l'enigme est accessible, pas d'erreur
    frameError.value = false
  }
}

// Écoute les messages postMessage des enigmes
function handleMessage(event) {
  // Accepter les messages des enigmes (tous les ports locaux)
  if (!event.origin.includes('localhost')) return

  const { type, enigmaId, success, timeSeconds } = event.data || {}

  if (type === 'ENIGMA_COMPLETED') {
    const id = enigmaId || props.enigmaId
    const time = timeSeconds || elapsedSeconds.value
    handleEnigmaCompletion(id, success !== false, time)
  }
}

async function handleEnigmaCompletion(enigmaId, isSuccess, timeSeconds) {
  clearInterval(timerInterval)

  try {
    // 1. Valider le puzzle côté backend
    await gameService.validatePuzzle(enigmaId, isSuccess ? 'SUCCESS' : 'FAIL')
  } catch (e) {
    console.warn('Impossible de valider le puzzle côté backend:', e)
  }

  try {
    // 2. Terminer la session
    await gameService.endGame()
  } catch (e) {
    console.warn('Impossible de terminer la session:', e)
  }

  if (isSuccess) {
    showSuccessModal.value = true
  } else {
    goBack()
  }
}

async function markCompleted() {
  // Mode dev : marque l'enigme comme complété sans iframe
  clearInterval(timerInterval)
  try {
    await gameService.validatePuzzle(props.enigmaId, 'SUCCESS')
    await gameService.endGame()
  } catch (e) {
    console.warn('Erreur API (mode test):', e)
  }
  showSuccessModal.value = true
}

function confirmExit() {
  showExitModal.value = true
}

async function exitGame() {
  clearInterval(timerInterval)
  try {
    await gameService.endGame()
  } catch (e) {
    console.warn('Erreur fin de session:', e)
  }
  goBack()
}

function goBack() {
  router.push('/dashboard')
}

// Détecter si l'iframe échoue à charger (timeout)
let loadTimeout = null

onMounted(() => {
  // Démarrer le timer
  elapsedSeconds.value = 0
  timerInterval = setInterval(() => { elapsedSeconds.value++ }, 1000)

  // Exposer le timer aux enigmes via window
  window.getTimerValue = () => displayTime.value
  window.enigmaId = props.enigmaId

  // Écouter les messages des enigmes
  window.addEventListener('message', handleMessage)

  // Timeout pour détecter si l'enigme ne charge pas
  loadTimeout = setTimeout(() => {
    if (frameLoading.value) {
      frameLoading.value = false
      frameError.value = true
    }
  }, 8000)
})

onBeforeUnmount(() => {
  clearInterval(timerInterval)
  clearTimeout(loadTimeout)
  window.removeEventListener('message', handleMessage)
})
</script>

<style scoped>
.enigma-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.enigma-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  z-index: 10;
  flex-shrink: 0;
  height: 56px;
}

.btn-back {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.8);
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  font-size: 0.8rem;
  transition: background 0.2s;
}
.btn-back:hover { background: rgba(255,255,255,0.1); }

.enigma-title {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.enigma-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #a855f7;
  letter-spacing: 0.15em;
}
.enigma-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.timer-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.timer-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.1em;
}
.timer-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  font-family: 'Courier New', monospace;
}

.enigma-frame-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.enigma-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.frame-loading, .frame-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(5, 10, 20, 0.97);
  color: white;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.frame-error h3 { color: #f87171; font-size: 1.5rem; margin: 0; }
.frame-error p { color: rgba(255,255,255,0.7); text-align: center; max-width: 500px; }
.error-hint { font-size: 0.85rem !important; }
.error-hint code {
  background: rgba(255,255,255,0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: monospace;
  color: #4ade80;
}

.dev-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-dev-complete {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid #10b981;
  color: #4ade80;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: background 0.2s;
}
.btn-dev-complete:hover { background: rgba(16, 185, 129, 0.35); }

.btn-back-error {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  backdrop-filter: blur(4px);
}

.modal-box {
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  color: white;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
}
.modal-box h3 { margin: 0 0 0.75rem 0; font-size: 1.3rem; }
.modal-box p { color: rgba(255,255,255,0.7); margin: 0 0 1.5rem 0; font-size: 0.9rem; line-height: 1.5; }

.modal-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm-exit {
  background: #ef4444;
  border: none;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
}
.btn-cancel {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.success-modal { border-color: rgba(16, 185, 129, 0.4); }
.success-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.time-result { color: #22d3ee !important; font-size: 1rem !important; margin-bottom: 1.5rem !important; }

.btn-back-success {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  border: none;
  color: white;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.2s;
}
.btn-back-success:hover { transform: translateY(-2px); }
</style>