<template>
  <div class="autopsy-modal">
    <div class="paper-report">
      <h1>RAPPORT D'AUTOPSIE</h1>
      <div class="info-box">
        <p><strong>Nom :</strong> Calvin, Susan</p>
        <p><strong>Sexe :</strong> F</p>
        <p><strong>Date de naissance :</strong> 17-08-1982</p>
        <br>
        <p><strong>Date du décès :</strong> 24-03-2034</p>
        <p><strong>Autopsie pratiquée le :</strong> 25-03-2034</p>
        <p><strong>Par :</strong> Dr Goureau T.</p>
      </div>
      <p><strong>Dossier :</strong> EGM-0425-A</p>

      <h2>1 - OBSERVATIONS EXTERNES</h2>
      <ul>
        <li>Œdème facial marqué (lèvres, paupières, langue)</li>
        <li>Éruption urticarienne étendue sur le tronc</li>
        <li>Cyanose distale</li>
        <li>Pas de lésions traumatiques visibles</li>
      </ul>

      <h2>2 - OBSERVATIONS INTERNES</h2>
      <ul>
        <li><strong>Voies respiratoires :</strong> œdème laryngé sévère, obstruction glottique</li>
        <li><strong>Poumons :</strong> congestion importante, présence de sécrétions purulentes dans les bronches</li>
        <li><strong>Cœur :</strong> rythme rapide sans anomalie morphologique</li>
        <li><strong>Estomac :</strong> résidus médicamenteux (analyse compatible avec corticoïdes)</li>
      </ul>

      <h2>3 - EXAMENS COMPLÉMENTAIRES</h2>
      <p><strong>A. Dosage de tryptase sérique post-mortem</strong><br>
      Résultat : 58 µg/L (N &lt; 11 µg/L)<br>
      Taux fortement augmenté, compatible avec une réaction anaphylactique aiguë.</p>

      <p><strong>B. Bactériologie post-mortem (culture pulmonaire)</strong><br>
      Résultat : Streptococcus pneumoniae détecté<br>
      Culture bactérienne positive au pneumocoque suggérant une infection respiratoire sous-jacente au moment du décès (bronchopneumonie probable).</p>

      <p><strong>C. Recherche de virus respiratoires (PCR multiplex)</strong><br>
      Résultat : Négative, y compris pour Influenza A et B</p>

      <h2>4 - CONCLUSION</h2>
      <p>Le décès est attribué à <strong>une réaction allergique sévère liée à l'administration de corticoïdes</strong> (Prednisolone). La tryptase élevée valide l'origine allergique.</p>
      <p>La présence d'une infection pulmonaire à pneumocoque est un facteur aggravant, mais non responsable direct du décès.</p>
      <p><em>Le contexte médicamenteux soulève la question d'une erreur thérapeutique ou d'un acte intentionnel.</em></p>

      <p><strong>CAUSE DU DÉCÈS :</strong> Choc anaphylactique secondaire à l'exposition aux corticoïdes.</p>
      <p><strong>FACTEURS CONTRIBUTIFS :</strong> La patiente souffrait d'une <strong>pneumopathie bactérienne</strong> (infection respiratoire à Streptococcus pneumoniae).</p>

      <div class="signature">
        Dr Goureau T.<br>
        <span style="font-family: 'Brush Script MT', cursive; font-size: 1.5rem;">Dr T. Goureau</span>
      </div>
    </div>
    <button class="close-btn-report" @click="$emit('close')">&times;</button>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.autopsy-modal {
  position: absolute;
  top: 5%; left: 50%; transform: translateX(-50%);
  width: 90%; max-width: 800px; height: 90%;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px; border: 2px solid #555;
  display: flex; flex-direction: column; align-items: center;
  z-index: 40; padding: 20px; box-sizing: border-box;
}
.paper-report {
  background: white; color: black;
  width: 100%; height: 100%;
  overflow-y: auto;
  padding: 40px; box-sizing: border-box;
  font-family: 'Times New Roman', Times, serif;
  box-shadow: 0 0 15px rgba(255,255,255,0.2);
  line-height: 1.6;
}
.paper-report h1 {
  text-align: center; font-size: 2rem; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 30px; letter-spacing: 2px;
}
.paper-report h2 {
  font-size: 1.2rem; margin-top: 30px; border-bottom: 1px solid #ccc; font-weight: bold;
}
.info-box {
  border: 1px solid #000; padding: 20px; margin-bottom: 20px;
}
.info-box p {
  margin: 5px 0;
}
.paper-report ul {
  margin-top: 5px; list-style-type: square;
}
.signature {
  margin-top: 50px; text-align: right; margin-right: 50px; font-weight: bold;
}
.close-btn-report {
  position: absolute; top: 10px; right: 10px;
  width: 36px; height: 36px; border-radius: 50%;
  border: none; background: rgba(0,0,0,0.5); color: white;
  font-size: 22px; cursor: pointer; z-index: 5;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.close-btn-report:hover { background: rgba(0,0,0,0.8); }
</style>
