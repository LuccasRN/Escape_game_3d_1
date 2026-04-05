<template>
  <div class="test-fiches-page">
    <h1>Mode Prévisualisation des Fiches Pédagogiques</h1>
    <p class="subtitle">Faites défiler vers le bas pour voir les 5 fiches que j'ai créées :</p>
    
    <div class="fiches-wrapper">
      <FicheSalleReseau />
      <FicheIngenierieSociale />
      <FicheIntelligenceArtificielle />
      <FicheRetroconception />
      <FicheResponsabiliteEthique />
    </div>
  </div>
</template>

<script setup>
import FicheSalleReseau from '../components/fiches_pedagogiques/FicheSalleReseau.vue'
import FicheIngenierieSociale from '../components/fiches_pedagogiques/FicheIngenierieSociale.vue'
import FicheIntelligenceArtificielle from '../components/fiches_pedagogiques/FicheIntelligenceArtificielle.vue'
import FicheRetroconception from '../components/fiches_pedagogiques/FicheRetroconception.vue'
import FicheResponsabiliteEthique from '../components/fiches_pedagogiques/FicheResponsabiliteEthique.vue'
</script>

<style scoped>
.test-fiches-page {
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  color: #22d3ee;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 3rem;
}

.fiches-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5rem; /* Grand espace entre chaque fiche pour bien les voir */
  width: 100%;
}
</style>
