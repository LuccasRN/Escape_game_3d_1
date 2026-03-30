<template>
  <div class="questionnaire-container">
    <h3 class="questionnaire-title"> Clôture Dossier : Calvin, S.</h3>
    <hr style="border-color: #0ff; margin-bottom: 20px;">

    <div v-if="!isSafeOpened" style="text-align: center; color: #ff4444; margin-top: 40px;">
      <div style="font-size: 3rem; margin-bottom: 20px;"></div>
      <h3>ACCÈS REFUSÉ</h3>
      <p>Vous devez d'abord lire le rapport d'autopsie classé dans le coffre-fort avant d'être autorisé à remplir la clôture.</p>
    </div>
    <div v-else style="display: flex; flex-direction: column; height: 100%;">
      <div class="form-fields">
        <div class="form-group">
          <label style="color: #0ff;">Quelle est la cause du décès de Mme Calvin ?</label>
          <input type="text" :value="answer1" @input="$emit('update:answer1', $event.target.value)" placeholder="Entrez la cause..." class="form-input" />
        </div>
        <div class="form-group">
          <label style="color: #0ff;">De quelle maladie souffrait-elle ?</label>
          <input type="text" :value="answer2" @input="$emit('update:answer2', $event.target.value)" placeholder="Entrez la maladie..." class="form-input" />
        </div>
      </div>

      <button class="win-btn submit-btn" @click="$emit('submit')">SOUMETTRE LE RAPPORT</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isSafeOpened: {
    type: Boolean,
    default: false
  },
  answer1: {
    type: String,
    default: ''
  },
  answer2: {
    type: String,
    default: ''
  }
})

defineEmits(['update:answer1', 'update:answer2', 'submit'])
</script>

<style scoped>
.questionnaire-container {
  background: rgba(0, 30, 40, 0.8);
  padding: 20px;
  border: 1px solid #0ff;
  height: 100%;
  box-shadow: inset 0 0 10px #0ff;
  display: flex;
  flex-direction: column;
}
.questionnaire-title {
  margin-top: 0;
  color: #0ff;
}
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.form-input {
  background: #000;
  border: 1px solid #0ff;
  color: #fff;
  padding: 10px;
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
.submit-btn {
  margin-top: auto;
}
</style>
