<template>
  <div class="game-ui-overlay">
    <div class="hint-bar">
      <span>Explorez la pharmacie</span>
    </div>

    <!-- Bear info modal -->
    <div v-if="showBearInfo" class="modal-overlay" @click.self="showBearInfo = false">
      <div class="modal bear-modal">
        <button class="modal-close" @click="showBearInfo = false">✕</button>
        <h2>Papier trouvé dans la peluche</h2>
        <div class="note-paper">
          <div class="note-code">CODE TERMINAL : 4719</div>
          <div class="note-body">
            <p><em>Notes de l'inspecteur Marchand :</em></p>
            <p>Le Dr Deckard a traité un patient pour une pathologie hivernale courante (code <strong>J1_</strong>). Deux traitements étaient possibles — un <strong>AINS</strong> et un <strong>non-AINS</strong>. Vérifier la table de prescriptions.</p>
            <p>L'affaire Calvin est plus grave. Elle souffrait d'une infection pulmonaire bactérienne (code <strong>J15._</strong>). Le traitement administré n'était <strong>PAS</strong> le bon. Quel médicament de première intention aurait dû être utilisé ?</p>
            <p class="note-footer">Trouver les réponses. Les saisir dans le terminal.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables modal -->
    <div v-if="showTablesModal" class="modal-overlay" @click.self="showTablesModal = false">
      <div class="modal tables-modal">
        <button class="modal-close" @click="showTablesModal = false">✕</button>
        <h2>Documents trouvés sur le bureau</h2>
        <div class="table-section">
          <h3>PATHOLOGIES_REF</h3>
          <table>
            <thead><tr><th>Code CIM-10</th><th>Nom</th></tr></thead>
            <tbody>
              <tr><td>J06.9</td><td>Infection aiguë des voies respiratoires</td></tr>
              <tr><td>J10</td><td>Grippe</td></tr>
              <tr><td>J15.9</td><td>Pneumopathie bactérienne, sans précision</td></tr>
              <tr><td>E11</td><td>Diabète de type 2</td></tr>
              <tr><td>I10</td><td>Hypertension essentielle</td></tr>
              <tr><td>M54.5</td><td>Lombalgie</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-section">
          <h3>PRESCRIPTION_STANDARD</h3>
          <table>
            <thead><tr><th>Code CIM-10</th><th>Alternative</th><th>Code Médicament</th></tr></thead>
            <tbody>
              <tr><td>J06.9</td><td>Symptomatique</td><td>MED-501</td></tr>
              <tr><td>J10</td><td>AINS</td><td>MED-101</td></tr>
              <tr><td>J10</td><td>Non-AINS</td><td>MED-102</td></tr>
              <tr><td>J15.9</td><td>1ère intention</td><td>MED-201</td></tr>
              <tr><td>J15.9</td><td>2ème intention</td><td>MED-202</td></tr>
              <tr><td>E11</td><td>Antidiabétique</td><td>MED-301</td></tr>
              <tr><td>I10</td><td>1ère intention</td><td>MED-401</td></tr>
              <tr><td>M54.5</td><td>AINS</td><td>MED-601</td></tr>
            </tbody>
          </table>
        </div>
        <div class="table-section">
          <h3>MEDICAMENTS_SPECIALITES</h3>
          <table>
            <thead><tr><th>Code</th><th>DCI</th><th>Classe thérapeutique</th></tr></thead>
            <tbody>
              <tr><td>MED-101</td><td>Ibuprofène</td><td>Anti-inflammatoire (AINS)</td></tr>
              <tr><td>MED-102</td><td>Prednisone</td><td>Corticoïde</td></tr>
              <tr><td>MED-201</td><td>Amoxicilline</td><td>Antibiotique (pénicilline)</td></tr>
              <tr><td>MED-202</td><td>Lévofloxacine</td><td>Fluoroquinolone</td></tr>
              <tr><td>MED-301</td><td>Metformine</td><td>Antidiabétique (biguanide)</td></tr>
              <tr><td>MED-401</td><td>Amlodipine</td><td>Inhibiteur calcique</td></tr>
              <tr><td>MED-501</td><td>Paracétamol</td><td>Analgésique / Antipyrétique</td></tr>
              <tr><td>MED-601</td><td>Kétoprofène</td><td>Anti-inflammatoire (AINS)</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Medicine info modal -->
    <div v-if="showMedicineInfo" class="modal-overlay" @click.self="showMedicineInfo = false">
      <div class="modal medicine-modal">
        <button class="modal-close" @click="showMedicineInfo = false">✕</button>
        <h2>Boîte de médicament</h2>
        <p class="medicine-name">{{ currentMedicineName }}</p>
        <p class="medicine-hint">L'étiquette est partiellement illisible. Consultez les documents de référence pour identifier le contenu exact de chaque boîte.</p>
      </div>
    </div>

    <!-- Computer terminal modal -->
    <div v-if="isComputerUIOpen" class="modal-overlay" @click.self="isComputerUIOpen = false">
      <div class="modal computer-modal">
        <button class="modal-close" @click="isComputerUIOpen = false">✕</button>

        <div v-if="!isComputerUnlocked" class="lock-screen">
          <div class="lock-icon">Verrouillé</div>
          <h2>Terminal Médical — Accès Restreint</h2>
          <p class="lock-instruction">Saisissez le code d'accès à 4 chiffres</p>
          <div class="code-entry">
            <input v-model="codeInput" type="text" maxlength="4" placeholder="_ _ _ _" class="code-input" @keyup.enter="tryUnlock" />
            <button class="btn-unlock" @click="tryUnlock">Déverrouiller</button>
          </div>
          <p v-if="codeError" class="code-error">{{ codeError }}</p>
        </div>

        <div v-else>
          <div class="computer-tabs">
            <button :class="['tab-btn', { active: activeTab === 'dossiers' }]" @click="activeTab = 'dossiers'">Dossiers Patients</button>
            <button :class="['tab-btn', { active: activeTab === 'formulaire' }]" @click="activeTab = 'formulaire'">Validation</button>
          </div>

          <div v-if="activeTab === 'dossiers'" class="tab-content">
            <div class="patient-file">
              <h3>Cabinet du Dr Deckard</h3>
              <div class="file-content">
                <p><strong>Patient :</strong> M. Roy Batty</p>
                <p><strong>Date :</strong> 15/01/2026</p>
                <p><strong>Diagnostic :</strong></p>
                <p class="highlight">Le patient présente les symptômes d'une <span class="keyword">GRIPPE</span> (code CIM-10 : <span class="code">J10</span>).</p>
                <p><em>Prescrire un traitement adapté. Deux alternatives thérapeutiques existent.</em></p>
              </div>
            </div>
            <div class="patient-file">
              <h3>Rapport d'autopsie — Mme Susan Calvin</h3>
              <div class="file-content">
                <p><strong>Date du décès :</strong> 22/12/2025</p>
                <p><strong>Médecin légiste :</strong> Dr Eldon Tyrell</p>
                <p class="highlight">La victime souffrait de <span class="keyword">PNEUMOPATHIE BACTÉRIENNE</span> (code CIM-10 : <span class="code">J15.9</span>).</p>
                <p class="highlight warning">Le traitement administré n'était <strong>pas le bon</strong>. Si le traitement de 1ère intention avait été prescrit, la patiente aurait pu être sauvée.</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'formulaire'" class="tab-content">
            <h3>Formulaire de validation</h3>
            <p class="form-instruction">Identifiez les DCI manquantes à partir de votre enquête.</p>
            <form @submit.prevent="submitAnswers" class="validation-form">
              <div class="form-group">
                <label><strong>1.</strong> Traitement <strong>AINS</strong> pour la grippe — DCI :</label>
                <input v-model="answer1" type="text" placeholder="Nom de la molécule" autocomplete="off" spellcheck="false" />
              </div>
              <div class="form-group">
                <label><strong>2.</strong> Traitement <strong>non-AINS</strong> pour la grippe — DCI :</label>
                <input v-model="answer2" type="text" placeholder="Nom de la molécule" autocomplete="off" spellcheck="false" />
              </div>
              <div class="form-group">
                <label><strong>3.</strong> Traitement de <strong>1ère intention</strong> pour la pneumopathie — DCI :</label>
                <input v-model="answer3" type="text" placeholder="Nom de la molécule" autocomplete="off" spellcheck="false" />
              </div>
              <div v-if="validationMessage" :class="['validation-msg', validationSuccess ? 'success' : 'error']">
                {{ validationMessage }}
              </div>
              <button type="submit" class="btn-submit" :disabled="gameCompleted">
                {{ gameCompleted ? '✅ Accès autorisé' : 'Valider les réponses' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="gameCompleted" class="win-banner">
        <div class="win-content">
          <h2>Enquête résolue</h2>
          <p>Traitements correctement identifiés — la trousse de premiers secours est déverrouillée.</p>
        </div>
      </div>
    </transition>

    <MiniGame v-if="showMiniGame" @victory="onMiniGameWon" @close="showMiniGame = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameState } from '@/composables/useGameState.vue'
import MiniGame from './MiniGame.vue'
import { notifyEnigmaCompleted } from '../utils/enigme-completion.js'

const {
  discoveredClues,
  isComputerUIOpen,
  isComputerUnlocked,
  showTablesModal,
  showMedicineInfo,
  showBearInfo,
  showMiniGame,
  currentMedicineName,
  gameCompleted,
  validationMessage,
  validationSuccess,
  discoverClue,
} = useGameState()

function onMiniGameWon() {
  showMiniGame.value = false
  showBearInfo.value = true
  discoverClue('bear')
}

const activeTab = ref('dossiers')
const codeInput = ref('')
const codeError = ref('')
const TERMINAL_CODE = '4719'

function tryUnlock() {
  if (codeInput.value.trim() === TERMINAL_CODE) {
    isComputerUnlocked.value = true
    codeError.value = ''
  } else {
    codeError.value = 'Code incorrect — accès refusé.'
    codeInput.value = ''
  }
}

const answer1 = ref('')
const answer2 = ref('')
const answer3 = ref('')

function normalize(s) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function submitAnswers() {
  const a1 = normalize(answer1.value)
  const a2 = normalize(answer2.value)
  const a3 = normalize(answer3.value)

  const q1ok = a1 === 'ibuprofene'
  const q2ok = a2 === 'prednisone'
  const q3ok = a3 === 'amoxicilline'

  if (q1ok && q2ok && q3ok) {
    validationMessage.value = 'Traitements validés — accès autorisé.'
    validationSuccess.value = true
    gameCompleted.value = true

    // ✅ Notifier le dashboard parent — succès enigme 3
    notifyEnigmaCompleted(true, 3)
  } else {
    const wrong = []
    if (!q1ok) wrong.push('1')
    if (!q2ok) wrong.push('2')
    if (!q3ok) wrong.push('3')
    validationMessage.value = `Réponse(s) incorrecte(s) (question${wrong.length > 1 ? 's' : ''} ${wrong.join(', ')}) — accès refusé.`
    validationSuccess.value = false
  }
}
</script>

<style scoped>
.game-ui-overlay {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 100;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}
.game-ui-overlay > * { pointer-events: auto; }

.hint-bar {
  position: fixed; bottom: 20px; left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.45); backdrop-filter: blur(8px);
  border-radius: 20px; padding: 8px 22px;
  color: rgba(255, 255, 255, 0.7); font-size: 13px; z-index: 200;
}

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; z-index: 300;
}
.modal {
  background: #1a1a2e; border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px; padding: 28px; color: #e0e0e0;
  max-height: 85vh; overflow-y: auto; position: relative;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}
