<template>
  <div id="app">
    <IntroScreen v-if="gameState.showIntro" @finish="finishIntro" />
    <div v-else class="game-container">
      <Scene3D />
      <GameUI />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { gameState, finishIntro } from './composables/useGameState.js'
import IntroScreen from './components/IntroScreen.vue'
import Scene3D from './components/Scene3D.vue'
import GameUI from './components/GameUI.vue'


const finalTime = ref('00:00')
const finalScore = ref(0)

watch(() => gameState.gamePassed || gameState.gameOver, (ended) => {
  if (ended && window.getTimerValue) {
    finalTime.value = window.getTimerValue()
  }
  if (ended && window.getScoreValue) {
    finalScore.value = window.getScoreValue()
  }
})
</script>

<style>
/* Basic styles */
#app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  font-family: Arial, sans-serif;
}
.start-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #1a1a2e;
  color: white;
}
.start-screen button {
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
}
.game-container {
  position: relative;
  width: 100%;
  height: 100%;
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
}
.overlay h2 {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 20px;
}
.overlay.success { 
  border: 3px solid #10b981; 
}
.overlay.error { 
  border: 3px solid #ef4444; 
}
.final-time, .final-score {
  margin-top: 25px;
  font-size: 1.4rem;
  font-weight: bold;
  color: #38bdf8;
  font-family: 'JetBrains Mono', monospace;
}
</style>

