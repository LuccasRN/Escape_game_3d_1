<template>
  <div class="safe-modal">
    <h2>Digicode Coffre-Fort</h2>
    <div class="pad-display">{{ safeInput || '----' }}</div>
    <div class="pad-grid">
      <button v-for="n in 9" :key="n" @click="$emit('pressPad', n)">{{ n }}</button>
      <button @click="$emit('clearPad')">C</button>
      <button @click="$emit('pressPad', 0)">0</button>
      <button @click="$emit('checkCode')">OK</button>
    </div>
    <button class="close-btn-safe" @click="$emit('cancel')">Annuler</button>
  </div>
</template>

<script setup>
defineProps({
  safeInput: {
    type: String,
    default: ''
  }
})

defineEmits(['pressPad', 'clearPad', 'checkCode', 'cancel'])
</script>

<style scoped>
.safe-modal {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: #222; border: 4px solid #555; border-radius: 10px;
  padding: 30px; display: flex; flex-direction: column; align-items: center;
  z-index: 40; box-shadow: 0 10px 40px rgba(0,0,0,0.8); color: #fff;
}
.pad-display {
  background: #000; color: #0f0; font-family: monospace; font-size: 2.5rem;
  width: 100%; text-align: center; padding: 15px; margin-bottom: 20px;
  border-radius: 5px; border: inset 2px #333; letter-spacing: 10px;
}
.pad-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
.pad-grid button {
  background: #333; color: #fff; border: 2px solid #555; border-radius: 8px;
  font-size: 1.5rem; padding: 15px 25px; cursor: pointer;
  box-shadow: 0 4px 0 #111; transition: transform 0.1s, box-shadow 0.1s;
}
.pad-grid button:active { transform: translateY(4px); box-shadow: 0 0 0 #111; }
.close-btn-safe { background: #d32f2f; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; width: 100%; }
</style>
