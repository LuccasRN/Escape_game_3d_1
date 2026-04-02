<template>
  <div class="game-ui">

    <div v-if="gameState.showChoiceOverlay" class="choice-modal">
      <div class="choice-content">
        <h2>Qui est le vrai responsable de la mort de l'IA (Mme Calvin) ?</h2>
        <p class="subtitle">Rendez votre verdict final.</p>
        <div class="options">
          <button class="choice-btn" @click="choose('Dr Deckard')">Dr Deckard</button>
          <button class="choice-btn" @click="choose('Emma')">Emma</button>
          <button class="choice-btn" @click="choose('Les deux')">Les deux</button>
        </div>
        <button class="close-btn" @click="closeChoice">Retourner enquêter</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { gameState, makeChoice, closeChoice } from '../composables/useGameState'

function choose(answer) {
  makeChoice(answer)
}
</script>

<style scoped>
.game-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; 
}
.game-ui > * {
  pointer-events: auto; 
}
.choice-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.85); /* background */
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.choice-content {
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  color: #1e293b;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}
.choice-content h2 {
  margin-top: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #0f172a;
}
.subtitle {
  color: #64748b;
  margin-bottom: 25px;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}
.choice-btn {
  padding: 18px;
  font-size: 1.1rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #334155;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.choice-btn:hover {
  background: #38bdf8;
  color: white;
  border-color: #0284c7;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.close-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background: transparent;
  color: #94a3b8;
  border: none;
  font-size: 0.95rem;
  text-decoration: underline;
  cursor: pointer;
}
.close-btn:hover {
  color: #ef4444;
}
</style>

