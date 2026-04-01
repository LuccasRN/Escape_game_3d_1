<template>
  <div class="game-ui">

    <!-- Progression -->
    <div class="progress-panel">
      <div class="panel-title">STATUT MISSION : CLINIC_01</div>
      
      <div class="step" :class="{ done: boxUnlocked }">
        <div class="step-header">
          <span class="status-indicator"></span>
          <span class="step-name">Stockage Sécurisé</span>
        </div>
        <span class="step-hint" v-if="!boxUnlocked">Code d'Accès Requis</span>
      </div>

      <div class="step" :class="{ done: computerCompleted }">
        <div class="step-header">
          <span class="status-indicator"></span>
          <span class="step-name">Nœud de Diagnostic</span>
        </div>
        <span class="step-hint" v-if="!computerCompleted">Calibration Requise</span>
      </div>

      <div class="step" :class="{ done: computerCompleted }">
        <div class="step-header">
          <span class="status-indicator"></span>
          <span class="step-name">Protocole Thérapeutique</span>
        </div>
      </div>
    </div>

    <!-- Document inventory -->
    <DocumentInventory
      :documents="inventoryDocs"
      :z-index="150"
      @open-document="openDocFromInventory"
    />

  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useGameState } from '@/composables/useGameState.js'
import DocumentInventory from '../../../DocumentInventory.vue'

const {
  boxUnlocked,
  computerCompleted,
  showComputer,
  showCodeBox,
  showPlaquette,
  showPathHint,
  currentPlaqueIndex,
  discoveredComputer,
  discoveredBox,
  unlockedPlaques,
  unlockedPlaquesCount,
} = useGameState()

const pathHintSeen = ref(false)

watch(showPathHint, (v) => { if (v) pathHintSeen.value = true })

const inventoryDocs = computed(() => [
  { id: 'plaques', label: 'Dossiers médicaux', sub: `${unlockedPlaquesCount()} / 4 fiches trouvées`, icon: 'doc', discovered: unlockedPlaquesCount() > 0 },
  { id: 'codebox', label: 'Unité de stockage', sub: boxUnlocked.value ? 'Déverrouillé' : 'Code requis', icon: 'key', discovered: discoveredBox.value },
  { id: 'pathhint', label: 'Schéma neuronal', sub: 'Croquis D. Deckard', icon: 'note', discovered: pathHintSeen.value },
  { id: 'computer', label: 'PC de diagnostic', sub: computerCompleted.value ? 'Terminé' : 'Calibration requise', icon: 'pc', discovered: discoveredComputer.value },
])

function openDocFromInventory(id) {
  if (id === 'plaques') {
    const firstUnlocked = unlockedPlaques.findIndex(Boolean)
    if (firstUnlocked < 0) return
    currentPlaqueIndex.value = firstUnlocked
    showPlaquette.value = true
  } else if (id === 'codebox') {
    showCodeBox.value = true
  } else if (id === 'computer') {
    showComputer.value = true
  } else if (id === 'pathhint') {
    showPathHint.value = true
  }
}
</script>

<style scoped>
.game-ui {
  pointer-events: none;
}

.progress-panel {
  position: fixed;
  top: 90px;
  left: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.9);
  border-left: 4px solid #38bdf8;
  padding: 16px 20px;
  color: #f1f5f9;
  font-family: 'Inter', sans-serif;
  min-width: 220px;
  pointer-events: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.panel-title {
  color: #38bdf8;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.step {
  margin-bottom: 12px;
  opacity: 0.5;
  transition: opacity 0.3s;
}
.step:last-child { margin-bottom: 0; }
.step.done { opacity: 1; }

.step-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border: 1px solid #94a3b8;
  border-radius: 2px;
  flex-shrink: 0;
}
.step.done .status-indicator {
  background: #10b981;
  border-color: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.step-name {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.step-hint {
  font-size: 0.65rem;
  color: #64748b;
  margin-left: 18px;
  display: block;
  margin-top: 2px;
}
</style>
