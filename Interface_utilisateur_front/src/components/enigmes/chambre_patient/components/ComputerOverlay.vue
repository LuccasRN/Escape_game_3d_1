<template>
  <div class="overlay-backdrop" @click.self="close">
    <div class="computer-ui">

      <div class="ui-header">
        <div class="header-main">
          <div class="terminal-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M20,19V7H4V19H20M20,3A2,2,0,0,1,22,5V19A2,2,0,0,1,20,21H4A2,2,0,0,1,2,19V5A2,2,0,0,1,4,3H20M13,17V15H18V17H13M9.58,13L5.57,9L6.99,7.58L12.41,13L6.99,18.41L5.57,17L9.58,13Z"/>
            </svg>
          </div>
          <span class="ui-logo">DIAGNOSTIC NEURO-ALLERGOLOGIQUE v2.4.1</span>
        </div>
        <button class="close-btn" @click="close">TERMINER LA SESSION</button>
      </div>

      <template v-if="step === 'result'">
        <div class="result-panel">
          <div class="panel-header">
            <span class="badge success">ANALYSE TERMINÉE</span>
            <div class="result-title">RAPPORT DE DIAGNOSTIC AUTOMATISÉ</div>
          </div>
          <div class="result-grid">
            <div class="result-item">
              <span class="item-label">CATÉGORIE D'ALLERGIE</span>
              <span class="item-value">MÉDICAMENTEUSE</span>
            </div>
            <div class="result-item">
              <span class="item-label">NIVEAU DE RÉPONSE</span>
              <span class="item-value">35 / 100</span>
            </div>
            <div class="result-item">
              <span class="item-label">PARAMÈTRES DU MODÈLE</span>
              <span class="item-value">LSTM (α=0.3, PRÉC: 0.95)</span>
            </div>
          </div>
          <div class="treatment-box">
            <span class="treatment-label">PROTOCOLE DE TRAITEMENT RECOMMANDÉ :</span>
            <span class="treatment-value">PARACÉTAMOL</span>
          </div>
          <div class="completion-info">
            <div class="final-timer-box">
              <span class="final-label">TEMPS DE RÉSOLUTION FINAL :</span>
              <span class="final-time">{{ finalTime }}</span>
            </div>
          </div>
          <div class="gm-questions">
            <div class="gm-title">DOSSIER DE VALIDATION CLINIQUE</div>
            <div class="gm-q">
              <p class="q-text">ID-01 : ÉTAT FONCTIONNEL DU RÉSEAU DE NEURONES</p>
              <p class="gm-a">STATUT : OPÉRATIONNEL (CONFORME AU RAPPORT FINAL)</p>
            </div>
            <div class="gm-q">
              <p class="q-text">ID-02 : JUSTIFICATION DE LA MODIFICATION THÉRAPEUTIQUE</p>
              <p class="gm-a">NOTE : PRÉSENCE D'ANTÉCÉDENTS D'ULCÈRE GASTRIQUE (CHOIX DE SUBSTITUTION)</p>
            </div>
            <div class="gm-q">
              <p class="q-text">ID-03 : RÉSULTAT DU MODÈLE (CAS CALVIN)</p>
              <p class="gm-a">DIAGNOSTIC : TRAITEMENT PARACÉTAMOL PRÉCONISÉ</p>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="ui-body">
          <section class="ui-section">
            <div class="section-title">
              <span class="section-id">SECTION A</span>
              PARAMÈTRES D'ENTRÉE DU PATIENT
            </div>
            <div class="field-group">
              <label>TYPE D'ALLERGIE IDENTIFIÉ</label>
              <div class="radio-group">
                <label v-for="opt in allergieOptions" :key="opt.value" class="radio-label">
                  <input type="radio" v-model="form.allergie" :value="opt.value" />
                  <span class="radio-custom"></span>
                  {{ opt.label.toUpperCase() }}
                </label>
              </div>
              <span v-if="errors.allergie" class="error-msg">{{ errors.allergie }}</span>
            </div>
            <div class="field-group">
              <label>NIVEAU DE RÉPONSE ALLERGIQUE (BASE 100)</label>
              <div class="input-wrapper">
                <input type="number" min="0" max="100" step="1" v-model.number="form.niveau" placeholder="00" class="input-field" />
                <span class="unit">%</span>
              </div>
              <span v-if="errors.niveau" class="error-msg">{{ errors.niveau }}</span>
              <p class="field-hint">Référence : Relevé allergologique + calibration LSTM (α=0.3)</p>
            </div>
          </section>

          <section class="ui-section">
            <div class="section-title">
              <span class="section-id">SECTION B</span>
              VECTEUR DE POIDS LSTM
              <span v-if="!boxUnlocked" class="badge locked">SYSTÈME VERROUILLÉ</span>
            </div>
            <div :class="['weights-container', { 'is-locked': !boxUnlocked }]">
              <p class="field-hint" style="margin-bottom:12px">Paramètres requis : Ligne K du tableau de calibration (Dossier sécurisé).</p>
              <div class="weights-grid">
                <div v-for="(_, i) in form.weights" :key="i" class="weight-field">
                  <label>W{{ i + 1 }}</label>
                  <input type="number" step="0.01" min="0" max="2" v-model.number="form.weights[i]" :disabled="!boxUnlocked" class="input-field weight-input" />
                  <div v-if="errors[`w${i}`]" class="invalid-indicator">!</div>
                </div>
              </div>
              <span v-if="errors.weights" class="error-msg">{{ errors.weights }}</span>
            </div>
          </section>
        </div>

        <div class="ui-footer">
          <button class="btn-validate" @click="validate">EXÉCUTER L'ALGORITHME DE DIAGNOSTIC</button>
          <span v-if="globalError" class="error-msg global-error">{{ globalError }}</span>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useGameState } from '../composables/useGameState.js'
