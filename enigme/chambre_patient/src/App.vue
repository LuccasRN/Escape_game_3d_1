<script setup>
import IntroScreen from './components/IntroScreen.vue'
import Scene3D from './components/Scene3D.vue'
import GameTimer from './components/GameTimer.vue'
import HintSystem from './components/HintSystem.vue'
import ComputerOverlay from './components/ComputerOverlay.vue'
import CodeBoxOverlay from './components/CodeBoxOverlay.vue'
import PlaquetteOverlay from './components/PlaquetteOverlay.vue'
import PathHintOverlay from './components/PathHintOverlay.vue'
import GameUI from './components/GameUI.vue'
import { useGameState } from './composables/useGameState.js'
import { ref, watch } from 'vue'

const { showComputer, showCodeBox, showPlaquette, showPathHint, showIntro, finishIntro, gamePassed } = useGameState()

const finalTime = ref('00:00')
const finalScore = ref(0)

watch(() => gamePassed.value, (ended) => {
  if (ended && window.getTimerValue) {
    finalTime.value = window.getTimerValue()
  }
  if (ended && window.getScoreValue) {
    finalScore.value = window.getScoreValue()
  }
})
</script>

<template>
  <IntroScreen v-if="showIntro" @finish="finishIntro" />
  
  <template v-else>
    <Scene3D />
    <GameTimer v-if="!gamePassed" />
    <HintSystem :hints="['Trouver les quatres fiches de modèle d\'ia recommandée', 'Résoudre le casse-tête du moniteur', 'Rassembler tout les éléments pour compléter le DIAGNOSTIC NEURO-ALLERGOLOGIQUE']" />
    <GameUI />
    <ComputerOverlay  v-if="showComputer"  />
    <CodeBoxOverlay   v-if="showCodeBox"   />
    <PlaquetteOverlay v-if="showPlaquette" />
    <PathHintOverlay  v-if="showPathHint" />

    <div v-if="gamePassed" class="overlay success">
      <h2>Félicitations</h2>
      <p>Vous avez terminé la chambre du patient !</p>
      <p class="final-time">Temps final : {{ finalTime }}</p>
      <p class="final-score">Score : {{ finalScore }} / 1000</p>
    </div>
  </template>
</template>

<style scoped>
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


