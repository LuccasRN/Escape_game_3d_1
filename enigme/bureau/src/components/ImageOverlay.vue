<template>
  <GameOverlay :visible="visible" @close="$emit('close')">
    <div class="image-frame" :class="frameStyle">
      <img v-if="imageSrc" :src="imageSrc" class="frame-image" />
      <iframe v-if="iframeSrc" :src="iframeSrc" class="frame-iframe"></iframe>
      <button class="close-btn" :class="closeStyle" @click="$emit('close')">✕</button>
    </div>
  </GameOverlay>
</template>

<script setup>
import GameOverlay from './GameOverlay.vue'

defineProps({
  visible: { type: Boolean, default: false },
  imageSrc: { type: String, default: '' },
  iframeSrc: { type: String, default: '' },
  frameStyle: { type: String, default: 'white' },
  closeStyle: { type: String, default: '' }
})
defineEmits(['close'])
</script>

<style scoped>
.image-frame {
  position: relative;
  width: 80%;
  max-width: 800px;
  height: 80%;
  max-height: 800px;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-frame.white {
  background: white;
}

.image-frame.wood {
  background-color: #5D4037;
  background-image: repeating-linear-gradient(45deg,
    rgba(255,255,255,0.03) 0px,
    rgba(0,0,0,0.03) 2px,
    transparent 5px
  );
  border: 15px solid #3E2723;
  outline: 2px solid #281815;
  padding: 25px;
  box-shadow:
    inset 0 0 40px rgba(0, 0, 0, 0.8),
    0 20px 50px rgba(0, 0, 0, 0.8);
}

.image-frame.chest {
  width: 400px;
  max-width: 90%;
  height: 300px;
  max-height: 300px;
  background: #2a3546;
  border-radius: 8px;
}

.frame-image {
  max-width: 100%;
  max-height: 100%;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.image-frame.wood .frame-image {
  border: 2px solid #281815;
  box-shadow: 0 0 15px rgba(0,0,0,0.6);
}

.frame-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #2a3546;
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn.wood-close {
  top: -20px;
  right: -20px;
  border: 2px solid #3E2723;
  background: #8D6E63;
}
</style>