import { notifyEnigmaCompleted } from '../../../../utils/enigme-completion.js'

const { showComputer, boxUnlocked, computerCompleted, gamePassed } = useGameState()

const CORRECT_ALLERGIE = 'medicamenteuse'
const CORRECT_NIVEAU   = 35
const CORRECT_WEIGHTS  = [0.70, 0.75, 0.72, 0.68, 0.77, 0.74, 0.69, 0.78, 0.73, 0.71]

const allergieOptions = [
  { value: 'medicamenteuse',   label: 'Médicamenteuse'   },
  { value: 'alimentaire',      label: 'Alimentaire'      },
  { value: 'environnementale', label: 'Environnementale' },
  { value: 'contact',          label: 'De contact'       },
]

const form = reactive({ allergie: '', niveau: null, weights: Array(10).fill(null) })
const errors = reactive({})
const globalError = ref('')
const step = ref('form')
const finalTime = ref('')

function close() { showComputer.value = false }

function validate() {
  Object.keys(errors).forEach(k => delete errors[k])
  globalError.value = ''
  let ok = true

  if (form.allergie !== CORRECT_ALLERGIE) {
    errors.allergie = 'ERREUR : Catégorie non concordante avec les relevés cliniques.'
    ok = false
  }
  if (form.niveau !== CORRECT_NIVEAU) {
    errors.niveau = 'ERREUR : Niveau de réponse invalide.'
    ok = false
  }

  if (boxUnlocked.value) {
    let weightErrors = false
    form.weights.forEach((w, i) => {
      if (Math.abs((w ?? -1) - CORRECT_WEIGHTS[i]) > 0.005) {
        errors[`w${i}`] = true
        weightErrors = true
      }
    })
    if (weightErrors) {
      errors.weights = 'ERREUR : Un ou plusieurs poids du vecteur sont hors tolérance.'
      ok = false
    }
  } else {
    if (form.weights.some(w => w === null)) {
      errors.weights = 'ERREUR : Vecteur de poids incomplet.'
      ok = false
    }
  }

  if (ok) {
    computerCompleted.value = true
    gamePassed.value = true
    finalTime.value = window.getTimerValue ? window.getTimerValue() : ''
    step.value = 'result'
    showComputer.value = false // Fermer automatiquement l'ordinateur
    startConfetti()

    // âœ… Notifier le dashboard parent â€” succès enigme 2
    notifyEnigmaCompleted(true, 2)
  } else {
    globalError.value = "Échec de la validation. Vérifiez les paramètres d'entrée."
  }
}

function startConfetti() {
  if (typeof confetti === 'undefined') return
  const duration = 10 * 1000
  const end = Date.now() + duration
  const colors = ['#38bdf8', '#10b981', '#ffffff', '#f08040']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors, zIndex: 10000 })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors, zIndex: 10000 })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
</script>

