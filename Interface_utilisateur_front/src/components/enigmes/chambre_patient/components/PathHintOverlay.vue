<template>
  <div class="overlay-backdrop" @click.self="close">
    <div class="note-paper">
      <button class="close-btn" @click="close">×</button>
      
      <div class="note-content">
        <h3 class="note-title">Schéma neuronal - D. Deckard</h3>
        <p class="note-desc">Croquis de la structure :</p>
        
        <svg viewBox="0 0 300 200" class="path-svg">
          <!-- Grille/Lignes de fond -->
          <line x1="50" y1="100" x2="110" y2="140" class="sketch-line" />
          <line x1="110" y1="140" x2="190" y2="100" class="sketch-line" />
          <line x1="190" y1="100" x2="250" y2="100" class="sketch-line" />
          
          <!-- Colonne 1 -->
          <circle cx="50" cy="50" r="4" class="node-ghost" />
          <circle cx="50" cy="100" r="7" class="node-target" /> <!-- A2 -->
          <circle cx="50" cy="150" r="4" class="node-ghost" />

          <!-- Colonne 2 -->
          <circle cx="110" cy="60" r="4" class="node-ghost" />
          <circle cx="110" cy="100" r="4" class="node-ghost" />
          <circle cx="110" cy="140" r="7" class="node-target" /> <!-- B3 -->
          <circle cx="110" cy="180" r="4" class="node-ghost" />

          <!-- Colonne 3 -->
          <circle cx="190" cy="60" r="4" class="node-ghost" />
          <circle cx="190" cy="100" r="7" class="node-target" /> <!-- C2 -->
          <circle cx="190" cy="140" r="4" class="node-ghost" />
          <circle cx="190" cy="180" r="4" class="node-ghost" />

          <!-- Colonne 4 -->
          <circle cx="250" cy="50" r="4" class="node-ghost" />
          <circle cx="250" cy="100" r="7" class="node-target" /> <!-- D2 -->
          <circle cx="250" cy="150" r="4" class="node-ghost" />
        </svg>

        <p class="note-footer">
          Le signal stable traverse par le bas avant de remonter au cœur...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameState } from '../composables/useGameState.js'

const { showPathHint } = useGameState()

function close() {
  showPathHint.value = false
}
</script>

<style scoped>
.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(2px);
}

.note-paper {
  position: relative;
  background: #fdf5e6; /* Couleur vieux papier */
  width: min(80%, 450px);
  padding: 30px;
  border-radius: 4px;
  box-shadow: 2px 5px 15px rgba(0,0,0,0.4), inset 0 0 50px rgba(0,0,0,0.05);
  font-family: 'Courier New', Courier, monospace;
  color: #2c2c2c;
  transform: rotate(-2deg); /* Effet posé sur une table */
}

/* Texture subtile papier froissé */
.note-paper::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 10px 10px;
  opacity: 0.3;
  pointer-events: none;
}

.close-btn {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  color: #fff;
  border: 3px solid #fdf5e6;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  z-index: 10;
}
.close-btn:hover { background: #555; }

.note-title {
  font-size: 1.2rem;
  font-weight: bold;
  border-bottom: 2px solid #555;
  padding-bottom: 10px;
  margin-top: 0;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.note-desc {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.path-svg {
  width: 100%;
  height: auto;
  border: 1px dashed #aaa;
  background: rgba(255,255,255,0.4);
  margin-bottom: 20px;
}

.sketch-line {
  stroke: #c22;
  stroke-width: 3;
  stroke-dasharray: 8 4;
}

.node-ghost {
  fill: none;
  stroke: #999;
  stroke-width: 1.5;
}

.node-target {
  fill: #c22;
  stroke: #222;
  stroke-width: 2;
}

.note-footer {
  font-size: 0.85rem;
  font-style: italic;
  text-align: right;
  opacity: 0.8;
  margin-bottom: 0;
}
</style>
