<template>
  <div id="app">
    <Scene3D
      :wifiConnected="isWifiConnected"
      :safeOpened="isSafeOpened"
      @onWifiConnected="handleWifiConnected"
      @onMonitorClick="handleMonitorClick"
      @onSafeClick="handleSafeClick"
    />

    <HintSystem :hints="['Rallume le routeur', 'Fouille dans les fichiers du pc', 'Assemble les indices pour completer le questionnaire']" />
    <GameTimer v-if="!gamePassed" />

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

    <VictoryScreen
      v-if="gamePassed"
    />
  </div>
</template>

<script setup>
import Scene3D from './components/Scene3D.vue'
import GameTimer from './components/GameTimer.vue'
import HintSystem from './components/HintSystem.vue'
import NotificationOverlay from './components/NotificationOverlay.vue'
import OsDesktop from './components/OsDesktop.vue'
import SafePadlock from './components/SafePadlock.vue'
import AutopsyReport from './components/AutopsyReport.vue'
import VictoryScreen from './components/VictoryScreen.vue'
import { useGameState } from './composables/useGameState.js'

const {
  isWifiConnected,
  isSafeOpened,
  notification,
  gamePassed,
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
  checkAnswers,
  pressPad,
  clearPad,
  checkSafeCode
} = useGameState()
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

