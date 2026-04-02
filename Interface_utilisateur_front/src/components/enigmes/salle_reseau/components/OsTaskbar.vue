<template>
  <div class="os-taskbar">
    <div class="tb-left">
      <div class="start-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>
        <span>EscapeOS</span>
      </div>
    </div>

    <div class="tb-right">
      <div class="tb-tray">
        <div class="tray-item" :class="{ connected: isWifiConnected }">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
          <span class="tray-label">{{ isWifiConnected ? 'Connecté' : 'Hors ligne' }}</span>
        </div>
        <div class="tray-divider"></div>
        <div class="tray-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/></svg>
          <span class="tray-label">89%</span>
        </div>
        <div class="tray-divider"></div>
        <span class="tb-clock">{{ currentTime }}</span>
      </div>
      <button class="power-btn" @click="$emit('shutdown')" title="à‰teindre l'écran">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({ isWifiConnected: { type: Boolean, default: false } })
defineEmits(['shutdown'])

const currentTime = ref('00:00')
let timer = null

function updateTime() {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

onMounted(() => { updateTime(); timer = setInterval(updateTime, 1000) })
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.os-taskbar {
  height: 38px;
  background: rgba(6, 10, 18, 0.97);
  backdrop-filter: blur(12px);
  z-index: 2;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 12px;
  border-top: 1px solid rgba(0, 200, 255, 0.08);
  font-family: 'Inter', sans-serif;
}

.tb-left { display: flex; align-items: center; }

.start-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 4px 12px; border-radius: 4px;
  font-size: 0.7rem; font-weight: 600;
  color: rgba(0, 200, 255, 0.7);
  cursor: default;
  transition: background 0.15s;
}
.start-btn:hover { background: rgba(0, 200, 255, 0.06); }
.start-btn svg { opacity: 0.6; }

.tb-right { display: flex; align-items: center; gap: 8px; }

.tb-tray {
  display: flex; align-items: center; gap: 10px;
  padding: 4px 10px; border-radius: 4px;
  background: rgba(255, 255, 255, 0.03);
}

.tray-item {
  display: flex; align-items: center; gap: 5px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.65rem;
}
.tray-item.connected { color: rgba(0, 210, 160, 0.8); }
.tray-item.connected svg { filter: drop-shadow(0 0 4px rgba(0, 210, 160, 0.4)); }

.tray-divider {
  width: 1px; height: 14px;
  background: rgba(255, 255, 255, 0.08);
}

.tray-label { font-weight: 500; }

.tb-clock {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem; font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 1px;
}

.power-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border-radius: 4px;
  background: rgba(255, 60, 60, 0.08);
  border: 1px solid rgba(255, 60, 60, 0.15);
  color: rgba(255, 60, 60, 0.6);
  cursor: pointer;
  transition: all 0.15s;
}
.power-btn:hover {
  background: rgba(255, 60, 60, 0.15);
  color: rgba(255, 60, 60, 0.9);
  border-color: rgba(255, 60, 60, 0.3);
}
</style>

