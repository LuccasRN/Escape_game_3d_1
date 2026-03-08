import { ref, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'

const SKY_COLOR = 0x87ceeb

export function useThreeScene(containerRef) {
  const isLoading = ref(true)
  const loadingProgress = ref(0)

  let renderer, scene, camera, controls
  let raycaster, pointer
  let animationId

  function init() {
    const container = containerRef.value
    if (!container) return

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    container.appendChild(renderer.domElement)

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(SKY_COLOR)

    // Camera
    camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.set(8, 8, 8)

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.target.set(0, 1.5, 0)
    controls.maxPolarAngle = Math.PI / 2
    controls.update()

    // Raycaster
    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 10, 5)
    dirLight.castShadow = true
    scene.add(dirLight)

    // Load model with Draco
    loadModel()

    // Events
    renderer.domElement.addEventListener('pointermove', onPointerMove)
    renderer.domElement.addEventListener('click', onClick)
    window.addEventListener('resize', onResize)

    animate()
  }

  function loadModel() {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.183.1/examples/jsm/libs/basis/')
    ktx2Loader.detectSupport(renderer)

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)
    loader.setKTX2Loader(ktx2Loader)

    loader.load(
      '/model/chambre_patient.glb',
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        scene.add(model)

        // Place camera inside the room — wide angle view of the whole room
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        camera.position.set(
          center.x - size.x * 0.35,
          center.y + size.y * 0.15,
          center.z + size.z * 0.35
        )
        controls.target.set(center.x + size.x * 0.2, center.y - size.y * 0.1, center.z - size.z * 0.2)
        controls.update()

        console.log('Modèle chargé — centre:', center, 'taille:', size)

        isLoading.value = false
        dracoLoader.dispose()
        ktx2Loader.dispose()
      },
      (xhr) => {
        if (xhr.total) {
          loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
        }
      },
      (err) => {
        console.error('Erreur chargement modèle GLB:', err)
        isLoading.value = false
      }
    )
  }

  // Pointer
  function onPointerMove(e) {
    const r = renderer.domElement.getBoundingClientRect()
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1
  }

  function onClick() {
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(scene.children, true)
    if (hits.length) {
      console.log('Click:', hits[0].object.name)
    }
  }

  // Resize
  function onResize() {
    const c = containerRef.value
    if (!c) return
    camera.aspect = c.clientWidth / c.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(c.clientWidth, c.clientHeight)
  }

  // Render loop
  function animate() {
    animationId = requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
  }

  function dispose() {
    cancelAnimationFrame(animationId)
    if (renderer) {
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      renderer.domElement.removeEventListener('click', onClick)
    }
    window.removeEventListener('resize', onResize)
    if (renderer) renderer.dispose()
  }

  onBeforeUnmount(dispose)

  return {
    init,
    dispose,
    isLoading,
    loadingProgress,
  }
}
