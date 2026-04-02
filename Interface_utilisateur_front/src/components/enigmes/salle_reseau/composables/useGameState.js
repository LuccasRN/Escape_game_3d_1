import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import { notifyEnigmaCompleted } from '../utils/enigme-completion.js'

export function useGameState() {
  const showIntro = ref(true)
  const isWifiConnected = ref(false)
  const isSafeOpened = ref(false)
  const notification = ref(null)
  const gamePassed = ref(false)
  const routerHintActive = ref(false)

  function handleHintShown(hint) {
    if (hint === 'Rallume le routeur') {
      routerHintActive.value = true
      setTimeout(() => {
        routerHintActive.value = false
      }, 5000)
    }
  }

  function finishIntro() {
    showIntro.value = false
  }

  const showOS = ref(false)
  const activeWindow = ref(null)

  const activeWindowTitle = computed(() => {
    if (activeWindow.value === 'documents') return "C:\\\\Users\\\\Admin\\\\Documents"
    if (activeWindow.value === 'network') return "Réseau Local"
    if (activeWindow.value === 'system') return "Propriétés Système"
    if (activeWindow.value === 'questionnaire') return "Clôture Enquête"
    if (activeWindow.value === 'secret_file') return "\\\\\\\\Serveur_Admin\\\\Fichiers_Secrets"
    return ""
  })

  function openWindow(win) { activeWindow.value = win }
  function closeWindow() { activeWindow.value = null }

  const showSafeLock = ref(false)
  const safeCode = ref("")
  const safeInput = ref("")

  function triggerConfetti() {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) return clearInterval(interval)
      const particleCount = 50 * (timeLeft / duration)
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }))
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }))
    }, 250)
  }

  function showNotif(msg, time = 4000) {
    notification.value = msg
    setTimeout(() => { notification.value = null }, time)
  }

  function initSafe() {
    safeCode.value = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  }
  initSafe()

  function handleWifiConnected() {
    if (isWifiConnected.value) return
    isWifiConnected.value = true
    showNotif('<strong>Routeur connecté.</strong>', 6000)
  }

  function handleMonitorClick() { showOS.value = true }

  const showAutopsyReport = ref(false)
  const answer1 = ref("")
  const answer2 = ref("")

  function checkAnswers() {
    const ans1 = answer1.value.toLowerCase().trim()
    const ans2 = answer2.value.toLowerCase().trim()

    const q1Correct = ans1.includes("allergique") && ans1.includes("cortisone")
    const q3Correct = ans2.includes("bactérienne") && (ans2.includes("pneumopathie") || ans2.includes("pneumonie"))

    if (q1Correct && q3Correct) {
      gamePassed.value = true
      triggerConfetti()
      closeWindow()
      showOS.value = false

      // ✅ Notifier le dashboard parent — succès enigme 4
      notifyEnigmaCompleted(true, 4)
    } else {
      showNotif("Réponse(s) incorrecte(s). Veuillez vérifier le rapport d'autopsie.", 3000)
    }
  }

  function handleSafeClick() {
    if (isSafeOpened.value) {
      showAutopsyReport.value = true
      return
    }
    showSafeLock.value = true
    safeInput.value = ""
  }

  function pressPad(num) {
    if (safeInput.value.length < 4) safeInput.value += num.toString()
  }

  function clearPad() { safeInput.value = "" }

  function checkSafeCode() {
    if (safeInput.value === safeCode.value) {
      isSafeOpened.value = true
      showSafeLock.value = false
      showNotif("Code valide. Ouverture du coffre-fort.", 5000)
    } else {
      showNotif("Code PIN erroné", 2000)
      clearPad()
    }
  }

  return {
    showIntro, finishIntro,
    isWifiConnected, isSafeOpened, notification, gamePassed,
    routerHintActive,
    showOS, activeWindow, activeWindowTitle,
    showSafeLock, safeCode, safeInput,
    showAutopsyReport, answer1, answer2,
    openWindow, closeWindow, showNotif,
    handleWifiConnected, handleMonitorClick, handleSafeClick, handleHintShown,
    checkAnswers, pressPad, clearPad, checkSafeCode, triggerConfetti,
  }
}
