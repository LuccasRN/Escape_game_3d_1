<template>
  <div class="glass-panel fiche-container">
    <div class="fiche-header">
      <span class="badge domaine">Domaine : Cybersécurité</span>
      <span class="badge thematique">Thématique : Réseau</span>
    </div>
    
    <h2>Bilan de la Salle Réseau</h2>
    
    <div class="intro-text">
      <p>
        Le numérique n'est pas "magique", il repose sur des infrastructures physiques bien réelles. 
        Dans cette salle, vous avez découvert comment l'information circule.
      </p>
    </div>

    <div class="concepts-grid">
      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12" y2="20"></line>
          </svg>
        </div>
        <div class="concept-content">
          <h3>Le Signal Invisible</h3>
          <p>Pour qu'un appareil communique, il doit se connecter à un point d'accès (comme une borne Wi-Fi).</p>
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
          <h3>L'Identité Numérique</h3>
          <p>Chaque réseau possède un nom (le SSID) qui permet de l'identifier et, parfois, de transmettre des informations clés.</p>
        </div>
      </div>

      <div class="concept-card">
        <div class="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <div class="concept-content">
          <h3>La Sécurité Physique</h3>
          <p>En cybersécurité, celui qui a accès au matériel (brancher un boîtier) a souvent le pouvoir sur le logiciel.</p>
        </div>
      </div>
    </div>

    <div class="dyk-box">
      <div class="dyk-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <h4>Le savais-tu ?</h4>
      </div>
      <p>La santé est un domaine "intime" qui nécessite une rigueur éthique totale : chaque connexion doit être sécurisée pour protéger la vie privée des patients.</p>
    </div>

    <!-- Le bouton 'Continuer' émet un événement que le binôme pourra écouter -->
    <button @click="$emit('continue')" class="btn-continue">
      Terminer et Continuer
    </button>
  </div>
</template>

<script setup>
// Le composant émet "continue" pour que le binôme puisse gérer la transition
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
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  justify-content: flex-start;
}

.badge {
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: white;
}

.badge.domaine {
  background: rgba(34, 211, 238, 0.2);
  border: 1px solid rgba(34, 211, 238, 0.4);
  color: #22d3ee;
}

.badge.thematique {
  background: rgba(168, 85, 247, 0.2);
  border: 1px solid rgba(168, 85, 247, 0.4);
  color: #d8b4fe;
}

h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.intro-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  text-align: center;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.concepts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-bottom: 3rem;
}

.concept-card {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.2s;
}

.concept-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.05);
}

.icon-wrapper {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.concept-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.concept-content p {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.dyk-box {
  background: linear-gradient(to right, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
  border-left: 4px solid #fbbf24;
  padding: 1.5rem;
  border-radius: 0 12px 12px 0;
  width: 100%;
  margin-bottom: 3rem;
}

.dyk-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.dyk-header h4 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #fbbf24;
  margin: 0;
}

.dyk-box p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
  line-height: 1.5;
  margin: 0;
}

.btn-continue {
  background: linear-gradient(to right, #22d3ee, #a855f7);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.3);
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.5);
}

.btn-continue:active {
  transform: translateY(0);
}
</style>