.modal-close {
  position: absolute; top: 12px; right: 14px;
  background: none; border: none; color: #888; font-size: 20px; cursor: pointer;
}
.modal-close:hover { color: #fff; }

.bear-modal { width: min(90vw, 500px); }
.bear-modal h2 { margin-top: 0; color: #ffd700; font-size: 18px; }
.note-paper {
  background: #f5f0e1; color: #2a2215; border-radius: 6px; padding: 20px; margin-top: 16px;
  font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.7;
  border: 1px solid #d4c9a8;
}
.note-code {
  text-align: center; font-weight: bold; font-size: 16px; padding: 10px; margin-bottom: 14px;
  border: 2px dashed #8b7355; border-radius: 4px; letter-spacing: 3px;
}
.note-body p { margin: 10px 0; }
.note-footer { margin-top: 16px; font-style: italic; font-weight: bold; }

.tables-modal { width: min(92vw, 820px); }
.tables-modal h2 { margin-top: 0; color: #ffd700; font-size: 17px; }
.table-section { margin-bottom: 22px; }
.table-section h3 { color: #64b5f6; font-size: 14px; margin-bottom: 6px; font-family: 'Courier New', monospace; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead th { background: rgba(100, 181, 246, 0.12); color: #90caf9; padding: 7px 10px; text-align: left; font-weight: 600; border-bottom: 2px solid rgba(100, 181, 246, 0.25); }
tbody td { padding: 7px 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
tbody tr:hover { background: rgba(255, 255, 255, 0.03); }

.medicine-modal { width: min(90vw, 400px); text-align: center; }
.medicine-modal h2 { margin-top: 0; color: #ffd700; }
.medicine-name { font-size: 18px; font-weight: 600; color: #64ffda; margin: 14px 0; }
.medicine-hint { color: #999; font-size: 13px; }

.computer-modal { width: min(92vw, 700px); }

.lock-screen { text-align: center; padding: 30px 0; }
.lock-icon { font-size: 48px; margin-bottom: 12px; }
.lock-screen h2 { margin: 0 0 8px; color: #e0e0e0; font-size: 18px; }
.lock-instruction { color: #999; font-size: 14px; margin-bottom: 20px; }
.code-entry { display: flex; gap: 10px; justify-content: center; align-items: center; }
.code-input {
  width: 140px; text-align: center; font-size: 24px; letter-spacing: 8px;
  font-family: 'Courier New', monospace; padding: 10px;
  border: 2px solid rgba(255,255,255,0.15); border-radius: 8px;
  background: #16213e; color: #64ffda;
}
.code-input:focus { outline: none; border-color: #64b5f6; }
.btn-unlock {
  padding: 10px 20px; border: none; border-radius: 8px;
  background: #1a73e8; color: #fff; font-weight: 600; cursor: pointer; font-size: 14px;
}
.btn-unlock:hover { background: #1565c0; }
.code-error { color: #ff5252; font-size: 14px; margin-top: 12px; font-weight: 600; }

.computer-tabs { display: flex; gap: 4px; margin-bottom: 18px; border-bottom: 2px solid rgba(255,255,255,0.08); }
.tab-btn { background: none; border: none; color: #888; font-size: 14px; font-weight: 600; padding: 10px 16px; cursor: pointer; border-bottom: 3px solid transparent; transition: color 0.2s; }
.tab-btn:hover { color: #ccc; }
.tab-btn.active { color: #64b5f6; border-bottom-color: #64b5f6; }

.patient-file { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 18px; margin-bottom: 14px; }
.patient-file h3 { margin-top: 0; color: #ffd700; font-size: 15px; }
.file-content p { margin: 5px 0; line-height: 1.6; }
.highlight { background: rgba(100,181,246,0.08); border-left: 3px solid #64b5f6; padding: 10px 14px; border-radius: 0 6px 6px 0; margin: 10px 0; }
.highlight.warning { background: rgba(255,152,0,0.08); border-left-color: #ff9800; }
.keyword { color: #ff5252; font-weight: 700; }
.code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; color: #64ffda; }

.form-instruction { color: #999; font-size: 13px; margin-bottom: 18px; line-height: 1.5; }
.validation-form { display: flex; flex-direction: column; gap: 16px; }
.form-group label { display: block; margin-bottom: 5px; font-size: 14px; line-height: 1.5; }
.form-group input { width: 100%; padding: 10px 14px; border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; background: #16213e; color: #e0e0e0; font-size: 14px; box-sizing: border-box; }
.form-group input:focus { outline: none; border-color: #64b5f6; }
.validation-msg { padding: 10px 14px; border-radius: 8px; font-weight: 600; text-align: center; font-size: 14px; }
.validation-msg.error { background: rgba(255,82,82,0.12); color: #ff5252; border: 1px solid rgba(255,82,82,0.25); }
.validation-msg.success { background: rgba(76,175,80,0.12); color: #4caf50; border: 1px solid rgba(76,175,80,0.25); }
.btn-submit { padding: 12px 24px; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, #1a73e8, #0d47a1); color: #fff; transition: all 0.2s; }
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(26,115,232,0.35); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

.win-banner { position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, rgba(76,175,80,0.9), rgba(56,142,60,0.9)); backdrop-filter: blur(10px); padding: 18px; text-align: center; color: #fff; z-index: 400; }
.win-content h2 { margin: 0 0 4px; font-size: 22px; }
.win-content p { margin: 4px 0; font-size: 14px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s, transform 0.5s; }
.fade-enter-from { opacity: 0; transform: translateY(-30px); }
.fade-leave-to { opacity: 0; transform: translateY(-30px); }
</style>