<template>
  <div class="sys-panel">
    <div class="sys-header">
      <div class="sys-logo">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      </div>
      <div>
        <h3 class="sys-name">EscapeOS <span class="version">v11.4</span></h3>
        <p class="sys-owner">Propriétaire : Admin_Reseau</p>
      </div>
    </div>

    <div class="sys-grid">
      <div class="sys-card">
        <div class="card-label">Réseau</div>
        <div class="card-value" :class="{ online: isWifiConnected, offline: !isWifiConnected }">
          <div class="status-dot"></div>
          {{ isWifiConnected ? 'Connecté' : 'Hors ligne' }}
        </div>
      </div>
      <div class="sys-card">
        <div class="card-label">Processeur</div>
        <div class="card-value">Quantum Core i9</div>
      </div>
      <div class="sys-card">
        <div class="card-label">Mémoire RAM</div>
        <div class="card-value">128 Go DDR6</div>
      </div>
      <div class="sys-card">
        <div class="card-label">Stockage</div>
        <div class="card-value">2 To NVMe</div>
      </div>
      <div class="sys-card">
        <div class="card-label">Noyau</div>
        <div class="card-value">Kernel-X 6.2</div>
      </div>
      <div class="sys-card">
        <div class="card-label">Uptime</div>
        <div class="card-value">12j 07h 34m</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ isWifiConnected: { type: Boolean, default: false } })
</script>

<style scoped>
.sys-panel { padding: 4px; }

.sys-header {
  display: flex; align-items: center; gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 20px;
}
.sys-logo {
  width: 52px; height: 52px; border-radius: 12px;
  background: rgba(160, 130, 255, 0.1);
  display: flex; align-items: center; justify-content: center;
  color: #a88bfa; flex-shrink: 0;
}
.sys-name {
  margin: 0; font-size: 1rem; font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
}
.version {
  font-size: 0.7rem; font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
  margin-left: 6px;
}
.sys-owner {
  margin: 4px 0 0; font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
}

.sys-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.sys-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 6px;
  padding: 14px;
}
.card-label {
  font-size: 0.6rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.25);
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.card-value {
  font-size: 0.78rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  display: flex; align-items: center; gap: 6px;
}
.card-value .status-dot {
  width: 6px; height: 6px; border-radius: 50%;
}
.card-value.online { color: rgba(0, 210, 160, 0.8); }
.card-value.online .status-dot { background: #00d4a0; box-shadow: 0 0 6px rgba(0, 212, 160, 0.4); }
.card-value.offline { color: rgba(255, 80, 80, 0.6); }
.card-value.offline .status-dot { background: #ff5050; }
</style>

