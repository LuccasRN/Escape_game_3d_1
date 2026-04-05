<template>
  <div class="os-wrapper">
    <div class="scanline"></div>
    <div class="os-desktop">
      <div class="desktop-icons">
        <div class="desktop-icon" @dblclick="openWindow('documents')">
          <div class="icon-box docs">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M22 6l-10 7L2 6"/></svg>
          </div>
          <span class="icon-text">Mes Documents</span>
        </div>
        <div class="desktop-icon" @dblclick="openWindow('network')">
          <div class="icon-box net">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </div>
          <span class="icon-text">Réseau Local</span>
        </div>
        <div class="desktop-icon" @dblclick="openWindow('system')">
          <div class="icon-box sys">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <span class="icon-text">Système</span>
        </div>
        <div class="desktop-icon" @dblclick="openWindow('questionnaire')">
          <div class="icon-box quest">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <span class="icon-text">Clôture Enquête</span>
        </div>
      </div>

      <OsWindow v-if="activeWindow" :title="activeWindowTitle" @close="closeWindow">
        <WindowDocuments v-if="activeWindow === 'documents'" />
        <WindowNetwork v-else-if="activeWindow === 'network'" :isWifiConnected="isWifiConnected" @openSecretFile="openWindow('secret_file')" />
        <WindowSecretFile v-else-if="activeWindow === 'secret_file'" :safeCode="safeCode" @goBack="openWindow('network')" />
        <WindowSystem v-else-if="activeWindow === 'system'" :isWifiConnected="isWifiConnected" />
        <WindowQuestionnaire v-else-if="activeWindow === 'questionnaire'" :isSafeOpened="isSafeOpened" :answer1="answer1" :answer2="answer2" @update:answer1="$emit('update:answer1', $event)" @update:answer2="$emit('update:answer2', $event)" @submit="$emit('checkAnswers')" />
      </OsWindow>
    </div>

    <OsTaskbar :isWifiConnected="isWifiConnected" @shutdown="$emit('shutdown')" />
  </div>
</template>

<script setup>
import OsWindow from './OsWindow.vue'
import OsTaskbar from './OsTaskbar.vue'
import WindowDocuments from './WindowDocuments.vue'
import WindowNetwork from './WindowNetwork.vue'
import WindowSecretFile from './WindowSecretFile.vue'
import WindowSystem from './WindowSystem.vue'
import WindowQuestionnaire from './WindowQuestionnaire.vue'

defineProps({
  activeWindow: { type: String, default: null },
  activeWindowTitle: { type: String, default: '' },
  isWifiConnected: { type: Boolean, default: false },
  isSafeOpened: { type: Boolean, default: false },
  safeCode: { type: String, default: '----' },
  answer1: { type: String, default: '' },
  answer2: { type: String, default: '' }
})

const emit = defineEmits(['shutdown', 'openWindow', 'closeWindow', 'update:answer1', 'update:answer2', 'checkAnswers'])

function openWindow(win) { emit('openWindow', win) }
function closeWindow() { emit('closeWindow') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

.os-wrapper {
  position: absolute;
  top: 8%; left: 12%; right: 12%; bottom: 8%;
  border: 3px solid rgba(0, 210, 255, 0.25);
  border-radius: 10px;
  background-image: url('../img/fond_st.jpg');
  background-size: cover;
  display: flex; flex-direction: column;
  z-index: 20; color: #fff;
  overflow: hidden;
  box-shadow:
    0 0 40px rgba(0, 180, 255, 0.15),
    0 0 80px rgba(0, 0, 0, 0.6),
    inset 0 0 60px rgba(0, 0, 0, 0.5);
}
.os-wrapper::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0, 15, 30, 0.75), rgba(0, 5, 15, 0.85));
  z-index: 0;
}

.scanline {
  position: absolute; inset: 0; z-index: 999;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 200, 255, 0.015) 2px,
    rgba(0, 200, 255, 0.015) 4px
  );
}

.os-desktop {
  flex: 1; position: relative; z-index: 2; display: flex;
}

.desktop-icons {
  width: 130px; padding: 24px 16px;
  display: flex; flex-direction: column; gap: 20px;
}

.desktop-icon {
  display: flex; flex-direction: column; align-items: center;
  cursor: pointer; padding: 12px 8px; border-radius: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.desktop-icon:hover {
  background: rgba(0, 200, 255, 0.08);
  border-color: rgba(0, 200, 255, 0.15);
  transform: translateY(-2px);
}
.desktop-icon:active {
  transform: translateY(0);
  background: rgba(0, 200, 255, 0.15);
}

.icon-box {
  width: 48px; height: 48px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 6px;
  transition: box-shadow 0.2s;
}
.icon-box.docs { background: rgba(100, 160, 255, 0.15); color: #6ea8fe; }
.icon-box.net  { background: rgba(0, 200, 180, 0.15); color: #00d4b4; }
.icon-box.sys  { background: rgba(160, 130, 255, 0.15); color: #a88bfa; }
.icon-box.quest { background: rgba(255, 160, 60, 0.15); color: #ffa03c; }

.desktop-icon:hover .icon-box.docs { box-shadow: 0 0 16px rgba(100, 160, 255, 0.3); }
.desktop-icon:hover .icon-box.net  { box-shadow: 0 0 16px rgba(0, 200, 180, 0.3); }
.desktop-icon:hover .icon-box.sys  { box-shadow: 0 0 16px rgba(160, 130, 255, 0.3); }
.desktop-icon:hover .icon-box.quest { box-shadow: 0 0 16px rgba(255, 160, 60, 0.3); }

.icon-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem; font-weight: 500;
  text-align: center; color: rgba(255, 255, 255, 0.75);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  line-height: 1.3;
}
</style>

