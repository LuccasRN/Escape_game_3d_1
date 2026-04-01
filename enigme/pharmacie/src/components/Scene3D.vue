<template>
  <div class="scene-wrapper">
    <div ref="containerRef" class="scene3d-container"></div>
    <CapybaraLoader v-if="isLoading" :progress="loadingProgress" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import CapybaraLoader from './CapybaraLoader.vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { useGameState } from '@/composables/useGameState.vue'

const containerRef = ref(null)
const SKY_COLOR = 0x87ceeb

const {
  isComputerUIOpen,
  showBearInfo,
  showMiniGame,
  showMedicineInfo,
  showTablesModal,
  currentMedicineName,
  gameCompleted,
  discoverClue,
  discoveredClues,
} = useGameState()

// Variables Three.js
const isLoading = ref(true)
const loadingProgress = ref(0)
let renderer, scene, camera, controls
let raycaster, pointer
let animationId
const interactiveObjects = []
let rewardMesh = null

// Objets interactifs
function isInteractiveName(name) {
  if (!name) return false
  const n = name.toLowerCase()
  return (
    n === 'cube064_1' ||
    n.startsWith('bear_doll') ||
    n.startsWith('box_of_medicine') ||
    n === 'bureau002'
  )
}

function collectInteractives(object) {
  object.traverse((child) => {
    if (child.isMesh && isInteractiveName(child.name)) {
      interactiveObjects.push(child)
    }
    if (child.isMesh && child.name === 'trousse_premier_secours') {
      rewardMesh = child
    }
  })
}

// Initialisation de la scène
function initScene() {
  const container = containerRef.value

  renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = false
  container.appendChild(renderer.domElement)

  scene = new THREE.Scene()
  scene.background = new THREE.Color(SKY_COLOR)

  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100)
  camera.position.set(8, 8, 8)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.target.set(0, 1.5, 0)
  controls.maxPolarAngle = Math.PI / 2
  controls.update()

  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()

  // Simple performant lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.8))
  const dir = new THREE.DirectionalLight(0xffffff, 1.2)
  dir.position.set(5, 10, 5)
  scene.add(dir)

  // Load model
  const draco = new DRACOLoader()
  draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
  const ktx2 = new KTX2Loader()
  ktx2.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/')
  ktx2.detectSupport(renderer)

  const loader = new GLTFLoader()
  loader.setDRACOLoader(draco)
  loader.setKTX2Loader(ktx2)

  const skyMat = new THREE.MeshBasicMaterial({ color: SKY_COLOR })

  loader.load(
    '/model/Pharmacie_test_texture_3_compressed.glb',
    (gltf) => {
      const model = gltf.scene
      model.traverse((child) => {
        if (!child.isMesh) return
        const n = child.name.toLowerCase()
        if (n === 'mur_exterieur001' || n === 'mur_exterieur002') {
          child.material = skyMat
        }
      })
      scene.add(model)
      collectInteractives(model)
      isLoading.value = false


      draco.dispose()
      ktx2.dispose()
    },
    (xhr) => { 
      if (xhr.total > 0) {
        loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
      } 
    },
    (err) => {
      console.error('Erreur chargement GLB:', err)
      isLoading.value = false
    }
  )

  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('click', onClick)
  window.addEventListener('resize', onResize)
  animate()
}

// Gestion du pointeur
function onPointerMove(e) {
  const r = renderer.domElement.getBoundingClientRect()
  pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
  pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
}

function onClick() {
  raycaster.setFromCamera(pointer, camera)

  const all = raycaster.intersectObjects(scene.children, true)
  if (all.length) {}

  const hits = raycaster.intersectObjects(interactiveObjects, false)
  if (!hits.length) return

  const name = hits[0].object.name.toLowerCase()

  if (name === 'cube064_1') {
    isComputerUIOpen.value = true
    discoverClue('computer')
  } else if (name.startsWith('bear_doll')) {
    if (discoveredClues.includes('bear')) {
      showBearInfo.value = true
    } else {
      showMiniGame.value = true
    }
  } else if (name.startsWith('box_of_medicine')) {
    currentMedicineName.value = hits[0].object.name
    showMedicineInfo.value = true
    discoverClue('medicine')
  } else if (name === 'bureau002') {
    showTablesModal.value = true
    discoverClue('tables')
  }
}

// Animation de victoire
let animatingWin = false
let winProgress = 0

watch(gameCompleted, (v) => { if (v) { animatingWin = true; winProgress = 0 } })

function updateWinAnimation() {
  if (!animatingWin || !rewardMesh) return
  winProgress += 0.005
  if (winProgress >= 1) { animatingWin = false; return }
  const t = new THREE.Vector3()
  rewardMesh.getWorldPosition(t)
  camera.position.lerp(t.clone().add(new THREE.Vector3(2, 2, 3)), 0.02)
  controls.target.lerp(t, 0.02)
}

// Redimensionnement──
function onResize() {
  const c = containerRef.value
  if (!c) return
  camera.aspect = c.clientWidth / c.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(c.clientWidth, c.clientHeight)
}

// Boucle de rendu
function animate() {
  animationId = requestAnimationFrame(animate)
  controls.update()
  updateWinAnimation()
  renderer.render(scene, camera)
}

// Cycle de vie
onMounted(initScene)
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  renderer.domElement.removeEventListener('pointermove', onPointerMove)
  renderer.domElement.removeEventListener('click', onClick)
  window.removeEventListener('resize', onResize)
  renderer.dispose()
})
</script>

<style scoped>
.scene-wrapper { width: 100%; height: 100vh; position: relative; }
.scene3d-container { width: 100%; height: 100vh; overflow: hidden; display: block; }
</style>
