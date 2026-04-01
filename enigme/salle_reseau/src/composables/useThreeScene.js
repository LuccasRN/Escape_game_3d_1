import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ref } from 'vue'

export function useThreeScene(container, props, emit) {
  const isLoading = ref(true)
  const loadingProgress = ref(0)

  let scene, camera, renderer, composer
  let orbitControls, dragControls
  let reqId
  let raycaster, mouse
  let interactableMeshes = []
  let objectsToDrag = []

  let wifiMesh = null
  let socketMesh = null
  let monitorMesh = null
  let safeMesh = null
  let safeDoorMesh = null
  let bloomPass

  const initThree = () => {
    if (!container.value) return

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x050510)
    scene.fog = new THREE.FogExp2(0x050510, 0.05)

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(7, 3, 0)

    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2))
    renderer.shadowMap.enabled = false
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.value.appendChild(renderer.domElement)

    const renderScene = new RenderPass(scene, camera)
    bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0.95
    bloomPass.strength = 0.2
    bloomPass.radius = 0.5

    composer = new EffectComposer(renderer)
    composer.addPass(renderScene)
    composer.addPass(bloomPass)

    orbitControls = new OrbitControls(camera, renderer.domElement)
    orbitControls.enableDamping = true
    orbitControls.dampingFactor = 0.05
    orbitControls.minDistance = 1
    orbitControls.maxDistance = 10
    orbitControls.target.set(0, 1, 0)

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0)
    scene.add(ambientLight)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 2.0)
    hemiLight.position.set(0, 10, 0)
    scene.add(hemiLight)

    const dirLightFront = new THREE.DirectionalLight(0xffffff, 2.0)
    dirLightFront.position.set(10, 10, 10)
    scene.add(dirLightFront)

    const dirLightBack = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLightBack.position.set(-10, 10, -10)
    scene.add(dirLightBack)

    // Lumière point ciblée pour déboucher le noir du coffre-fort (Position: -1.91, -1.45, 5.49)
    const safeLight = new THREE.PointLight(0xffffff, 20.0, 15)
    safeLight.position.set(-1.9, -0.5, 6.5)
    scene.add(safeLight)

    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)

    const ktx2Loader = new KTX2Loader()
    ktx2Loader.setTranscoderPath('/basis/')
    ktx2Loader.detectSupport(renderer)
    gltfLoader.setKTX2Loader(ktx2Loader)

    gltfLoader.load(
      '/model/reseau_st001_compressed.glb',
      (gltf) => {
        const model = gltf.scene
        model.traverse((child) => {
          if (child.isMesh) {
            const name = child.name.toLowerCase()
            interactableMeshes.push(child)

            if (name.includes('wifi')) wifiMesh = child
            if (name.includes('socket')) socketMesh = child
            if (name.includes('cylinder003_13')) monitorMesh = child
            if (name.includes('safe')) {
              safeMesh = child
              if (name.includes('door') || name.includes('porte')) safeDoorMesh = child
            }
          }
        })
        scene.add(model)
        postLoadSetup(true)
      },
      (xhr) => {
        if (xhr.total > 0) loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
      },
      (err) => {
        console.warn("Model non trouvé, génération factice", err)
        postLoadSetup(false)
      }
    )

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()
    window.addEventListener('resize', onWindowResize)
    window.addEventListener('click', onClick)

    animate()
  }

  function postLoadSetup(hasRealModel) {
    isLoading.value = false

    if (wifiMesh) {
      objectsToDrag.push(wifiMesh)
      dragControls = new DragControls(objectsToDrag, camera, renderer.domElement)

      dragControls.addEventListener('dragstart', function (event) {
        orbitControls.enabled = false
        if (event.object.material) event.object.material.emissiveIntensity = 1.0
      })

      dragControls.addEventListener('drag', function (event) {
        if (socketMesh) {
          const dist = event.object.position.distanceTo(socketMesh.position)
          if (dist < 1.0) {
            event.object.position.copy(socketMesh.position)
            event.object.position.z += 0.2
            emit('onWifiConnected')
            dragControls.enabled = false
            orbitControls.enabled = true
            if (event.object.material) event.object.material.emissive.setHex(0x00ff00)
          }
        }
      })

      dragControls.addEventListener('dragend', function (event) {
        orbitControls.enabled = true
        if (props.wifiConnected && event.object.material) {
          event.object.material.emissive.setHex(0x00ff00)
        } else if (event.object.material) {
          event.object.material.emissiveIntensity = 0.5
        }
      })
    }
  }

  function updateMonitorState(isConnected) {
    if (monitorMesh && monitorMesh.material) {
      if (isConnected) {
        monitorMesh.material.emissive.setHex(0x00ffff)
        monitorMesh.material.emissiveIntensity = 1.0
      } else {
        monitorMesh.material.emissive.setHex(0xff0000)
        monitorMesh.material.emissiveIntensity = 0.5
      }
    }
  }

  function openSafeDoor() {
    const target = safeDoorMesh || safeMesh
    if (target) {
      const startR = target.rotation.y
      const targetR = startR + Math.PI / 2
      const duration = 1000
      const startTime = performance.now()

      function animDoor(time) {
        const elaps = time - startTime
        const t = Math.min(elaps / duration, 1)
        target.rotation.y = startR + (targetR - startR) * t
        if (t < 1) requestAnimationFrame(animDoor)
      }
      requestAnimationFrame(animDoor)
    }
  }

  const onWindowResize = () => {
    if (!camera || !renderer || !composer) return
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  }

  const onClick = (event) => {
    if (!camera || !scene || !raycaster) return
    if (event.target.tagName !== 'CANVAS') return

    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouse.x = (x / rect.width) * 2 - 1;
    mouse.y = -(y / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(interactableMeshes, true)

    if (intersects.length > 0) {
      const clickedOb = intersects[0].object

      let current = clickedOb
      let clickedName = ""
      while (current && current !== scene) {
        clickedName += current.name.toLowerCase()
        current = current.parent
      }

      if (clickedName.includes('monitor') || clickedName.includes('cylinder003_13')) {
        emit('onMonitorClick')
      } else if (clickedName.includes('safe')) {
        emit('onSafeClick')
      }
    }
  }

  const animate = () => {
    reqId = requestAnimationFrame(animate)

    if (wifiMesh && wifiMesh.material) {
      if (props.wifiConnected) {
        wifiMesh.material.emissive.setHex(0x00ff00)
        wifiMesh.material.emissiveIntensity = 1.0
      } else if (props.routerHintActive && orbitControls && orbitControls.enabled) {
        const time = performance.now() * 0.005
        wifiMesh.material.emissive.setHex(0xffaa00)
        wifiMesh.material.emissiveIntensity = 0.2 + Math.abs(Math.sin(time)) * 0.8
      } else if (orbitControls && orbitControls.enabled) {
        wifiMesh.material.emissive.setHex(0x000000)
        wifiMesh.material.emissiveIntensity = 0.0
      } else if (orbitControls && !orbitControls.enabled) {
        wifiMesh.material.emissive.setHex(0xffffff)
      }
    }

    if (orbitControls) orbitControls.update()
    if (composer) {
      composer.render()
    } else if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }

  const cleanup = () => {
    if (reqId) cancelAnimationFrame(reqId)
    window.removeEventListener('resize', onWindowResize)
    window.removeEventListener('click', onClick)
    if (renderer) renderer.dispose()
  }

  return { isLoading, loadingProgress, initThree, cleanup, updateMonitorState, openSafeDoor }
}
