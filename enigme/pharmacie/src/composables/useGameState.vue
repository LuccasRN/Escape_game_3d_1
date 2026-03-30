<script>
import { ref, reactive } from 'vue'

// ─── Shared reactive game state (singleton via module scope) ───        
const isComputerUIOpen = ref(false)
const isComputerUnlocked = ref(false)
const showBearInfo = ref(false)
const showMiniGame = ref(false)
const showMedicineInfo = ref(false)
const showTablesModal = ref(false)
const currentMedicineName = ref('')
const discoveredClues = reactive([])
const gameCompleted = ref(false)
const validationMessage = ref('')
const validationSuccess = ref(false)

function discoverClue(id) {
  if (!discoveredClues.includes(id)) {
    discoveredClues.push(id)
  }
}

function resetGame() {
  isComputerUIOpen.value = false
  isComputerUnlocked.value = false
  showBearInfo.value = false
  showMiniGame.value = false
  showMedicineInfo.value = false
  showTablesModal.value = false
  currentMedicineName.value = ''
  discoveredClues.splice(0, discoveredClues.length)
  gameCompleted.value = false
  validationMessage.value = ''
  validationSuccess.value = false
}

export function useGameState() {
  return {
    isComputerUIOpen,
    isComputerUnlocked,
    showBearInfo,
    showMiniGame,
    showMedicineInfo,
    showTablesModal,
    currentMedicineName,
    discoveredClues,
    gameCompleted,
    validationMessage,
    validationSuccess,
    discoverClue,
    resetGame,
  }
}
</script>