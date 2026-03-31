<template>
  <div class="overlay-backdrop" @click.self="close">
    <div class="box-ui">

      <div class="box-header">
        <div class="status-indicator">
          <div :class="['status-led', { active: boxUnlocked }]"></div>
          <span class="status-text">{{ boxUnlocked ? 'ACCÈS AUTORISÉ' : 'SYSTÈME VERROUILLÉ' }}</span>
        </div>
        <button class="close-btn" @click="close">QUITTER</button>
      </div>

      <!-- État verrouillé -->
      <template v-if="!boxUnlocked">
        <div class="box-body">
          <div class="security-icon">
            <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
              <path d="M12,1L3,5v6c0,5.55,3.84,10.74,9,12c5.16-1.26,9-6.45,9-12V5L12,1z M12,7c1.1,0,2,0.9,2,2s-0.9,2-2,2s-2-0.9-2-2S10.9,7,12,7z M12,18c-2.33,0-4.31-1.46-5.11-3.5c0.31-0.34,1.4-1,2.11-1.5c1-0.66,2-1,3-1s2,0.34,3,1c0.71,0.5,1.8,1.16,2.11,1.5C16.31,16.54,14.33,18,12,18z"/>
            </svg>
          </div>
          
          <div class="security-notice">
            <div class="notice-title">DISPOSITIF DE SÉCURITÉ ACTIF</div>
            <p class="box-desc">
              Unité de stockage scellée. Identification requise via protocole à 3 chiffres.<br />
              Analysez le <strong>rapport d'analyse réseau de neurones</strong> et identifiez les chaînes de dépendance.
            </p>
          </div>

          <!-- Indice mots à relier -->
          <div class="word-chains">
            <div class="chain-title">PROTOCOLE DE DÉCRYPTAGE (DÉPENDANCES COLORÉES) :</div>
            <div class="chain"><span class="c1">test</span> → <span class="c1">effectué</span> → <span class="c1">préconise</span></div>
            <div class="chain"><span class="c2">sortie</span> → <span class="c2">neurones</span> → <span class="c2">entrées</span> → <span class="c2">vérification</span> → <span class="c2">résultats</span></div>
            <div class="chain"><span class="c3">anomalie</span> → <span class="c3">prédiction</span> → <span class="c3">données</span> → <span class="c3">fonction</span></div>
            <p class="chain-hint">Note : Localisez ces séquences dans la conclusion du rapport pour extraire les coefficients numériques.</p>
          </div>

          <!-- Saisie du code -->
          <div class="code-input-group">
            <div class="code-digits">
              <input
                v-for="(_, i) in 3" :key="i"
                type="text" maxlength="1"
                v-model="digits[i]"
                @input="onDigitInput(i, $event)"
                @keydown.backspace="onBackspace(i)"
                :ref="el => { if (el) digitRefs[i] = el }"
                class="digit-input"
              />
            </div>
            <button class="btn-unlock" @click="tryUnlock">VÉRIFIER LE CODE</button>
          </div>
          <div v-if="codeError" class="error-panel">
            <span class="error-icon">!</span>
            <span class="error-msg">{{ codeError }}</span>
          </div>
        </div>
      </template>

      <!-- État déverrouillé — contenu de la boîte -->
      <template v-else>
        <div class="box-body unlocked">
          <div class="unlocked-header">
            <div class="unlocked-badge">AUTHENTIFICATION RÉUSSIE</div>
            <p class="box-desc">Accès aux dossiers cliniques et calques de calibration LSTM autorisé.</p>
          </div>

          <!-- Tabs documents -->
          <div class="doc-tabs">
            <button
              v-for="(doc, i) in documents" :key="i"
              :class="['tab-btn', { active: activeDoc === i }]"
              @click="activeDoc = i"
            >
              <span class="tab-index">0{{ i + 1 }}</span>
              <span class="tab-title">{{ doc.title }}</span>
            </button>
          </div>

          <div class="doc-content">
            <!-- Post-it conditions -->
            <template v-if="activeDoc === 0">
              <div class="document-view">
                <div class="doc-header">PARAMÈTRES DE FILTRAGE DU MODÈLE</div>
                <div class="postit">
                  <table class="cond-table">
                    <tr v-for="c in conditions" :key="c.label">
                      <td class="label">{{ c.label }}</td>
                      <td class="value">{{ c.value }}</td>
                    </tr>
                  </table>
                  <div class="doc-footer">
                    Rechercher l'occurrence unique dans la matrice de performances.
                  </div>
                </div>
              </div>
            </template>

            <!-- Tableau performances -->
            <template v-if="activeDoc === 1">
              <div class="document-view">
                <div class="doc-header">MATRICE DES PERFORMANCES COMPARATIVES</div>
                <div class="table-scroll">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>ÉPOQUES</th><th>LR</th><th>NODES</th><th>ACTIV.</th><th>COUCHES</th><th>OVERFIT</th><th>POIDS MOY.</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in perfTable" :key="row.model" :class="{ 'highlight-k': row.model === 'K' }">
                        <td>{{ row.model }}</td>
                        <td>{{ row.epochs }}</td>
                        <td>{{ row.lr }}</td>
                        <td>{{ row.neurons }}</td>
                        <td>{{ row.activation }}</td>
                        <td>{{ row.layers }}</td>
                        <td>{{ row.overfit }}</td>
                        <td>{{ row.avgWeight }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>

            <!-- Tableau poids -->
            <template v-if="activeDoc === 2">
              <div class="document-view">
                <div class="doc-header">VECTEURS DE POIDS — MODÈLES SÉLECTIONNÉS</div>
                <div class="table-scroll">
                  <table class="data-table weights-table">
                    <thead>
                      <tr>
                        <th>MOD</th>
                        <th v-for="w in 10" :key="w">W{{ w }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="row in weightsTable" :key="row.model" :class="{ 'highlight-k': row.model === 'K' }">
                        <td class="mod-id">{{ row.model }}</td>
                        <td v-for="(w, i) in row.weights" :key="i">{{ w.toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="doc-footer highlight-footer">
                  Rappel : Les coefficients de la ligne K doivent être injectés dans l'interface de diagnostic.
                </div>
              </div>
            </template>

            <!-- Calques LSTM -->
            <template v-if="activeDoc === 3">
              <div class="document-view">
                <div class="doc-header">CALIBRATION LSTM — PRÉCISION / ALPHA</div>
                <table class="data-table">
                  <thead><tr><th>RÉF</th><th>α</th><th>PRÉCISION</th><th>NIVEAU ALLERGIE (CALVIN)</th></tr></thead>
                  <tbody>
                    <tr v-for="c in calques" :key="c.alpha" :class="{ 'highlight-k': c.alpha === 0.3 }">
                      <td>LSTM-B</td>
                      <td>{{ c.alpha }}</td>
                      <td>{{ c.accuracy }}</td>
                      <td class="level-cell">{{ c.level !== null ? c.level : '--' }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="doc-footer">
                  Sélectionner le coefficient α maximisant la précision pour obtenir le niveau de réponse patient.
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useGameState } from '@/composables/useGameState.js'

const { showCodeBox, boxUnlocked } = useGameState()

const CORRECT_CODE = '124'

const digits = reactive(['', '', ''])
const digitRefs = []
const codeError = ref('')
const activeDoc = ref(0)

const documents = [
  { title: 'CONDITIONS' },
  { title: 'PERFORMANCES' },
  { title: 'POIDS (W1-10)' },
  { title: 'CALIBRATION LSTM' },
]

const conditions = [
  { label: 'Époques',        value: '> 200'   },
  { label: 'Taux d\'app.',   value: '< 0.001' },
  { label: 'Neurones',       value: '> 300'   },
  { label: 'Activation',     value: 'tanh'    },
  { label: 'Couches',        value: '< 20'    },
  { label: 'Overfitting',    value: 'non'     },
  { label: 'Poids moyen',    value: '< 1'     },
]

const perfTable = [
  { model: 'A', epochs: 150, lr: '0.002',  neurons: 200, activation: 'relu', layers: 8,  overfit: 'non', avgWeight: '0.62' },
  { model: 'B', epochs: 180, lr: '0.0015', neurons: 250, activation: 'tanh', layers: 10, overfit: 'oui', avgWeight: '0.55' },
  { model: 'C', epochs: 210, lr: '0.0012', neurons: 310, activation: 'relu', layers: 14, overfit: 'non', avgWeight: '0.83' },
  { model: 'D', epochs: 220, lr: '0.0009', neurons: 350, activation: 'tanh', layers: 16, overfit: 'oui', avgWeight: '0.47' },
  { model: 'E', epochs: 190, lr: '0.001',  neurons: 280, activation: 'tanh', layers: 12, overfit: 'non', avgWeight: '0.39' },
  { model: 'F', epochs: 240, lr: '0.0007', neurons: 390, activation: 'relu', layers: 18, overfit: 'non', avgWeight: '0.72' },
  { model: 'G', epochs: 175, lr: '0.0008', neurons: 320, activation: 'tanh', layers: 9,  overfit: 'non', avgWeight: '0.28' },
  { model: 'H', epochs: 260, lr: '0.0005', neurons: 450, activation: 'relu', layers: 22, overfit: 'non', avgWeight: '0.91' },
  { model: 'I', epochs: 230, lr: '0.0006', neurons: 400, activation: 'tanh', layers: 15, overfit: 'non', avgWeight: '1.12' },
  { model: 'J', epochs: 200, lr: '0.001',  neurons: 300, activation: 'tanh', layers: 11, overfit: 'non', avgWeight: '0.96' },
  { model: 'K', epochs: 220, lr: '0.0008', neurons: 420, activation: 'TANH', layers: 12, overfit: 'NON', avgWeight: '0.45' },
  { model: 'L', epochs: 215, lr: '0.0009', neurons: 410, activation: 'tanh', layers: 13, overfit: 'non', avgWeight: '1.05' },
]

const weightsTable = [
  { model: 'A', weights: [0.62, 0.58, 0.61, 0.64, 0.59, 0.63, 0.57, 0.65, 0.60, 0.62] },
  { model: 'B', weights: [0.55, 0.52, 0.54, 0.56, 0.53, 0.55, 0.51, 0.57, 0.54, 0.55] },
  { model: 'C', weights: [0.83, 0.80, 0.82, 0.85, 0.81, 0.83, 0.79, 0.86, 0.82, 0.83] },
  { model: 'D', weights: [0.47, 0.44, 0.46, 0.48, 0.45, 0.47, 0.43, 0.49, 0.46, 0.47] },
  { model: 'E', weights: [0.39, 0.36, 0.38, 0.40, 0.37, 0.39, 0.35, 0.41, 0.38, 0.39] },
  { model: 'F', weights: [0.72, 0.69, 0.71, 0.73, 0.70, 0.72, 0.68, 0.74, 0.71, 0.72] },
  { model: 'G', weights: [0.28, 0.25, 0.27, 0.29, 0.26, 0.28, 0.24, 0.30, 0.27, 0.28] },
  { model: 'H', weights: [0.91, 0.88, 0.90, 0.92, 0.89, 0.91, 0.87, 0.93, 0.90, 0.91] },
  { model: 'I', weights: [1.12, 1.09, 1.11, 1.13, 1.10, 1.12, 1.08, 1.14, 1.11, 1.12] },
  { model: 'J', weights: [0.96, 0.93, 0.95, 0.97, 0.94, 0.96, 0.92, 0.98, 0.95, 0.96] },
  { model: 'K', weights: [0.70, 0.75, 0.72, 0.68, 0.77, 0.74, 0.69, 0.78, 0.73, 0.71] },
  { model: 'L', weights: [1.05, 1.02, 1.04, 1.06, 1.03, 1.05, 1.01, 1.07, 1.04, 1.05] },
]

const calques = [
  { alpha: 0.1, accuracy: '0.75', level: null },
  { alpha: 0.2, accuracy: '0.82', level: null },
  { alpha: 0.3, accuracy: '0.95', level: 35   },
  { alpha: 0.4, accuracy: '0.88', level: null },
  { alpha: 0.5, accuracy: '0.79', level: null },
  { alpha: 0.6, accuracy: '0.71', level: null },
]

function onDigitInput(index, event) {
  const val = event.target.value.replace(/\D/, '')
  digits[index] = val
  if (val && index < 2) digitRefs[index + 1]?.focus()
}

function onBackspace(index) {
  if (!digits[index] && index > 0) {
    digits[index - 1] = ''
    digitRefs[index - 1]?.focus()
  }
}

function tryUnlock() {
  const code = digits.join('')
  if (code === CORRECT_CODE) {
    boxUnlocked.value = true
    codeError.value = ''
  } else {
    codeError.value = 'ERREUR_CODE_INVALIDE : Croisez les motifs colorés dans le rapport neuronal.'
    digits.fill('')
    digitRefs[0]?.focus()
  }
}

function close() {
  showCodeBox.value = false
}
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  backdrop-filter: blur(2px);
}

.box-ui {
  background: #1a1a1a;
  border: 1px solid #333;
  border-top: 3px solid #f08040;
  border-radius: 4px;
  width: min(850px, 100%);
  max-height: 90vh;
  overflow-y: auto;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  color: #ccc;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #222;
  border-bottom: 1px solid #333;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-led {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #440000;
  box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
}
.status-led.active {
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
}

.status-text {
  font-size: 0.7rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.close-btn {
  background: #333;
  border: 1px solid #444;
  color: #888;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: bold;
}
.close-btn:hover { background: #444; color: #fff; }

.box-body { padding: 32px; }

.security-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
  color: #f08040;
}

.security-notice {
  text-align: center;
  margin-bottom: 32px;
}

.notice-title {
  font-size: 0.9rem;
  font-weight: 800;
  color: #f08040;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.box-desc {
  font-size: 0.85rem;
  color: #999;
  line-height: 1.6;
}

.word-chains {
  background: #111;
  border-left: 3px solid #f08040;
  padding: 20px;
  margin-bottom: 32px;
}

.chain-title {
  font-size: 0.7rem;
  color: #f08040;
  margin-bottom: 16px;
  font-weight: bold;
}

.chain {
  font-size: 0.8rem;
  margin-bottom: 10px;
  color: #bbb;
}

.c1 { color: #40d0f0; }
.c2 { color: #f08040; }
.c3 { color: #80e060; }

.chain-hint {
  font-size: 0.7rem;
  color: #666;
  margin-top: 16px;
  font-style: italic;
}

.code-input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.code-digits {
  display: flex;
  gap: 16px;
}

.digit-input {
  width: 60px;
  height: 80px;
  background: #000;
  border: 1px solid #444;
  color: #f08040;
  font-size: 2.5rem;
  text-align: center;
  font-family: inherit;
  outline: none;
  border-radius: 2px;
}
.digit-input:focus { border-color: #f08040; background: #0a0500; }

.btn-unlock {
  background: #f08040;
  border: none;
  color: #000;
  padding: 12px 32px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 800;
  border-radius: 2px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: background 0.2s;
}
.btn-unlock:hover { background: #ff9d66; }

.error-panel {
  margin-top: 24px;
  padding: 12px;
  background: rgba(240, 80, 80, 0.1);
  border: 1px solid #f05050;
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  background: #f05050;
  color: #fff;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.8rem;
}

.error-msg {
  font-size: 0.75rem;
  color: #f05050;
}

/* ── État Déverrouillé ── */
.unlocked-header {
  text-align: center;
  margin-bottom: 32px;
}

.unlocked-badge {
  display: inline-block;
  background: rgba(0, 255, 100, 0.1);
  border: 1px solid #00ff64;
  color: #00ff64;
  padding: 4px 16px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 20px;
  margin-bottom: 12px;
}

.doc-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 2px;
}

.tab-btn {
  background: #222;
  border: 1px solid #333;
  border-bottom: none;
  color: #666;
  padding: 10px 16px;
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 4px 4px 0 0;
}
.tab-btn.active {
  background: #2a2a2a;
  color: #f08040;
  border-top: 2px solid #f08040;
}

.tab-index { opacity: 0.5; }

.doc-content {
  background: #2a2a2a;
  border: 1px solid #333;
  padding: 24px;
  min-height: 300px;
}

.document-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.doc-header {
  font-size: 0.7rem;
  color: #666;
  border-bottom: 1px solid #444;
  padding-bottom: 8px;
  font-weight: bold;
}

.postit {
  background: #333;
  padding: 24px;
  border-radius: 4px;
}

.cond-table {
  width: 100%;
  border-collapse: collapse;
}
.cond-table td {
  padding: 8px 0;
  border-bottom: 1px solid #444;
  font-size: 0.8rem;
}
.cond-table .label { color: #888; width: 150px; }
.cond-table .value { color: #fff; font-weight: bold; }

.doc-footer {
  margin-top: 20px;
  font-size: 0.75rem;
  color: #666;
  font-style: italic;
}

.highlight-footer {
  color: #80e060;
  border-top: 1px solid #444;
  padding-top: 16px;
}

.table-scroll { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}
.data-table th {
  background: #1a1a1a;
  color: #666;
  padding: 8px;
  text-align: left;
  border: 1px solid #333;
}
.data-table td {
  padding: 8px;
  border: 1px solid #333;
  color: #aaa;
}

.highlight-k td {
  background: rgba(128, 224, 96, 0.05);
  color: #80e060;
  border-color: rgba(128, 224, 96, 0.2);
}

.mod-id { font-weight: bold; color: #fff; }

.level-cell {
  font-weight: 800;
  color: #f08040;
}
</style>
