<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-left">
        <button @click="logout" class="btn-logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
      <button class="btn-export">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Exporter CSV
      </button>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Total Joueurs</span>
          <span class="kpi-value">210</span>
        </div>
        <div class="kpi-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Temps Moyen</span>
          <span class="kpi-value">17.6 min</span>
        </div>
        <div class="kpi-icon bg-pink">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Taux de Réussite</span>
          <span class="kpi-value">73%</span>
        </div>
        <div class="kpi-icon bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-info">
          <span class="kpi-label">Total Erreurs</span>
          <span class="kpi-value">92</span>
        </div>
        <div class="kpi-icon bg-orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
      </div>
    </div>

    <!-- Banner -->
    <button @click="$router.push('/admin/joueurs')" class="action-banner glass-panel">
      <div class="banner-icon bg-blue">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
      </div>
      <div class="banner-texts">
        <strong>Voir tous les joueurs</strong>
        <p>Accédez à la liste complète et inspectez les performances individuelles</p>
      </div>
      <div class="banner-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </div>
    </button>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- Chart 1: Bar -->
      <div class="chart-card glass-panel">
        <h4>Temps Moyen par Énigme (minutes)</h4>
        <div class="chart-container flex-end bar-chart">
          <!-- Y Axis Marks -->
          <div class="y-axis">
            <span>24</span><span>18</span><span>12</span><span>6</span><span>0</span>
          </div>
          <!-- Bars -->
          <div class="bar-area">
            <div class="bar-col"><div class="bar bg-purple-1" style="height: 50%"></div><span>Énigme 1</span></div>
            <div class="bar-col"><div class="bar bg-purple-2" style="height: 75%"></div><span>Énigme 2</span></div>
            <div class="bar-col"><div class="bar bg-purple-3" style="height: 60%"></div><span>Énigme 3</span></div>
            <div class="bar-col"><div class="bar bg-purple-4" style="height: 95%"></div><span>Énigme 4</span></div>
            <div class="bar-col"><div class="bar bg-purple-5" style="height: 85%"></div><span>Énigme 5</span></div>
          </div>
        </div>
      </div>

      <!-- Chart 2: Histogram -->
      <div class="chart-card glass-panel">
        <h4>Distribution par Âge</h4>
        <div class="chart-container flex-end bar-chart">
          <div class="y-axis">
            <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
          </div>
          <div class="bar-area narrow-gap">
            <div class="bar-col"><div class="bar bg-pink-solid" style="height: 55%"></div><span>18-20</span></div>
            <div class="bar-col"><div class="bar bg-pink-solid" style="height: 100%"></div><span>21-23</span></div>
            <div class="bar-col"><div class="bar bg-pink-solid" style="height: 65%"></div><span>24-26</span></div>
            <div class="bar-col"><div class="bar bg-pink-solid" style="height: 30%"></div><span>27-29</span></div>
            <div class="bar-col"><div class="bar bg-pink-solid" style="height: 15%"></div><span>30+</span></div>
          </div>
        </div>
      </div>

      <!-- Chart 3: Line Chart -->
      <div class="chart-card glass-panel">
        <h4>Tentatives et Erreurs par Jour</h4>
        <div class="chart-container flex-end line-chart">
          <div class="y-axis">
            <span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
          </div>
          <div class="line-area">
            <svg viewBox="0 0 600 200" preserveAspectRatio="none" class="svg-graph">
              <line x1="0" y1="0" x2="600" y2="0" class="grid-line"/>
              <line x1="0" y1="50" x2="600" y2="50" class="grid-line"/>
              <line x1="0" y1="100" x2="600" y2="100" class="grid-line"/>
              <line x1="0" y1="150" x2="600" y2="150" class="grid-line"/>
              <line x1="0" y1="200" x2="600" y2="200" class="grid-line"/>
              
              <polyline points="0,110 100,80 200,60 300,100 400,30 500,140 600,160" fill="none" stroke="#3b82f6" stroke-width="4" />
              <circle cx="0" cy="110" r="4" fill="#3b82f6"/>
              <circle cx="100" cy="80" r="4" fill="#3b82f6"/>
              <circle cx="200" cy="60" r="4" fill="#3b82f6"/>
              <circle cx="300" cy="100" r="4" fill="#3b82f6"/>
              <circle cx="400" cy="30" r="4" fill="#3b82f6"/>
              <circle cx="500" cy="140" r="4" fill="#3b82f6"/>
              <circle cx="600" cy="160" r="4" fill="#3b82f6"/>

              <polyline points="0,180 100,170 200,160 300,185 400,150 500,190 600,195" fill="none" stroke="#ef4444" stroke-width="4" />
              <circle cx="0" cy="180" r="4" fill="#ef4444"/>
              <circle cx="100" cy="170" r="4" fill="#ef4444"/>
              <circle cx="200" cy="160" r="4" fill="#ef4444"/>
              <circle cx="300" cy="185" r="4" fill="#ef4444"/>
              <circle cx="400" cy="150" r="4" fill="#ef4444"/>
              <circle cx="500" cy="190" r="4" fill="#ef4444"/>
              <circle cx="600" cy="195" r="4" fill="#ef4444"/>
            </svg>
            <div class="x-axis-line">
              <span>Lun</span><span>Mar</span><span>Mer</span><span>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
            </div>
          </div>
        </div>
        <div class="legend-center">
            <span class="legend-item"><span class="dot bg-red-500"></span>erreurs</span>
            <span class="legend-item"><span class="dot bg-blue-500"></span>tentatives</span>
        </div>
      </div>

      <!-- Chart 4: Pie Chart -->
      <div class="chart-card glass-panel">
        <h4>Taux de Réussite Global</h4>
        <div class="pie-container">
          <div class="pie-chart"></div>
          <div class="pie-labels">
            <span class="label-success">Réussite: 73%</span>
            <span class="label-fail">Échec: 27%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  router.push('/')
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
.btn-logout:hover {
  opacity: 1;
}

