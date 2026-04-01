<template>
  <div class="victory-overlay">
    <div class="victory-card">
      <h2 class="victory-title">Salle Reseau Terminee</h2>
      <p class="victory-subtitle">Vous avez resolu toutes les enigmes.</p>
      <p class="final-time">Temps final : {{ finalTime }}</p>
      <p class="final-score">Score : {{ finalScore }} / 1000</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const finalTime = ref('00:00')
const finalScore = ref(0)

onMounted(() => {
  if (window.getTimerValue) {
    finalTime.value = window.getTimerValue()
  }
  if (window.getScoreValue) {
    finalScore.value = window.getScoreValue()
  }
})
</script>

<style scoped>
.victory-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 10, 20, 0.9);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 60;
}

.victory-card {
  background: rgba(0, 15, 25, 0.95);
  border: 2px solid cyan;
  border-radius: 12px;
  padding: 40px;
  max-width: 650px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 0 40px rgba(0, 255, 255, 0.2);
  color: #e0e0e0;
}

.victory-title {
  margin-top: 0;
  font-size: 2rem;
  color: cyan;
  text-align: center;
  text-shadow: 0 0 10px cyan;
}

.victory-subtitle {
  text-align: center;
  color: #aaa;
  margin-bottom: 10px;
}

.final-time, .final-score {
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
  color: cyan;
  font-family: 'Courier New', monospace;
  margin-bottom: 30px;
}
</style>
