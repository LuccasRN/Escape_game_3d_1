import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function useThreeScene(canvasRef, emit) {
  // State
  const isNightMode = ref(false)
  const isLoading = ref(true)
  const loadingProgress = ref(0)
  let scene, camera, renderer, controls
  let ambientLight, directionalLight, deskLight, catLight, windowLight
  let isDeskLightOn = true
  let isCatLightOn = true
  const modelLights = []
  const nightLights = []
  let computerObject = null
  let serverObject = null
  let dogObject = null
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()
  let animationId = null

  // Keys state
  const keys = {
    forward: false, backward: false,
    left: false, right: false,
    up: false, down: false
  }
  const moveSpeed = 0.15

  function init() {
    const canvas = canvasRef.value
    if (!canvas) return

    // Scene
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB)

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(8, 8, 8)
    camera.lookAt(0, 0, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Controls
    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minAzimuthAngle = 0
    controls.maxAzimuthAngle = Math.PI / 2
    controls.maxPolarAngle = Math.PI / 2

    // Lights
    setupLights()

    // Loaders
    loadModel(renderer)

    // Events
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    canvas.addEventListener('click', onMouseClick)

    // Render loop
    render()
  }

  function setupLights() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    directionalLight.shadow.bias = -0.001
    scene.add(directionalLight)

    windowLight = new THREE.PointLight(0xffffff, 40, 40)
    windowLight.position.set(1, 2.5, -4)
    scene.add(windowLight)

    deskLight = new THREE.PointLight(0xffffff, 20, 20)
    deskLight.position.set(-5.3, 2.5, 1)
    scene.add(deskLight)

    catLight = new THREE.PointLight(0xffffff, 5, 5)
    catLight.position.set(7.5, 4, -2.5)
    scene.add(catLight)

    // Night mode lights
    const lightPositions = [
      { x: -2, y: 2.8, z: 0, intensity: 15, distance: 8, color: 0xffcc66 },
      { x: 0, y: 2.8, z: 0, intensity: 15, distance: 8, color: 0xffcc66 },
      { x: 2, y: 2.8, z: 0, intensity: 15, distance: 8, color: 0xffcc66 },
      { x: -1.5, y: 1.2, z: 1.5, intensity: 20, distance: 6, color: 0xffeedd },
      { x: 3, y: 2, z: 0, intensity: 25, distance: 8, color: 0xffddaa },
      { x: 3.5, y: 1, z: 1, intensity: 20, distance: 6, color: 0xffeedd },
      { x: 0, y: 1.5, z: 2, intensity: 10, distance: 8, color: 0xffffff },
    ]
    lightPositions.forEach((pos) => {
      const light = new THREE.PointLight(pos.color, 0, pos.distance)
      light.position.set(pos.x, pos.y, pos.z)
      scene.add(light)
      nightLights.push({ light, intensity: pos.intensity })
    })
  }

  function loadModel(renderer) {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.183.1/examples/jsm/libs/basis/')
    ktx2Loader.detectSupport(renderer)

    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.setKTX2Loader(ktx2Loader)

    gltfLoader.load(
      '/enigmes/bureau/model/ptut_server_compressed.glb',
      (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
          const name = child.name.toLowerCase()
          if (name.includes('computer') || name.includes('ordinateur') || name.includes('pc') || name.includes('ecran') || name.includes('screen') || name.includes('monitor')) {
            computerObject = child
            console.log('Computer object found:', child.name)
          }
          if (name.includes('server') || name.includes('serveur') || name.includes('rack')) {
            serverObject = child
            console.log('Server object found:', child.name)
          }
          if (name === 'plane001') {
            dogObject = child
            console.log('Image object found:', child.name)
          }
          if (child.name === 'Plane017' || child.name === 'Plane.017' ||
            child.name === 'Plane021' || child.name === 'Plane.021') {
            child.material = new THREE.MeshBasicMaterial({ color: 0x87CEEB })
          }
        })
        scene.add(gltf.scene)
console.log('Model loaded and added to scene.', gltf.scene)

        // Fairy lights
        const fairyLightPositions = [
          { x: -1.35, y: 5.47, z: -2.83 },
          { x: 0, y: 5.47, z: -2.83 },
          { x: 1.435, y: 5.47, z: -2.83 },
          { x: 2.98, y: 5.47, z: -2.83 },
          { x: 4.48, y: 5.47, z: -2.83 },
          { x: 6.1, y: 5.5, z: -2.85 },
          { x: -6.07, y: 3.67, z: -1.77 },
          { x: -5.6, y: 3.75, z: -1.935 },
          { x: -5.15, y: 3.95, z: -2.1 },
          { x: -4.72, y: 4.2, z: -2.3 },
          { x: -3.78, y: 4.15, z: -2.8 },
          { x: -3.29, y: 3.86, z: -2.78 },
          { x: -2.8, y: 3.8, z: -2.85 },
          { x: -6.3, y: 3.97, z: -0.4 },
          { x: -6.4, y: 4.1, z: 0.095 },
          { x: -6.47, y: 4.4, z: 1.49 },
          { x: -6.4, y: 4.2, z: 1.95 },
          { x: -6.4, y: 3.9, z: 2.4 },
          { x: -6.4, y: 3.8, z: 2.9 },
          { x: -6.4, y: 3.8, z: 3.45 },
          { x: 6.95, y: 3, z: -2.8 },
          { x: 6.95, y: 0, z: -2.8 },
        ]
        fairyLightPositions.forEach((pos) => {
          const pointLight = new THREE.PointLight(0xffeeaa, 0, 3)
          pointLight.position.set(pos.x, pos.y, pos.z)
          scene.add(pointLight)
          modelLights.push(pointLight)
        })
        isLoading.value = false
      },
      (xhr) => {
        if (xhr.total > 0) {
          loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
        }
      },
      (error) => {
        console.error('Model loading error:', error)
        isLoading.value = false
      }
    )
  }

  function updateDeskLight() {
    if (!deskLight) return
    deskLight.intensity = isDeskLightOn ? (isNightMode.value ? 10 : 20) : 0
  }

  function updateCatLight() {
    if (!catLight) return
    catLight.intensity = isCatLightOn ? (isNightMode.value ? 10 : 20) : 0
  }

  function toggleNightMode() {
    isNightMode.value = !isNightMode.value
    if (isNightMode.value) {
      scene.background = new THREE.Color(0x0a0a1a)
      directionalLight.intensity = 0.02
      ambientLight.intensity = 0.15
      ambientLight.color.setHex(0x2a2a4a)
      nightLights.forEach((item) => { item.light.intensity = item.intensity })
      modelLights.forEach((light) => { light.intensity = 8 })
    } else {
      scene.background = new THREE.Color(0x87CEEB)
      directionalLight.intensity = 1
      ambientLight.intensity = 0.5
      ambientLight.color.setHex(0xffffff)
      nightLights.forEach((item) => { item.light.intensity = 0 })
      modelLights.forEach((light) => { light.intensity = 0 })
    }
    updateDeskLight()
    updateCatLight()
  }

  function setControlsEnabled(enabled) {
    if (controls) controls.enabled = enabled
  }

  // Click detection
  function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object
      console.log('Clicked on:', clickedObject.name)

      // Computer
      let current = clickedObject
      while (current) {
        const name = current.name.toLowerCase()
        if (name.includes('computer') || name.includes('ordinateur') || name.includes('pc') ||
          name.includes('ecran') || name.includes('screen') || name.includes('monitor')) {
          emit('object-click', 'computer')
          return
        }
        current = current.parent
      }
      if (computerObject && (clickedObject === computerObject || clickedObject.parent === computerObject)) {
        emit('object-click', 'computer')
        return
      }

      // Desk light
      if (clickedObject.name.toLowerCase().includes('tablelight2')) {
        isDeskLightOn = !isDeskLightOn
        updateDeskLight()
      }

      // Cat light
      if (clickedObject.name.toLowerCase().includes('torus') || clickedObject.name.toLowerCase().includes('sphere003')) {
        isCatLightOn = !isCatLightOn
        updateCatLight()
      }

      // Dog picture
      if (clickedObject.name.toLowerCase() === 'plane003_2') {
        emit('object-click', 'dog')
      }

      // Draw picture
      if (clickedObject.name.toLowerCase() === 'béziercurve002_2') {
        emit('object-click', 'draw')
      }

      // Anniv picture
      if (clickedObject.name.toLowerCase() === 'sphere') {
        emit('object-click', 'anniv')
      }

      // Chest
      if (clickedObject.name.toLowerCase().includes('wooden') && clickedObject.name.toLowerCase().includes('chest')) {
        emit('object-click', 'chest')
      }

      // Server
      let serverCurrent = clickedObject
      let isServer = false
      while (serverCurrent) {
        const sname = serverCurrent.name.toLowerCase()
        if (sname.includes('server') || sname.includes('serveur') || sname.includes('rack')) {
          isServer = true
          break
        }
        serverCurrent = serverCurrent.parent
      }
      if (isServer || (serverObject && (clickedObject === serverObject || clickedObject.parent === serverObject))) {
        emit('object-click', 'server')
      }

      // Skeleton
      if (clickedObject.name.toLowerCase() === 'skeleton003') {
        emit('object-click', 'skeleton')
      }
    }
  }

  // Keyboard handlers
  function onKeyDown(event) {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return
    switch (event.code) {
      case 'z': case 'w':  case 'arrowup': keys.forward = true; break
      case 's': case 'arrowdown': keys.backward = true; break
      case 'q': case 'a':  case 'arrowleft': keys.left = true; break
      case 'd': case 'arrowright': keys.right = true; break
      case ' ': keys.up = true; break
    }
  }

  function onKeyUp(event) {
    switch (event.code) {
      case 'z': case 'w':  case 'arrowup': keys.forward = false; break
      case 's': case 'arrowdown': keys.backward = false; break
      case 'q': case 'a':  case 'arrowleft': keys.left = false; break
      case 'd': case 'arrowright': keys.right = false; break
      case ' ': keys.up = false; break
    }
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function render() {
    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    const right = new THREE.Vector3()
    right.crossVectors(direction, camera.up).normalize()

    if (keys.forward) {
      camera.position.addScaledVector(direction, moveSpeed)
      controls.target.addScaledVector(direction, moveSpeed)
    }
    if (keys.backward) {
      camera.position.addScaledVector(direction, -moveSpeed)
      controls.target.addScaledVector(direction, -moveSpeed)
    }
    if (keys.left) {
      camera.position.addScaledVector(right, -moveSpeed)
      controls.target.addScaledVector(right, -moveSpeed)
    }
    if (keys.right) {
      camera.position.addScaledVector(right, moveSpeed)
      controls.target.addScaledVector(right, moveSpeed)
    }
    if (keys.up) {
      camera.position.y += moveSpeed
      controls.target.y += moveSpeed
    }

    controls.update()
    renderer.render(scene, camera)
    animationId = window.requestAnimationFrame(render)
  }

  function dispose() {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    const canvas = canvasRef.value
    if (canvas) canvas.removeEventListener('click', onMouseClick)
    if (renderer) renderer.dispose()
  }

  return {
    isNightMode,
    isLoading,
    loadingProgress,
    init,
    dispose,
    toggleNightMode,
    setControlsEnabled,
  }
}
