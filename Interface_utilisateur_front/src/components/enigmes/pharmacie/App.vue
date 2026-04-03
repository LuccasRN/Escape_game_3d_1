<script setup>
import { ref, watch } from 'vue'
import { useGameState } from './composables/useGameState.vue'
import IntroScreen from './components/IntroScreen.vue'
import Scene3D from './components/Scene3D.vue'
import GameUI from './components/GameUI.vue'

import HintSystem from './components/HintSystem.vue'
import DocumentInventory from './components/DocumentInventory.vue'
import { computed } from 'vue'

const showIntro = ref(true)
const { 
  gameCompleted, 
  discoveredClues, 
  showBearInfo, 
  showTablesModal, 
  isComputerUIOpen, 
  showMedicineInfo,
  currentMedicineName 
} = useGameState()

const inventoryDocs = computed(() => [
  { id: 'bear', label: "Note de l'inspecteur", sub: "Code terminal + indices", icon: "image", discovered: discoveredClues.includes('bear') },
  { id: 'tables', label: "Registre pharmaceutique", sub: "Tables de référence", icon: "image", discovered: discoveredClues.includes('tables') },
  { id: 'medicine', label: "Boîte de médicaments", sub: "Étiquette", icon: "image", discovered: discoveredClues.includes('medicine') },
  { id: 'computer', label: "Terminal d'accès", sub: "Valider les traitements", icon: "computer", discovered: discoveredClues.includes('computer') }
])

function openDocFromInventory(id) {
  if (id === 'bear') showBearInfo.value = true
  if (id === 'tables') showTablesModal.value = true
  if (id === 'computer') isComputerUIOpen.value = true
  if (id === 'medicine') showMedicineInfo.value = true
}

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
    
    <HintSystem :hints="['Observe bien le bureau', 'Clique sur l\'ours en peluche', 'Clique sur le pc']" />
    
    <DocumentInventory
      :documents="inventoryDocs"
      :z-index="1100"
      @open-document="openDocFromInventory"
    />
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
