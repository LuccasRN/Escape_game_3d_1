<template>
  <div class="admin-layout">
    
    <div v-if="tooltip.visible" class="custom-tooltip" :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }">
      {{ tooltip.text }}
    </div>

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

    <div v-if="loading" class="loading-row">
      <div class="spinner"></div>
      <span>Chargement des statistiques...</span>
    </div>

    <div v-else class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Total Joueurs</span>
          <span class="kpi-value">{{ stats.totalPlayers }}</span>
        </div>
        <div class="kpi-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Temps Moyen</span>
          <span class="kpi-value">{{ hasData ? stats.averageTimeMinutes.toFixed(1) + ' min' : '--' }}</span>
        </div>
        <div class="kpi-icon bg-pink">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Taux de Réussite</span>
          <span class="kpi-value">{{ hasData ? Math.round(stats.successRate) + '%' : '--' }}</span>
        </div>
        <div class="kpi-icon bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Sessions Actives</span>
          <span class="kpi-value">{{ stats.totalPlayers > 0 ? Math.floor(stats.totalPlayers * 0.1) : 0 }}</span>
        </div>
        <div class="kpi-icon bg-orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      </div>
    </div>

    <button @click="$router.push('/admin/joueurs')" class="action-banner glass-panel">
      <div class="banner-icon bg-blue">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="banner-texts">
        <strong>Voir tous les joueurs</strong>
        <p>Accédez à la liste complète et inspectez les performances individuelles</p>
      </div>
      <div class="banner-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </button>

    <div v-if="!loading" class="charts-grid">

      <div class="demographics-grid">
        <div class="chart-card glass-panel">
          <h4>Répartition par Public Cible</h4>
          <div v-if="stats.repartitionProfil && Object.keys(stats.repartitionProfil).length > 0" class="demo-bars">
            <div v-for="(count, profil) in stats.repartitionProfil" :key="profil" class="demo-bar-container">
              <div class="demo-label">
                <span>{{ profil }}</span>
                <strong>{{ count }} joueur(s)</strong>
              </div>
              <div class="demo-track" 
                   @mousemove="moveTooltip" 
                   @mouseenter="showTooltip($event, `${count} joueur(s) représente(nt) ${getPercentage(count, stats.totalPlayers)}%`)" 
                   @mouseleave="hideTooltip">
                <div class="demo-fill bg-cyan" :style="{ width: getPercentage(count, stats.totalPlayers) + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state" style="margin-top: 1.5rem;">Aucune donnée</div>
        </div>

        <div class="chart-card glass-panel">
          <h4>Tranches d'Âge</h4>
          <div v-if="stats.repartitionAge && Object.keys(stats.repartitionAge).length > 0" class="demo-bars">
            <div v-for="(count, ageGroup) in stats.repartitionAge" :key="ageGroup" class="demo-bar-container">
              <div class="demo-label">
                <span>{{ ageGroup }}</span>
                <strong>{{ count }} joueur(s)</strong>
              </div>
              <div class="demo-track"
                   @mousemove="moveTooltip" 
                   @mouseenter="showTooltip($event, `${count} joueur(s) dans la tranche ${ageGroup} (${getPercentage(count, stats.totalPlayers)}%)`)" 
                   @mouseleave="hideTooltip">
                <div class="demo-fill bg-purple" :style="{ width: getPercentage(count, stats.totalPlayers) + '%' }"></div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state" style="margin-top: 1.5rem;">Aucune donnée</div>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Temps Moyen par Énigme (minutes)</h4>
        <div class="chart-container flex-end bar-chart">
          <div class="y-axis">
            <span>{{ maxEnigmaTime }}</span><span>{{ Math.round(maxEnigmaTime * 0.66) }}</span>
            <span>{{ Math.round(maxEnigmaTime * 0.33) }}</span><span>0</span>
          </div>
          <div class="bar-area">
            <div v-if="!hasData" class="empty-state" style="width: 100%; text-align: center; margin-bottom: 2rem;">Aucune donnée</div>
            
            <div v-for="(enigma, i) in enigmaStats" :key="i" class="bar-col">
              <div class="bar-track">
                <div class="bar bar-interactive"
                  :style="{ height: (enigma.avgTime / maxEnigmaTime * 100) + '%', background: enigmaColors[i % enigmaColors.length] }"
                  @mousemove="moveTooltip"
                  @mouseenter="showTooltip($event, `${enigma.nom} : ${enigma.avgTime.toFixed(1)} minutes en moyenne`)"
                  @mouseleave="hideTooltip">
                </div>
              </div>
              <span class="bar-label">{{ enigma.nom }}</span>
            </div>
            
          </div>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Distribution du Taux de Réussite</h4>
        <div class="chart-container flex-end bar-chart">
          <div class="y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
          <div v-if="hasData" class="bar-area narrow-gap">
            <div class="bar-col">
              <div class="bar-track">
                <div class="bar bg-green-solid bar-interactive" :style="{ height: stats.successRate + '%' }"
                     @mousemove="moveTooltip"
                     @mouseenter="showTooltip($event, `Réussite globale : ${Math.round(stats.successRate)}%`)"
                     @mouseleave="hideTooltip"></div>
              </div>
              <span class="bar-label">Réussite</span>
            </div>
            <div class="bar-col">
              <div class="bar-track">
                <div class="bar bg-red-solid bar-interactive" :style="{ height: (100 - stats.successRate) + '%' }"
                     @mousemove="moveTooltip"
                     @mouseenter="showTooltip($event, `Échec global : ${Math.round(100 - stats.successRate)}%`)"
                     @mouseleave="hideTooltip"></div>
              </div>
              <span class="bar-label">Échec</span>
            </div>
          </div>
          <div v-else class="empty-state" style="width: 100%; text-align: center; align-self: center;">Aucune donnée</div>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Taux de Réussite Global</h4>
        <div v-if="hasData" class="pie-container">
          <div class="pie-chart pie-interactive"
            :style="{ background: 'conic-gradient(#4ade80 0% ' + stats.successRate + '%, #f87171 ' + stats.successRate + '% 100%)' }"
            @mousemove="moveTooltip"
            @mouseenter="showTooltip($event, `Réussite : ${Math.round(stats.successRate)}% | Échec : ${Math.round(100 - stats.successRate)}%`)"
            @mouseleave="hideTooltip">
          </div>
          <div class="pie-labels">
            <span class="label-success">Réussite: {{ Math.round(stats.successRate) }}%</span>
            <span class="label-fail">Échec: {{ Math.round(100 - stats.successRate) }}%</span>
          </div>
        </div>
        <div v-else class="pie-container">
          <div class="pie-chart" style="background: rgba(255, 255, 255, 0.05); box-shadow: none;"></div>
          <div class="empty-state" style="position: absolute;">Aucune donnée</div>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Derniers Joueurs Inscrits</h4>
        <div class="player-mini-list">
          <div v-if="recentPlayers.length === 0" class="empty-state">Aucun joueur enregistré</div>
          <div v-for="p in recentPlayers" :key="p.id" class="player-mini-item">
            <div class="mini-avatar" :style="{ background: p.color }">{{ p.initials }}</div>
            <div class="mini-info">
              <strong>{{ p.name }}</strong>
              <span>{{ p.email }}</span>
            </div>
            <button @click="$router.push('/admin/joueurs/' + p.id)" class="btn-mini-inspect">Voir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, authService } from '../services/api' 

