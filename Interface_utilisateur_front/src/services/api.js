// =========================================================================
// 🚀 SERVICE D'API - CONNECTÉ AU BACKEND SPRING BOOT
// =========================================================================

const API_BASE_URL = 'http://localhost:8080/api';

// Helper pour les headers authentifiés
function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// ----------------------------------------------------
// 1. AUTHENTIFICATION
// ----------------------------------------------------
export const authService = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        prenom: userData.prenom,
        nom: userData.nom,
        pseudo: userData.pseudo || userData.prenom,
        etablissement: userData.etablissement || 'CHL',
        dateNaissance: userData.dateNaissance,
      }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Erreur lors de l'inscription");
    }
    const data = await response.json();
    // Stocker le nom pour l'affichage
    localStorage.setItem('registeredUserName', `${userData.prenom} ${userData.nom}`);
    return { success: true, ...data };
  },

  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Email ou mot de passe incorrect');
    }
    const data = await response.json();
    // Stocker le JWT et les infos utilisateur
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRole', data.role);
    return { success: true, ...data };
  },

  async loginAdmin(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error('Email ou mot de passe incorrect');
    }
    const data = await response.json();
    if (data.role !== 'ROLE_ADMIN') {
      throw new Error('Accès réservé aux administrateurs');
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('userRole', data.role);
    return { success: true, ...data };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('registeredUserName');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('escapeGlobalTimer');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getRole() {
    return localStorage.getItem('userRole');
  },
};

// ----------------------------------------------------
// 2. SERVICE JEU (Game Session + Puzzle)
// ----------------------------------------------------
export const gameService = {
  // Démarre une nouvelle session de jeu
  async startGame() {
    const response = await fetch(`${API_BASE_URL}/game/start`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Impossible de démarrer la partie');
    const data = await response.json();
    localStorage.setItem('sessionId', data.sessionId);
    return data;
  },

  // Valide la réponse d'un puzzle et enregistre l'attempt
  async validatePuzzle(enigmaId, answer) {
    const response = await fetch(`${API_BASE_URL}/game/validate-puzzle`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        puzzleId: String(enigmaId),
        answer: answer,
      }),
    });
    if (!response.ok) throw new Error('Erreur lors de la validation');
    return await response.json();
  },

  // Termine la session de jeu
  async endGame() {
    const response = await fetch(`${API_BASE_URL}/game/end`, {
      method: 'POST',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erreur lors de la fin de partie');
    localStorage.removeItem('sessionId');
    return await response.json();
  },
};

// ----------------------------------------------------
// 3. DONNÉES ÉTUDIANT (Dashboard & Stats)
// ----------------------------------------------------
export const studentService = {
  // Récupère la liste des enigmes avec leur statut (COMMENCER / VERROUILLÉ / RÉUSSI)
  async getDashboardData() {
    const response = await fetch(`${API_BASE_URL}/player/dashboard`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erreur lors du chargement du dashboard');
    return await response.json(); // List<EnigmaStatusDTO>
  },

  // Récupère les statistiques personnelles (radar chart)
  async getMyStats() {
    const response = await fetch(`${API_BASE_URL}/player/stats`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Erreur lors du chargement des stats');
    return await response.json(); // PlayerDetailDTO
  },
};

// ----------------------------------------------------
// 4. STATISTIQUES ADMINISTRATEUR
// ----------------------------------------------------
export const adminService = {
  async getGlobalStats() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Accès refusé');
    return await response.json();
  },

  async getAllPlayers() {
    const response = await fetch(`${API_BASE_URL}/admin/players`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Accès refusé');
    return await response.json();
  },

  async getPlayerDetails(playerId) {
    const response = await fetch(`${API_BASE_URL}/admin/player/${playerId}/stats`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Joueur non trouvé');
    return await response.json();
  },
};