<template>
  <div class="admin-layout">
    <header class="admin-header">
      <button @click="$router.push('/admin/joueurs')" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Retour à la liste
      </button>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="loading-row">
      <div class="spinner"></div>
      <span>Chargement du profil...</span>
    </div>

    <template v-else-if="player">

      <!-- Banner perfil -->
      <div class="profile-banner glass-panel">
        <div class="profile-left">
          <div class="avatar" :style="{ background: avatarColor }">
            {{ playerInitials }}
          </div>
          <div class="profile-meta">
            <h2>{{ player.playerName }}</h2>
            <div class="meta-stats">
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                {{ player.email }}
              </span>
            </div>
          </div>
        </div>
        <div class="profile-right">
          <div class="success-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="#eab308" stroke-width="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
            </svg>
            <div class="rate-val">{{ globalScore }}%</div>
            <div class="rate-label">Score global</div>
          </div>
        </div>
      </div>

      <!-- KPIs de habilidades -->
      <div class="kpi-grid">
        <div v-for="skill in skillsList" :key="skill.key" class="kpi-card">
          <div class="kpi-info">
            <span class="kpi-label">{{ skill.label }}</span>
            <span class="kpi-value" :style="{ color: skill.color }">
              {{ player.skills[skill.key] || 0 }}
            </span>
          </div>
          <div class="skill-bar-container">
            <div class="skill-bar-bg">
              <div class="skill-bar-fill"
                :style="{
                  width: (player.skills[skill.key] || 0) + '%',
                  background: skill.color
                }">
              </div>
            </div>
            <span class="skill-pct">{{ player.skills[skill.key] || 0 }}/100</span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="charts-grid">

        <!-- Radar de competencias -->
        <div class="chart-card glass-panel">
          <h4>Profil de Compétences</h4>
          <div class="radar-container">
            <svg viewBox="0 0 100 100" class="radar-chart">
              <!-- Grilla del radar -->
              <polygon points="50,10 88,37.6 73.5,82.4 26.5,82.4 12,37.6"
                fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <polygon points="50,20 78.5,40.7 67.6,74.3 32.4,74.3 21.5,40.7"
                fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <polygon points="50,30 69,45 61.8,66.2 38.2,66.2 31,45"
                fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <!-- Ejes -->
              <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <line x1="50" y1="50" x2="88" y2="37.6" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <line x1="50" y1="50" x2="73.5" y2="82.4" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <line x1="50" y1="50" x2="26.5" y2="82.4" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <line x1="50" y1="50" x2="12" y2="37.6" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
              <!-- Polígono de datos dinámico -->
              <polygon
                :points="radarPoints"
                fill="rgba(168, 85, 247, 0.35)"
                stroke="#a855f7"
                stroke-width="1.5"
              />
              <!-- Puntos en los vértices -->
              <circle v-for="(pt, i) in radarVertices" :key="i"
                :cx="pt.x" :cy="pt.y" r="1.8" fill="#a855f7"/>
              <!-- Etiquetas -->
              <text x="50" y="7" fill="white" font-size="3.2" text-anchor="middle">Rapidité</text>
              <text x="92" y="37" fill="white" font-size="3.2" text-anchor="start">Précision</text>
              <text x="76" y="87" fill="white" font-size="3.2" text-anchor="start">Logique</text>
              <text x="24" y="87" fill="white" font-size="3.2" text-anchor="end">Créativité</text>
              <text x="8" y="37" fill="white" font-size="3.2" text-anchor="end">Persévérance</text>
            </svg>
          </div>
        </div>

        <!-- Barras de skills -->
        <div class="chart-card glass-panel">
          <h4>Détail des Compétences</h4>
          <div class="skills-detail-list">
            <div v-for="skill in skillsList" :key="skill.key" class="skill-detail-row">
              <span class="skill-detail-label">{{ skill.label }}</span>
              <div class="skill-detail-bar-bg">
                <div class="skill-detail-bar-fill"
                  :style="{
                    width: (player.skills[skill.key] || 0) + '%',
                    background: skill.color
                  }">
                </div>
              </div>
              <span class="skill-detail-val">{{ player.skills[skill.key] || 0 }}</span>
            </div>
          </div>
        </div>

        <!-- Info general -->
        <div class="chart-card glass-panel">
          <h4>Informations du Joueur</h4>
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Nom complet</span>
              <span class="info-val">{{ player.playerName }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-val">{{ player.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Score global</span>
              <span class="info-val score-val">{{ globalScore }}%</span>
            </div>
            <div class="info-row">
              <span class="info-label">Meilleure compétence</span>
              <span class="info-val">{{ bestSkill.label }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Compétence à améliorer</span>
              <span class="info-val warn-val">{{ worstSkill.label }}</span>
            </div>
          </div>
        </div>

        <!-- Progresión visual -->
        <div class="chart-card glass-panel">
          <h4>Progression Globale</h4>
          <div class="progression-visual">
            <div class="prog-circle-wrapper">
              <svg viewBox="0 0 120 120" class="prog-svg">
                <!-- Círculo de fondo -->
                <circle cx="60" cy="60" r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  stroke-width="8"/>
                <!-- Círculo de progreso -->
                <circle cx="60" cy="60" r="50"
                  fill="none"
                  stroke="#a855f7"
                  stroke-width="8"
                  stroke-linecap="round"
                  :stroke-dasharray="`${globalScore * 3.14} 314`"
                  transform="rotate(-90 60 60)"
                  style="transition: stroke-dasharray 1s ease"/>
                <text x="60" y="55" text-anchor="middle"
                  fill="white" font-size="20" font-weight="700">
                  {{ globalScore }}%
                </text>
                <text x="60" y="72" text-anchor="middle"
                  fill="rgba(255,255,255,0.6)" font-size="9">
                  Score global
                </text>
              </svg>
            </div>
            <div class="prog-legend">
              <div v-for="skill in skillsList" :key="skill.key" class="prog-legend-item">
                <span class="prog-dot" :style="{ background: skill.color }"></span>
                <span>{{ skill.label }}: {{ player.skills[skill.key] || 0 }}/100</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- Error / no encontrado -->
    <div v-else class="not-found">
      <p>Joueur introuvable.</p>
      <button @click="$router.push('/admin/joueurs')" class="btn-back">
        Retour à la liste
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService, authService } from '../services/api'

const route = useRoute()
const router = useRouter()
const playerId = route.params.id

const loading = ref(true)
const player = ref(null)

const skillsList = [
  { key: 'RAPIDITE',     label: 'Rapidité',     color: '#22d3ee' },
  { key: 'PRECISION',    label: 'Précision',    color: '#a855f7' },
  { key: 'LOGIQUE',      label: 'Logique',      color: '#4ade80' },
  { key: 'CREATIVITE',   label: 'Créativité',   color: '#f472b6' },
  { key: 'PERSEVERANCE', label: 'Persévérance', color: '#fb923c' }
]

const COLORS = ['#f472b6', '#c084fc', '#d946ef', '#a855f7', '#818cf8']

const avatarColor = computed(() => {
  if (!player.value) return '#a855f7'
  return COLORS[(parseInt(playerId) || 0) % COLORS.length]
})

const playerInitials = computed(() => {
  if (!player.value) return '??'
  const parts = (player.value.playerName || '').split(' ')
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0]?.[0] || '?').toUpperCase()
})

