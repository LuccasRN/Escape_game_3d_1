<template>
  <div style="display: flex; gap: 20px;">
    <div style="font-size: 4rem;"></div>
    <div>
      <h3 style="margin-top: 0;">EscapeOS v11.4</h3>
      <p>Propriétaire : <strong>Admin_Reseau</strong></p>
      <p>Etat du réseau : <strong :style="{color: isWifiConnected ? 'green' : 'red'}">{{ isWifiConnected ? 'Connecté' : 'Hors ligne' }}</strong></p>
      <p>Processeur : Quantum Core i9</p>
      <p>RAM : 128 Go DDR6</p>
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
</script>
