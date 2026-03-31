import { reactive } from 'vue';
import confetti from 'canvas-confetti';
import { notifyEnigmaCompleted } from '../../../../Interface_utilisateur_front/src/utils/enigme-completion';

export const gameState = reactive({
  isStarted: true,
  showChoiceOverlay: false,
  discoveredBouton: false,
  gamePassed: false,
  gameOver: false,
  choiceMessage: ''
});

export function startGame() {
  gameState.isStarted = true;
}

export function openChoice() {
  gameState.showChoiceOverlay = true;
}

export function closeChoice() {
  gameState.showChoiceOverlay = false;
}

export function triggerConfetti() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 50 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
  }, 250);
}

export function makeChoice(answer) {
  if (answer === 'Dr Deckard') {
    gameState.gamePassed = true;
    gameState.showChoiceOverlay = false;
    gameState.choiceMessage = 'Bonne réponse. Vous avez découvert la vérité sur la mort de Mme Calvin. Affaire classée.';
    triggerConfetti();

    // ✅ Notifier le dashboard parent — succès enigme 5
    notifyEnigmaCompleted(true, 5);
  } else {
    gameState.gameOver = true;
    gameState.showChoiceOverlay = false;
    gameState.choiceMessage = 'Mauvaise conclusion. Emma est une intelligence artificielle sous la direction du Dr Deckard... Vous vous êtes trompé de cible !';

    // ✅ Notifier le dashboard parent — échec
    notifyEnigmaCompleted(false, 5);
  }
}

export function useGameState() {
  return {
    gameState,
    startGame,
    openChoice,
    closeChoice,
    makeChoice,
  }
}