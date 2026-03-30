<template>
  <div class="os-wrapper">
    <div class="os-desktop">
      <div class="desktop-icons">
        <div class="desktop-icon" @dblclick="openWindow('documents')">
          <span class="icon-emoji"></span>
          <span class="icon-text">Mes Documents</span>
        </div>
        <div class="desktop-icon" @dblclick="openWindow('network')">
          <span class="icon-emoji"></span>
          <span class="icon-text">Réseau Local</span>
        </div>
        <div class="desktop-icon" @dblclick="openWindow('system')">
          <span class="icon-emoji"></span>
          <span class="icon-text">Système</span>
        </div>
        <div class="desktop-icon" @dblclick="openWindow('questionnaire')">
          <span class="icon-emoji"></span>
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
  activeWindow: {
    type: String,
    default: null
  },
  activeWindowTitle: {
    type: String,
    default: ''
  },
  isWifiConnected: {
    type: Boolean,
    default: false
  },
  isSafeOpened: {
    type: Boolean,
    default: false
  },
  safeCode: {
    type: String,
    default: '----'
  },
  answer1: {
    type: String,
    default: ''
  },
  answer2: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['shutdown', 'openWindow', 'closeWindow', 'update:answer1', 'update:answer2', 'checkAnswers'])

function openWindow(win) {
  emit('openWindow', win)
}

function closeWindow() {
  emit('closeWindow')
}
</script>

<style scoped>
.os-wrapper {
  position: absolute;
  top: 10%; left: 15%; right: 15%; bottom: 10%;
  border: 8px solid #111;
  border-radius: 12px;
  box-shadow: 0 0 50px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,0,0,0.8);
  background-image: url('../img/fond_st.jpg');
  background-size: cover;
  display: flex; flex-direction: column;
  z-index: 20; color: #fff;
  overflow: hidden;
}
.os-wrapper::before {
  content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
  background: rgba(0, 15, 30, 0.6);
}
.os-desktop {
  flex: 1; position: relative; z-index: 2; display: flex;
}
.desktop-icons {
  width: 120px; padding: 20px; display: flex; flex-direction: column; gap: 30px;
}
.desktop-icon {
  display: flex; flex-direction: column; align-items: center; cursor: pointer;
  padding: 10px; border-radius: 6px; transition: background 0.2s;
}
.desktop-icon:hover { background: rgba(0, 255, 255, 0.2); }
.icon-emoji { font-size: 2.5rem; text-shadow: 0 0 5px cyan; }
.icon-text { font-size: 0.8rem; margin-top: 5px; text-align: center; text-shadow: 1px 1px 2px #000; color: cyan; font-weight: bold; }
</style>
