<template>
  <div class="overlay-backdrop" @click.self="close">
    <div class="plaque-ui">

      <div class="plaque-header">
        <div class="header-content">
          <span class="header-title">DESCRIPTIONS DES PROTOCOLES</span>
          <span class="header-subtitle">Dossiers Médicaux de Référence</span>
        </div>
        <button class="close-btn" @click="close">FERMER</button>
      </div>

      <!-- Navigation des plaquettes -->
      <div class="plaque-tabs">
        <button
          v-for="(p, i) in plaques" :key="i"
          :class="['tab-btn', { active: currentPlaqueIndex === i, locked: !unlockedPlaques[i] }]"
          :disabled="!unlockedPlaques[i]"
          @click="openPlaque(i)"
        >
          <span class="tab-label">{{ unlockedPlaques[i] ? `RÉF-${i + 101}` : 'VERROUILLÉ' }}</span>
        </button>
      </div>

      <!-- Contenu de la plaquette active -->
      <div class="plaque-body">
        <div v-if="unlockedPlaques[currentPlaqueIndex]" class="plaque-card">
          <div class="plaque-category">{{ plaques[currentPlaqueIndex].category }}</div>
          <div class="plaque-allergie">{{ plaques[currentPlaqueIndex].allergie }}</div>
          
          <div class="plaque-divider"></div>
          
          <div class="plaque-info-grid">
            <div class="info-item">
              <span class="info-label">MODÈLE RECOMMANDÉ</span>
              <span class="info-value model-highlight">{{ plaques[currentPlaqueIndex].model }}</span>
            </div>
          </div>
          
          <div class="plaque-note">
            <span class="note-label">Données Cliniques :</span>
            {{ plaques[currentPlaqueIndex].note }}
          </div>
        </div>
        
        <div v-else class="plaque-card locked-card">
          <div class="locked-icon">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
              <path d="M18,8H17V6A5,5,0,0,0,7,6V8H6a2,2,0,0,0-2,2V20a2,2,0,0,0,2,2H18a2,2,0,0,0,2-2V10A2,2,0,0,0,18,8ZM9,6a3,3,0,0,1,6,0V8H9ZM18,20H6V10H18Z"/>
            </svg>
          </div>
          <div class="plaque-allergie">ACCÈS RESTREINT</div>
          <div class="plaque-note">Veuillez identifier l'objet correspondant dans l'environnement clinique pour synchroniser ce dossier.</div>
        </div>

        <div class="plaque-hint">
          Note : Croisez cette recommandation de modèle avec les antécédents du patient trouvés dans le Cabinet Deckard pour déterminer les paramètres de diagnostic appropriés.
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useGameState } from '../composables/useGameState.js'

const { showPlaquette, currentPlaqueIndex, unlockedPlaques } = useGameState()

const plaques = [
  {
    category: 'PHARMACOLOGIQUE',
    allergie: 'Allergie Médicamenteuse',
    model: 'LSTM',
    note: 'Long Short-Term Memory — Optimal pour l\'analyse des réactions médicamenteuses séquentielles et la cartographie des dépendances temporelles.',
  },
  {
    category: 'DIÉTÉTIQUE',
    allergie: 'Allergie Alimentaire',
    model: 'GRU',
    note: 'Gated Recurrent Unit — Optimisé pour les schémas d\'exposition alimentaire répétitifs et la gestion simplifiée des états.',
  },
  {
    category: 'ENVIRONNEMENTALE',
    allergie: 'Allergie Environnementale',
    model: 'CNN',
    note: 'Convolutional Neural Network — Spécialisé dans la reconnaissance des motifs saisonniers et la corrélation des données spatiales.',
  },
  {
    category: 'DERMATOLOGIQUE',
    allergie: 'Allergie de Contact',
    model: 'MLP',
    note: 'Multilayer Perceptron — Classification standard pour les réactions dermatologiques localisées et les vecteurs d\'entrée statiques.',
  },
]

function close() {
  showPlaquette.value = false
}

function openPlaque(index) {
  if (!unlockedPlaques[index]) return
  currentPlaqueIndex.value = index
}
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 30, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.plaque-ui {
  background: #f8f9fa;
  border-top: 4px solid #2c5282;
  border-radius: 4px;
  width: min(600px, 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #2d3748;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.plaque-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: #edf2f7;
  border-bottom: 1px solid #e2e8f0;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.header-title {
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #2c5282;
}

.header-subtitle {
  font-size: 0.65rem;
  color: #718096;
  text-transform: uppercase;
}

.close-btn {
  background: #cbd5e0;
  border: none;
  color: #2d3748;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: bold;
  transition: background 0.2s;
}
.close-btn:hover { background: #a0aec0; }

.plaque-tabs {
  display: flex;
  background: #e2e8f0;
  padding: 0 24px;
  gap: 2px;
}

.tab-btn {
  background: #edf2f7;
  border: none;
  color: #718096;
  padding: 12px 16px;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border-top: 2px solid transparent;
}
.tab-btn:hover:not(:disabled) { background: #fff; color: #2c5282; }
.tab-btn.active {
  background: #fff;
  color: #2c5282;
  border-top-color: #2c5282;
}

.tab-btn.locked {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

.tab-btn:disabled {
  pointer-events: none;
}

.plaque-body {
  padding: 32px 24px;
}

.plaque-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 32px;
  margin-bottom: 24px;
  position: relative;
}

.plaque-category {
  font-size: 0.65rem;
  font-weight: 800;
  color: #4a5568;
  letter-spacing: 0.2em;
  margin-bottom: 8px;
  text-align: center;
}

.plaque-allergie {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 24px;
  text-align: center;
}

.plaque-divider {
  width: 40px;
  height: 2px;
  background: #2c5282;
  margin: 0 auto 24px;
}

.plaque-info-grid {
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #718096;
  margin-bottom: 4px;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 2.25rem;
  font-weight: 900;
  color: #2c5282;
}

.model-highlight {
  text-shadow: 0 2px 4px rgba(44, 82, 130, 0.1);
}

.plaque-note {
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.6;
  padding: 16px;
  background: #f7fafc;
  border-left: 3px solid #cbd5e0;
  border-radius: 0 4px 4px 0;
}

.note-label {
  display: block;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  margin-bottom: 4px;
  color: #718096;
}

.locked-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f1f5f9;
  border-style: dashed;
  border-color: #cbd5e0;
}

.locked-icon {
  color: #a0aec0;
  margin-bottom: 16px;
}

.plaque-hint {
  font-size: 0.75rem;
  color: #718096;
  text-align: center;
  line-height: 1.5;
  padding: 0 16px;
}
</style>
