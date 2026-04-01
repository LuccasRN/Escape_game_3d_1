<template>
  <div v-if="!isWifiConnected" class="net-error">
    <div class="error-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.56 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    </div>
    <div class="error-badge">ERREUR RÉSEAU</div>
    <h3>Connexion impossible</h3>
    <p>Aucune connexion internet ni réseau local détectée.</p>
    <p class="error-hint">Vérifiez les branchements du routeur physique.</p>
    <div class="error-code">Code: NET_ERR_NO_CONNECTION (0x404)</div>
  </div>

  <div v-else class="net-connected">
    <div class="net-header">
      <div class="net-status">
        <div class="status-dot online"></div>
        <span>Réseau local actif</span>
      </div>
      <span class="net-ip">192.168.1.x</span>
    </div>
    <div class="net-devices">
      <div class="device-item server" @dblclick="$emit('openSecretFile')">
        <div class="device-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
        </div>
        <div class="device-info">
          <span class="device-name">Serveur_Admin</span>
          <span class="device-desc">Partage réseau sécurisé</span>
        </div>
        <div class="device-arrow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ isWifiConnected: { type: Boolean, default: false } })
defineEmits(['openSecretFile'])
</script>

<style scoped>
.net-error {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%;
  text-align: center; padding: 30px;
}
.error-icon { color: rgba(255, 80, 80, 0.5); margin-bottom: 16px; }
.error-badge {
  font-size: 0.6rem; font-weight: 700;
  color: #ff5050; letter-spacing: 0.15em;
  padding: 4px 12px; border-radius: 3px;
  background: rgba(255, 60, 60, 0.08);
  border: 1px solid rgba(255, 60, 60, 0.15);
  margin-bottom: 16px;
}
.net-error h3 {
  margin: 0 0 8px; font-size: 1rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
}
.net-error p {
  margin: 0 0 4px; font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.3);
}
.error-hint { font-style: italic; color: rgba(255, 200, 100, 0.4) !important; }
.error-code {
  margin-top: 16px; font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; color: rgba(255, 255, 255, 0.15);
}

.net-connected { height: 100%; display: flex; flex-direction: column; }
.net-header {
  display: flex; justify-content: space-between; align-items: center;
  padding-bottom: 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 16px;
}
.net-status {
  display: flex; align-items: center; gap: 8px;
  font-size: 0.75rem; font-weight: 500;
  color: rgba(0, 210, 160, 0.8);
}
.status-dot {
  width: 7px; height: 7px; border-radius: 50%;
}
.status-dot.online {
  background: #00d4a0;
  box-shadow: 0 0 8px rgba(0, 212, 160, 0.5);
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.net-ip {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem; color: rgba(255, 255, 255, 0.2);
}

.device-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px; border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  cursor: pointer; transition: all 0.2s;
}
.device-item:hover {
  background: rgba(0, 200, 255, 0.06);
  border-color: rgba(0, 200, 255, 0.12);
}
.device-icon { color: rgba(0, 200, 255, 0.5); flex-shrink: 0; }
.device-item:hover .device-icon { color: rgba(0, 200, 255, 0.8); }
.device-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.device-name { font-size: 0.8rem; font-weight: 600; color: rgba(255, 255, 255, 0.7); }
.device-desc { font-size: 0.65rem; color: rgba(255, 255, 255, 0.25); }
.device-arrow { color: rgba(255, 255, 255, 0.15); transition: transform 0.15s; }
.device-item:hover .device-arrow { transform: translateX(3px); color: rgba(0, 200, 255, 0.4); }
</style>
