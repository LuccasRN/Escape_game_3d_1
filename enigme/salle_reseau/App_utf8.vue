<template>
  <div id="app">
    <!-- 3D Background -->
    <Scene3D 
      :wifiConnected="isWifiConnected"
      :safeOpened="isSafeOpened"
      @onWifiConnected="handleWifiConnected"
      @onMonitorClick="handleMonitorClick"
      @onSafeClick="handleSafeClick"
    />

    <!-- UI Overlay for Notifications -->
    <div v-if="notification" class="notification">
      <span v-html="notification"></span>
    </div>

    <!-- UI Overlay for Monitor OS (Windows Style) -->
    <div v-if="showOS" class="os-wrapper">
      <div class="os-desktop">
        <div class="desktop-icons">
          <div class="desktop-icon" @dblclick="openWindow('documents')">
            <span class="icon-emoji"></span>
            <span class="icon-text">Mes Documents</span>
          </div>
          <div class="desktop-icon" @dblclick="openWindow('network')">
            <span class="icon-emoji"></span>
            <span class="icon-text">Réseau Local</span>
          </div>
          <div class="desktop-icon" @dblclick="openWindow('system')">
            <span class="icon-emoji"></span>
            <span class="icon-text">Système</span>
          </div>
          <div class="desktop-icon" @dblclick="openWindow('questionnaire')">
            <span class="icon-emoji"></span>
            <span class="icon-text">Clôture Enquête</span>
          </div>
        </div>

        <div v-if="activeWindow" class="os-window">
          <div class="os-window-header">
            <span class="window-title">{{ activeWindowTitle }}</span>
            <button class="window-close" @click="closeWindow"></button>
          </div>
          <div class="os-window-content">
            <!-- Documents -->
            <div v-if="activeWindow === 'documents'" class="window-inner">
               <div style="text-align: center; color: #555; padding-top: 40px;">
                 <div style="font-size: 3rem;"></div>
                 <p>Dossier vide. Tous les fichiers ont été purgés selon le protocole de sécurité.</p>
               </div>
            </div>
            
            <!-- Network -->
            <div v-else-if="activeWindow === 'network'" class="window-inner">
               <div v-if="!isWifiConnected" class="network-error">
                  <div style="font-size: 3rem; margin-bottom: 20px;"></div>
                  <h3 style="color: #d00;">Erreur Réseau (Code 404)</h3>
                  <p>Aucune connexion internet ni réseau local détectée.</p>
                  <p>Veuillez vérifier les branchements du routeur.</p>
               </div>
               <div v-else class="folder-grid">
                    <div class="desktop-icon" @dblclick="openWindow('secret_file')">
                      <span class="icon-emoji"></span>
                    <span class="icon-text">Serveur_Admin</span>
                  </div>
               </div>
            </div>

            <!-- Secret File -->
            <div v-else-if="activeWindow === 'secret_file'" class="window-inner file-content">
                 <div style="background: rgba(0, 30, 40, 0.8); padding: 20px; border: 1px solid #0ff; height: 100%; box-shadow: inset 0 0 10px #0ff;">
                   <h3 style="margin-top: 0; color: #0ff;">Code_Securite_Urgence.txt</h3>
                   <hr style="border-color: #0ff;">
                   <p style="color: #aaa;">[Accès réseau sécurisé - Partage administrateur]</p>
                   <p style="font-size: 1.1rem; margin-top: 20px;">Le code d'accès de sécurité du coffre-fort physique est :</p>
                   <p class="safe-pin" style="color:#0ff; font-size: 2.5rem; text-align: center; font-weight: bold; letter-spacing: 5px; text-shadow: 0 0 10px #0ff;">{{ safeCode }}</p>
                   <button class="win-btn" @click="openWindow('network')">Retour</button>
                 </div>
            </div>

            <!-- System -->
            <div v-else-if="activeWindow === 'system'" class="window-inner">
               <div style="display: flex; gap: 20px;">
                  <div style="font-size: 4rem;"></div>
                  <div>
                    <h3 style="margin-top: 0;">EscapeOS v11.4</h3>
                    <p>Propriétaire : <strong>Admin_Reseau</strong></p>
                    <p>Etat du réseau : <strong :style="{color: isWifiConnected ? 'green' : 'red'}">{{ isWifiConnected ? 'Connecté' : 'Hors ligne' }}</strong></p>
                    <p>Processeur : Quantum Core i9</p>
                    <p>RAM : 128 Go DDR6</p>
                  </div>
               </div>
            </div>

            <!-- Questionnaire / Enquete -->
            <div v-else-if="activeWindow === 'questionnaire'" class="window-inner file-content">
                 <div style="background: rgba(0, 30, 40, 0.8); padding: 20px; border: 1px solid #0ff; height: 100%; box-shadow: inset 0 0 10px #0ff; display: flex; flex-direction: column;">
                   <h3 style="margin-top: 0; color: #0ff;"> Clôture Dossier : Calvin, S.</h3>
                   <hr style="border-color: #0ff; margin-bottom: 20px;">
                   
                   <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 20px;">
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                      <label style="color: #0ff;">Quelle est la cause du décès de Mme Calvin ?</label>
                      <input type="text" v-model="answer1" placeholder="Entrez la cause..." style="background: #000; border: 1px solid #0ff; color: #fff; padding: 10px;" />
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                      <label style="color: #0ff;">De quelle maladie souffrait-elle ?</label>
                      <input type="text" v-model="answer2" placeholder="Entrez la maladie..." style="background: #000; border: 1px solid #0ff; color: #fff; padding: 10px;" />
                    </div>
                   </div>
                   
                   <button class="win-btn" style="margin-top: auto;" @click="checkAnswers">SOUMETTRE LE RAPPORT</button>
                 </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Taskbar -->
      <div class="os-taskbar">
        <div class="start-btn"><span style="color: #00a8ff;"></span> Démarrer</div>
        <div class="taskbar-right">
          <span v-if="isWifiConnected" title="Connecté" class="tb-icon"></span>
          <span v-else title="Non connecté" class="tb-icon" style="color: red; opacity: 0.5;"></span>
          <span class="tb-icon"></span>
          <span class="tb-icon">15:42</span>
          <button class="os-power-btn" @click="showOS = false"> Eteindre l'écran</button>
        </div>
      </div>
    </div>

    <!-- UI Overlay for Safe Padpad -->
    <div v-if="showSafeLock" class="safe-modal">
      <h2>Digicode Coffre-Fort</h2>
      <div class="pad-display">{{ safeInput || '----' }}</div>
      <div class="pad-grid">
        <button v-for="n in 9" :key="n" @click="pressPad(n)">{{ n }}</button>
        <button @click="clearPad()">C</button>
        <button @click="pressPad(0)">0</button>
        <button @click="checkSafeCode()">OK</button>
      </div>
      <button class="close-btn-safe" @click="showSafeLock = false">Annuler</button>
    </div>

    <!-- UI Overlay for Autopsy Report in the Safe -->
    <div v-if="showAutopsyReport" class="autopsy-modal">
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
      <button class="close-btn-safe" @click="showAutopsyReport = false">Remettre dans le coffre</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Scene3D from './components/Scene3D.vue'

