<template>
  <div class="glass-panel fiche-container">
    <div class="fiche-header">
      <span class="badge domaine">Domaine : Intelligence Artificielle</span>
      <span class="badge thematique">Thématiques : Réseaux de Neurones & Séries Temporelles</span>
    </div>
    
    <h2>Bilan de la 3ème Salle</h2>
    
    <div class="intro-text">
      <p>
        Ici, vous avez manipulé le cerveau virtuel d'une IA pour comprendre comment elle prend ses décisions.
      </p>
    </div>

    <div class="concepts-grid">
      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </div>
        <div class="concept-content">
          <h3>Réseaux de Neurones</h3>
          <p>Ce sont des modèles informatiques inspirés de notre cerveau pour apprendre à reconnaître des schémas complexes.</p>
        </div>
      </div>

      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <div class="concept-content">
          <h3>Prédiction Temporelle</h3>
          <p>L'IA analyse les données du passé (comme des tests allergiques sur plusieurs mois) pour prédire ce qu'il va se passer demain.</p>
        </div>
      </div>

      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div class="concept-content">
          <h3>Le Danger des Données Manquantes</h3>
          <p>Si une information manque dans l'historique, l'IA peut faire une erreur de prédiction, d'où l'importance de la vérification humaine.</p>
        </div>
      </div>
    </div>

    <!-- Le bouton 'Continuer' émet un événement que le binôme pourra écouter -->
    <button @click="$emit('continue')" class="btn-continue">
      Terminer et Continuer
    </button>
  </div>
</template>

<script setup>
defineEmits(['continue'])
</script>

<style scoped>
.fiche-container {
  width: 100%;
  max-width: 850px;
  margin: 2rem auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(45, 27, 84, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
.fiche-header {
  display: flex; gap: 1rem; margin-bottom: 2rem; width: 100%; justify-content: flex-start; flex-wrap: wrap;
}
.badge {
  padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; color: white;
}
.badge.domaine { background: rgba(34, 211, 238, 0.2); border: 1px solid rgba(34, 211, 238, 0.4); color: #22d3ee; }
.badge.thematique { background: rgba(168, 85, 247, 0.2); border: 1px solid rgba(168, 85, 247, 0.4); color: #d8b4fe; }
h2 {
  font-size: 2.2rem; font-weight: 700; color: white; margin-bottom: 1.5rem; text-align: center; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.intro-text {
  font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); line-height: 1.6; text-align: center; margin-bottom: 3rem; padding: 0 2rem;
}
.concepts-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; width: 100%; margin-bottom: 3rem;
}
.concept-card {
  background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; align-items: flex-start; transition: transform 0.2s;
}
.concept-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.05); }
.icon-wrapper { background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 12px; margin-bottom: 1rem; }
.concept-content h3 { font-size: 1.1rem; font-weight: 600; color: white; margin-bottom: 0.5rem; }
.concept-content p { font-size: 0.95rem; color: rgba(255, 255, 255, 0.7); line-height: 1.5; }
.btn-continue {
  background: linear-gradient(to right, #22d3ee, #a855f7); color: white; border: none; padding: 1rem 3rem; border-radius: 30px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
}
.btn-continue:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5); }
.btn-continue:active { transform: translateY(0); }
</style>
