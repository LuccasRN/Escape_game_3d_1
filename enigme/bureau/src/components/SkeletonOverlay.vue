<template>
  <GameOverlay :visible="visible" @close="$emit('close')">
    <div class="skeleton-frame">
      <h2 class="form-title">🏆 Formulaire de Validation</h2>
      <p class="form-subtitle">Répondez aux questions pour terminer l'escape game</p>

      <div class="question-group">
        <label>1. Selon le Dr Deckard, de quoi souffrait Mme Calvin ?</label>
        <input
          v-model="answer1"
          type="text"
          placeholder="Votre réponse..."
          class="answer-input"
        />
        <span class="feedback" :class="feedback1Class">{{ feedback1Text }}</span>
      </div>

      <div class="question-group">
        <label>2. Quelles sont les informations complémentaires ?</label>
        <input
          v-model="answer2"
          type="text"
          placeholder="Votre réponse..."
          class="answer-input"
        />
        <span class="feedback" :class="feedback2Class">{{ feedback2Text }}</span>
      </div>

      <button v-if="!completed" class="validate-btn" @click="validateAnswers">Valider</button>

      <div v-if="completed" class="success-message">
        <h3>🎉 Félicitations !</h3>
        <p>Vous avez terminé l'escape game avec succès !</p>
        <p v-if="finalTime" class="final-time">⏱️ Temps : {{ finalTime }}</p>
      </div>

      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
  </GameOverlay>
</template>

<script setup>
import { ref } from 'vue'
import GameOverlay from './GameOverlay.vue'
import { notifyEnigmaCompleted } from '../../../../Interface_utilisateur_front/src/utils/enigme-completion'

defineProps({
  visible: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'completed'])

const answer1 = ref('')
const answer2 = ref('')
const feedback1Text = ref('')
const feedback1Class = ref('')
const feedback2Text = ref('')
const feedback2Class = ref('')
const completed = ref(false)
const finalTime = ref('')

function validateAnswers() {
  const a1 = answer1.value.toLowerCase().trim()
  const a2 = answer2.value.toLowerCase().trim()
  let correct1 = false, correct2 = false

  if (a1.includes('grippe')) {
    feedback1Text.value = '✓ Correct !'
    feedback1Class.value = 'correct'
    correct1 = true
  } else {
    feedback1Text.value = '✗ Incorrect'
    feedback1Class.value = 'incorrect'
  }

  if (a2.includes('cortisone')) {
    feedback2Text.value = '✓ Correct !'
    feedback2Class.value = 'correct'
    correct2 = true
  } else {
    feedback2Text.value = '✗ Incorrect'
    feedback2Class.value = 'incorrect'
  }

  if (correct1 && correct2) {
    if (window.stopTimer) window.stopTimer()
    finalTime.value = window.getTimerValue ? window.getTimerValue() : ''
    completed.value = true
    localStorage.setItem('escapeGameCompleted', 'true')
    emit('completed')
    startConfetti()

    // ✅ Notifier le dashboard parent
    notifyEnigmaCompleted(true, 1)
  }
}

function startConfetti() {
  if (typeof confetti === 'undefined') return
  const duration = 10 * 1000
  const end = Date.now() + duration
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700', '#ff6b6b', '#50ef87']
  ;(function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors, zIndex: 10000 })
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors, zIndex: 10000 })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}
</script>

<style scoped>
.skeleton-frame {
  position: relative;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid #e94560;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  font-family: 'Source Code Pro', monospace;
}
.form-title {
  color: #ffd700;
  margin: 0 0 10px 0;
  font-size: 20px;
}
.form-subtitle {
  color: #aaa;
  font-size: 12px;
  margin-bottom: 25px;
}
.question-group {
  margin-bottom: 20px;
  text-align: left;
}
.question-group label {
  display: block;
  color: #fff;
  font-size: 13px;
  margin-bottom: 8px;
}
.answer-input {
  width: 100%;
  padding: 12px;
  background: #0f3460;
  border: 2px solid #1a1a2e;
  border-radius: 6px;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  box-sizing: border-box;
}
.answer-input:focus {
  outline: none;
  border-color: #e94560;
}
.feedback {
  display: block;
  font-size: 11px;
  margin-top: 5px;
  min-height: 16px;
}
.feedback.correct { color: #50ef87; }
.feedback.incorrect { color: #ff6b6b; }
.validate-btn {
  background: #e94560;
  border: none;
  color: #fff;
  padding: 12px 30px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}
.validate-btn:hover { background: #ff6b6b; }
.success-message {
  margin-top: 20px;
  padding: 20px;
  background: rgba(80, 239, 135, 0.1);
  border: 2px solid #50ef87;
  border-radius: 8px;
}
.success-message h3 {
  color: #50ef87;
  margin: 0 0 10px 0;
}
.success-message p {
  color: #fff;
  font-size: 13px;
  margin: 5px 0;
}
.final-time {
  color: #ffd700 !important;
  font-size: 16px !important;
  margin-top: 10px !important;
}
.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #e74c3c;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
