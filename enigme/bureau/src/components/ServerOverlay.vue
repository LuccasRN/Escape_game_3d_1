<template>
  <GameOverlay :visible="visible" @close="$emit('close')">
    <div class="server-frame">
      <div class="server-icon">🖥️</div>
      <h2 class="server-title">WINDOWS_7_server</h2>
      <p class="server-subtitle">Serveur de fichiers - Hôpital</p>
      <div class="server-ip-box">
        <p class="ip-label">Adresse IP du serveur :</p>
        <p class="ip-value">192.168.56.100</p>
      </div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
  </GameOverlay>
</template>

<script setup>
import GameOverlay from './GameOverlay.vue'

defineProps({
  visible: { type: Boolean, default: false }
})
defineEmits(['close'])
</script>

<style scoped>
.server-frame {
  position: relative;
  width: 400px;
  max-width: 90%;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid #00bcd4;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  font-family: 'Source Code Pro', monospace;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
}
.server-icon {
  font-size: 48px;
  margin-bottom: 15px;
}
.server-title {
  color: #00bcd4;
  margin: 0 0 10px 0;
  font-size: 18px;
}
.server-subtitle {
  color: #aaa;
  font-size: 12px;
  margin-bottom: 20px;
}
.server-ip-box {
  background: #0a0a1a;
  border: 1px solid #00bcd4;
  border-radius: 6px;
  padding: 15px;
  margin: 10px 0;
}
.ip-label {
  color: #888;
  font-size: 11px;
  margin: 0 0 5px 0;
}
.ip-value {
  color: #50ef87;
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  letter-spacing: 2px;
}
.server-hint {
  color: #666;
  font-size: 11px;
  margin-top: 15px;
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
