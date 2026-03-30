<template>
  <div class="secret-container">
    <h3 class="secret-title">Code_Securite_Urgence.txt</h3>
    <hr style="border-color: #0ff;">
    <p style="color: #aaa;">[Accès réseau sécurisé - Partage administrateur]</p>
    <p style="font-size: 1.1rem; margin-top: 20px;">Le code d'accès de sécurité du coffre-fort physique est :</p>
    <p class="safe-pin">{{ safeCode }}</p>
    <button class="win-btn" @click="$emit('goBack')">Retour</button>
  </div>
</template>

<script setup>
defineProps({
  safeCode: {
    type: String,
    default: '----'
  }
})

defineEmits(['goBack'])
</script>

<style scoped>
.secret-container {
  background: rgba(0, 30, 40, 0.8);
  padding: 20px;
  border: 1px solid #0ff;
  height: 100%;
  box-shadow: inset 0 0 10px #0ff;
}
.secret-title {
  margin-top: 0;
  color: #0ff;
}
.safe-pin {
  color: #0ff;
  font-size: 2.5rem;
  text-align: center;
  font-weight: bold;
  letter-spacing: 5px;
  text-shadow: 0 0 10px #0ff;
}
.win-btn {
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid cyan;
  color: cyan;
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
}
.win-btn:hover {
  background: rgba(0, 255, 255, 0.3);
}
</style>
