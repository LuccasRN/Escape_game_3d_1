<template>
  <div class="hint-btn-wrapper" @click="getHint">
    <div class="button" :class="{ exhausted: limitReached }">
      <button name="checkbox" type="button"></button>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="hint-text">Indice ({{ remaining }})</div>
  </div>

  <Teleport to="body">
    <div class="hint-toast" :class="{ visible: toastVisible }">
      <span style="margin-right: 8px;"></span>
      <span>{{ toastMessage }}</span>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  hints: {
    type: Array,
    default: () => [
      'Cherche bien autour de toi',
      'As-tu regardé tous les objets interactifs ?',
      'La solution est souvent sous tes yeux'
    ]
  }
})

const emit = defineEmits(['hint-shown'])

const hintCount = ref(0)
const hintLimit = computed(() => props.hints.length)
const limitReached = computed(() => hintCount.value >= hintLimit.value)
const remaining = computed(() => hintLimit.value - hintCount.value)

const toastMessage = ref('')
const toastVisible = ref(false)
let hideTimeout = null

function getHint() {
  if (hintCount.value < hintLimit.value) {
    const hint = props.hints[hintCount.value]
    toastMessage.value = hint
    emit('hint-shown', hint)
    hintCount.value++
  } else {
    toastMessage.value = "Plus d'indices disponibles !"
  }
  
  toastVisible.value = true
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => { toastVisible.value = false }, 4000)
}
</script>


<style scoped>
.hint-btn-wrapper {
  position: fixed;
  top: 80px;
  left: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.hint-text {
  background: rgba(15, 23, 42, 0.9);
  color: #fff;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 14px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  backdrop-filter: blur(8px);
}

/* From Uiverse.io by augustin_4687 */
.button {
  --stone-50: #fafaf9;
  --stone-800: #292524;
  --yellow-300: #fde047;
  --yellow-400: #facc15;
  --yellow-500: #eab308;
  --black-25: rgba(0, 0, 0, 0.25);

  position: relative;
  display: block;
  width: 4rem;
  height: 4rem;
  cursor: pointer;
}

.button.exhausted {
  filter: grayscale(100%);
  opacity: 0.5;
}

.button > button {
  cursor: pointer;
  display: inline-block;
  height: 100%;
  width: 100%;
  appearance: none;
  border: 2px solid var(--stone-800);
  border-radius: 0.25rem;
  background-color: var(--yellow-400);
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: background-color 0.2s;
}

.button > button:hover {
  background-color: var(--yellow-300);
}

.button > button:checked {
  background-color: var(--stone-800);
  border-color: var(--stone-800);
}

.button > button:checked:hover {
  background-color: #44403c;
}

.button > button:active {
  outline-color: var(--stone-800);
}

.button > button:focus-visible {
  outline-color: var(--stone-800);
  outline-style: dashed;
}

.button > span:nth-child(2) {
  position: absolute;
  inset: 3px;
  pointer-events: none;
  background-color: var(--yellow-400);
  border-bottom: 2px solid var(--black-25);
  transition: transform 75ms;
}

.button > span:nth-child(2)::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
      rgb(255 255 255 / 80%) 20%,
      transparent 20%
    ),
    radial-gradient(rgb(255 255 255 / 100%) 20%, transparent 20%);
  background-position:
    0 0,
    4px 4px;
  background-size: 8px 8px;
  mix-blend-mode: hard-light;
  opacity: 0.5;
  animation: dots 0.5s infinite linear;
}

.button > span:nth-child(3) {
  position: absolute;
  pointer-events: none;
  inset: 0;
}

.button > span:nth-child(3)::before {
  content: "";
  width: 0.375rem;
  height: 0.375rem;
  position: absolute;
  top: 0.25rem;
  left: 0.25rem;
  background-color: var(--stone-800);
  border-radius: 0.125rem;
  box-shadow:
    3.125em 0 var(--stone-800),
    0 3.125em var(--stone-800),
    3.125em 3.125em var(--stone-800);
}

.button > span:nth-child(4) {
  position: absolute;
  pointer-events: none;
  inset: 0;
  filter: drop-shadow(0.25em 0.25em 0 rgba(0, 0, 0, 0.2));
  transition: all 75ms;
}

.button > span:nth-child(4)::after {
  content: "";
  width: 0.25rem;
  height: 0.25rem;
  position: absolute;
  top: 0.875rem;
  left: 1rem;
  border-radius: 0.0625px;
  background-color: var(--stone-800);
  box-shadow:
    0.75em 2em var(--stone-800),
    1em 2em var(--stone-800),
    0.75em 1.75em var(--stone-800),
    1em 1.75em var(--stone-800),
    0.75em 1.25em var(--stone-800),
    1em 1.25em var(--stone-800),
    0.75em 1em var(--stone-800),
    1em 1em var(--stone-800),
    1em 0.75em var(--stone-800),
    1.5em 0.75em var(--stone-800),
    1.25em 0.75em var(--stone-800),
    1.25em -0.25em var(--stone-800),
    1.5em 0em var(--stone-800),
    1.25em 0.5em var(--stone-800),
    1.5em 0.5em var(--stone-800),
    1.25em 0.25em var(--stone-800),
    1.5em 0.25em var(--stone-800),
    1.25em 0 var(--stone-800),
    1em -0.25em var(--stone-800),
    0.75em -0.25em var(--stone-800),
    0.5em -0.25em var(--stone-800),
    0.25em -0.25em var(--stone-800),
    0.25em 0 var(--stone-800),
    0 0.25em var(--stone-800),
    0 0.5em var(--stone-800),
    0.25em 0.25em var(--stone-800),
    0.25em 0.5em var(--stone-800);
}

.button > span:nth-child(5) {
  position: absolute;
  background-color: var(--yellow-400);
  border: 2px solid var(--stone-800);
  border-radius: 0.75rem;
  pointer-events: none;
  z-index: -1;
  inset: 0.5rem 1.5rem;
  box-shadow:
    7px 0 0 0 var(--stone-800),
    inset 0 2px 0 0 var(--yellow-300),
    inset 0 -2px 0 0 var(--yellow-500);
  transition: all 0ms cubic-bezier(0, 0.5, 0.4, 1);
}

.button button:active ~ span:nth-child(5) {
  transform: translateY(-200%);
  transition-duration: 200ms;
  opacity: 0;
}

.button button:hover ~ span:nth-child(4) {
  filter: drop-shadow(0.125em 0.125em 0 rgba(0, 0, 0, 0.2));
}

@keyframes dots {
  0% {
    background-position:
      0 0,
      4px 4px;
  }
  100% {
    background-position:
      8px 0,
      12px 4px;
  }
}

@media (prefers-color-scheme: dark) {
  .button button:active,
  .button button:focus-visible {
    outline-color: var(--yellow-400);
  }
}

.hint-toast {
  position: fixed;
  top: 130px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  background: rgba(15, 23, 42, 0.95);
  color: #fff;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 16px;
  padding: 15px 30px;
  border-radius: 8px;
  border: 1px solid #ffd700;
  z-index: 10000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s ease, transform 0.4s ease;
  backdrop-filter: blur(4px);
}

.hint-toast.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>


