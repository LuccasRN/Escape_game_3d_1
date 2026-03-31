<template>
  <div class="dashboard-layout">
    <header class="dashboard-header">
      <button @click="logout" class="btn-logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Déconnexion
      </button>
      <button @click="$router.push('/statistiques')" class="btn-menu">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </header>

    <div class="dashboard-banner">
      <h2>Accueil Post-Inscription</h2>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Chargement de votre progression...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadDashboard" class="btn-retry">Réessayer</button>
    </div>

    <div v-else class="dashboard-content">
      <!-- Left Profile Panel -->
      <aside class="profile-panel">
        <div class="profile-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <h3 class="greeting">Bonjour,<br/><span class="username">[{{ userName }}]</span> !</h3>
        <p class="ready-text">Prêt(e) pour relever le défi ?</p>
        <div class="progress-summary">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <p class="progress-text">{{ completedCount }} / {{ levels.length }} enigmes résolus</p>
        </div>
        <div class="profile-footer">
          <div class="divider">Projet FIE-3 • CHL</div>
        </div>
      </aside>

      <!-- Right Levels Panel -->
      <main class="levels-panel">
        <div v-for="(level, index) in levels" :key="index" class="level-card" :class="{ 'card-solved': level.status === 'RÉUSSI', 'card-locked': level.status === 'VERROUILLÉ' }">
          <div class="level-icon-wrapper" :style="{ backgroundColor: getLevelIconBg(level.status) }">
            <svg v-html="getLevelIcon(index)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
          </div>
          <div class="level-info">
            <div class="level-header">
              <h4>{{ level.nom }}</h4>
              <div class="level-badges">
                <span class="difficulty-badge" :class="getDifficultyClass(level.difficulte)">{{ level.difficulte }}</span>
                <span class="status-badge" :class="getStatusClass(level.status)">{{ level.status }}</span>
              </div>
            </div>
            <p class="level-subtitle">{{ getLevelSubtitle(index) }}</p>
            <p class="level-desc">{{ level.description || getLevelDesc(index) }}</p>
            <button
              v-if="level.status === 'COMMENCER'"
              @click="startEnigma(level)"
              class="btn-start"
            >
              Commencer &rsaquo;
            </button>
            <button
              v-else-if="level.status === 'RÉUSSI'"
              class="btn-solved"
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Complété
            </button>
            <button v-else class="btn-locked" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Verrouillé
            </button>
          </div>
        </div>

        <!-- Si aucun niveau chargé -->
        <div v-if="levels.length === 0" class="empty-state">
          <p>Aucun enigme disponible pour le moment.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService, studentService, gameService } from '../services/api'

const router = useRouter()
const userName = ref('utilisateur')
const levels = ref([])
const loading = ref(true)
const error = ref(null)

// Mapping enigme ID -> route de l'enigme (ordre défini par les sous-dossiers)
// IDs dans la BD correspondent à l'ordre d'insertion des enigmes
const ENIGME_ROUTES = {
  1: '/enigme/bureau',
  2: '/enigme/chambre-patient',
  3: '/enigme/pharmacie',
  4: '/enigme/salle-reseau',
  5: '/enigme/salle-reunion',
}

// Données statiques de présentation par index (0-based)
const LEVEL_META = [
  {
    subtitle: 'Cabinet du Médecin',
    icon: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
    iconBgUnlocked: 'rgba(168, 85, 247, 0.4)',
  },
  {
    subtitle: 'Urgence Vitale',
    icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    iconBgUnlocked: 'rgba(236, 72, 153, 0.4)',
  },
  {
    subtitle: 'Code Médicament',
    icon: '<rect x="2" y="10" width="20" height="4" rx="2"></rect><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"></path>',
    iconBgUnlocked: 'rgba(168, 85, 247, 0.4)',
  },
  {
    subtitle: 'Enquête Numérique',
    icon: '<rect x="2" y="2" width="20" height="20" rx="2"></rect><line x1="8" y1="2" x2="8" y2="22"></line>',
    iconBgUnlocked: 'rgba(6, 182, 212, 0.4)',
  },
  {
    subtitle: 'Conseil Médical',
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
    iconBgUnlocked: 'rgba(168, 85, 247, 0.4)',
  },
]

const DEFAULT_DESCS = [
  'Déchiffrez le dossier médical pour trouver le diagnostic du patient.',
  'Stabilisez le patient en analysant les constantes vitales et les dossiers.',
  'Déverrouillez le coffre en identifiant les molécules et prescriptions.',
  'Résolvez l\'énigme réseau pour accéder aux fichiers secrets du serveur.',
  'Présentez votre cas devant le comité d\'experts et rendez votre verdict.',
]

const completedCount = computed(() => levels.value.filter(l => l.status === 'RÉUSSI').length)
const progressPercent = computed(() => levels.value.length ? (completedCount.value / levels.value.length) * 100 : 0)

function getLevelIconBg(status) {
  if (status === 'RÉUSSI') return 'rgba(16, 185, 129, 0.4)'
  if (status === 'VERROUILLÉ') return 'rgba(100, 100, 100, 0.3)'
  return 'rgba(168, 85, 247, 0.4)'
}

