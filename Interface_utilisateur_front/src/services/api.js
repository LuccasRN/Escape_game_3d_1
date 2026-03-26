// =========================================================
// api.js — Conexión con Spring Boot usando jQuery AJAX
// =========================================================

const API_BASE_URL = 'http://localhost:8080/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken()
  };
}

// ---- 1. AUTHENTIFICATION ----

export const authService = {

  register(userData) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          email: userData.email,
          password: userData.password,
          prenom: userData.prenom,
          nom: userData.nom,
          pseudo: userData.pseudo || userData.prenom,
          etablissement: userData.etablissement || '',
          dateNaissance: userData.dateNaissance
        }),
        success: function() {
          // Connexion automatique après inscription
          authService.login(userData.email, userData.password)
            .then(resolve)
            .catch(reject);
        },
        error: function(xhr) {
          reject(new Error(xhr.responseText || 'Erreur inscription'));
        }
      });
    });
  },

  login(email, password) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/auth/login',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email, password }),
        success: function(data) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', data.id);
          localStorage.setItem('userEmail', data.email);
          localStorage.setItem('userRole', data.role);
          resolve({ success: true, ...data });
        },
        error: function(xhr) {
          reject(new Error(xhr.responseText || 'Identifiants incorrects'));
        }
      });
    });
  },

  loginAdmin(email, password) {
    return new Promise((resolve, reject) => {
      authService.login(email, password)
        .then(data => {
          if (data.role !== 'ROLE_ADMIN') {
            authService.logout();
            reject(new Error('Accès refusé : rôle admin requis.'));
          } else {
            resolve({ success: true, ...data });
          }
        })
        .catch(reject);
    });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  },

  isAuthenticated() {
    return !!getToken();
  },

  getRole() {
    return localStorage.getItem('userRole');
  }
};

// ---- 2. DONNÉES ÉTUDIANT ----

export const studentService = {

  getDashboardData() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/player/dashboard',
        method: 'GET',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.status + ': ' + xhr.responseText));
        }
      });
    });
  },

  getMyStats() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/player/stats',
        method: 'GET',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.status + ': ' + xhr.responseText));
        }
      });
    });
  }
};

// ---- 3. GAME ----

export const gameService = {

  startGame() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/game/start',
        method: 'POST',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.responseText || 'Erreur démarrage partie'));
        }
      });
    });
  },

  validatePuzzle(puzzleId, answer) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/game/validate-puzzle',
        method: 'POST',
        contentType: 'application/json',
        headers: { 'Authorization': 'Bearer ' + getToken() },
        data: JSON.stringify({ puzzleId: String(puzzleId), answer }),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.responseText || 'Erreur validation'));
        }
      });
    });
  },

  endGame() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/game/end',
        method: 'POST',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.responseText || 'Erreur fin de partie'));
        }
      });
    });
  }
};

// ---- 4. ADMIN ----

export const adminService = {

  getDashboardStats() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/admin/dashboard-stats',
        method: 'GET',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.status + ': ' + xhr.responseText));
        }
      });
    });
  },

  getAllPlayers() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/admin/players',
        method: 'GET',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.status + ': ' + xhr.responseText));
        }
      });
    });
  },

  getPlayerStats(playerId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: API_BASE_URL + '/admin/player/' + playerId + '/stats',
        method: 'GET',
        headers: authHeaders(),
        success: resolve,
        error: function(xhr) {
          reject(new Error(xhr.status + ': ' + xhr.responseText));
        }
      });
    });
  }
};