const globalScore = computed(() => {
  if (!player.value?.skills) return 0
  const vals = Object.values(player.value.skills)
  if (!vals.length) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
})

const bestSkill = computed(() => {
  if (!player.value?.skills) return skillsList[0]
  let best = skillsList[0]
  skillsList.forEach(s => {
    if ((player.value.skills[s.key] || 0) > (player.value.skills[best.key] || 0)) {
      best = s
    }
  })
  return best
})

const worstSkill = computed(() => {
  if (!player.value?.skills) return skillsList[skillsList.length - 1]
  let worst = skillsList[0]
  skillsList.forEach(s => {
    if ((player.value.skills[s.key] || 0) < (player.value.skills[worst.key] || 0)) {
      worst = s
    }
  })
  return worst
})

// Radar chart: 5 ejes en orden RAPIDITE, PRECISION, LOGIQUE, CREATIVITE, PERSEVERANCE
const CENTER = { x: 50, y: 50 }
const MAX_R = 38
const ANGLES_DEG = [-90, -18, 54, 126, 198]

const radarVertices = computed(() => {
  if (!player.value?.skills) return []
  const keys = ['RAPIDITE', 'PRECISION', 'LOGIQUE', 'CREATIVITE', 'PERSEVERANCE']
  return keys.map((key, i) => {
    const val = (player.value.skills[key] || 0) / 100
    const r = val * MAX_R
    const angle = (ANGLES_DEG[i] * Math.PI) / 180
    return {
      x: parseFloat((CENTER.x + r * Math.cos(angle)).toFixed(2)),
      y: parseFloat((CENTER.y + r * Math.sin(angle)).toFixed(2))
    }
  })
})

