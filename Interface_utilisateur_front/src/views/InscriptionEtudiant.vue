<template>
  <div class="glass-panel form-container">
    <div class="icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <line x1="19" y1="8" x2="19" y2="14"></line>
        <line x1="22" y1="11" x2="16" y2="11"></line>
      </svg>
    </div>
    <h2>Inscription Étudiant</h2>
    <p class="subtitle">Créez votre compte pour accéder aux défis</p>

    <form @submit.prevent="handleSubmit" class="registration-form">
      <div class="form-group">
        <label>Nom</label>
        <input type="text" v-model="nom" placeholder="Dupont" required />
      </div>
      <div class="form-group">
        <label>Prénom</label>
        <input type="text" v-model="prenom" placeholder="Jean" required />
      </div>
      <div class="form-group">
        <label>Date de naissance</label>
        <input type="date" v-model="dateNaissance" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="jean.dupont@example.com" required />
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <div class="password-input">
          <input type="password" v-model="password" placeholder="••••••••" required />
          <div class="password-strength-bg">
            <div class="password-strength-bar" :style="{ backgroundColor: strengthColor, width: strengthWidth }"></div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label>Confirmer le mot de passe</label>
        <input type="password" placeholder="••••••••" required />
      </div>
      
      <div class="checkbox-group">
        <div class="checkbox-wrapper">
          <input type="checkbox" id="terms" required />
          <div class="custom-checkbox"></div>
        </div>
        <label for="terms">J'accepte les <a href="#">conditions de confidentialité</a></label>
      </div>

      <button type="submit" class="submit-btn">S'inscrire</button>

      <div class="footer-link">
        <p>Déjà inscrit(e) ? <router-link to="/connexion">Se connecter</router-link></p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api' // Ajout du service API

const router = useRouter()
const password = ref('')
const nom = ref('')
const prenom = ref('')
const dateNaissance = ref('')
const email = ref('')

const strengthScore = computed(() => {
  if (!password.value) return 0;
  let score = 1; // trop simple
  if (password.value.length >= 6 && /[0-9]/.test(password.value)) score = 2; // moyen
  if (password.value.length >= 8 && /[0-9]/.test(password.value) && /[a-zA-Z]/.test(password.value) && /[^A-Za-z0-9]/.test(password.value)) score = 3; // fort
  return score;
})

const strengthColor = computed(() => {
  switch (strengthScore.value) {
    case 1: return '#ef4444'; // rouge
    case 2: return '#f97316'; // orange
    case 3: return '#10b981'; // vert
    default: return 'rgba(255, 255, 255, 0.8)'; // blanc (vide)
  }
})

const strengthWidth = computed(() => {
  switch (strengthScore.value) {
    case 1: return '33%';
    case 2: return '66%';
    case 3: return '100%';
    default: return '100%'; // Pleine largeur quand vide
  }
})

const handleSubmit = async () => {
  try {
    // 🔗 APPEL AU SERVICE API REGISTER
    const response = await authService.register({
      nom: nom.value,
      prenom: prenom.value,
      dateNaissance: dateNaissance.value,
      email: email.value,
      password: password.value
    });

    if (response.success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error("Erreur inscription:", error)
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: var(--glass-input-bg);
  border-radius: 50%;
  border: 1px solid var(--glass-border);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.registration-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.875rem;
  color: var(--color-text);
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"] {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--glass-input-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.password-input {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.password-strength-bg {
  height: 4px;
  width: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.password-strength-bar {
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.checkbox-wrapper {
  position: relative;
  width: 16px;
  height: 16px;
}

.checkbox-wrapper input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 100%;
  width: 100%;
  z-index: 2;
}

.custom-checkbox {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  border-radius: 4px;
}

.checkbox-wrapper input:checked ~ .custom-checkbox::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 4px;
  height: 8px;
  border: solid var(--color-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-group label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.checkbox-group a {
  color: var(--color-text);
  text-decoration: none;
}

.checkbox-group a:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 0.875rem;
  background: #ffffff;
  color: var(--color-primary);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Ensure date picker icon is visible/white on webkit */
::-webkit-calendar-picker-indicator {
  filter: invert(1);
  opacity: 0.5;
  cursor: pointer;
}
::-webkit-calendar-picker-indicator:hover {
  opacity: 0.8;
}

.footer-link {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
}

.footer-link a {
  color: #22d3ee;
  text-decoration: none;
  font-weight: 600;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>