<style scoped>
.overlay-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.9); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; backdrop-filter: blur(8px); }
.computer-ui { background: #ffffff; border-radius: 8px; width: min(900px, 100%); max-height: 90vh; overflow-y: auto; font-family: 'Inter', -apple-system, sans-serif; color: #1e293b; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); display: flex; flex-direction: column; }
.ui-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #1e293b; color: #f1f5f9; }
.header-main { display: flex; align-items: center; gap: 12px; }
.terminal-icon { color: #38bdf8; }
.ui-logo { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.05em; }
.close-btn { background: transparent; border: 1px solid #475569; color: #94a3b8; cursor: pointer; padding: 6px 12px; border-radius: 4px; font-size: 0.65rem; font-weight: bold; transition: all 0.2s; }
.close-btn:hover { background: #334155; color: #fff; border-color: #64748b; }
.ui-body { padding: 32px; display: flex; gap: 32px; flex-wrap: wrap; background: #f8fafc; }
.ui-section { flex: 1 1 350px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.section-title { font-size: 0.85rem; font-weight: 700; color: #0f172a; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
.section-id { background: #38bdf8; color: #fff; padding: 2px 8px; border-radius: 4px; font-size: 0.65rem; font-weight: 900; }
.badge { font-size: 0.6rem; font-weight: 800; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; }
.badge.locked { background: #fee2e2; color: #ef4444; }
.badge.success { background: #dcfce7; color: #16a34a; }
.field-group { margin-bottom: 24px; }
.field-group > label { display: block; font-size: 0.65rem; font-weight: 700; color: #64748b; margin-bottom: 8px; letter-spacing: 0.025em; }
.radio-group { display: flex; flex-direction: column; gap: 8px; }
.radio-label { font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #f1f5f9; border-radius: 6px; border: 1px solid transparent; transition: all 0.2s; }
.radio-label:hover { background: #e2e8f0; }
.input-wrapper { display: flex; align-items: center; gap: 8px; }
.input-field { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; color: #1e293b; padding: 10px 14px; font-family: inherit; font-size: 1rem; width: 100%; transition: border-color 0.2s; }
.input-field:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.1); }
.unit { font-weight: 700; color: #94a3b8; }
.field-hint { font-size: 0.7rem; color: #64748b; margin-top: 8px; }
.error-msg { font-size: 0.7rem; color: #ef4444; font-weight: 600; margin-top: 6px; display: block; }
.weights-container.is-locked { opacity: 0.5; pointer-events: none; filter: grayscale(1); }
.weights-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.weight-field { display: flex; flex-direction: column; gap: 4px; position: relative; }
.weight-field label { font-size: 0.6rem; font-weight: 700; color: #94a3b8; text-align: center; }
.weight-input { padding: 6px; font-size: 0.8rem; text-align: center; }
.invalid-indicator { position: absolute; top: -4px; right: -4px; background: #ef4444; color: #fff; width: 14px; height: 14px; border-radius: 50%; font-size: 0.6rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
.ui-footer { padding: 24px 32px; background: #ffffff; border-top: 1px solid #e2e8f0; display: flex; align-items: center; gap: 24px; }
.btn-validate { background: #0f172a; border: none; color: #ffffff; padding: 12px 24px; font-family: inherit; font-size: 0.8rem; font-weight: 700; border-radius: 6px; cursor: pointer; letter-spacing: 0.025em; transition: background 0.2s; }
.btn-validate:hover { background: #1e293b; }
.global-error { margin-top: 0; }
.result-panel { padding: 40px; background: #ffffff; }
.panel-header { margin-bottom: 32px; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; }
.result-title { font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-top: 12px; }
.result-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 24px; margin-bottom: 40px; }
.result-item { display: flex; flex-direction: column; gap: 4px; padding: 16px; background: #f8fafc; border-radius: 8px; }
.item-label { font-size: 0.65rem; font-weight: 800; color: #64748b; letter-spacing: 0.05em; }
.item-value { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.treatment-box { background: #dcfce7; border: 1px solid #bbf7d0; padding: 24px; border-radius: 8px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 40px; }
.treatment-label { font-size: 0.75rem; font-weight: 800; color: #166534; }
.treatment-value { font-size: 2rem; font-weight: 900; color: #14532d; }
.completion-info { margin-bottom: 40px; background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; }
.final-timer-box { display: flex; flex-direction: column; gap: 4px; }
.final-label { font-size: 0.7rem; font-weight: 800; color: #64748b; }
.final-time { font-size: 1.5rem; font-weight: 900; color: #38bdf8; }
.gm-questions { background: #1e293b; color: #f1f5f9; border-radius: 8px; padding: 24px; }
.gm-title { font-size: 0.7rem; font-weight: 900; color: #38bdf8; margin-bottom: 20px; letter-spacing: 0.1em; }
.gm-q { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #334155; }
.gm-q:last-child { border-bottom: none; margin-bottom: 0; }
.q-text { font-size: 0.65rem; font-weight: 700; color: #94a3b8; margin-bottom: 4px; }
.gm-a { font-size: 0.85rem; font-weight: 600; color: #f8fafc; }
</style>
