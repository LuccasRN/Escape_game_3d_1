<template>
  <div class="admin-layout">
    <header class="admin-header">
      <button @click="$router.push('/dashboard-admin')" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Retour au tableau de bord
      </button>
    </header>

    <div class="admin-title-row">
      <div>
        <h2>Liste des Joueurs</h2>
        <p class="subtitle">Gérez et inspectez les performances de chaque joueur</p>
      </div>
    </div>

    <div class="controls-row">
      <div class="search-box glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Rechercher un joueur..." />
      </div>
      <div class="sort-box">
        <label>Trier par:</label>
        <select class="glass-dropdown">
          <option>Nom</option>
          <option>Date d'inscription</option>
          <option>Taux de réussite</option>
        </select>
      </div>
    </div>

    <p class="results-count">{{ users.length }} joueurs trouvés</p>

    <div class="table-container glass-panel">
      <table class="players-table">
        <thead>
          <tr>
            <th>Joueur</th>
            <th>Email</th>
            <th>Âge</th>
            <th>Progression</th>
            <th>Temps Moyen</th>
            <th>Taux Réussite</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="player-cell">
                <div class="avatar" :style="{ backgroundColor: user.color }">{{ user.initials }}</div>
                <div class="player-info">
                  <strong>{{ user.name }}</strong>
                  <span>Inscrit le {{ user.date }}</span>
                </div>
              </div>
            </td>
            <td class="text-low">{{ user.email }}</td>
            <td class="text-low">{{ user.age }} ans</td>
            <td>
              <div class="progression-cell">
                <span>{{ user.progression }}/5</span>
                <div class="progress-bar-bg"><div class="progress-bar-fill" :style="{ width: (user.progression / 5 * 100) + '%', backgroundColor: user.barColor }"></div></div>
              </div>
            </td>
            <td class="text-low">{{ user.time }} min</td>
            <td>
              <span class="success-rate" :style="{ color: user.rateColor }">
                <svg v-if="user.rate >= 50" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
                {{ user.rate }}%
              </span>
            </td>
            <td>
              <button @click="$router.push(`/admin/joueurs/${user.id}`)" class="btn-inspect">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                Inspecter
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, initials: 'EB', name: 'Emma Bernard', date: '08/01/2026', email: 'emma.b@example.com', age: 23, progression: 5, time: 12.8, rate: 100, color: '#f472b6', barColor: '#ec4899', rateColor: '#4ade80' },
  { id: 2, initials: 'SD', name: 'Sophie Dubois', date: '10/01/2026', email: 'sophie.d@example.com', age: 22, progression: 5, time: 14.5, rate: 100, color: '#c084fc', barColor: '#a855f7', rateColor: '#4ade80' },
  { id: 3, initials: 'LD', name: 'Léa Durand', date: '10/01/2026', email: 'lea.d@example.com', age: 21, progression: 4, time: 19.1, rate: 80, color: '#d946ef', barColor: '#d946ef', rateColor: '#4ade80' },
  { id: 4, initials: 'LM', name: 'Lucas Martin', date: '12/01/2026', email: 'lucas.m@example.com', age: 21, progression: 4, time: 18.2, rate: 80, color: '#f472b6', barColor: '#f472b6', rateColor: '#4ade80' },
  { id: 5, initials: 'NM', name: 'Nathan Moreau', date: '12/01/2026', email: 'nathan.m@example.com', age: 23, progression: 5, time: 15.9, rate: 100, color: '#a855f7', barColor: '#a855f7', rateColor: '#4ade80' },
  { id: 6, initials: 'TP', name: 'Thomas Petit', date: '13/01/2026', email: 'thomas.p@example.com', age: 20, progression: 3, time: 22.5, rate: 60, color: '#c084fc', barColor: '#c084fc', rateColor: '#facc15' },
])
</script>

<style scoped>
.admin-layout { width: 100%; max-width: 1200px; margin: 0 auto; padding: 1rem 2rem 4rem 2rem; display: flex; flex-direction: column; color: white; min-height: 100vh; }
.admin-header { padding: 0.5rem 0 2rem 0; }
.btn-back { background: transparent; border: none; color: white; display: flex; align-items: center; gap: 0.5rem; font-family: inherit; font-size: 0.9rem; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; }
.btn-back:hover { opacity: 1; }
.admin-title-row { margin-bottom: 2rem; }
.admin-title-row h2 { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem 0; }
.subtitle { font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); margin: 0; }

.controls-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.search-box { display: flex; align-items: center; gap: 0.75rem; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); padding: 0.6rem 1rem; border-radius: 8px; width: 300px; }
.search-box input { background: transparent; border: none; color: white; outline: none; width: 100%; font-family: inherit; }
.search-box input::placeholder { color: rgba(255, 255, 255, 0.4); }
.search-box svg { color: rgba(255, 255, 255, 0.4); }

.sort-box { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; }
.glass-dropdown { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 0.5rem 1rem; border-radius: 8px; outline: none; }
.glass-dropdown option { background: #5b21b6; color: white; }

.results-count { font-size: 0.75rem; color: rgba(255, 255, 255, 0.5); margin-bottom: 1rem; }

.glass-panel { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; }
.table-container { overflow: hidden; }
.players-table { width: 100%; border-collapse: collapse; text-align: left; }
.players-table th { padding: 1.25rem 1.5rem; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; color: rgba(255, 255, 255, 0.8); border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.players-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.85rem; }
.players-table tr:hover td { background: rgba(255, 255, 255, 0.03); }
.players-table tr:last-child td { border-bottom: none; }

.player-cell { display: flex; align-items: center; gap: 1rem; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; }
.player-info { display: flex; flex-direction: column; }
.player-info strong { font-weight: 600; font-size: 0.9rem; }
.player-info span { font-size: 0.7rem; color: rgba(255, 255, 255, 0.5); }

.text-low { color: rgba(255, 255, 255, 0.8); }

.progression-cell { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.8rem; font-weight: 600; }
.progress-bar-bg { width: 60px; height: 4px; background: rgba(255, 255, 255, 0.2); border-radius: 2px; }
.progress-bar-fill { height: 100%; border-radius: 2px; }

.success-rate { display: flex; align-items: center; gap: 0.25rem; font-weight: 600; font-size: 0.85rem; }

.btn-inspect { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: white; padding: 0.4rem 0.75rem; border-radius: 6px; font-size: 0.75rem; font-family: inherit; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.2s; }
.btn-inspect:hover { background: rgba(255, 255, 255, 0.2); }
</style>
