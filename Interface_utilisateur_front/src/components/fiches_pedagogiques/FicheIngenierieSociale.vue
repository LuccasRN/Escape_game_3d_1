<template>
  <div class="glass-panel fiche-container">
    <div class="fiche-header">
      <span class="badge domaine">Domaine : Cybersécurité</span>
      <span class="badge thematique">Thématique : Ingénierie Sociale</span>
    </div>
    
    <h2>Bilan de la 2ème Salle</h2>
    
    <div class="intro-text">
      <p>
        La plus grande faille informatique n'est pas toujours un bug, mais l'humain lui-même. 
        Vous avez dû "hacker" un accès en utilisant la psychologie.
      </p>
    </div>

    <div class="concepts-grid">
      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="concept-content">
          <h3>L'Ingénierie Sociale</h3>
          <p>C'est l'art de récupérer des informations confidentielles en observant les habitudes d'une personne (ses proches, ses passions).</p>
        </div>
      </div>

      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <div class="concept-content">
          <h3>La Protection des Données</h3>
          <p>Utiliser des détails personnels comme mots de passe rend nos données vulnérables.</p>
        </div>
      </div>

      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
          </svg>
        </div>
        <div class="concept-content">
          <h3>Le Big Data</h3>
          <p>Aujourd'hui, les médecins utilisent des masses de données géantes pour soigner de façon personnalisée, ce qui rend la protection de ces accès vitale.</p>
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