const router = useRouter()
const loading = ref(true)

const stats = ref({
  totalPlayers: 0,
  averageTimeMinutes: 0,
  successRate: 0,
  repartitionProfil: {}, 
  repartitionAge: {}     
})

const recentPlayers = ref([])
const enigmaStats = ref([]) 
const maxEnigmaTime = ref(30) 

// ✅ NUEVA VARIABLE: Guarda la lista completa para el reporte Excel
const allPlayersExport = ref([])

const hasData = computed(() => enigmaStats.value.length > 0)

const enigmaColors = ['#8b5cf6', '#9333ea', '#a855f7', '#c084fc', '#d8b4fe']
const COLORS = ['#f472b6', '#c084fc', '#d946ef', '#a855f7', '#818cf8']

// LÓGICA DEL TOOLTIP DINÁMICO
const tooltip = ref({
  visible: false,
  text: '',
  x: 0,
  y: 0
})

const showTooltip = (event, text) => {
  tooltip.value = {
    visible: true,
    text: text,
    x: event.clientX,
    y: event.clientY - 40
  }
}

const moveTooltip = (event) => {
  if (tooltip.value.visible) {
    tooltip.value.x = event.clientX
    tooltip.value.y = event.clientY - 40
  }
}

const hideTooltip = () => {
  tooltip.value.visible = false
}

function getInitials(prenom, nom) {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase()
}

