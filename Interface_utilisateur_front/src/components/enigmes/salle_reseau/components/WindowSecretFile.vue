<template>
  <div class="secret-container">
    <div class="secret-header">
      <div class="file-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        CONFIDENTIEL
      </div>
      <h3 class="secret-title">Code_Securite_Urgence.txt</h3>
      <p class="secret-meta">Accès réseau sécurisé â€” Partage administrateur</p>
    </div>

    <div class="code-display">
      <div class="code-label">CODE D'ACCàˆS COFFRE-FORT</div>
      <div class="code-value">
        <span v-for="(digit, i) in safeCode.split('')" :key="i" class="code-digit">{{ digit }}</span>
      </div>
      <div class="code-hint">Saisir ce code sur le digicode du coffre physique</div>
    </div>

    <button class="back-btn" @click="$emit('goBack')">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
      Retour au réseau
    </button>
  </div>
</template>

<script setup>
defineProps({ safeCode: { type: String, default: '----' } })
defineEmits(['goBack'])
</script>

<style scoped>
.secret-container {
  height: 100%; display: flex; flex-direction: column;
}

.secret-header {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 24px;
}
.file-badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.55rem; font-weight: 700;
  color: #ff6b6b; letter-spacing: 0.15em;
  padding: 4px 10px; border-radius: 3px;
  background: rgba(255, 60, 60, 0.08);
  border: 1px solid rgba(255, 60, 60, 0.12);
  margin-bottom: 12px;
}
.secret-title {
  margin: 0 0 6px; font-size: 0.9rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'JetBrains Mono', monospace;
}
.secret-meta {
  margin: 0; font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.25);
}

.code-display {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px;
}
.code-label {
  font-size: 0.6rem; font-weight: 700;
  color: rgba(0, 200, 255, 0.4);
  letter-spacing: 0.2em;
}
.code-value {
  display: flex; gap: 8px;
}
.code-digit {
  width: 48px; height: 56px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.8rem; font-weight: 700;
  color: #00d8ff;
  background: rgba(0, 200, 255, 0.06);
  border: 1px solid rgba(0, 200, 255, 0.15);
  border-radius: 6px;
  text-shadow: 0 0 12px rgba(0, 216, 255, 0.4);
  animation: digitGlow 2s ease-in-out infinite alternate;
}
.code-digit:nth-child(2) { animation-delay: 0.3s; }
.code-digit:nth-child(3) { animation-delay: 0.6s; }
.code-digit:nth-child(4) { animation-delay: 0.9s; }

@keyframes digitGlow {
  from { border-color: rgba(0, 200, 255, 0.1); }
  to   { border-color: rgba(0, 200, 255, 0.3); }
}

.code-hint {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
}

.back-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; margin-top: auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.72rem; font-weight: 500;
  cursor: pointer; transition: all 0.15s;
  font-family: 'Inter', sans-serif;
  align-self: flex-start;
}
.back-btn:hover {
  background: rgba(0, 200, 255, 0.06);
  color: rgba(0, 200, 255, 0.7);
  border-color: rgba(0, 200, 255, 0.15);
}
</style>