// State variables
const isWifiConnected = ref(false)
const isSafeOpened = ref(false)
const notification = ref(null)


// Enigma 2
const showOS = ref(false)
const activeWindow = ref(null)

const activeWindowTitle = computed(() => {
  if (activeWindow.value === 'documents') return "C:\\\\Users\\\\Admin\\\\Documents"
  if (activeWindow.value === 'network') return "Réseau Local"
  if (activeWindow.value === 'system') return "Propriétés Système"
  if (activeWindow.value === 'questionnaire') return "Clôture Enquête"
  if (activeWindow.value === 'secret_file') return "\\\\\\\\Serveur_Admin\\\\Fichiers_Secrets"
  return ""
})

function openWindow(win) {
  activeWindow.value = win
}

function closeWindow() {
  activeWindow.value = null
}

// Enigma 3
const showSafeLock = ref(false)
const safeCode = ref("")
const safeInput = ref("")

onMounted(() => {
  // Generate random 4 digits string padded with 0
  safeCode.value = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
})

function showNotif(msg, time = 4000) {
  notification.value = msg
  setTimeout(() => {
    notification.value = null
  }, time)
}

function handleWifiConnected() {
  if (isWifiConnected.value) return; 
  isWifiConnected.value = true
  showNotif('<strong>Succès ! Routeur connecté.</strong>', 5000)
}

function handleMonitorClick() {
  showOS.value = true
}

// Enigma 4 - Questionnaire
const showAutopsyReport = ref(false)
const answer1 = ref("")
const answer2 = ref("")

function checkAnswers() {
  const ans1 = answer1.value.toLowerCase().trim()
  const ans2 = answer2.value.toLowerCase().trim()
  
  // Basic flexible string match to be gentle
  const q1Correct = ans1.includes("allergique") && ans1.includes("cortisone")
  const q2Correct = ans1 === "réaction allergique à la cortisone" || q1Correct
  
  const q3Correct = ans2.includes("bactérienne") && (ans2.includes("pneumopathie") || ans2.includes("pneumonie"))
  
  if (q1Correct && q3Correct) {
    showNotif("Félicitations ! Vous avez validé toutes les étapes.")
    closeWindow()
  } else {
    showNotif("Réponse(s) incorrecte(s). Veuillez vérifier le rapport d'autopsie.", 3000)
  }
}

function handleSafeClick() {
  if (isSafeOpened.value) {
    showAutopsyReport.value = true
    return
  }
  showSafeLock.value = true
  safeInput.value = ""
}

function pressPad(num) {
  if (safeInput.value.length < 4) {
    safeInput.value += num.toString()
  }
}

function clearPad() {
  safeInput.value = ""
}

function checkSafeCode() {
  if (safeInput.value === safeCode.value) {
    isSafeOpened.value = true
    showSafeLock.value = false
    showNotif("Code valide. Accès autorisé. Ouverture du coffre-fort.", 5000)
  } else {
    showNotif("Code PIN erroné", 2000)
    clearPad()
  }
}
</script>

