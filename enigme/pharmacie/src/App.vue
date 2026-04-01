<script setup>
import { ref, watch } from 'vue'
import { useGameState } from './composables/useGameState.vue'
import IntroScreen from './components/IntroScreen.vue'
import Scene3D from './components/Scene3D.vue'
import GameUI from './components/GameUI.vue'
import GameTimer from './components/GameTimer.vue'
import HintSystem from './components/HintSystem.vue'

const showIntro = ref(true)
const { gameCompleted } = useGameState()

const finalTime = ref('00:00')
const finalScore = ref(0)

watch(() => gameCompleted.value, (ended) => {
  if (ended && window.getTimerValue) {
    finalTime.value = window.getTimerValue()
  }
  if (ended && window.getScoreValue) {
    finalScore.value = window.getScoreValue()
  }
})

function finishIntro() {
  showIntro.value = false
}
</script>

<template>
  <IntroScreen v-if="showIntro" @finish="finishIntro" />
  
  <template v-else>
    <Scene3D />
    <GameUI />
    <GameTimer v-if="!gameCompleted" />
    <HintSystem :hints="['Observe bien le bureau', 'Clique sur l\'ours en peluche', 'Clique sur le pc']" />

    <div v-if="gameCompleted" class="overlay success">
      <h2>Félicitations</h2>
      <p>Vous avez terminé la pharmacie !</p>
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
