<template>
  <div class="os-window">
    <div class="os-window-header">
      <div class="header-left">
        <div class="traffic-lights">
          <button class="tl-dot close" @click="$emit('close')"></button>
          <span class="tl-dot minimize"></span>
          <span class="tl-dot maximize"></span>
        </div>
        <span class="window-title">{{ title }}</span>
      </div>
      <div class="header-breadcrumb">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
        <span>/</span>
        <span class="breadcrumb-active">{{ title }}</span>
      </div>
    </div>
    <div class="os-window-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({ title: { type: String, default: '' } })
defineEmits(['close'])
</script>

<style scoped>
.os-window {
  position: absolute; top: 10%; left: 18%; right: 18%; bottom: 12%;
  background: rgba(8, 12, 20, 0.96);
  border: 1px solid rgba(0, 200, 255, 0.2);
  border-radius: 8px;
  display: flex; flex-direction: column;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 1px rgba(0, 200, 255, 0.4);
  backdrop-filter: blur(8px);
  overflow: hidden;
  animation: windowOpen 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes windowOpen {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

.os-window-header {
  background: rgba(10, 16, 28, 0.98);
  padding: 0 16px;
  height: 38px;
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 1px solid rgba(0, 200, 255, 0.1);
  flex-shrink: 0;
}

.header-left {
  display: flex; align-items: center; gap: 14px;
}

.traffic-lights {
  display: flex; gap: 6px; align-items: center;
}
.tl-dot {
  width: 11px; height: 11px; border-radius: 50%;
  border: none; cursor: default;
  transition: filter 0.15s;
}
.tl-dot.close    { background: #ff5f57; cursor: pointer; }
.tl-dot.minimize { background: #ffbd2e; }
.tl-dot.maximize { background: #28c840; }
.tl-dot.close:hover { filter: brightness(1.3); }

.window-title {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.02em;
}

.header-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; color: rgba(255, 255, 255, 0.25);
}
.header-breadcrumb svg { opacity: 0.4; }
.breadcrumb-active { color: rgba(0, 200, 255, 0.5); }

.os-window-content {
  flex: 1; padding: 20px; overflow-y: auto;
  font-family: 'Inter', sans-serif;
}

.os-window-content::-webkit-scrollbar { width: 6px; }
.os-window-content::-webkit-scrollbar-track { background: transparent; }
.os-window-content::-webkit-scrollbar-thumb { background: rgba(0, 200, 255, 0.15); border-radius: 3px; }
.os-window-content::-webkit-scrollbar-thumb:hover { background: rgba(0, 200, 255, 0.3); }
</style>

