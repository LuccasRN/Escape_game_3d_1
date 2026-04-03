<template>
  <div class="game-ui-overlay">
    <div class="hint-bar">
      <span>Explorez la pharmacie</span>
    </div>

    <!-- Bear info modal -->
    <div v-if="showBearInfo" class="modal-overlay" style="z-index: 320;" @click.self="showBearInfo = false">
      <div class="modal bear-modal">
        <button class="modal-close" @click="showBearInfo = false">&times;</button>
        <div class="note-paper">
          <div class="note-fold"></div>
          <div class="note-header">Note manuscrite</div>
          <div class="note-divider"></div>
          <div class="note-code">CODE TERMINAL&ensp;:&ensp;{{ terminalCode.split('').join(' ') }}</div>
          <div class="note-divider"></div>
          <div class="note-body">
            <p class="note-author">Insp. Marchand â€” notes personnelles</p>
            <p>Le Dr Deckard a traité un patient pour une pathologie hivernale courante (code <strong>J1_</strong>). Deux traitements étaient possibles â€” un <strong>AINS</strong> et un <strong>non-AINS</strong>. Vérifier la table de prescriptions.</p>
            <p>L'affaire Calvin est plus grave. Elle souffrait d'une infection pulmonaire bactérienne (code <strong>J15._</strong>). Le traitement administré n'était <strong>PAS</strong> le bon. Quel médicament de première intention aurait dû être utilisé ?</p>
            <p class="note-footer">â€” Trouver les réponses. Les saisir dans le terminal.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tables modal -->
    <div v-if="showTablesModal" class="modal-overlay" style="z-index: 320;" @click.self="showTablesModal = false">
      <div class="modal tables-modal">
        <button class="modal-close" @click="showTablesModal = false">&times;</button>
        <div class="doc-header">
          <div class="doc-stamp">CONFIDENTIEL</div>
          <h2>Registre pharmaceutique</h2>
          <p class="doc-sub">Documents récupérés sur le bureau du dispensaire</p>
        </div>
        <div class="table-section">
          <h3>Pathologies â€” Référentiel</h3>
          <table>
            <thead><tr><th>Code CIM-10</th><th>Pathologie</th></tr></thead>
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
          <h3>Prescriptions standards</h3>
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
          <h3>Spécialités médicamenteuses</h3>
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
        <button class="modal-close" @click="showMedicineInfo = false">&times;</button>
        <div class="med-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="12" rx="2"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>
        </div>
        <h2>Boîte de médicament</h2>
        <p class="medicine-name">{{ currentMedicineName }}</p>
        <p class="medicine-hint">L'étiquette est partiellement illisible. Consultez les documents de référence pour identifier le contenu exact de chaque boîte.</p>
      </div>
    </div>

    <!-- Computer terminal modal -->
    <div v-if="isComputerUIOpen" class="modal-overlay" @click.self="isComputerUIOpen = false">
      <div class="modal computer-modal">
        <button class="modal-close" @click="isComputerUIOpen = false">&times;</button>

        <div v-if="!isComputerUnlocked" class="lock-screen">
          <svg class="lock-svg" width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg>
          <h2>Terminal Médical</h2>
          <p class="lock-sub">Accès restreint â€” Saisissez le code à 4 chiffres</p>
          <div class="code-entry">
            <input v-model="codeInput" type="text" maxlength="4" placeholder="····" class="code-input" @keyup.enter="tryUnlock" />
            <button class="btn-unlock" @click="tryUnlock">Entrer</button>
          </div>
          <p v-if="codeError" class="code-error">{{ codeError }}</p>
        </div>

        <div v-else class="terminal-unlocked">
          <div class="terminal-bar">
            <span class="terminal-dot red"></span>
            <span class="terminal-dot yellow"></span>
            <span class="terminal-dot green"></span>
            <span class="terminal-title">Terminal â€” Hôpital St-Michel</span>
          </div>
          <div class="computer-tabs">
            <button :class="['tab-btn', { active: activeTab === 'dossiers' }]" @click="activeTab = 'dossiers'">Dossiers</button>
            <button :class="['tab-btn', { active: activeTab === 'formulaire' }]" @click="activeTab = 'formulaire'">Validation</button>
          </div>

          <div v-if="activeTab === 'dossiers'" class="tab-content">
            <div class="patient-file">
              <div class="file-badge">Consultation</div>
              <h3>Dr Deckard â€” Cabinet médical</h3>
              <div class="file-meta">
                <span>Patient : M. Roy Batty</span>
                <span>Date : 15/01/2026</span>
              </div>
              <div class="file-content">
                <p class="highlight">Le patient présente les symptômes d'une <span class="keyword">GRIPPE</span> (code CIM-10 : <span class="code-tag">J10</span>).</p>
                <p class="file-note">Prescrire un traitement adapté. Deux alternatives thérapeutiques existent.</p>
              </div>
            </div>
            <div class="patient-file autopsy">
              <div class="file-badge urgent">Autopsie</div>
              <h3>Mme Susan Calvin</h3>
              <div class="file-meta">
                <span>Décès : 22/12/2025</span>
                <span>Légiste : Dr Eldon Tyrell</span>
              </div>
              <div class="file-content">
                <p class="highlight">La victime souffrait de <span class="keyword">PNEUMOPATHIE BACTÉRIENNE</span> (code CIM-10 : <span class="code-tag">J15.9</span>).</p>
                <p class="highlight-warn">Le traitement administré n'était <strong>pas le bon</strong>. Si le traitement de 1ère intention avait été prescrit, la patiente aurait pu être sauvée.</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'formulaire'" class="tab-content">
            <h3>Identification des traitements</h3>
            <p class="form-instruction">Saisissez les DCI (dénominations communes internationales) correspondantes.</p>
            <form @submit.prevent="submitAnswers" class="validation-form">
              <div class="form-group">
                <label>Traitement <strong>AINS</strong> pour la grippe</label>
                <input v-model="answer1" type="text" placeholder="DCI du médicament" autocomplete="off" spellcheck="false" />
              </div>
              <div class="form-group">
                <label>Traitement <strong>non-AINS</strong> pour la grippe</label>
                <input v-model="answer2" type="text" placeholder="DCI du médicament" autocomplete="off" spellcheck="false" />
              </div>
              <div class="form-group">
                <label>Traitement de <strong>1ère intention</strong> â€” pneumopathie</label>
                <input v-model="answer3" type="text" placeholder="DCI du médicament" autocomplete="off" spellcheck="false" />
              </div>
              <div v-if="validationMessage" :class="['validation-msg', validationSuccess ? 'success' : 'error']">
                {{ validationMessage }}
              </div>
              <button type="submit" class="btn-submit" :disabled="gameCompleted">
                {{ gameCompleted ? 'Accès autorisé' : 'Valider' }}
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
          <p>Traitements identifiés â€” la trousse de premiers secours est déverrouillée.</p>
        </div>
      </div>
    </transition>

    <MiniGame v-if="showMiniGame" @victory="onMiniGameWon" @close="showMiniGame = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameState } from '../composables/useGameState.vue'