<style>
/* Reset and layout */
body, html {
  margin: 0; padding: 0; overflow: hidden;
  background-color: #000;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#app {
  width: 100vw; height: 100vh; position: relative;
}

/* UI Elements overlay */
.notification {
  position: absolute;
  top: 10%; left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 20, 20, 0.85);
  border: 1px solid cyan;
  color: cyan;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 4px;
  box-shadow: 0 0 15px cyan;
  pointer-events: none;
  z-index: 50;
  text-align: center;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 5px cyan; }
  50% { box-shadow: 0 0 20px cyan; }
  100% { box-shadow: 0 0 5px cyan; }
}

/* Windows OS Style => Cyberpunk OS Style */
.os-wrapper {
  position: absolute; 
  top: 10%; left: 15%; right: 15%; bottom: 10%;
  border: 8px solid #111;
  border-radius: 12px;
  box-shadow: 0 0 50px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,0,0,0.8);
  background: url('https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop') no-repeat center center;
  background-size: cover;
  display: flex; flex-direction: column;
  z-index: 20; color: #fff;
  overflow: hidden;
}
.os-wrapper::before {
  content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
  background: rgba(0, 15, 30, 0.6);
}
.os-desktop {
  flex: 1; position: relative; z-index: 2; display: flex;
}
.desktop-icons {
  width: 120px; padding: 20px; display: flex; flex-direction: column; gap: 30px;
}
.desktop-icon {
  display: flex; flex-direction: column; align-items: center; cursor: pointer;
  padding: 10px; border-radius: 6px; transition: background 0.2s;
}
.desktop-icon:hover { background: rgba(0, 255, 255, 0.2); }
.icon-emoji { font-size: 2.5rem; text-shadow: 0 0 5px cyan; }
.icon-text { font-size: 0.8rem; margin-top: 5px; text-align: center; text-shadow: 1px 1px 2px #000; color: cyan; font-weight: bold; }

.os-window {
  position: absolute; top: 15%; left: 20%; right: 20%; bottom: 15%;
  background: rgba(0, 10, 15, 0.9);
  border: 1px solid cyan;
  box-shadow: 0 0 20px rgba(0,255,255,0.2);
  display: flex; flex-direction: column;
}
.os-window-header {
  background: #06101f; padding: 10px; display: flex; justify-content: space-between;
  border-bottom: 1px solid cyan; align-items: center;
}
.window-title { font-size: 0.9rem; font-family: monospace; color: cyan; font-weight: bold; }
.window-close { background: none; border: none; font-size: 1rem; cursor: pointer; color: red; opacity: 0.7; }
.window-close::after { content: 'X'; }
.window-close:hover { opacity: 1; text-shadow: 0 0 5px red; }
.os-window-content { flex: 1; padding: 20px; overflow-y: auto; }
.window-inner { box-sizing: border-box; }
.folder-grid { display: flex; gap: 20px; flex-wrap: wrap; }
.network-error { display: flex; flex-direction: column; align-items: center; margin-top: 40px; }

.os-taskbar {
  height: 40px; background: rgba(0, 10, 15, 0.95); z-index: 2;
  display: flex; justify-content: space-between; align-items: center;
  padding: 0 15px; border-top: 1px solid cyan; box-shadow: 0 -2px 10px rgba(0,0,0,0.5);
}
.start-btn { display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: bold; color: cyan; }
.taskbar-right { display: flex; gap: 15px; align-items: center; }
.tb-icon { font-size: 1rem; color: cyan; }
.os-power-btn { background: none; border: 1px solid red; color: red; cursor: pointer; padding: 4px 10px; border-radius: 4px;}
.os-power-btn:hover { background: rgba(255,0,0,0.2); }

.safe-modal {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  background: #222; border: 4px solid #555; border-radius: 10px;
  padding: 30px; display: flex; flex-direction: column; align-items: center;
  z-index: 40; box-shadow: 0 10px 40px rgba(0,0,0,0.8); color: #fff;
}
.pad-display {
  background: #000; color: #0f0; font-family: monospace; font-size: 2.5rem;
  width: 100%; text-align: center; padding: 15px; margin-bottom: 20px;
  border-radius: 5px; border: inset 2px #333; letter-spacing: 10px;
}
.pad-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
.pad-grid button {
  background: #333; color: #fff; border: 2px solid #555; border-radius: 8px;
  font-size: 1.5rem; padding: 15px 25px; cursor: pointer;
  box-shadow: 0 4px 0 #111; transition: transform 0.1s, box-shadow 0.1s;
}
.pad-grid button:active { transform: translateY(4px); box-shadow: 0 0 0 #111; }
.close-btn-safe { background: #d32f2f; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; font-weight: bold; width: 100%; }

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
.paper-report .info-box {
  border: 1px solid #000; padding: 20px; margin-bottom: 20px;
}
.paper-report .info-box p {
  margin: 5px 0;
}
.paper-report ul {
  margin-top: 5px; list-style-type: square;
}
.paper-report .signature {
  margin-top: 50px; text-align: right; margin-right: 50px; font-weight: bold;
}
</style>
