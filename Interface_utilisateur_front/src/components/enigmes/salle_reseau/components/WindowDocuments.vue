<template>
  <div class="empty-folder">
    <div class="empty-icon">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    </div>
    <h4>Dossier vide</h4>
    <p>Tous les fichiers ont été purgés selon le protocole de sécurité.</p>
    <div class="purge-badge">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      Purge automatique â€” 15/03/2026
    </div>
  </div>
</template>

<style scoped>
.empty-folder {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 100%;
  color: rgba(255, 255, 255, 0.3);
  text-align: center; padding: 40px;
}
.empty-icon {
  opacity: 0.15; margin-bottom: 16px;
}
.empty-folder h4 {
  margin: 0 0 8px;
  font-size: 0.9rem; font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.05em;
}
.empty-folder p {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.25);
  max-width: 280px; line-height: 1.5;
}
.purge-badge {
  margin-top: 20px;
  display: flex; align-items: center; gap: 6px;
  font-size: 0.6rem; font-weight: 600;
  color: rgba(255, 100, 100, 0.4);
  padding: 6px 12px; border-radius: 4px;
  background: rgba(255, 60, 60, 0.05);
  border: 1px solid rgba(255, 60, 60, 0.08);
  letter-spacing: 0.05em; text-transform: uppercase;
}
</style>

