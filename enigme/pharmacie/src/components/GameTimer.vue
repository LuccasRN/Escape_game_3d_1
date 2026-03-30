<template>
  <div class="game-timer">
    <div class="timer-label">TEMPS ÉCOULÉ</div>
    <div class="timer-value">{{ displayTime }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  timeSeconds: {
    type: Number,
    default: -1
  },
  stopped: {
    type: Boolean,
    default: false
  }
})

const internalTime = ref(0)
let timer = null

const displayTime = computed(() => {
  const current = props.timeSeconds !== -1 ? props.timeSeconds : internalTime.value
  const m = Math.floor(current / 60).toString().padStart(2, '0')
  const s = (current % 60).toString().padStart(2, '0')
  return m + ':' + s
})

// Compatibility for iframes
window.getTimerValue = () => displayTime.value

onMounted(() => {
  if (props.timeSeconds === -1) {
    const savedTime = localStorage.getItem('escapeGlobalTimer')
    if (savedTime) {
      internalTime.value = parseInt(savedTime, 10)
    }
    
    timer = setInterval(() => {
      if (!props.stopped) {
        internalTime.value++
        localStorage.setItem('escapeGlobalTimer', internalTime.value.toString())
      }
    }, 1000)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.game-timer {
  position: fixed;
  top: 24px;
  right: 24px;
  background: rgba(15, 23, 42, 0.9);
  border-right: 4px solid #38bdf8;
  padding: 12px 20px;
  color: #f1f5f9;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  z-index: 9999;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  text-align: right;
  backdrop-filter: blur(8px);
  user-select: none;
}
.timer-label {
  font-size: 0.7rem;
  font-weight: 900;
  color: #38bdf8;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}
.timer-value {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