const radarPoints = computed(() => {
  return radarVertices.value.map(v => `${v.x},${v.y}`).join(' ')
})

onMounted(async () => {
  try {
    const data = await adminService.getPlayerStats(playerId)
    player.value = data
  } catch (err) {
    console.error('Erreur détail joueur:', err)
    if (err.message.startsWith('401') || err.message.startsWith('403')) {
      authService.logout()
      router.push('/admin')
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-layout {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem 4rem 2rem;
  display: flex;
  flex-direction: column;
  color: white;
  min-height: 100vh;
}
.admin-header { padding: 0.5rem 0 1.5rem 0; }
.btn-back {
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
.btn-back:hover { opacity: 1; }

.loading-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 3rem 0;
  color: rgba(255,255,255,0.6);
}
.spinner {
  width: 28px; height: 28px;
  border: 2px solid rgba(255,255,255,0.15);
  border-top-color: #a855f7;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.glass-panel {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
}

/* Banner perfil */
.profile-banner {
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.profile-left { display: flex; align-items: center; gap: 1.5rem; }
.avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  font-size: 1.5rem; font-weight: 700;
  color: white;
  flex-shrink: 0;
}
.profile-meta h2 { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.5rem 0; }
.meta-stats { display: flex; gap: 1.5rem; font-size: 0.8rem; color: rgba(255,255,255,0.7); }
.meta-stats span { display: flex; align-items: center; gap: 0.4rem; }

.success-box {
  background: rgba(250,204,21,0.1);
  border: 1px solid rgba(250,204,21,0.2);
  padding: 1rem 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}
.rate-val { font-size: 2rem; font-weight: 700; color: white; }
.rate-label { font-size: 0.75rem; color: rgba(255,255,255,0.7); }

/* KPIs de skills */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}
.kpi-card {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.kpi-label { display: block; font-size: 0.72rem; color: rgba(255,255,255,0.6); margin-bottom: 0.2rem; }
.kpi-value { display: block; font-size: 1.6rem; font-weight: 700; }
.skill-bar-container { display: flex; align-items: center; gap: 0.5rem; }
.skill-bar-bg {
  flex: 1; height: 5px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}
.skill-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 1s ease;
}
.skill-pct { font-size: 0.65rem; color: rgba(255,255,255,0.5); white-space: nowrap; }

/* Charts */
.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.chart-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.chart-card h4 { font-size: 0.95rem; font-weight: 600; margin: 0 0 1.5rem 0; color: white; }

/* Radar */
.radar-container { flex: 1; display: flex; justify-content: center; align-items: center; min-height: 240px; }
.radar-chart { width: 100%; max-width: 260px; height: auto; overflow: visible; }

/* Skills detail */
.skills-detail-list { display: flex; flex-direction: column; gap: 1rem; flex: 1; }
.skill-detail-row { display: flex; align-items: center; gap: 0.75rem; }
.skill-detail-label { font-size: 0.82rem; color: rgba(255,255,255,0.8); width: 100px; flex-shrink: 0; }
.skill-detail-bar-bg {
  flex: 1; height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}
.skill-detail-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1s ease;
  min-width: 4px;
}
.skill-detail-val { font-size: 0.78rem; font-weight: 600; width: 30px; text-align: right; }

/* Info list */
.info-list { display: flex; flex-direction: column; gap: 0; flex: 1; }
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.info-row:last-child { border-bottom: none; }
.info-label { font-size: 0.8rem; color: rgba(255,255,255,0.55); }
.info-val { font-size: 0.85rem; font-weight: 500; color: white; }
.score-val { color: #a855f7; font-weight: 700; }
.warn-val { color: #fb923c; }

/* Círculo de progresión */
.progression-visual {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 2rem;
  justify-content: center;
}
.prog-circle-wrapper { flex-shrink: 0; }
.prog-svg { width: 140px; height: 140px; }
.prog-legend { display: flex; flex-direction: column; gap: 0.6rem; }
.prog-legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem; color: rgba(255,255,255,0.75); }
.prog-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 5rem 0;
  color: rgba(255,255,255,0.5);
}

@media (max-width: 1100px) {
  .kpi-grid { grid-template-columns: repeat(3, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .progression-visual { flex-direction: column; }
}
@media (max-width: 700px) {
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .profile-banner { flex-direction: column; gap: 1rem; align-items: flex-start; }
}
</style>