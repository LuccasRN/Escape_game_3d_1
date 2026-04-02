<template>
  <div id="app">
    <IntroScreen v-if="showIntro" @finish="finishIntro" />

    <template v-else>
      <Scene3D
        :wifiConnected="isWifiConnected"
        :safeOpened="isSafeOpened"
        :routerHintActive="routerHintActive"
        @onWifiConnected="handleWifiConnected"
        @onMonitorClick="handleMonitorClick"
        @onSafeClick="handleSafeClick"
      />

      <HintSystem :hints="['Rallume le routeur', 'Fouille dans les fichiers du pc', 'Assemble les indices pour compléter le questionnaire']" @hint-shown="handleHintShown" />
      

      <DocumentInventory
        :documents="inventoryDocs"
        :z-index="100"
        @open-document="openDocFromInventory"
      />

    <NotificationOverlay :notification="notification" />

    <OsDesktop
      v-if="showOS"
      :activeWindow="activeWindow"
      :activeWindowTitle="activeWindowTitle"
      :isWifiConnected="isWifiConnected"
      :isSafeOpened="isSafeOpened"
      :safeCode="safeCode"
      :answer1="answer1"
      :answer2="answer2"
      @openWindow="openWindow"
      @closeWindow="closeWindow"
      @shutdown="showOS = false"
      @update:answer1="answer1 = $event"
      @update:answer2="answer2 = $event"
      @checkAnswers="checkAnswers"
    />

    <SafePadlock
      v-if="showSafeLock"
      :safeInput="safeInput"
      @pressPad="pressPad"
      @clearPad="clearPad"
      @checkCode="checkSafeCode"
      @cancel="showSafeLock = false"
    />

      <AutopsyReport
        v-if="showAutopsyReport"
        @close="showAutopsyReport = false"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import IntroScreen from './components/IntroScreen.vue'
import Scene3D from './components/Scene3D.vue'

import HintSystem from './components/HintSystem.vue'
import NotificationOverlay from './components/NotificationOverlay.vue'
import OsDesktop from './components/OsDesktop.vue'
import SafePadlock from './components/SafePadlock.vue'
import AutopsyReport from './components/AutopsyReport.vue'
import DocumentInventory from '../../DocumentInventory.vue'
import { useGameState } from './composables/useGameState.js'

const {
  showIntro,
  finishIntro,
  isWifiConnected,
  isSafeOpened,
  notification,
  gamePassed,
  routerHintActive,
  showOS,
  activeWindow,
  activeWindowTitle,
  showSafeLock,
  safeCode,
  safeInput,
  showAutopsyReport,
  answer1,
  answer2,
  openWindow,
  closeWindow,
  handleWifiConnected,
  handleMonitorClick,
  handleSafeClick,
  handleHintShown,
  checkAnswers,
  pressPad,
  clearPad,
  checkSafeCode
} = useGameState()

const discoveredSecretFile = ref(false)

watch(activeWindow, (win) => {
  if (win === 'secret_file') discoveredSecretFile.value = true
})

const inventoryDocs = computed(() => [
  { id: 'secret', label: 'Code coffre-fort', sub: 'Fichier réseau sécurisé', icon: 'key', discovered: discoveredSecretFile.value },
  { id: 'autopsy', label: 'Rapport d\'autopsie', sub: 'Mme Calvin — Dr Goureau', icon: 'doc', discovered: isSafeOpened.value },
])

function openDocFromInventory(id) {
  if (id === 'autopsy') {
    showAutopsyReport.value = true
  } else if (id === 'secret') {
    showOS.value = true
    openWindow('secret_file')
  }
}
</script>

<style>
body, html {
  margin: 0; padding: 0; overflow: hidden;
  background-color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#app {
  width: 100vw; height: 100vh; position: relative;
}
</style>


