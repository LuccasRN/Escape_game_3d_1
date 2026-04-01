<template>
  <div class="q-container">
    <div class="q-header">
      <div class="q-badge">DOSSIER JUDICIAIRE</div>
      <h3 class="q-title">Clôture Dossier : Calvin, S.</h3>
    </div>

    <div v-if="!isSafeOpened" class="q-locked">
      <div class="locked-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <div class="locked-badge">ACCÈS REFUSÉ</div>
      <p class="locked-text">Vous devez d'abord lire le rapport d'autopsie classé dans le coffre-fort avant d'être autorisé à remplir la clôture.</p>
    </div>

    <template v-else>
      <div class="q-form">
        <div class="form-field">
          <label>
            <span class="field-id">Q.01</span>
            Quelle est la cause du décès de Mme Calvin ?
          </label>
          <div class="input-wrapper">
            <input
              type="text"
              :value="answer1"
              @input="$emit('update:answer1', $event.target.value)"
              placeholder="Saisir la cause du décès..."
              spellcheck="false"
            />
          </div>
        </div>

        <div class="form-field">
          <label>
            <span class="field-id">Q.02</span>
            De quelle maladie souffrait-elle ?
          </label>
          <div class="input-wrapper">
            <input
              type="text"
              :value="answer2"
              @input="$emit('update:answer2', $event.target.value)"
              placeholder="Saisir la maladie..."
              spellcheck="false"
            />
          </div>
        </div>
      </div>

      <div class="q-footer">
        <button class="submit-btn" @click="$emit('submit')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          SOUMETTRE LE RAPPORT
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  isSafeOpened: { type: Boolean, default: false },
  answer1: { type: String, default: '' },
  answer2: { type: String, default: '' }
})
defineEmits(['update:answer1', 'update:answer2', 'submit'])
</script>

<style scoped>
.q-container {
  height: 100%; display: flex; flex-direction: column;
}

.q-header {
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 20px;
}
.q-badge {
  display: inline-block;
  font-size: 0.55rem; font-weight: 700;
  color: rgba(255, 180, 60, 0.8);
  letter-spacing: 0.15em;
  padding: 3px 10px; border-radius: 3px;
  background: rgba(255, 160, 60, 0.08);
  border: 1px solid rgba(255, 160, 60, 0.12);
  margin-bottom: 10px;
}
.q-title {
  margin: 0; font-size: 0.9rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.q-locked {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center; padding: 30px;
}
.locked-icon {
  color: rgba(255, 80, 80, 0.3); margin-bottom: 16px;
}
.locked-badge {
  font-size: 0.65rem; font-weight: 700;
  color: #ff5050; letter-spacing: 0.15em;
  padding: 4px 12px; border-radius: 3px;
  background: rgba(255, 60, 60, 0.08);
  border: 1px solid rgba(255, 60, 60, 0.12);
  margin-bottom: 14px;
}
.locked-text {
  margin: 0; font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  max-width: 320px; line-height: 1.6;
}

.q-form {
  flex: 1; display: flex; flex-direction: column; gap: 20px;
}

.form-field label {
  display: block; font-size: 0.75rem; font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}
.field-id {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; font-weight: 700;
  color: rgba(0, 200, 255, 0.5);
  background: rgba(0, 200, 255, 0.06);
  padding: 2px 6px; border-radius: 3px;
  margin-right: 8px;
}

.input-wrapper input {
  width: 100%; box-sizing: border-box;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  transition: border-color 0.15s;
}
.input-wrapper input::placeholder {
  color: rgba(255, 255, 255, 0.15);
}
.input-wrapper input:focus {
  outline: none;
  border-color: rgba(0, 200, 255, 0.3);
  box-shadow: 0 0 0 2px rgba(0, 200, 255, 0.06);
}

.q-footer {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  margin-top: auto;
}
.submit-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  background: rgba(0, 200, 255, 0.08);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 5px;
  color: rgba(0, 200, 255, 0.8);
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem; font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}
.submit-btn:hover {
  background: rgba(0, 200, 255, 0.14);
  border-color: rgba(0, 200, 255, 0.35);
  color: rgba(0, 220, 255, 1);
}
</style>
