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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'accueil', component: Accueil },
    { path: '/connexion', name: 'connexion', component: ConnexionEtudiant },
    { path: '/inscription', name: 'inscription', component: InscriptionEtudiant },
    { path: '/admin', name: 'admin', component: AccesAdministrateur },
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
    }
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