function getLevelIcon(index) {
  return LEVEL_META[index]?.icon || '<circle cx="12" cy="12" r="10"></circle>'
}

function getLevelSubtitle(index) {
  return LEVEL_META[index]?.subtitle || ''
}

function getLevelDesc(index) {
  return DEFAULT_DESCS[index] || ''
}

function getDifficultyClass(diff) {
  if (!diff) return 'badge-medium'
  const d = diff.toLowerCase()
  if (d === 'facile') return 'badge-easy'
  if (d === 'difficile' || d === 'dur') return 'badge-hard'
  return 'badge-medium'
}

function getStatusClass(status) {
  if (status === 'RÉUSSI') return 'status-done'
  if (status === 'COMMENCER') return 'status-start'
  return 'status-locked'
}

async function loadDashboard() {
  loading.value = true
  error.value = null
  try {
    const data = await studentService.getDashboardData()
    levels.value = data
  } catch (e) {
    error.value = 'Impossible de charger votre progression. Vérifiez votre connexion.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function startEnigma(level) {
  try {
    // Démarrer une session de jeu côté backend
    await gameService.startGame()
    // Stocker l'ID de l'enigme en cours
    localStorage.setItem('currentEnigmaId', level.id)
    localStorage.setItem('enigmaStartTime', Date.now().toString())
    // Naviguer vers l'enigme correspondant
    const route = ENIGME_ROUTES[level.id]
    if (route) {
      router.push(route)
    } else {
      alert(`Enigme "${level.nom}" — route non configurée (ID: ${level.id})`)
    }
  } catch (e) {
    console.error('Erreur démarrage enigme:', e)
    alert('Impossible de démarrer l\'enigme. Réessayez.')
  }
}

function logout() {
  authService.logout()
  router.push('/')
}

onMounted(() => {
  const storedName = localStorage.getItem('registeredUserName')
  if (storedName) userName.value = storedName

  if (!authService.isAuthenticated()) {
    router.push('/connexion')
    return
  }
  loadDashboard()
})
</script>

<style scoped>
.dashboard-layout {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.btn-logout, .btn-menu {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  transition: background 0.2s;
}
.btn-menu { padding: 0.5rem; }
.btn-logout:hover, .btn-menu:hover { background: rgba(255, 255, 255, 0.1); }

.dashboard-banner {
  background: rgba(45, 27, 84, 0.4);
  border-radius: 8px;
  padding: 1rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.dashboard-banner h2 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

/* Loading / Error */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  color: rgba(255,255,255,0.7);
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.2);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-retry {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.dashboard-content {
  display: flex;
  gap: 2rem;
  flex: 1;
  align-items: flex-start;
  padding-bottom: 2rem;
}

/* Profile Panel */
.profile-panel {
  width: 280px;
  background: rgba(45, 27, 84, 0.6);
  border-radius: 12px;
  padding: 3rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 2rem;
  min-height: 400px;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  border: 4px solid #22d3ee;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}
.greeting {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  color: white;
}
.username { color: #22d3ee; font-weight: 700; }
.ready-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.progress-summary {
  width: 100%;
  margin-bottom: 2rem;
}
.progress-bar-bg {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #22d3ee, #a855f7);
  border-radius: 3px;
  transition: width 0.5s ease;
}
.progress-text {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
}

.profile-footer .divider {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

/* Levels Panel */
.levels-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.level-card {
  background: rgba(67, 39, 114, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s, background 0.2s;
}
.level-card:hover:not(.card-locked) {
  background: rgba(78, 46, 133, 0.8);
  transform: translateX(4px);
}
.card-solved {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.08) !important;
}
.card-locked {
  opacity: 0.6;
}

.level-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.level-icon-wrapper svg { stroke: white; }

.level-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.level-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
  gap: 0.5rem;
}
.level-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: white;
}
.level-badges {
  display: flex;
  gap: 0.4rem;
  flex-shrink: 0;
}

.difficulty-badge, .status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  color: white;
}
.badge-easy { background: #10b981; }
.badge-medium { background: #eab308; }
.badge-hard { background: #ef4444; }

.status-done { background: rgba(16, 185, 129, 0.3); color: #4ade80; border: 1px solid rgba(16,185,129,0.4); }
.status-start { background: rgba(168, 85, 247, 0.3); color: #d8b4fe; border: 1px solid rgba(168,85,247,0.4); }
.status-locked { background: rgba(100, 100, 100, 0.3); color: rgba(255,255,255,0.4); border: 1px solid rgba(255,255,255,0.1); }

.level-subtitle {
  font-size: 0.75rem;
  color: #22d3ee;
  font-weight: 500;
  margin-bottom: 0.4rem;
}
.level-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.btn-start {
  background: #06b6d4;
  color: white;
  border: none;
  padding: 0.4rem 1.25rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.btn-start:hover { background: #0891b2; transform: translateY(-1px); }

.btn-solved {
  background: rgba(16, 185, 129, 0.2);
  color: #4ade80;
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.4rem 1.25rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: default;
}

.btn-locked {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.4rem 1.25rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: rgba(255,255,255,0.5);
}

@media (max-width: 900px) {
  .dashboard-content { flex-direction: column; }
  .profile-panel { width: 100%; position: relative; top: 0; min-height: auto; }
}
</style>