<template>
  <div class="admin-layout">
    <header class="admin-header">
      <button @click="$router.push('/dashboard-admin')" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
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
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un joueur..."
        />
      </div>
      <div class="sort-box">
        <label>Trier par:</label>
        <select class="glass-dropdown" v-model="sortKey">
          <option value="nom">Nom</option>
          <option value="date">Date d'inscription</option>
          <option value="age">Âge</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-row">
      <div class="spinner"></div>
      <span>Chargement des joueurs...</span>
    </div>

    <template v-else>
      <p class="results-count">{{ filteredPlayers.length }} joueur(s) trouvé(s)</p>

      <div class="table-container glass-panel">
        <div v-if="filteredPlayers.length === 0" class="empty-table">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
            fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          <p>Aucun joueur trouvé</p>
        </div>

        <table v-else class="players-table">
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Email</th>
              <th>Âge</th>
              <th>Profil</th>
              <th>Inscription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in filteredPlayers" :key="player.id">
              <td>
                <div class="player-cell">
                  <div class="avatar" :style="{ backgroundColor: player.color }">
                    {{ player.initials }}
                  </div>
                  <div class="player-info">
                    <strong>{{ player.name }}</strong>
                    <span>{{ player.pseudo }}</span>
                  </div>
                </div>
              </td>
              <td class="text-low">{{ player.email }}</td>
              <td class="text-low">
                {{ player.age !== '—' ? player.age + ' ans' : '—' }}
              </td>
              <td class="text-low">{{ player.profil }}</td>
              <td class="text-low">{{ player.dateInscription }}</td>
              <td>
                <button
                  @click="$router.push('/admin/joueurs/' + player.id)"
                  class="btn-inspect"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Inspecter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService, authService } from '../services/api'

const router = useRouter()
const loading = ref(true)
const allPlayers = ref([])
const searchQuery = ref('')
const sortKey = ref('nom')

const COLORS = ['#f472b6', '#c084fc', '#d946ef', '#a855f7', '#818cf8', '#38bdf8', '#34d399']

function getInitials(prenom, nom) {
  return ((prenom?.[0] || '') + (nom?.[0] || '')).toUpperCase()
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('fr-FR')
  } catch {
    return dateStr
  }
}

function calcularEdad(dateNaissance) {
  if (!dateNaissance) return '—'
  try {
    const hoy = new Date()
    const nac = new Date(dateNaissance)
    return hoy.getFullYear() - nac.getFullYear()
  } catch {
    return '—'
  }
}

onMounted(async () => {
  try {
    const data = await adminService.getAllPlayers()
    allPlayers.value = data.map((p, i) => ({
      id: p.id,
      initials: getInitials(p.prenom, p.nom),
      name: `${p.prenom || ''} ${p.nom || ''}`.trim() || p.email,
      pseudo: p.pseudo || '—',
      email: p.email,
      age: calcularEdad(p.dateNaissance),
      // ✅ Guardamos el profil en lugar del etablissement
      profil: p.profil || '—',
      dateInscription: formatDate(p.dateInscription),
      // ✅ Guardamos la fecha RAW de inscripción para poder ordenarla matemáticamente
      dateInscriptionRaw: p.dateInscription,
      color: COLORS[i % COLORS.length]
    }))
  } catch (err) {
    console.error('Erreur liste joueurs:', err)
    if (err.message.startsWith('401') || err.message.startsWith('403')) {
      authService.logout()
      router.push('/admin')
    }
  } finally {
    loading.value = false
  }
})

const filteredPlayers = computed(() => {
  let list = [...allPlayers.value]

  // BÚSQUEDA
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.pseudo.toLowerCase().includes(q) ||
      // ✅ Ahora la barra de búsqueda también busca por el nombre del Profil
      (p.profil || '').toLowerCase().includes(q)
    )
  }

  // ORDENAMIENTO
  if (sortKey.value === 'nom') {
    list.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortKey.value === 'date') {
    // ✅ CORREGIDO: Ahora usa 'dateInscriptionRaw' en lugar de la fecha de nacimiento.
    // Ordena del más reciente (nuevo inscrito) al más antiguo.
    list.sort((a, b) => {
      const da = new Date(a.dateInscriptionRaw || 0).getTime()
      const db = new Date(b.dateInscriptionRaw || 0).getTime()
      return db - da 
    })
  } else if (sortKey.value === 'age') {
    list.sort((a, b) => {
      const aa = typeof a.age === 'number' ? a.age : 0
      const ba = typeof b.age === 'number' ? b.age : 0
      return aa - ba
    })
  }

  return list
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
.admin-header { padding: 0.5rem 0 2rem 0; }
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

.admin-title-row { margin-bottom: 2rem; }
.admin-title-row h2 { font-size: 1.8rem; font-weight: 700; margin: 0 0 0.25rem 0; }
.subtitle { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0; }

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.6rem 1rem;
  border-radius: 8px;
  width: 320px;
}
.search-box input {
  background: transparent;
  border: none;
  color: white;
  outline: none;
  width: 100%;
  font-family: inherit;
  font-size: 0.9rem;
}
.search-box input::placeholder { color: rgba(255,255,255,0.4); }
.search-box svg { color: rgba(255,255,255,0.4); flex-shrink: 0; }

.sort-box { display: flex; align-items: center; gap: 0.75rem; font-size: 0.85rem; }
.glass-dropdown {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  outline: none;
  font-family: inherit;
  cursor: pointer;
}
.glass-dropdown option { background: #5b21b6; color: white; }

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

.results-count { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-bottom: 1rem; }

.glass-panel {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
}

.empty-table {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: rgba(255,255,255,0.4);
  font-size: 0.9rem;
}

.table-container { overflow: hidden; }
.players-table { width: 100%; border-collapse: collapse; text-align: left; }
.players-table th {
  padding: 1.25rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255,255,255,0.8);
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.players-table td {
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  font-size: 0.85rem;
}
.players-table tr:hover td { background: rgba(255,255,255,0.03); }
.players-table tr:last-child td { border-bottom: none; }

.player-cell { display: flex; align-items: center; gap: 0.9rem; }
.avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; justify-content: center; align-items: center;
  font-weight: 700; font-size: 0.85rem;
  flex-shrink: 0;
  color: white;
}
.player-info { display: flex; flex-direction: column; }
.player-info strong { font-weight: 600; font-size: 0.9rem; }
.player-info span { font-size: 0.7rem; color: rgba(255,255,255,0.5); }

.text-low { color: rgba(255,255,255,0.8); }

.btn-inspect {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.2s;
  white-space: nowrap;
}
.btn-inspect:hover { background: rgba(255,255,255,0.2); }
</style>