<template>
  <div v-if="!isWifiConnected" class="network-error">
    <div style="font-size: 3rem; margin-bottom: 20px;"></div>
    <h3 style="color: #d00;">Erreur Réseau (Code 404)</h3>
    <p>Aucune connexion internet ni réseau local détectée.</p>
    <p>Veuillez vérifier les branchements du routeur.</p>
  </div>
  <div v-else class="folder-grid">
    <div class="desktop-icon" @dblclick="$emit('openSecretFile')">
      <span class="icon-emoji"></span>
      <span class="icon-text">Serveur_Admin</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isWifiConnected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['openSecretFile'])
</script>

<style scoped>
.network-error { display: flex; flex-direction: column; align-items: center; margin-top: 40px; }
.folder-grid { display: flex; gap: 20px; flex-wrap: wrap; }
.desktop-icon {
  display: flex; flex-direction: column; align-items: center; cursor: pointer;
  padding: 10px; border-radius: 6px; transition: background 0.2s;
}
.desktop-icon:hover { background: rgba(0, 255, 255, 0.2); }
.icon-emoji { font-size: 2.5rem; text-shadow: 0 0 5px cyan; }
.icon-text { font-size: 0.8rem; margin-top: 5px; text-align: center; text-shadow: 1px 1px 2px #000; color: cyan; font-weight: bold; }
</style>
