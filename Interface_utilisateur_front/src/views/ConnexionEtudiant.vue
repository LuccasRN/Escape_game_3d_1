<template>
  <div class="glass-panel form-container">
    <div class="icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <h2>Connexion Étudiant</h2>
    <p class="subtitle">Accédez à votre espace pour relever les défis</p>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="jean.dupont@example.com" required />
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" v-model="password" placeholder="••••••••" required />
      </div>

      <button type="submit" class="submit-btn">Se connecter</button>
    </form>

    <div class="footer-link">
      <p>Pas encore de compte ? <router-link to="/inscription">S'inscrire</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api' // API prête pour backend

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    // 🔗 APPEL AU SERVICE API
    const response = await authService.login(email.value, password.value)
    if(response.success) {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error("Problème de connexion:", error)
    alert("Veuillez vérifier vos identifiants.")
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 440px;
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
  text-align: center;
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

input[type="email"],
input[type="password"] {
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
  margin-top: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

.footer-link {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.footer-link a {
  color: #22d3ee;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
}

.footer-link a:hover {
  text-decoration: underline;
}
</style>
