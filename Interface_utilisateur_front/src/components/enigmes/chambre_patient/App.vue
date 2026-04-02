<script setup>
import IntroScreen from './components/IntroScreen.vue'
import Scene3D from './components/Scene3D.vue'

import HintSystem from './components/HintSystem.vue'
import ComputerOverlay from './components/ComputerOverlay.vue'
import CodeBoxOverlay from './components/CodeBoxOverlay.vue'
import PlaquetteOverlay from './components/PlaquetteOverlay.vue'
import PathHintOverlay from './components/PathHintOverlay.vue'
import DocumentInventory from './components/DocumentInventory.vue'
import { useGameState } from './composables/useGameState.js'
import { ref, watch, computed } from 'vue'

const { 
  showComputer, 
  showCodeBox, 
  showPlaquette, 
  showPathHint, 
  showIntro, 
  finishIntro, 
  gamePassed,
  discoveredComputer,
  discoveredBox,
  unlockedPlaques,
  currentPlaqueIndex
} = useGameState()

const inventoryDocs = computed(() => [
  { id: 'plaque0', label: 'IA Recommandée #1', sub: 'Fiche 1', icon: 'image', discovered: unlockedPlaques[0] },
  { id: 'plaque1', label: 'IA Recommandée #2', sub: 'Fiche 2', icon: 'image', discovered: unlockedPlaques[1] },
  { id: 'plaque2', label: 'IA Recommandée #3', sub: 'Fiche 3', icon: 'image', discovered: unlockedPlaques[2] },
  { id: 'plaque3', label: 'IA Recommandée #4', sub: 'Fiche 4', icon: 'image', discovered: unlockedPlaques[3] },
  { id: 'computer', label: 'Nœud de Diagnostic', sub: 'Terminal', icon: 'computer', discovered: discoveredComputer.value },
  { id: 'box', label: 'Stockage Sécurisé', sub: 'Boîte', icon: 'lock', discovered: discoveredBox.value }
])

function openDocFromInventory(id) {
  if (id.startsWith('plaque')) {
    currentPlaqueIndex.value = parseInt(id.replace('plaque', ''), 10)
    showPlaquette.value = true
  } else if (id === 'computer') {
    showComputer.value = true
  } else if (id === 'box') {
    showCodeBox.value = true
  }
}

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
    
    <HintSystem :hints="['Trouver les quatres fiches de modèle d\'ia recommandée', 'Résoudre le casse-tête du moniteur', 'Rassembler tout les éléments pour compléter le DIAGNOSTIC NEURO-ALLERGOLOGIQUE']" />
    <DocumentInventory
      :documents="inventoryDocs"
      :z-index="1100"
      @open-document="openDocFromInventory"
    />
    <ComputerOverlay  v-if="showComputer"  />
    <CodeBoxOverlay   v-if="showCodeBox"   />
    <PlaquetteOverlay v-if="showPlaquette" />
    <PathHintOverlay  v-if="showPathHint" />
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


