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

    <!-- Boutons d'accès rapide -->
    <div class="quick-access">
      <div class="qa-label">INTERACTION OBJETS</div>
      <button class="qa-btn" :disabled="unlockedPlaquesCount() === 0" @click="openPlaquesFromQuickAccess">
        <span class="btn-status">{{ unlockedPlaquesCount() > 0 ? '✓' : '×' }}</span>
        <span class="btn-text">Dossiers Médicaux</span>
      </button>
      <button class="qa-btn" :disabled="!discoveredBox" @click="showCodeBox = true">
        <span class="btn-status">{{ discoveredBox ? '✓' : '×' }}</span>
        <span class="btn-text">Unité de Stockage</span>
      </button>
      <button class="qa-btn" :disabled="!discoveredComputer" @click="showComputer = true">
        <span class="btn-status">{{ discoveredComputer ? '✓' : '×' }}</span>
        <span class="btn-text">PC de Diagnostic</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { useGameState } from '@/composables/useGameState.js'

const {
  boxUnlocked,
  computerCompleted,
  showComputer,
  showCodeBox,
  showPlaquette,
  currentPlaqueIndex,
  discoveredComputer,
  discoveredBox,
  unlockedPlaques,
  unlockedPlaquesCount,
} = useGameState()

function openPlaquesFromQuickAccess() {
  const firstUnlocked = unlockedPlaques.findIndex(Boolean)
  if (firstUnlocked < 0) return
  currentPlaqueIndex.value = firstUnlocked
  showPlaquette.value = true
}
</script>

<style scoped>
.game-ui {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 16px;
  pointer-events: none;
}

.progress-panel {
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

.quick-access {
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: all;
}

.qa-label {
  font-size: 0.6rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.qa-btn {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  font-family: inherit;
  font-size: 0.7rem;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  width: 180px;
}
.qa-btn:hover:not(:disabled) {
  background: #1e293b;
  border-color: #38bdf8;
}

.qa-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(1);
}

.btn-status {
  font-weight: 900;
  width: 14px;
  color: #38bdf8;
}
.qa-btn:disabled .btn-status { color: #64748b; }

.btn-text {
  font-weight: 600;
  letter-spacing: 0.025em;
}
</style>
