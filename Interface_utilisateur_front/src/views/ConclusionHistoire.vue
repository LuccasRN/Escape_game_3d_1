<template>
  <div class="glass-panel story-container">
    <h2>Le Dénouement</h2>
    
    <div class="story-content">
      <div class="section">
        <h3 class="section-title">QUE S’EST-IL RÉELLEMENT PASSÉ ?</h3>
        <p>
          Suite à la réalisation d’une radiographie pulmonaire et des analyses sanguines, le Dr Deckard a diagnostiqué une grippe à Mme Calvin et lui a prescrit un traitement à base d’ibuprofène (anti-inflammatoire) pendant 15 jours. Il a ensuite demandé à son assistante Emma de prendre le relais.
        </p>
        <p>
          Après avoir analysé les données médicales et personnelles de Mme Calvin, Emma a modifié le traitement en prescrivant de la cortisone. En effet, Mme Calvin présentait des antécédents d’ulcère gastrique incompatibles avec le traitement prescrit par le Dr Deckard. Malheureusement, Mme Calvin était allergique à la cortisone prescrite par Emma, ce qui a entraîné son décès.
        </p>
        
        <div class="error-blocks">
          <div class="error-block">
            <h4>L'erreur du Dr Deckard</h4>
            <p>Il a commis une erreur de diagnostic : Mme Calvin souffrait d’une pneumopathie bactérienne et non d'une grippe. Cette simple erreur n'aurait pas provoqué le décès de la patiente.</p>
          </div>
          <div class="error-block">
            <h4>L'erreur d'Emma</h4>
            <p>Elle a commis une erreur d'analyse de données : elle n'a pas tenu compte d’une anomalie dans le dossier de la patiente, une période pendant laquelle Mme Calvin était en voyage en Espagne. Lors de ce voyage, elle avait déjà eu une réaction allergique grave aux corticoïdes.</p>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h3 class="section-title text-accent">ENJEUX ET POSITIONNEMENT DES JOUEURS</h3>
        <p>
          Le Dr Deckard et son assistante ont tous les deux commis une erreur. Mais au-delà de la simple erreur médicale, il est impératif pour les joueurs de prendre en compte un paramètre important : 
          <strong class="text-reveal">Emma, l'assistante du Dr Deckard, est une IA (Emma = Electronic Medical Assistant)</strong>. 
          Ce détail n’est pas donné aux joueurs de manière claire et explicite au lancement de la partie. C’est à eux de le comprendre durant le jeu ou de le découvrir lors de la résolution du scénario.
        </p>
        <p>
          Dans l'introduction du jeu, il est question de la loi Batty. Cet élément doit pousser les joueurs à se questionner sur la place de l’IA dans le domaine médical et comment doit fonctionner le binôme humain/IA lors de la prise de décision. Une IA seule peut-elle prendre des décisions mineures ou majeures ? Est-il obligatoire qu'un humain valide une décision prise par l'IA ? Si une erreur est commise par l’IA, l’humain est-il obligatoirement responsable ?
        </p>
        <p>
          Dans cette histoire, Emma a commis une erreur : elle n'a pas tenu compte d'une information déterminante concernant Mme Calvin. Mais est-elle vraiment responsable ? Doit-on douter de sa fiabilité ?
        </p>
        <p>
          Le PC du Dr Deckard contenait des dossiers concernant ses patients. Dans celui de Mme Calvin, il y avait un schéma pour se connecter à un serveur et récupérer un document : <em>« document manquant »</em>. Ce document peut être vu comme le point central de cette histoire. Sans cette information, il était impossible pour Emma d'aboutir au bon traitement.
        </p>
        
        <div class="question-block">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <p>
            Une question essentielle se pose alors : ce document étant en possession du Dr Deckard, l'a-t-il volontairement caché à son assistante ? Si oui, pourquoi (peur de la concurrence, manque de confiance dans l’IA, réfractaire aux changements...) ?
          </p>
        </div>
        
        <p class="conclusion-text">
          Le questionnaire rempli par les joueurs était un moyen de connaître les faits, mais répondre à cette question est peut-être le seul moyen de déterminer la responsabilité de l'humain et/ou l'IA dans le décès de Mme Calvin.
        </p>
      </div>
    </div>

    <!-- Émet l'action continue pour le binôme ou retourne au menu principal par défaut -->
    <button @click="$emit('continue')" class="btn-start">
      Terminer l'Expérience
    </button>
  </div>
</template>

<script setup>
defineEmits(['continue'])
</script>

<style scoped>
.story-container {
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: justify;
  line-height: 1.6;
}

h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.story-content {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.05rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.section-title {
  font-size: 1.4rem;
  color: #22d3ee;
  border-bottom: 1px solid rgba(34, 211, 238, 0.3);
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.text-accent {
  color: #fbbf24;
  border-bottom-color: rgba(251, 191, 36, 0.3);
}

.text-reveal {
  color: #fbbf24;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  font-weight: 800;
  font-size: 1.1rem;
}

.divider {
  height: 1px;
  width: 50%;
  margin: 1rem auto;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.error-blocks {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.error-block {
  flex: 1;
  min-width: 250px;
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
  padding: 1.2rem;
  border-radius: 0 8px 8px 0;
}

.error-block h4 {
  color: #fca5a5;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.error-block p {
  margin: 0;
  font-size: 0.95rem;
}

.question-block {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
}

.question-block svg {
  color: #fbbf24;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.question-block p {
  margin: 0;
  color: #fef3c7;
  font-weight: 500;
  font-size: 1.1rem;
}

.conclusion-text {
  font-style: italic;
  font-weight: 600;
  color: #e2e8f0;
  text-align: center;
  margin-top: 1rem;
}

.btn-start {
  background: linear-gradient(to right, #ec4899, #a855f7);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 30px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-top: 2rem;
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
}

.btn-start:active {
  transform: translateY(0);
}
</style>
