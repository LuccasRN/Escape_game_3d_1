<template>
  <div class="os-taskbar">
    <div class="start-btn"><span style="color: #00a8ff;"></span> Démarrer</div>
    <div class="taskbar-right">
      <span v-if="isWifiConnected" title="Connecté" class="tb-icon"></span>
      <span v-else title="Non connecté" class="tb-icon" style="color: red; opacity: 0.5;"></span>
      <span class="tb-icon"></span>
      <span class="tb-icon">{{ currentTime }}</span>
      <button class="os-power-btn" @click="$emit('shutdown')"> Eteindre l'écran</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  isWifiConnected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['shutdown'])

const currentTime = ref('00:00')
let timer = null

function updateTime() {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.os-taskbar {
  height: 40px; background: rgba(0, 10, 15, 0.95); z-index: 2;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 15px; border-top: 1px solid cyan; box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
}
.start-btn { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: bold; color: cyan; }
.taskbar-right { display: flex; gap: 15px; align-items: center; }
.tb-icon { font-size: 1rem; color: cyan; }
.os-power-btn { background: none; border: 1px solid red; color: red; cursor: pointer; padding: 4px 10px; border-radius: 4px;}
.os-power-btn:hover { background: rgba(255,0,0,0.2); }
</style>
