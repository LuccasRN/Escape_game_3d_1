<template>
  <div class="admin-layout">
    <header class="admin-header">
      <button @click="$router.push('/dashboard')" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Retour aux défis
      </button>
    </header>

    <div class="profile-banner glass-panel">
      <div class="profile-left">
        <div class="avatar bg-pink">{{ userInitials }}</div>
        <div class="profile-meta">
          <h2 class="capitalize-name">{{ userName }}</h2>
          <div class="meta-stats">
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> {{ userEmail }}</span>
            <span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Inscription <br/>Aujourd'hui</span>
          </div>
        </div>
      </div>
      <div class="profile-right">
        <div class="success-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <div class="rate-val color-cyan">1 / 5</div>
          <div class="rate-label">Niveaux complétés</div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info"><span class="kpi-label">Énigmes résolues</span><span class="kpi-value">1/5</span></div>
        <div class="kpi-icon bg-blue"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info"><span class="kpi-label">Temps total</span><span class="kpi-value">10.2 min</span></div>
        <div class="kpi-icon bg-pink"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info"><span class="kpi-label">Score global</span><span class="kpi-value">95/100</span></div>
        <div class="kpi-icon bg-green"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info"><span class="kpi-label">Total erreurs</span><span class="kpi-value">2</span></div>
        <div class="kpi-icon bg-orange"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <div class="chart-card glass-panel">
        <h4>Temps par Énigme (minutes)</h4>
        <div class="chart-container flex-end bar-chart">
          <div class="y-axis"><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div>
          <div class="bar-area">
            <div class="bar-col"><div class="bar" style="height: 50%; background: #2dd4bf"></div><span>Énigme 1</span></div>
            <div class="bar-col"><div class="bar" style="height: 5%; background: rgba(255,255,255,0.1)"></div><span class="text-muted">Énigme 2</span></div>
            <div class="bar-col"><div class="bar" style="height: 5%; background: rgba(255,255,255,0.1)"></div><span class="text-muted">Énigme 3</span></div>
            <div class="bar-col"><div class="bar" style="height: 5%; background: rgba(255,255,255,0.1)"></div><span class="text-muted">Énigme 4</span></div>
            <div class="bar-col"><div class="bar" style="height: 5%; background: rgba(255,255,255,0.1)"></div><span class="text-muted">Énigme 5</span></div>
          </div>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Évolution de votre Score</h4>
        <div class="chart-container line-chart flex-end">
          <div class="y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
          <div class="line-area">
            <svg viewBox="0 0 500 200" preserveAspectRatio="none" class="svg-graph">
              <line x1="0" y1="0" x2="500" y2="0" class="grid-line"/>
              <line x1="0" y1="50" x2="500" y2="50" class="grid-line"/>
              <line x1="0" y1="100" x2="500" y2="100" class="grid-line"/>
              <line x1="0" y1="150" x2="500" y2="150" class="grid-line"/>
              <line x1="0" y1="200" x2="500" y2="200" class="grid-line"/>
              <!-- Line 1 Blue: Single point for first enigma completion -->
              <circle cx="0" cy="10" r="6" fill="#3b82f6"/>
            </svg>
            <div class="x-axis-line"><span>Défi 1</span><span>Défi 2</span><span>Défi 3</span><span>Défi 4</span><span>Défi 5</span></div>
          </div>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Votre Profil de Compétences</h4>
        <div class="radar-container">
          <svg viewBox="0 0 100 100" class="radar-chart">
            <polygon points="50,10 88,37.6 73.5,82.4 26.5,82.4 12,37.6" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <polygon points="50,20 78.5,40.7 67.6,74.3 32.4,74.3 21.5,40.7" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <polygon points="50,30 69,45 61.8,66.2 38.2,66.2 31,45" fill="transparent" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <line x1="50" y1="50" x2="50" y2="10" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <line x1="50" y1="50" x2="88" y2="37.6" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <line x1="50" y1="50" x2="73.5" y2="82.4" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <line x1="50" y1="50" x2="26.5" y2="82.4" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <line x1="50" y1="50" x2="12" y2="37.6" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
            <!-- Data polygon initially lower because they just started -->
            <polygon points="50,30 65,42 55,60 40,65 35,45" fill="rgba(34, 211, 238, 0.4)" stroke="#22d3ee" stroke-width="1.5"/>
            <circle cx="50" cy="30" r="1.5" fill="#22d3ee"/>
            <circle cx="65" cy="42" r="1.5" fill="#22d3ee"/>
            <circle cx="55" cy="60" r="1.5" fill="#22d3ee"/>
            <circle cx="40" cy="65" r="1.5" fill="#22d3ee"/>
            <circle cx="35" cy="45" r="1.5" fill="#22d3ee"/>
            <text x="50" y="8" fill="white" font-size="3" text-anchor="middle">Rapidité</text>
            <text x="90" y="38" fill="white" font-size="3" text-anchor="start">Précision</text>
            <text x="75" y="86" fill="white" font-size="3" text-anchor="start">Logique</text>
            <text x="25" y="86" fill="white" font-size="3" text-anchor="end">Créativité</text>
            <text x="10" y="38" fill="white" font-size="3" text-anchor="end">Persévérance</text>
          </svg>
        </div>
      </div>

      <div class="chart-card glass-panel">
        <h4>Détails par Énigme</h4>
        <div class="enigme-list">
          <div class="enigme-item">
            <div class="enigme-meta">
              <strong>Énigme 1 : Salle de Réanimation</strong><span class="status-success">Réussi</span>
            </div>
            <div class="enigme-stats">
              <div><span>Temps</span><span>10.2 min</span></div>
              <div><span>Tentatives</span><span>2</span></div>
              <div><span>Score</span><span>95/100</span></div>
            </div>
          </div>
          <div class="enigme-item locked">
            <div class="enigme-meta">
              <strong>Énigme 2 : Bureau Médecin</strong><span class="status-locked">Verrouillé</span>
            </div>
            <div class="enigme-stats">
              <div><span>Temps</span><span>--</span></div>
              <div><span>Tentatives</span><span>--</span></div>
              <div><span>Score</span><span>--</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const userName = ref('Étudiant')
