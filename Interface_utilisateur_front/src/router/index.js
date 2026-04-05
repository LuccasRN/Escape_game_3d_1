import { createRouter, createWebHistory } from 'vue-router'
import Accueil from '../views/Accueil.vue'
import ConnexionEtudiant from '../views/ConnexionEtudiant.vue'
import InscriptionEtudiant from '../views/InscriptionEtudiant.vue'
import AccesAdministrateur from '../views/AccesAdministrateur.vue'
import DashboardEtudiant from '../views/DashboardEtudiant.vue'
import DashboardAdmin from '../views/DashboardAdmin.vue'
import AdminListeJoueurs from '../views/AdminListeJoueurs.vue'
import AdminJoueurDetail from '../views/AdminJoueurDetail.vue'
import StatistiquesEtudiant from '../views/StatistiquesEtudiant.vue'
import EnigmeBridge from '../views/EnigmeBridge.vue'
import IntroductionHistoire from '../views/IntroductionHistoire.vue'
import ConclusionHistoire from '../views/ConclusionHistoire.vue'
import TestFiches from '../views/TestFiches.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'accueil', component: Accueil },
    { path: '/connexion', name: 'connexion', component: ConnexionEtudiant },
    { path: '/inscription', name: 'inscription', component: InscriptionEtudiant },
    { path: '/admin', name: 'admin', component: AccesAdministrateur },
    {
      path: '/introduction',
      name: 'introduction',
      component: IntroductionHistoire,
      meta: { requiresAuth: true, role: 'ROLE_USER' }
    },
    {
      path: '/conclusion',
      name: 'conclusion',
      component: ConclusionHistoire
    },
    { path: '/test-fiches', name: 'test-fiches', component: TestFiches },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardEtudiant,
      meta: { requiresAuth: true, role: 'ROLE_USER' }
    },
    {
      path: '/statistiques',
      name: 'statistiques',
      component: StatistiquesEtudiant,
      meta: { requiresAuth: true, role: 'ROLE_USER' }
    },
    {
      path: '/dashboard-admin',
      name: 'dashboard-admin',
      component: DashboardAdmin,
      meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
    },
    {
      path: '/admin/joueurs',
      name: 'admin-joueurs',
      component: AdminListeJoueurs,
      meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
    },
    {
      path: '/admin/joueurs/:id',
      name: 'admin-joueur-detail',
      component: AdminJoueurDetail,
      meta: { requiresAuth: true, role: 'ROLE_ADMIN' }
    },

    {
      path: '/enigme/salle-reseau',
      name: 'enigme-salle-reseau',
      component: EnigmeBridge,
      props: { enigmaId: 1, enigmaName: 'Salle Réseau', enigmaPort: 5177 },
    },

    {
      path: '/enigme/bureau',
      name: 'enigme-bureau',
      component: EnigmeBridge,
      props: { enigmaId: 2, enigmaName: 'Bureau Médecin', enigmaPort: 5174 },
    },
    {
      path: '/enigme/chambre-patient',
      name: 'enigme-chambre-patient',
      component: EnigmeBridge,
      props: { enigmaId: 3, enigmaName: 'Chambre du Patient', enigmaPort: 5175 },
    },
    {
      path: '/enigme/pharmacie',
      name: 'enigme-pharmacie',
      component: EnigmeBridge,
      props: { enigmaId: 4, enigmaName: 'Pharmacie', enigmaPort: 5176 },
    },

    {
      path: '/enigme/salle-reunion',
      name: 'enigme-salle-reunion',
      component: EnigmeBridge,
      props: { enigmaId: 5, enigmaName: 'Salle de Réunion', enigmaPort: 5178 },
    },


  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('userRole')

  if (to.meta.requiresAuth) {
    if (!token) return next('/connexion')
    if (to.meta.role && role !== to.meta.role) {
      return next(role === 'ROLE_ADMIN' ? '/dashboard-admin' : '/dashboard')
    }
  }
  next()
})

export default router
