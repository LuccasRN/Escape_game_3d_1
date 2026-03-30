import { ref, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { openChoice } from '@/composables/useGameState.js'

const SKY_COLOR = 0x87ceeb

export function useThreeScene(containerRef) {
  const isLoading = ref(true)
  const loadingProgress = ref(0)

  let scene, camera, renderer, controls
  let reqId
  let raycaster, mouse
  let modelMeshes = []

  const keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false }
  const moveSpeed = 4.0
  const clock = new THREE.Clock()

  const init = () => {
    if (!containerRef.value) return

    scene = new THREE.Scene()
    scene.background = new THREE.Color(SKY_COLOR)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(1.5, 1.5, 1.5) 
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    containerRef.value.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    
    // limiter le zoom avec la molettre
    controls.minDistance = 0.1
    controls.maxDistance = 3.5 
    
    // empecher le déplacement clic droit 
    controls.enablePan = false
    
    // limiter l'angle pour ne pas passer sous le sol
    controls.maxPolarAngle = Math.PI / 2 + 0.1

    controls.target.set(0, 1.0, 0) 

    const ambientLight = new THREE.AmbientLight(0xffffff, 2)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
    directionalLight.position.set(5, 10, 5)
    scene.add(directionalLight)

    const gltfLoader = new GLTFLoader()
    
    // Draco Loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)

    // KTX2 Loader just in case
    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('/basis/')
    ktx2Loader.detectSupport(renderer)
    gltfLoader.setKTX2Loader(ktx2Loader)

    gltfLoader.load(
      '/model/reunion4_compressed.glb',
      (gltf) => {
        const model = gltf.scene
        scene.add(model)
        
        model.traverse((child) => {
          if (child.isMesh) {
            modelMeshes.push(child)
            // Useful for debugging names if needed
            // console.log(child.name)
          }
        })
        isLoading.value = false
      },
      (xhr) => {
        if (xhr.total > 0) {
          loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
        }
      },
      (error) => {
        console.error('Erreur chargement modele:', error)
        isLoading.value = false
      }
    )

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('click', onClick)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    animate()
  }

  const onWindowResize = () => {
    if (!camera || !renderer) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const onClick = (event) => {
    if (!camera || !scene || !raycaster) return
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(modelMeshes, false)

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object
      const name = clickedMesh.name
      console.log('Clicked mesh:', name)
      
      if (name === 'Circle001_1' || name === 'Circle001') {
        openChoice()
      }
    }
  }

  const onKeyDown = (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true
  }

  const onKeyUp = (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false
  }

  const handleMovement = (delta) => {
    if (!controls || !camera) return
    const speed = moveSpeed * delta
    
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(forward, camera.up).normalize()

    const moveVec = new THREE.Vector3()

    if (keys.w || keys.ArrowUp) moveVec.add(forward)
    if (keys.s || keys.ArrowDown) moveVec.sub(forward)
    if (keys.d || keys.ArrowRight) moveVec.add(right)
    if (keys.a || keys.ArrowLeft) moveVec.sub(right)

    if (moveVec.lengthSq() > 0) {
      moveVec.normalize().multiplyScalar(speed)
      
      const newPos = camera.position.clone().add(moveVec)
      
      
      newPos.x = THREE.MathUtils.clamp(newPos.x, -4.5, 4.5)
      newPos.z = THREE.MathUtils.clamp(newPos.z, -4.5, 4.5)
      newPos.y = camera.position.y

      const actualMoveVec = newPos.clone().sub(camera.position)

      camera.position.add(actualMoveVec)
      controls.target.add(actualMoveVec)
    }
  }

  const animate = () => {
    reqId = requestAnimationFrame(animate)
    const delta = clock.getDelta()
    
    handleMovement(delta)
    if (controls) {
      // Stocker l'ancienne position de la target et de la camera
      const oldTargetY = controls.target.y
      
      controls.update()
      
      // Bloquer la caméra pour qu'elle reste dans la salle
      let clampedY = THREE.MathUtils.clamp(camera.position.y, 0.5, 2.5) // plafond plus bas
      if (camera.position.y !== clampedY) {
         // Ajuster la cible aussi pour éviter que la caméra ne glisse
         const diff = clampedY - camera.position.y
         controls.target.y += diff
         camera.position.y = clampedY
      }

      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -4.5, 4.5)
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -4.5, 4.5)
    }
    if (renderer && scene && camera) renderer.render(scene, camera)
  }

  onBeforeUnmount(() => {
    if (reqId) cancelAnimationFrame(reqId)
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('click', onClick)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    if (renderer) renderer.dispose()
  })

  return {
    init,
    isLoading,
    loadingProgress
  }
}
