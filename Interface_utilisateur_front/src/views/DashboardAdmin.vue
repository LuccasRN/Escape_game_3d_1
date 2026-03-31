<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-left">
        <button @click="logout" class="btn-logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Déconnexion
        </button>
      </div>
    </header>

    <div class="admin-title-row">
      <div>
        <h2>Tableau de Bord Admin</h2>
        <p class="subtitle">Vue d'ensemble des statistiques de l'escape game</p>
      </div>
      <button class="btn-export" @click="exportCSV">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Exporter CSV
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-row">
      <div class="spinner"></div>
      <span>Chargement des statistiques...</span>
    </div>

    <!-- KPIs -->
    <div v-else class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Total Joueurs</span>
          <span class="kpi-value">{{ stats.totalPlayers }}</span>
        </div>
        <div class="kpi-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Temps Moyen</span>
          <span class="kpi-value">{{ stats.averageTimeMinutes.toFixed(1) }} min</span>
        </div>
        <div class="kpi-icon bg-pink">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Taux de Réussite</span>
          <span class="kpi-value">{{ Math.round(stats.successRate) }}%</span>
        </div>
        <div class="kpi-icon bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Sessions Actives</span>
          <span class="kpi-value">{{ stats.totalPlayers > 0 ? Math.floor(stats.totalPlayers * 0.1) : 0 }}</span>
        </div>
        <div class="kpi-icon bg-orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      </div>
    </div>

    <!-- Banner -->
    <button @click="$router.push('/admin/joueurs')" class="action-banner glass-panel">
      <div class="banner-icon bg-blue">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="banner-texts">
        <strong>Voir tous les joueurs</strong>
        <p>Accédez à la liste complète et inspectez les performances individuelles</p>
      </div>
      <div class="banner-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </button>

    <!-- Charts Grid -->
    <div v-if="!loading" class="charts-grid">

      <!-- Chart 1: Barras por enigma -->
      <div class="chart-card glass-panel">
        <h4>Temps Moyen par Énigme (minutes)</h4>
        <div class="chart-container flex-end bar-chart">
          <div class="y-axis">
            <span>30</span><span>20</span><span>10</span><span>0</span>
          </div>
          <div class="bar-area">
            <div v-for="(enigma, i) in enigmaStats" :key="i" class="bar-col">
              <div class="bar"
                :style="{ height: (enigma.avgTime / 30 * 100) + '%', background: enigmaColors[i] }">
              </div>
              <span>{{ enigma.nom }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart 2: Distribución por tasa de éxito -->
      <div class="chart-card glass-panel">
        <h4>Distribution du Taux de Réussite</h4>
        <div class="chart-container flex-end bar-chart">
          <div class="y-axis">
            <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
          </div>
          <div class="bar-area narrow-gap">
            <div class="bar-col">
              <div class="bar bg-green-solid"
                :style="{ height: stats.successRate + '%' }"></div>
              <span>Réussite</span>
            </div>
            <div class="bar-col">
              <div class="bar bg-red-solid"
                :style="{ height: (100 - stats.successRate) + '%' }"></div>
              <span>Échec</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart 3: Pie -->
      <div class="chart-card glass-panel">
        <h4>Taux de Réussite Global</h4>
        <div class="pie-container">
          <div class="pie-chart"
            :style="{ background: 'conic-gradient(#4ade80 0% ' + stats.successRate + '%, #f87171 ' + stats.successRate + '% 100%)' }">
          </div>
          <div class="pie-labels">
            <span class="label-success">Réussite: {{ Math.round(stats.successRate) }}%</span>
            <span class="label-fail">Échec: {{ Math.round(100 - stats.successRate) }}%</span>
          </div>
        </div>
      </div>

      <!-- Chart 4: Top jugadores -->
      <div class="chart-card glass-panel">
        <h4>Derniers Joueurs Inscrits</h4>
        <div class="player-mini-list">
          <div v-if="recentPlayers.length === 0" class="empty-state">
            Aucun joueur enregistré
          </div>
          <div v-for="p in recentPlayers" :key="p.id" class="player-mini-item">
            <div class="mini-avatar" :style="{ background: p.color }">
              {{ p.initials }}
            </div>
            <div class="mini-info">
              <strong>{{ p.name }}</strong>
              <span>{{ p.email }}</span>
            </div>
            <button @click="$router.push('/admin/joueurs/' + p.id)" class="btn-mini-inspect">
              Voir
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, authService } from '../services/api'

const router = useRouter()
const loading = ref(true)

const stats = ref({
  totalPlayers: 0,
  averageTimeMinutes: 0,
  successRate: 0
})

const recentPlayers = ref([])

const enigmaStats = ref([
  { nom: 'Énigme 1', avgTime: 12 },
  { nom: 'Énigme 2', avgTime: 18 },
  { nom: 'Énigme 3', avgTime: 22 },
  { nom: 'Énigme 4', avgTime: 15 },
  { nom: 'Énigme 5', avgTime: 28 }
])

