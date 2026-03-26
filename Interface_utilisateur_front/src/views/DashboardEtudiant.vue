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

    <div class="dashboard-content">
      <!-- Left Profile Panel -->
      <aside class="profile-panel">
        <div class="profile-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>
        <h3 class="greeting">Bonjour,<br/><span class="username">[{{ userName }}]</span> !</h3>
        <p class="ready-text">Prêt(e) pour relever le défi ?</p>
        <div class="profile-footer">
          <div class="divider">Projet FIE-3 • CHL</div>
        </div>
      </aside>

      <!-- Right Levels Panel -->
      <main class="levels-panel">
        <div v-for="(level, index) in levels" :key="index" class="level-card">
          <div class="level-icon-wrapper" :style="{ backgroundColor: level.iconBg }">
            <svg v-html="level.iconSvg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
          </div>
          <div class="level-info">
            <div class="level-header">
              <h4>{{ level.title }}</h4>
              <span class="difficulty-badge" :class="level.difficultyClass">{{ level.difficulty }}</span>
            </div>
            <p class="level-subtitle">{{ level.subtitle }}</p>
            <p class="level-desc">{{ level.desc }}</p>
            <button v-if="level.isUnlocked" @click="goToPage(level.route)" class="btn-start">
              Commencer &rsaquo;
            </button>
            <button v-else class="btn-locked" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Verrouillé
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { studentService, authService } from '../services/api'

const router = useRouter()
const userName = ref('...')
const levels = ref([])
const loading = ref(true)

onMounted(async () => {
  const storedName = localStorage.getItem('registeredUserName')
  if (storedName) userName.value = storedName

  try {
    const dashboardData = await studentService.getDashboardData()

    levels.value = dashboardData.map(enigma => ({
      title: enigma.nom,
      subtitle: enigma.difficulte || '',
      desc: enigma.description,
      difficulty: enigma.difficulte,
      difficultyClass: getDifficultyClass(enigma.difficulte),
      iconBg: 'rgba(168, 85, 247, 0.4)',
      iconSvg: getIconSvg(enigma.id),
      isUnlocked: enigma.status === 'COMMENCER' || enigma.status === 'RÉUSSI',
      isCompleted: enigma.status === 'RÉUSSI',
      enigmaId: enigma.id,
      route: `/enigme/${enigma.id}`
    }))
  } catch (error) {
    console.error('Erreur dashboard:', error)
    if (error.message.startsWith('401') || error.message.startsWith('403')) {
      authService.logout()
      router.push('/connexion')
    }
  } finally {
    loading.value = false
  }
})

function getDifficultyClass(difficulte) {
  const d = (difficulte || '').toLowerCase()
  if (d.includes('facile')) return 'badge-easy'
  if (d.includes('difficile') || d.includes('extreme')) return 'badge-hard'
  return 'badge-medium'
}

function getIconSvg(id) {
  const icons = {
    1: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    2: '<rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
    3: '<path d="M3 14h18"></path><path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>',
    4: '<rect x="2" y="10" width="20" height="4" rx="2"></rect>',
    5: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>'
  }
  return icons[id] || icons[1]
}

const logout = () => {
  authService.logout()
  router.push('/')
}

const goToPage = (routePath) => {
  router.push(routePath)
}
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
.btn-menu {
  padding: 0.5rem;
}

.btn-logout:hover, .btn-menu:hover {
  background: rgba(255, 255, 255, 0.1);
}

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

.dashboard-content {
  display: flex;
  gap: 2rem;
  flex: 1;
  align-items: flex-start;
  padding-bottom: 2rem;
}

/* Profile Panel */
.profile-panel {
  width: 320px;
  background: rgba(45, 27, 84, 0.6);
  border-radius: 12px;
  padding: 4rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 2rem;
  min-height: 500px;
}
.profile-avatar {
  width: 90px;
  height: 90px;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  border: 4px solid #22d3ee;
  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
}
.greeting {
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 1rem;
  color: white;
}
.username {
  color: #22d3ee;
  font-weight: 700;
}
.ready-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4rem;
}
.profile-footer .divider {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  position: relative;
  width: 100%;
}
.profile-footer .divider::before, .profile-footer .divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30px;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}
.profile-footer .divider::before { left: -40px; }
.profile-footer .divider::after { right: -40px; }

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
.level-card:hover {
  background: rgba(78, 46, 133, 0.8);
  transform: translateX(4px);
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
.level-icon-wrapper svg {
  stroke: white;
}

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
}
.level-header h4 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.difficulty-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  color: white;
}
.badge-easy { background: #10b981; }
.badge-medium { background: #eab308; }
.badge-hard { background: #ef4444; }

.level-subtitle {
  font-size: 0.75rem;
  color: #22d3ee;
  font-weight: 500;
  margin-bottom: 0.5rem;
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
  transition: background 0.2s;
}
.btn-start:hover {
  background: #0891b2;
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

@media (max-width: 900px) {
  .dashboard-content {
    flex-direction: column;
  }
  .profile-panel {
    width: 100%;
    position: relative;
    top: 0;
    min-height: auto;
  }
}
</style>
