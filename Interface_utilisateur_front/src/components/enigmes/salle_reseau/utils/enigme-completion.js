/**
 * enigme-completion.js
 * 
 * Utilitaire partagé pour notifier le dashboard parent
 * quand une enigme est terminée (succès ou échec).
 * 
 * à€ importer dans chaque App.vue des enigmes.
 * 
 * Usage:
 *   import { notifyEnigmaCompleted } from '@/utils/enigme-completion.js'
 *   notifyEnigmaCompleted(true)   // succès
 *   notifyEnigmaCompleted(false)  // échec
 */

/**
 * Envoie un postMessage au parent (EnigmeBridge.vue dans le dashboard)
 * pour signaler la fin de l'enigme.
 * 
 * @param {boolean} success - true si l'enigme est réussie
 * @param {number|null} enigmaId - ID de l'enigme (optionnel, récupéré depuis window)
 */
export function notifyEnigmaCompleted(success = true, enigmaId = null) {
  const id = enigmaId || window.enigmaId || null
  const timeSeconds = getTimerSeconds()

  const message = {
    type: 'ENIGMA_COMPLETED',
    enigmaId: id,
    success: success,
    timeSeconds: timeSeconds,
  }

  // Envoyer au parent (si dans un iframe)
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(message, '*')
  }

  // Stocker dans localStorage pour récupération
  localStorage.setItem('lastEnigmaResult', JSON.stringify({
    ...message,
    timestamp: Date.now(),
  }))

  console.log('[Enigme] Résultat envoyé:', message)
}

/**
 * Récupère le nombre de secondes depuis le timer global
 */
function getTimerSeconds() {
  if (window.getTimerValue) {
    const timeStr = window.getTimerValue() // format "MM:SS"
    const parts = timeStr.split(':')
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1])
    }
  }
  // Fallback: calculer depuis le localStorage
  const startTime = localStorage.getItem('enigmaStartTime')
  if (startTime) {
    return Math.floor((Date.now() - parseInt(startTime)) / 1000)
  }
  return 0
}

