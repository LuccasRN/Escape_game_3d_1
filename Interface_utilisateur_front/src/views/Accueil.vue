<template>
  <div class="landing-container">
    <!-- Header Titles -->
    <header class="text-center mb-12">
      <h1 class="main-title">Digital Escape Game</h1>
      <h2 class="sub-title">Health Tech Edition</h2>
      <div class="divider">
        <span>CHL INNOVATION LAB</span>
      </div>
    </header>

    <!-- Main Central Card -->
    <button @click="$router.push('/connexion')" class="glass-panel main-student-card">
      <div class="avatar-circle">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </div>
      <h3>Accès Étudiant</h3>
      <p>Cliquez pour accéder &rarr;</p>
    </button>

    <!-- Info Bottom Bar -->
    <div class="info-bar glass-panel mt-auto">
      <div class="info-item">
        <div class="info-icon bg-yellow">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
        </div>
        <div class="info-text">
          <strong>Projet Académique</strong>
          <p>Développement dans le cadre de la SAE ou FIE-3</p>
        </div>
      </div>
      <div class="info-item">
        <div class="info-icon bg-green">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        </div>
        <div class="info-text">
          <strong>Conformité RGPD</strong>
          <p>Vos données sont anonymisées et protégées</p>
        </div>
      </div>
      <div class="info-item">
        <div class="info-icon bg-blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <div class="info-text">
          <strong>Contenu Vérifié</strong>
          <p>Informations médicales et protocoles validés</p>
        </div>
      </div>
    </div>

    <!-- Cookies Overlay Banner -->
    <div v-if="showCookies" class="cookie-banner glass-panel">
      <div class="cookie-content">
        <div class="cookie-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          <strong>Respect de votre vie privée</strong>
        </div>
        <p>Nous utilisons des cookies essentiels pour améliorer votre expérience. Vos données sont stockées localement et ne sont pas partagées avec des tiers. Ce projet pédagogique respecte le <strong>RGPD</strong> et n'est pas destiné à collecter des données personnelles sensibles.</p>
        <div class="cookie-footer">
          <small>Projet FIE-3 • CHL & Santé Numérique • ISIS Castres</small>
        </div>
      </div>
      <div class="cookie-actions">
        <button @click="hideCookies" class="btn-accept">J'accepte</button>
        <button @click="hideCookies" class="btn-refuse">Refuser</button>
      </div>
    </div>

    <!-- Admin Floating Button -->
    <button @click="$router.push('/admin')" class="admin-fab" title="Connexion Administrateur">
      ?
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showCookies = ref(true)

const hideCookies = () => {
  showCookies.value = false
}
</script>

<style scoped>
.landing-container {
  width: 100%;
  padding: 4rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: calc(100vh - 4rem); /* To account for app padding */
}

/* Typography */
.text-center {
  text-align: center;
}
.mb-12 {
  margin-bottom: 3rem;
}
.main-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}
.sub-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1.5rem;
}
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.divider::before, .divider::after {
  content: '';
  height: 1px;
  width: 40px;
  background: rgba(255, 255, 255, 0.3);
}

/* Main Student Card */
.main-student-card {
  width: 100%;
  max-width: 400px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  color: white;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  background: rgba(255, 255, 255, 0.15); /* Match the original clear style */
}
.main-student-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}
.avatar-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.main-student-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
}
.main-student-card p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/* Bottom Info Bar */
.mt-auto {
  margin-top: auto;
}
.info-bar {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 1.5rem 2rem;
  margin-top: 4rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}
.info-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.bg-yellow { background: rgba(234, 179, 8, 0.2); color: #fdf08a; }
.bg-green { background: rgba(34, 197, 94, 0.2); color: #bbf7d0; }
.bg-blue { background: rgba(59, 130, 246, 0.2); color: #bfdbfe; }

.info-text strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
  color: white;
}
.info-text p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

/* Cookie Banner */
.cookie-banner {
  position: fixed;
  bottom: 2rem;
  background: white; /* Bright white banner as in design */
  color: #1f2937;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  gap: 2rem;
  width: 90%;
  max-width: 800px;
  z-index: 50;
  border: none;
}
.cookie-content {
  flex: 1;
}
.cookie-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
.cookie-header svg {
  background: rgba(236, 72, 153, 0.1); /* light pink */
  padding: 4px;
  border-radius: 6px;
  width: 28px;
  height: 28px;
}
.cookie-content p {
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}
.cookie-footer small {
  font-size: 0.7rem;
  color: #9ca3af;
}
.cookie-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.btn-accept {
  background: linear-gradient(to right, #9333ea, #ec4899);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-accept:hover { opacity: 0.9; }
.btn-refuse {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-refuse:hover { background: #f3f4f6; }

/* Admin Floating Button */
.admin-fab {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 40;
}
.admin-fab:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

@media (max-width: 768px) {
  .info-bar {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .cookie-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .cookie-actions {
    width: 100%;
    justify-content: stretch;
  }
  .cookie-actions button {
    flex: 1;
  }
}
</style>
