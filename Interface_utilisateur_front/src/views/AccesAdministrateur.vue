<template>
  <div class="glass-panel form-container">
    <div class="icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    </div>
    <h2>Accès Administrateur</h2>
    <p class="subtitle">Connexion sécurisée</p>

    <div class="security-banner">
      <div class="banner-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </div>
      <div class="banner-text">
        <strong>Connexion sécurisée</strong>
        <p>Vos données sont protégées par chiffrement. Accès réservé au personnel autorisé.</p>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label>Email</label>
        <div class="input-with-icon">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <input type="email" v-model="email" placeholder="Entrez votre email admin" required />
        </div>
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <div class="input-with-icon">
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <input type="password" v-model="password" placeholder="Entrez le mot de passe" required />
        </div>
      </div>

      <button type="submit" class="submit-btn">Se connecter</button>
    </form>
    
    <p class="footer-note">Accès réservé au personnel administratif</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/api'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMsg.value = ''
  loading.value = true
  try {
    const response = await authService.loginAdmin(email.value, password.value)
    if (response.success) {
      router.push('/dashboard-admin')
    }
  } catch (error) {
    errorMsg.value = error.message || 'Accès refusé.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
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
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
}

.security-banner {
  background: rgba(96, 165, 250, 0.1);
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
}

.banner-icon {
  margin-top: 0.125rem;
}

.banner-text strong {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.banner-text p {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
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

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: var(--color-text-muted);
}

.input-with-icon input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: var(--glass-input-bg);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.input-with-icon input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.input-with-icon input:focus {
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:active {
  transform: translateY(0);
}

.footer-note {
  margin-top: 1.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
