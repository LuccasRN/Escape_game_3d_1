<script setup>
import Scene3D from './components/Scene3D.vue'
import GameTimer from './components/GameTimer.vue'
import HintSystem from './components/HintSystem.vue'
import ComputerOverlay from './components/ComputerOverlay.vue'
import CodeBoxOverlay from './components/CodeBoxOverlay.vue'
import PlaquetteOverlay from './components/PlaquetteOverlay.vue'
import { useGameState } from './composables/useGameState.js'

const { showComputer, showCodeBox, showPlaquette } = useGameState()
</script>

<template>
  <Scene3D />
  <GameTimer />
  <HintSystem :hints="['Affiche : cherche une date', 'Code : lié à la naissance de la gamine', 'Clé : cherche près du lit']" />
  <ComputerOverlay  v-if="showComputer"  />
  <CodeBoxOverlay   v-if="showCodeBox"   />
  <PlaquetteOverlay v-if="showPlaquette" />
</template>

<style scoped>
</style>


