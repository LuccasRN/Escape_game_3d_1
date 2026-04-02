<template>
  <GameOverlay :visible="visible" @close="$emit('close')">
    <div class="computer-frame">
      <div class="screen-bezel">
        <iframe :src="iframeSrc" class="computer-iframe"></iframe>
      </div>
      <div class="power-led"></div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>
  </GameOverlay>
</template>

<script setup>
import GameOverlay from './GameOverlay.vue'

defineProps({
  visible: { type: Boolean, default: false },
  iframeSrc: { type: String, default: '' }
})
defineEmits(['close'])
</script>

<style scoped>
.computer-frame {
  position: relative;
  width: 85%;
  max-width: 1200px;
  height: 80%;
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 20px;
  padding: 20px 20px 60px 20px;
  box-shadow:
    0 0 0 3px #444,
    0 0 0 6px #222,
    0 20px 50px rgba(0, 0, 0, 0.8),
    inset 0 2px 0 rgba(255, 255, 255, 0.1);
}
.screen-bezel {
  width: 100%;
  height: 100%;
  background: #111;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.9);
}
.computer-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}
.power-led {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff00;
}
.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #e74c3c;
  color: white;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s, background 0.2s;
}
</style>
