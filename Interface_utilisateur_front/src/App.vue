<template>
  <div class="app-container">
    <!-- Show Back button only if we are not on the home page or custom dashboards -->
    <header v-if="route.path !== '/' && route.path !== '/dashboard' && route.path !== '/statistiques' && route.path !== '/dashboard-admin' && !route.path.startsWith('/admin/joueurs')" class="top-nav">
      <button @click="router.push('/')" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Retour à l'accueil
      </button>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
</script>

<style scoped>
.app-container {
  width: 100%;
  padding: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.top-nav {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 0rem;
  position: absolute; /* Allows pages like Accueil to use the full top space natively */
  top: 2rem;
  left: 2rem;
  z-index: 100;
}

.back-button {
  background: transparent;
  border: none;
  color: var(--color-text);
  font-family: inherit;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
