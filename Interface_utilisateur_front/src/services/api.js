// =========================================================================
// 🚀 SERVICE D'API - PRÊT POUR L'INTÉGRATION BACKEND
// =========================================================================
// Cher développeur Backend :
// Ce fichier centralise TOUS les appels de données de l'application (Auth, Stats, Admin).
// Pour connecter ton backend (Node.js/Express, Laravel, Django, etc.), 
// il te suffit de décommenter les appels fetch() et de remplacer nos Promesses
// simulées. AUCUN fichier .vue n'est à modifier ! 🎉
// =========================================================================

const API_BASE_URL = 'http://localhost:3000/api'; // ⚠️ Change ceci par ton URL d'API

// ----------------------------------------------------
// 1. AUTHENTIFICATION GENERALE
// ----------------------------------------------------
export const authService = {
  async register(userData) {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    /*
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Erreur lors de l\'inscription');
    return await response.json();
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    console.log("SIMULATION: Enregistrement envoyé au backend", userData);
    return new Promise(resolve => setTimeout(() => {
      // 🐛 Correction : Stockage local simulé pour que l'affichage sur le Dashboard fonctionne
      const fullName = `${userData.prenom} ${userData.nom}`;
      localStorage.setItem('registeredUserName', fullName);
      
      resolve({ success: true, user: userData, token: 'fake-jwt-token' });
    }, 800));
  },

  async login(email, password) {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    /*
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Mot de passe ou email incorrect');
    const data = await response.json();
    localStorage.setItem('token', data.token); // Stockage du JWT
    return data;
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    console.log("SIMULATION: Connexion Étudiant", { email });
    return new Promise((resolve, reject) => setTimeout(() => {
      if (email && password) resolve({ success: true, token: 'fake-jwt-token' });
      else reject(new Error("Email requis"));
    }, 800));
  },

  async loginAdmin(email, password) {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    // Idéalement sur la même route login mais avec vérification des rôles.
    /*
    const response = await fetch(`${API_BASE_URL}/admin/login`, { ... });
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    console.log("SIMULATION: Connexion Administrateur", { email });
    return new Promise(resolve => setTimeout(() => {
      resolve({ success: true, token: 'fake-admin-jwt' });
    }, 800));
  }
};

// ----------------------------------------------------
// 2. DONNÉES ÉTUDIANT (DASHBOARD & STATS)
// ----------------------------------------------------
export const studentService = {
  async getDashboardData() {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    /*
    const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await response.json();
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    return new Promise(resolve => setTimeout(() => {
      resolve({
        levels: [
          { id: 1, title: 'Salle de Réanimation', difficulty: 'Difficile', status: 'unlocked', link: '/salle-reanimation' },
          { id: 2, title: 'Bureau Médecin Chef', difficulty: 'Moyen', status: 'locked', link: '#' },
          { id: 3, title: 'Bloc Opératoire', difficulty: 'Extrême', status: 'locked', link: '#' }
        ]
      });
    }, 500));
  },

  async getMyStats() {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    /*
    const response = await fetch(`${API_BASE_URL}/student/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await response.json();
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    return new Promise(resolve => setTimeout(() => {
      resolve({ 
        kpis: { resolues: 1, totalTemps: 10.2, score: 95, erreurs: 2 },
        // Rajouter la donnée du radar et des barres via base de données ici...
      });
    }, 800));
  }
};

// ----------------------------------------------------
// 3. STATISTIQUES ADMINISTRATEUR
// ----------------------------------------------------
export const adminService = {
  async getAllUsers() {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    /*
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await response.json();
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    return new Promise(resolve => setTimeout(() => {
      resolve([
        { id: 1, initials: 'EB', name: 'Emma Bernard', date: '08/01/2026', email: 'emma.b@example.com', age: 23, progression: 5, time: 12.8, rate: 100, color: '#f472b6', barColor: '#ec4899', rateColor: '#4ade80' },
        { id: 2, initials: 'SD', name: 'Sophie Dubois', date: '10/01/2026', email: 'sophie.d@example.com', age: 22, progression: 5, time: 14.5, rate: 100, color: '#c084fc', barColor: '#a855f7', rateColor: '#4ade80' },
        { id: 3, initials: 'LD', name: 'Léa Durand', date: '10/01/2026', email: 'lea.d@example.com', age: 21, progression: 4, time: 19.1, rate: 80, color: '#d946ef', barColor: '#d946ef', rateColor: '#4ade80' },
        { id: 4, initials: 'LM', name: 'Lucas Martin', date: '12/01/2026', email: 'lucas.m@example.com', age: 21, progression: 4, time: 18.2, rate: 80, color: '#f472b6', barColor: '#f472b6', rateColor: '#4ade80' },
        { id: 5, initials: 'NM', name: 'Nathan Moreau', date: '12/01/2026', email: 'nathan.m@example.com', age: 23, progression: 5, time: 15.9, rate: 100, color: '#a855f7', barColor: '#a855f7', rateColor: '#4ade80' },
        { id: 6, initials: 'TP', name: 'Thomas Petit', date: '13/01/2026', email: 'thomas.p@example.com', age: 20, progression: 3, time: 22.5, rate: 60, color: '#c084fc', barColor: '#c084fc', rateColor: '#facc15' },
      ]);
    }, 500));
  },

  async getUserDetails(userId) {
    // === 🔗 CODE POUR TON VRAI BACKEND ===
    /*
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return await response.json();
    */

    // === 🛠️ SIMULATION TEMPORAIRE (À SUPPRIMER) ===
    return new Promise(resolve => setTimeout(() => {
      resolve({ id: userId, details: '...' });
    }, 500));
  }
};