import MiniGame from './MiniGame.vue'
import { notifyEnigmaCompleted } from '../../../../utils/enigme-completion.js'

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
  terminalCode,
  discoverClue,
} = useGameState()

function onMiniGameWon() {
  showMiniGame.value = false
  showBearInfo.value = true
  discoverClue('bear')
}

const inventoryOpen = ref(false)
const activeTab = ref('dossiers')
const codeInput = ref('')
const codeError = ref('')

function tryUnlock() {
  if (codeInput.value.trim() === terminalCode.value) {
    isComputerUnlocked.value = true
    codeError.value = ''
  } else {
    codeError.value = 'Code incorrect â€” accès refusé.'
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
    isComputerUIOpen.value = false // Fermer automatiquement l'ordinateur

    // ✅ Notifier le dashboard parent — succès enigme 3
    notifyEnigmaCompleted(true, 3)
  } else {
    const wrong = []
    if (!q1ok) wrong.push('1')
    if (!q2ok) wrong.push('2')
    if (!q3ok) wrong.push('3')
    validationMessage.value = `Réponse(s) incorrecte(s) (question${wrong.length > 1 ? 's' : ''} ${wrong.join(', ')}) â€” accès refusé.`
    validationSuccess.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.game-ui-overlay {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 100;
  font-family: 'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif;
}
.game-ui-overlay > * { pointer-events: auto; }

.hint-bar {
  position: fixed; bottom: 20px; left: 50%;
  transform: translateX(-50%);
  background: rgba(15, 15, 20, 0.6); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; padding: 8px 20px;
  color: rgba(255, 255, 255, 0.55); font-size: 12px;
  letter-spacing: 0.3px; z-index: 200;
}

/* â•â•â•â•â•â•â• OVERLAY & MODAL BASE â•â•â•â•â•â•â• */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(5, 5, 12, 0.7); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; z-index: 300;
}
.modal {
  background: #151520;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px; padding: 0; color: #c8c8d0;
  max-height: 85vh; overflow-y: auto; position: relative;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.03);
}
.modal-close {
  position: absolute; top: 14px; right: 16px;
  background: none; border: none; color: rgba(255,255,255,0.25);
  font-size: 18px; cursor: pointer; z-index: 10;
  width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;
  border-radius: 4px; transition: all 0.15s;
}
.modal-close:hover { color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }

/* â•â•â•â•â•â•â• NOTE PAPER (Bear modal) â•â•â•â•â•â•â• */
.bear-modal { width: min(88vw, 440px); padding: 0; overflow: hidden; }
.note-paper {
  background: #f2ead8;
  color: #3a342a;
  padding: 32px 28px 28px;
  font-size: 13.5px; line-height: 1.75;
  position: relative;
  background-image:
    repeating-linear-gradient(transparent, transparent 27px, rgba(180,160,130,0.2) 27px, rgba(180,160,130,0.2) 28px);
}
.note-fold {
  position: absolute; top: 0; right: 0;
  width: 32px; height: 32px;
  background: linear-gradient(225deg, #151520 50%, #d9cfbb 50%);
}
.note-header {
  font-size: 11px; text-transform: uppercase; letter-spacing: 2px;
  color: #8a7d6b; margin-bottom: 12px;
}
.note-divider {
  height: 1px; background: rgba(120,100,70,0.25); margin: 10px 0;
}
.note-code {
  text-align: center;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-weight: 500; font-size: 17px;
  padding: 14px; margin: 6px 0;
  letter-spacing: 4px;
  color: #2c2618;
}
.note-body { margin-top: 8px; }
.note-body p { margin: 10px 0; }
.note-body strong { color: #1a1510; }
.note-author {
  font-size: 11.5px; color: #8a7d6b;
  text-transform: uppercase; letter-spacing: 0.5px;
  margin-bottom: 14px !important;
}
.note-footer {
  margin-top: 18px !important;
  font-style: italic; color: #6b5d48;
  border-top: 1px solid rgba(120,100,70,0.2);
  padding-top: 12px;
}

/* â•â•â•â•â•â•â• TABLES MODAL (Documents) â•â•â•â•â•â•â• */
.tables-modal { width: min(92vw, 780px); padding: 28px 32px; }
.doc-header { margin-bottom: 24px; position: relative; }
.doc-header h2 {
  margin: 0; font-size: 17px; font-weight: 600;
  color: #e0ddd6; letter-spacing: -0.2px;
}
.doc-sub { margin: 4px 0 0; font-size: 12px; color: rgba(255,255,255,0.3); }
.doc-stamp {
  display: inline-block;
  font-size: 9px; font-weight: 600; letter-spacing: 2px;
  color: #c0392b; border: 1.5px solid #c0392b;
  padding: 2px 8px; border-radius: 2px;
  transform: rotate(-2deg);
  margin-bottom: 8px; opacity: 0.7;
}

.table-section { margin-bottom: 26px; }
.table-section:last-child { margin-bottom: 0; }
.table-section h3 {
  font-size: 12px; font-weight: 600;
  color: rgba(255,255,255,0.45); letter-spacing: 0.3px;
  margin: 0 0 8px; padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

table { width: 100%; border-collapse: collapse; font-size: 13px; }
thead th {
  background: rgba(255,255,255,0.03);
  color: rgba(255,255,255,0.5);
  padding: 8px 12px; text-align: left; font-weight: 500; font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
tbody td {
  padding: 7px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  color: #b0aeb8;
}
tbody tr:nth-child(even) { background: rgba(255,255,255,0.015); }
tbody tr:hover { background: rgba(255,255,255,0.04); }
tbody td:first-child {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px;
  color: #8a9aaa;
}

/* â•â•â•â•â•â•â• MEDICINE MODAL â•â•â•â•â•â•â• */
.medicine-modal { width: min(88vw, 380px); text-align: center; padding: 32px 28px; }
.med-icon { color: rgba(255,255,255,0.2); margin-bottom: 12px; }
.medicine-modal h2 { margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #d0cdc5; }
.medicine-name {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px; font-weight: 500; color: #8a9aaa;
  margin: 12px 0;
  padding: 8px 14px; background: rgba(255,255,255,0.04);
  border-radius: 3px; display: inline-block;
}
.medicine-hint { color: rgba(255,255,255,0.3); font-size: 12px; line-height: 1.6; margin: 12px 0 0; }

/* â•â•â•â•â•â•â• COMPUTER TERMINAL â•â•â•â•â•â•â• */
.computer-modal { width: min(92vw, 660px); padding: 0; overflow: hidden; }

/* Lock screen */
.lock-screen { text-align: center; padding: 48px 32px 40px; }
.lock-svg { color: rgba(255,255,255,0.15); margin-bottom: 18px; }
.lock-screen h2 {
  margin: 0 0 6px; color: #d0cdc5; font-size: 16px; font-weight: 600;
}
.lock-sub { color: rgba(255,255,255,0.3); font-size: 12.5px; margin: 0 0 24px; }
.code-entry { display: flex; gap: 10px; justify-content: center; align-items: center; }
.code-input {
  width: 120px; text-align: center; font-size: 22px; letter-spacing: 6px;
  font-family: 'IBM Plex Mono', monospace; padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 3px;
  background: rgba(255,255,255,0.03); color: #d0cdc5;
  transition: border-color 0.2s;
}
.code-input::placeholder { color: rgba(255,255,255,0.15); letter-spacing: 8px; }
.code-input:focus { outline: none; border-color: rgba(255,255,255,0.25); }
.btn-unlock {
  padding: 10px 18px; border: 1px solid rgba(255,255,255,0.12); border-radius: 3px;
  background: rgba(255,255,255,0.06); color: #c8c8d0;
  font-weight: 500; cursor: pointer; font-size: 13px; transition: all 0.15s;
}
.btn-unlock:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.code-error { color: #cf6679; font-size: 12.5px; margin-top: 14px; }

/* Terminal unlocked */
.terminal-bar {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 16px;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.terminal-dot {
  width: 10px; height: 10px; border-radius: 50%;
}
.terminal-dot.red { background: #e05050; }
.terminal-dot.yellow { background: #e0b850; }
.terminal-dot.green { background: #50b860; }
.terminal-title {
  margin-left: 8px; font-size: 11px;
  color: rgba(255,255,255,0.3); letter-spacing: 0.3px;
}

.computer-tabs {
  display: flex; gap: 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 0 16px;
}
.tab-btn {
  background: none; border: none;
  color: rgba(255,255,255,0.35); font-size: 13px; font-weight: 500;
  padding: 12px 16px; cursor: pointer;
  border-bottom: 2px solid transparent; transition: all 0.15s;
  font-family: inherit;
}
.tab-btn:hover { color: rgba(255,255,255,0.6); }
.tab-btn.active { color: #d0cdc5; border-bottom-color: #d0cdc5; }

.tab-content { padding: 20px 24px; }
.tab-content h3 { margin: 0 0 6px; font-size: 15px; font-weight: 600; color: #d0cdc5; }

/* Patient files */
.patient-file {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px; padding: 18px 20px; margin-bottom: 14px;
  position: relative;
}
.file-badge {
  position: absolute; top: 14px; right: 16px;
  font-size: 10px; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.8px; color: #5a8a6a;
  padding: 2px 8px; border: 1px solid rgba(90,138,106,0.3);
  border-radius: 2px; background: rgba(90,138,106,0.08);
}
.file-badge.urgent {
  color: #c0392b; border-color: rgba(192,57,43,0.3);
  background: rgba(192,57,43,0.08);
}
.patient-file h3 { margin: 0 0 8px; font-size: 14px; font-weight: 600; color: #d0cdc5; }
.file-meta {
  display: flex; gap: 20px; flex-wrap: wrap;
  font-size: 12px; color: rgba(255,255,255,0.35);
  margin-bottom: 14px; padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.file-content { font-size: 13.5px; line-height: 1.65; }
.file-content p { margin: 6px 0; }
.highlight {
  background: rgba(255,255,255,0.03);
  padding: 10px 14px; border-radius: 3px; margin: 10px 0;
  border-left: 3px solid #5a8a6a;
}
.highlight-warn {
  background: rgba(192,57,43,0.05);
  padding: 10px 14px; border-radius: 3px; margin: 10px 0;
  border-left: 3px solid #c0392b;
}
.keyword { color: #e8a87c; font-weight: 600; }
.code-tag {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px;
  background: rgba(255,255,255,0.06); padding: 1px 6px;
  border-radius: 2px; color: #8a9aaa;
}
.file-note { font-style: italic; color: rgba(255,255,255,0.35); font-size: 12.5px; }

/* Validation form */
.form-instruction { color: rgba(255,255,255,0.3); font-size: 12px; margin-bottom: 20px; line-height: 1.5; }
.validation-form { display: flex; flex-direction: column; gap: 18px; }
.form-group label {
  display: block; margin-bottom: 6px; font-size: 13px;
  color: rgba(255,255,255,0.5); line-height: 1.5;
}
.form-group input {
  width: 100%; padding: 10px 0; font-size: 14px;
  border: none; border-bottom: 1px solid rgba(255,255,255,0.1);
  background: transparent; color: #d0cdc5;
  font-family: inherit; box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-group input::placeholder { color: rgba(255,255,255,0.15); }
.form-group input:focus { outline: none; border-bottom-color: rgba(255,255,255,0.35); }
.validation-msg {
  padding: 10px 14px; border-radius: 3px; font-size: 13px; text-align: center;
}
.validation-msg.error { background: rgba(192,57,43,0.08); color: #cf6679; border: 1px solid rgba(192,57,43,0.15); }
.validation-msg.success { background: rgba(90,138,106,0.08); color: #5a8a6a; border: 1px solid rgba(90,138,106,0.15); }
.btn-submit {
  padding: 12px 24px; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px; font-size: 13px; font-weight: 500;
  cursor: pointer; background: rgba(255,255,255,0.06); color: #d0cdc5;
  transition: all 0.15s; font-family: inherit;
}
.btn-submit:hover:not(:disabled) { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* â•â•â•â•â•â•â• VICTORY BANNER â•â•â•â•â•â•â• */
.win-banner {
  position: fixed; top: 0; left: 0; right: 0;
  background: #151520;
  border-bottom: 1px solid rgba(90,138,106,0.3);
  padding: 18px; text-align: center; color: #d0cdc5; z-index: 400;
}
.win-content h2 { margin: 0 0 2px; font-size: 16px; font-weight: 600; color: #5a8a6a; }
.win-content p { margin: 2px 0; font-size: 12.5px; color: rgba(255,255,255,0.4); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s, transform 0.4s; }
.fade-enter-from { opacity: 0; transform: translateY(-20px); }
.fade-leave-to { opacity: 0; transform: translateY(-20px); }

/* â•â•â•â•â•â•â• INVENTORY â•â•â•â•â•â•â• */
.inventory-area {
  position: fixed; bottom: 56px; left: 20px; z-index: 350;
}
.inventory-toggle {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  background: rgba(15, 15, 20, 0.75); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 500;
  font-family: inherit; cursor: pointer;
  transition: all 0.15s;
}
.inventory-toggle:hover { background: rgba(15, 15, 20, 0.9); color: rgba(255,255,255,0.8); }
.inventory-toggle.open { background: rgba(15, 15, 20, 0.95); border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
.inventory-toggle svg { opacity: 0.6; }
.inventory-toggle.open svg { opacity: 1; }

.inventory-panel {
  position: absolute; bottom: 44px; left: 0;
  width: 260px;
  background: rgba(15, 15, 20, 0.95); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  padding: 6px;
  display: flex; flex-direction: column; gap: 2px;
}

.inv-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 3px; cursor: pointer;
  transition: background 0.12s;
}
.inv-item:hover { background: rgba(255,255,255,0.06); }

.inv-icon {
  width: 34px; height: 34px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.inv-icon.note { background: rgba(200,170,100,0.12); color: #c8a864; }
.inv-icon.doc { background: rgba(100,140,180,0.12); color: #7aa0c0; }

.inv-text { min-width: 0; }
.inv-label { font-size: 12.5px; font-weight: 500; color: #d0cdc5; line-height: 1.3; }
.inv-sub { font-size: 10.5px; color: rgba(255,255,255,0.3); margin-top: 1px; }

.inv-slide-enter-active, .inv-slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.inv-slide-enter-from { opacity: 0; transform: translateY(8px); }
.inv-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>