const userInitials = ref('ET')
const userEmail = ref('etudiant@example.com')

onMounted(() => {
  const storedName = localStorage.getItem('registeredUserName')
  if (storedName) {
    userName.value = storedName
    
    // Create initials
    const parts = storedName.split(' ')
    if(parts.length > 1) {
      userInitials.value = (parts[0][0] + parts[1][0]).toUpperCase()
      userEmail.value = `${parts[0]}.${parts[1]}@example.com`.toLowerCase()
    } else {
      userInitials.value = parts[0][0].toUpperCase() + 'U'
      userEmail.value = `${parts[0]}@example.com`.toLowerCase()
    }
  }
})
</script>

<style scoped>
.admin-layout { width: 100%; max-width: 1200px; margin: 0 auto; padding: 1rem 2rem 4rem 2rem; display: flex; flex-direction: column; color: white; min-height: 100vh; }
.admin-header { padding: 0.5rem 0 1rem 0; }
.btn-back { background: transparent; border: none; color: white; display: flex; align-items: center; gap: 0.5rem; font-family: inherit; font-size: 0.9rem; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; }
.btn-back:hover { opacity: 1; }

.glass-panel { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; }

/* Banner Profile */
.profile-banner { padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.profile-left { display: flex; align-items: center; gap: 1.5rem; }
.avatar { width: 72px; height: 72px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; font-weight: 700; background: #2dd4bf; }
.capitalize-name { text-transform: capitalize; }
.profile-meta h2 { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.5rem 0; }
.meta-stats { display: flex; gap: 1.5rem; font-size: 0.8rem; color: rgba(255,255,255,0.7); flex-wrap: wrap; }
.meta-stats span { display: flex; align-items: flex-start; gap: 0.4rem; }
.meta-stats svg { margin-top: -1px; }

.profile-right { display: flex; align-items: center; }
.success-box { background: rgba(34, 211, 238, 0.1); border: 1px solid rgba(34, 211, 238, 0.2); padding: 1rem 2rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
.color-cyan { color: #22d3ee !important; }
.rate-val { font-size: 2rem; font-weight: 700; color: white; margin-top: 0.2rem; }
.rate-label { font-size: 0.75rem; color: rgba(255,255,255,0.7); }

/* KPIs */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.kpi-card { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
.kpi-label { display: block; font-size: 0.75rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 0.25rem; }
.kpi-value { display: block; font-size: 1.5rem; font-weight: 700; }
.kpi-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; justify-content: center; align-items: center; }
.bg-blue { background: #0ea5e9; } .bg-pink { background: #d946ef; } .bg-green { background: #22c55e; } .bg-orange { background: #f97316; }

/* Charts */
.charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
.chart-card { padding: 1.5rem; display: flex; flex-direction: column; }
.chart-card h4 { font-size: 0.95rem; font-weight: 600; margin: 0 0 1.5rem 0; color: white; }

.chart-container { flex: 1; display: flex; position: relative; min-height: 220px; }
.y-axis { display: flex; flex-direction: column; justify-content: space-between; align-items: flex-end; padding-right: 1rem; color: rgba(255, 255, 255, 0.5); font-size: 0.7rem; border-right: 1px dashed rgba(255, 255, 255, 0.2); }

/* Bars */
.bar-area { flex: 1; display: flex; justify-content: space-around; align-items: flex-end; padding-left: 1rem; position: relative; }
.bar-area::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: rgba(255,255,255,0.2); }
.bar-col { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; height: 100%; justify-content: flex-end; flex: 1; margin: 0 4px; }
.bar { width: 100%; max-width: 40px; border-radius: 4px 4px 0 0; }
.bar-col span { font-size: 0.65rem; color: rgba(255, 255, 255, 0.7); white-space: nowrap; }
.text-muted { color: rgba(255, 255, 255, 0.3) !important; }

/* Line graph */
.line-area { flex: 1; display: flex; flex-direction: column; position: relative; padding-left: 1rem; }
.svg-graph { width: 100%; height: calc(100% - 20px); overflow: visible; }
.grid-line { stroke: rgba(255, 255, 255, 0.1); stroke-width: 1; stroke-dasharray: 4 4; }
.x-axis-line { display: flex; justify-content: space-between; margin-top: auto; color: rgba(255, 255, 255, 0.7); font-size: 0.65rem; }

/* Radar */
.radar-container { flex: 1; display: flex; justify-content: center; align-items: center; min-height: 220px;}
.radar-chart { width: 100%; max-width: 250px; height: auto; overflow: visible; }

/* Enigme List */
.enigme-list { display: flex; flex-direction: column; gap: 1rem; flex: 1; overflow-y: auto; padding-right: 0.5rem; max-height: 220px;}
.enigme-list::-webkit-scrollbar { width: 6px; }
.enigme-list::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px;}
.enigme-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px;}

.enigme-item { background: rgba(255,255,255,0.05); border-radius: 8px; padding: 1rem; border: 1px solid rgba(255,255,255,0.05); }
.enigme-item.locked { opacity: 0.5; }
.enigme-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.enigme-meta strong { font-size: 0.9rem; }
.status-success { font-size: 0.7rem; color: #4ade80; font-weight: 600; }
.status-locked { font-size: 0.7rem; color: rgba(255,255,255,0.5); font-weight: 600; }
.enigme-stats { display: flex; justify-content: space-between; }
.enigme-stats div { display: flex; flex-direction: column; gap: 0.2rem; }
.enigme-stats div span:first-child { font-size: 0.65rem; color: rgba(255,255,255,0.5); }
.enigme-stats div span:last-child { font-size: 0.8rem; font-weight: 600; }
</style>
