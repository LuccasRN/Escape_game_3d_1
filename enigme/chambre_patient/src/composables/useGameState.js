import { ref, reactive } from 'vue'

const showComputer = ref(false)
const showCodeBox = ref(false)
const showPlaquette = ref(false)
const currentPlaqueIndex = ref(0)

const discoveredComputer = ref(false)
const discoveredBox = ref(false)
const unlockedPlaques = reactive([false, false, false, false])

const boxUnlocked = ref(false)
const computerCompleted = ref(false)
const gamePassed = ref(false)

function unlockPlaque(index) {
  if (index >= 0 && index < unlockedPlaques.length) {
    unlockedPlaques[index] = true
  }
}

function unlockedPlaquesCount() {
  return unlockedPlaques.filter(Boolean).length
}

export function useGameState() {
  return {
    showComputer,
    showCodeBox,
    showPlaquette,
    currentPlaqueIndex,
    discoveredComputer,
    discoveredBox,
    unlockedPlaques,
    boxUnlocked,
    computerCompleted,
    gamePassed,
    unlockPlaque,
    unlockedPlaquesCount,
  }
}
