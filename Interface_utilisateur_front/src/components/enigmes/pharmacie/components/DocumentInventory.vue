<template>
  <div v-if="visibleDocs.length > 0" class="inventory-area" :style="{ zIndex: zIndex }">
    <button class="inventory-toggle" @click="open = !open" :class="{ open }">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      <span>Documents ({{ visibleDocs.length }})</span>
    </button>
    <transition name="inv-slide">
      <div v-if="open" class="inventory-panel">
        <div
          v-for="doc in visibleDocs"
          :key="doc.id"
          class="inv-item"
          @click="open = false; $emit('open-document', doc.id)"
        >
          <div class="inv-icon" :class="doc.icon || 'doc'">
            <svg v-if="doc.icon === 'note'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>
            <svg v-else-if="doc.icon === 'image'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <svg v-else-if="doc.icon === 'key'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
            <svg v-else-if="doc.icon === 'pc'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
          </div>
          <div class="inv-text">
            <div class="inv-label">{{ doc.label }}</div>
            <div class="inv-sub">{{ doc.sub }}</div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  documents: { type: Array, default: () => [] },
  zIndex: { type: Number, default: 350 },
})

defineEmits(['open-document'])

const open = ref(false)

const visibleDocs = computed(() => props.documents.filter(d => d.discovered))
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.inventory-area {
  position: fixed; bottom: 56px; left: 20px;
  font-family: 'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif;
  pointer-events: auto;
}
.inventory-toggle {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px;
  background: rgba(15, 15, 20, 0.75); backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  color: rgba(255,255,255,0.55); font-size: 12px; font-weight: 500;
  font-family: inherit; cursor: pointer;
  transition: all 0.15s;
}
.inventory-toggle:hover { background: rgba(15, 15, 20, 0.9); color: rgba(255,255,255,0.8); }
.inventory-toggle.open { background: rgba(15, 15, 20, 0.95); border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
.inventory-toggle svg { opacity: 0.6; }
.inventory-toggle.open svg { opacity: 1; }

.inventory-panel {
  position: absolute; bottom: 44px; left: 0;
  width: 260px;
  background: rgba(15, 15, 20, 0.95); backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  padding: 6px;
  display: flex; flex-direction: column; gap: 2px;
}

.inv-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px;
  border-radius: 3px; cursor: pointer;
  transition: background 0.12s;
}
.inv-item:hover { background: rgba(255,255,255,0.06); }

.inv-icon {
  width: 34px; height: 34px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.inv-icon.note { background: rgba(200,170,100,0.12); color: #c8a864; }
.inv-icon.doc { background: rgba(100,140,180,0.12); color: #7aa0c0; }
.inv-icon.image { background: rgba(160,120,180,0.12); color: #b090c0; }
.inv-icon.key { background: rgba(180,100,100,0.12); color: #c09090; }
.inv-icon.pc { background: rgba(100,180,140,0.12); color: #70b090; }

.inv-text { min-width: 0; }
.inv-label { font-size: 12.5px; font-weight: 500; color: #d0cdc5; line-height: 1.3; }
.inv-sub { font-size: 10.5px; color: rgba(255,255,255,0.3); margin-top: 1px; }

.inv-slide-enter-active, .inv-slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.inv-slide-enter-from { opacity: 0; transform: translateY(8px); }
.inv-slide-leave-to { opacity: 0; transform: translateY(8px); }
</style>