const enigmaColors = ['#8b5cf6', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe']

const COLORS = ['#f472b6', '#c084fc', '#d946ef', '#a855f7', '#818cf8']

function getInitials(prenom, nom) {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase()
}

onMounted(async () => {
  try {
    const [statsData, playersData] = await Promise.all([
      adminService.getDashboardStats(),
      adminService.getAllPlayers()
    ])

    stats.value = {
      totalPlayers: statsData.totalPlayers,
      averageTimeMinutes: statsData.averageTimeMinutes || 0,
      successRate: statsData.successRate || 0
    }

    recentPlayers.value = playersData.slice(0, 5).map((p, i) => ({
      id: p.id_utilisateur,
      name: `${p.prenom || ''} ${p.nom || ''}`.trim(),
      email: p.email,
      initials: getInitials(p.prenom, p.nom),
      color: COLORS[i % COLORS.length]
    }))

  } catch (err) {
    console.error('Erreur dashboard admin:', err)
    if (err.message.startsWith('401') || err.message.startsWith('403')) {
      authService.logout()
      router.push('/admin')
    }
  } finally {
    loading.value = false
  }
})

const logout = () => {
  authService.logout()
  router.push('/')
}

function exportCSV() {
  const rows = [
    ['Métrique', 'Valeur'],
    ['Total Joueurs', stats.value.totalPlayers],
    ['Temps Moyen (min)', stats.value.averageTimeMinutes.toFixed(1)],
    ['Taux de Réussite (%)', Math.round(stats.value.successRate)]
  ]
  const csv = rows.map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'stats_escape_game.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.admin-layout {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 2rem 4rem 2rem;
  display: flex;
  flex-direction: column;
  color: white;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: flex-start;
  padding: 0.5rem 0 2rem 0;
}

.btn-logout {
  background: transparent;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}
.btn-logout:hover { opacity: 1; }

.admin-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.admin-title-row h2 { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem 0; }
.subtitle { font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); margin: 0; }

.btn-export {
  background: white;
  color: #7c3aed;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.btn-export:hover { transform: translateY(-2px); }

.loading-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 3rem 0;
  color: rgba(255, 255, 255, 0.6);
}
.spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.kpi-card {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.kpi-label { display: block; font-size: 0.75rem; color: rgba(255,255,255,0.7); margin-bottom: 0.25rem; }
.kpi-value { display: block; font-size: 1.75rem; font-weight: 700; }
.kpi-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; }
.bg-blue { background: #0ea5e9; }
.bg-pink { background: #d946ef; }
.bg-green { background: #22c55e; }
.bg-orange { background: #f97316; }

.action-banner {
  width: 100%;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  color: white;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}
.action-banner:hover { background: rgba(255,255,255,0.12); }
.banner-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; justify-content: center; align-items: center; }
.banner-texts { flex: 1; }
.banner-texts strong { display: block; font-size: 1rem; margin-bottom: 0.2rem; }
.banner-texts p { margin: 0; font-size: 0.8rem; color: rgba(255,255,255,0.7); }
.banner-arrow { color: rgba(255,255,255,0.5); }

.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }

.chart-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.chart-card h4 { font-size: 0.95rem; font-weight: 600; margin: 0 0 1.5rem 0; color: white; }

.chart-container { flex: 1; display: flex; position: relative; min-height: 220px; }

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 1rem;
  color: rgba(255,255,255,0.5);
  font-size: 0.7rem;
  border-right: 1px dashed rgba(255,255,255,0.2);
}

.bar-area {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-left: 1rem;
  position: relative;
}
.bar-area::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 1px;
  border-bottom: 1px dashed rgba(255,255,255,0.2);
}
.bar-area.narrow-gap { gap: 12px; justify-content: center; }

.bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
  justify-content: flex-end;
  flex: 1;
  margin: 0 4px;
}
.bar {
  width: 100%;
  max-width: 44px;
  border-radius: 4px 4px 0 0;
  background: #a855f7;
  transition: height 0.8s ease;
  min-height: 4px;
}
.narrow-gap .bar { max-width: 80px; }
.bar-col span { font-size: 0.65rem; color: rgba(255,255,255,0.7); white-space: nowrap; }
.bg-green-solid { background: #4ade80; }
.bg-red-solid { background: #f87171; }

.pie-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;
}
.pie-chart {
  width: 180px; height: 180px;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: background 0.5s ease;
}
.pie-labels { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
.label-success { position: absolute; top: 25%; left: 15%; color: #4ade80; font-weight: 600; font-size: 0.8rem; }
.label-fail { position: absolute; bottom: 20%; right: 10%; color: #f87171; font-weight: 600; font-size: 0.8rem; }

.player-mini-list { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
.empty-state { color: rgba(255,255,255,0.4); font-size: 0.85rem; text-align: center; padding: 2rem 0; }
.player-mini-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.04);
  transition: background 0.2s;
}
.player-mini-item:hover { background: rgba(255,255,255,0.08); }
.mini-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  font-weight: 700; font-size: 0.8rem;
  flex-shrink: 0;
}
.mini-info { flex: 1; display: flex; flex-direction: column; }
.mini-info strong { font-size: 0.85rem; }
.mini-info span { font-size: 0.7rem; color: rgba(255,255,255,0.5); }
.btn-mini-inspect {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-mini-inspect:hover { background: rgba(255,255,255,0.2); }

@media (max-width: 1024px) {
  .kpi-grid, .charts-grid { grid-template-columns: 1fr; }
}
</style>