.admin-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}
.admin-title-row h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}
.subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}
.btn-export:hover {
  transform: translateY(-2px);
}

/* KPIs */
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
.kpi-label {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}
.kpi-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
}
.kpi-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg-blue { background: #0ea5e9; }
.bg-pink { background: #d946ef; }
.bg-green { background: #22c55e; }
.bg-orange { background: #f97316; }

/* Banner */
.action-banner {
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
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
.action-banner:hover {
  background: rgba(255, 255, 255, 0.12);
}
.banner-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0ea5e9;
}
.banner-texts {
  flex: 1;
}
.banner-texts strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 0.2rem;
}
.banner-texts p {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}
.banner-arrow {
  color: rgba(255, 255, 255, 0.5);
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}
.chart-card h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: white;
}

.chart-container {
  flex: 1;
  display: flex;
  position: relative;
  min-height: 220px;
}

/* Y Axis common */
.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding-right: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  border-right: 1px dashed rgba(255, 255, 255, 0.2);
}

/* Bar Charts */
.bar-area {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-left: 1rem;
  position: relative;
}
.bar-area.narrow-gap {
  gap: 2px;
  justify-content: space-between;
}
.bar-area::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
}
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
.bar-area.narrow-gap .bar-col {
  margin: 0;
}
.bar {
  width: 100%;
  max-width: 40px;
  border-radius: 4px 4px 0 0;
  background: #a855f7;
  transition: height 1s ease;
}
.narrow-gap .bar {
  max-width: 100%;
}
.bar-col span {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
}

.bg-purple-1 { background: #8b5cf6; }
.bg-purple-2 { background: #9333ea; }
.bg-purple-3 { background: #a855f7; }
.bg-purple-4 { background: #c084fc; }
.bg-purple-5 { background: #d8b4fe; }
.bg-pink-solid { background: #f472b6; }

/* Line Chart */
.line-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 1rem;
}
.svg-graph {
  width: 100%;
  height: calc(100% - 20px);
  overflow: visible;
}
.grid-line {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}
.x-axis-line {
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.65rem;
}
.legend-center {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1rem;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.bg-red-500 { background: #ef4444; }
.bg-blue-500 { background: #3b82f6; }

/* Pie Chart */
.pie-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  position: relative;
}
.pie-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(#4ade80 0% 73%, #f87171 73% 100%);
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.pie-labels {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  pointer-events: none;
}
.label-success {
  position: absolute;
  top: 25%;
  left: 20%;
  color: #4ade80;
  font-weight: 600;
  font-size: 0.8rem;
}
.label-fail {
  position: absolute;
  bottom: 20%;
  right: 15%;
  color: #f87171;
  font-weight: 600;
  font-size: 0.8rem;
}

@media (max-width: 1024px) {
  .kpi-grid, .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