onMounted(async () => {
  try {
    const [statsData, playersData] = await Promise.all([
      adminService.getGlobalStats(), 
      adminService.getAllPlayers()
    ])

    // ✅ Guardamos la lista cruda completa para el export CSV
    allPlayersExport.value = playersData || []

    stats.value = {
      totalPlayers: statsData.totalPlayers || 0,
      averageTimeMinutes: statsData.averageTimeMinutes || 0,
      successRate: statsData.successRate || 0,
      repartitionProfil: statsData.repartitionProfil || {}, 
      repartitionAge: statsData.repartitionAge || {}        
    }

    if (statsData.enigmaStats && statsData.enigmaStats.length > 0) {
      enigmaStats.value = statsData.enigmaStats;
      const maxTime = Math.max(...enigmaStats.value.map(e => e.avgTime || 0));
      maxEnigmaTime.value = maxTime > 0 ? Math.ceil(maxTime / 10) * 10 : 30; 
    } else {
      enigmaStats.value = [];
    }

    recentPlayers.value = playersData.slice(0, 5).map((p, i) => ({
      id: p.id, 
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

// ✅ FUNCIÓN DE EXPORTACIÓN MEJORADA (MARKETING Y RESULTADOS)
function exportCSV() {
  // 1. Definimos los encabezados de las columnas (Indicadores FEEINS)
  const headers = [
    "ID Joueur",
    "Date d'Inscription (Accès)",
    "Nom",
    "Prénom",
    "Email",
    "Date de Naissance",
    "Profil (Cible Marketing)",
    "Pseudo en jeu"
  ];

  // 2. Extraemos y formateamos la información de cada jugador
  const rows = allPlayersExport.value.map(p => {
    return [
      p.id || '',
      p.dateInscription || 'Non renseigné',
      p.nom || '',
      p.prenom || '',
      p.email || '',
      p.dateNaissance || 'Non renseigné',
      p.profil || 'Non renseigné',
      p.pseudo || ''
    ];
  });

  // 3. Unimos los encabezados y las filas
  // Usamos JSON.stringify para rodear los textos con comillas y evitar que las comas rompan las columnas
  const csvContent = [
    headers.join(';'), // Usamos punto y coma (;) porque Excel en Europa lo prefiere
    ...rows.map(r => r.map(field => `"${String(field).replace(/"/g, '""')}"`).join(';'))
  ].join('\n');

  // 4. Creamos el archivo y forzamos la descarga (El \uFEFF asegura que Excel lea bien los acentos)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'FEEINS_Rapport_Marketing_Joueurs.csv'
  
  // Simulamos el click para descargar
  document.body.appendChild(a);
  a.click()
  document.body.removeChild(a);
  URL.revokeObjectURL(url)
}

function getPercentage(count, total) {
  if (!total || total === 0) return 0;
  return Math.round((count / total) * 100);
}
</script>

<style scoped>
/* =========================================
   TOOLTIP CUSTOM FLOTANTE
   ========================================= */
.custom-tooltip {
  position: fixed;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  color: #fff;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  pointer-events: none; /* Para que el ratón no intercepte la caja */
  z-index: 9999;
  transform: translate(-50%, -100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* Clases interactivas para el hover */
.bar-interactive:hover, .demo-track:hover {
  cursor: pointer;
  filter: brightness(1.2);
}
.pie-interactive:hover {
  cursor: pointer;
  box-shadow: 0 4px 25px rgba(255,255,255,0.15);
}

/* =========================================
   TYPOGRAPHY & LAYOUT REFINEMENTS
   ========================================= */
.admin-layout { width: 100%; max-width: 1050px; margin: 0 auto; padding: 1rem 2rem 4rem 2rem; display: flex; flex-direction: column; color: white; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
.admin-header { display: flex; justify-content: flex-start; padding: 0.5rem 0 1.5rem 0; }
.btn-logout { background: transparent; border: none; color: white; display: flex; align-items: center; gap: 0.5rem; font-family: inherit; font-size: 0.85rem; cursor: pointer; opacity: 0.7; transition: opacity 0.2s; }
.btn-logout:hover { opacity: 1; }
.admin-title-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.admin-title-row h2 { font-size: 1.4rem; font-weight: 600; margin: 0 0 0.2rem 0; letter-spacing: -0.02em; }
.subtitle { font-size: 0.8rem; color: rgba(255, 255, 255, 0.5); margin: 0; }
.btn-export { background: white; color: #7c3aed; border: none; border-radius: 8px; padding: 0.4rem 0.8rem; font-weight: 600; font-size: 0.8rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: transform 0.2s ease; }
.btn-export:hover { transform: translateY(-2px); }

/* =========================================
   KPIS
   ========================================= */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.2rem; margin-bottom: 2rem; }
.kpi-card { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 1rem 1.2rem; display: flex; justify-content: space-between; align-items: center; }
.kpi-label { display: block; font-size: 0.65rem; color: rgba(255,255,255,0.5); margin-bottom: 0.3rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
.kpi-value { display: block; font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; }
.kpi-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; justify-content: center; align-items: center; }
.bg-blue { background: #0ea5e9; } .bg-pink { background: #d946ef; } .bg-green { background: #22c55e; } .bg-orange { background: #f97316; }

/* =========================================
   BANNER (VOIR TOUS LES JOUEURS)
   ========================================= */
.action-banner { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 1rem 1.2rem; display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; color: white; text-align: left; cursor: pointer; transition: background 0.2s; }
.action-banner:hover { background: rgba(255,255,255,0.08); }
.banner-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; }
.banner-texts { flex: 1; }
.banner-texts strong { display: block; font-size: 0.9rem; margin-bottom: 0.1rem; font-weight: 600; }
.banner-texts p { margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.banner-arrow { color: rgba(255,255,255,0.4); }

/* =========================================
   CHARTS GRID & CARDS
   ========================================= */
.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
.chart-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.2rem; display: flex; flex-direction: column; }
.chart-card h4 { font-size: 0.75rem; font-weight: 600; margin: 0 0 1.2rem 0; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.05em; }
.chart-container { flex: 1; display: flex; position: relative; min-height: 200px; }

/* =========================================
   DEMOGRAPHICS (BARRAS HORIZONTALES)
   ========================================= */
.demographics-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.2rem; margin-bottom: 1.2rem; }
.demo-bars { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 0.5rem; }
.demo-bar-container { display: flex; flex-direction: column; gap: 0.3rem; }
.demo-label { display: flex; justify-content: space-between; font-size: 0.7rem; color: rgba(255,255,255,0.6); }
.demo-label strong { font-weight: 600; color: rgba(255,255,255,0.9); }
.demo-track { width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; overflow: hidden; }
.demo-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease-out; }
.bg-cyan { background: linear-gradient(90deg, #06b6d4, #22d3ee); }
.bg-purple { background: linear-gradient(90deg, #9333ea, #c084fc); }

/* =========================================
   BAR CHARTS (VERTICALES) CORREGIDAS (Con track)
   ========================================= */
.y-axis { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding-right: 0.8rem; color: rgba(255,255,255,0.4); font-size: 0.65rem; border-right: 1px dashed rgba(255,255,255,0.1); padding-bottom: 34px; }
.bar-area { flex: 1; display: flex; justify-content: space-around; align-items: flex-end; padding-left: 0.8rem; position: relative; height: 100%; }
.bar-area::after { content: ''; position: absolute; bottom: 34px; left: 0; right: 0; height: 1px; border-bottom: 1px dashed rgba(255,255,255,0.2); z-index: 0; }
.bar-area.narrow-gap { gap: 12px; justify-content: center; }
.bar-col { display: flex; flex-direction: column; align-items: center; height: 100%; flex: 1; margin: 0 4px; z-index: 1; }
.bar-track { flex: 1; width: 100%; display: flex; justify-content: center; align-items: flex-end; }
.bar { width: 100%; max-width: 36px; border-radius: 3px 3px 0 0; background: #a855f7; transition: height 0.8s ease; min-height: 4px; }
.narrow-gap .bar { max-width: 60px; }
.bar-label { height: 28px; margin-top: 6px; font-size: 0.6rem; color: rgba(255,255,255,0.5); text-align: center; max-width: 60px; line-height: 1.1; display: flex; align-items: flex-start; justify-content: center; word-break: break-word;}
.bg-green-solid { background: #4ade80; } .bg-red-solid { background: #f87171; }

/* =========================================
   PIE CHART
   ========================================= */
.pie-container { display: flex; justify-content: center; align-items: center; flex: 1; position: relative; }
.pie-chart { width: 150px; height: 150px; border-radius: 50%; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: background 0.5s ease, box-shadow 0.3s ease; }
.pie-labels { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
.label-success { position: absolute; top: 20%; left: 10%; color: #4ade80; font-weight: 600; font-size: 0.7rem; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; }
.label-fail { position: absolute; bottom: 15%; right: 5%; color: #f87171; font-weight: 600; font-size: 0.7rem; background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; }

/* =========================================
   MINI LIST (DERNIERS JOUEURS)
   ========================================= */
.player-mini-list { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.empty-state { color: rgba(255,255,255,0.3); font-size: 0.75rem; text-align: center; padding: 2rem 0; font-style: italic; }
.player-mini-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.4rem; border-radius: 6px; background: rgba(255,255,255,0.02); transition: background 0.2s; }
.player-mini-item:hover { background: rgba(255,255,255,0.05); }
.mini-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 0.7rem; flex-shrink: 0; color: white; }
.mini-info { flex: 1; display: flex; flex-direction: column; }
.mini-info strong { font-size: 0.75rem; color: rgba(255,255,255,0.9); }
.mini-info span { font-size: 0.65rem; color: rgba(255,255,255,0.4); }
.btn-mini-inspect { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.65rem; font-family: inherit; cursor: pointer; transition: background 0.2s; }
.btn-mini-inspect:hover { background: rgba(255,255,255,0.15); }

/* Utilidades Loader */
.loading-row { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 4rem 0; color: rgba(255, 255, 255, 0.5); font-size: 0.85rem; }
.spinner { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #a855f7; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Media Queries */
@media (max-width: 1024px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .charts-grid { grid-template-columns: 1fr; }
  .demographics-grid { grid-template-columns: 1fr; }
}
</style>