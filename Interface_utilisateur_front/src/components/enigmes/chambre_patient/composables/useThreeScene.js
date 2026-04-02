import { ref, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'
import { useGameState } from '@/composables/useGameState.js'

const SKY_COLOR = 0x87ceeb

// Mapping strict des interactions
const PLAQUE_NAME_TO_INDEX = {
	'defaultmaterial001': 0,
	'plane_2': 1,
	'cube014_3': 2,
	'uploads_files_4069531_hospital+bed_7': 3,
}

function resolveInteraction(mesh) {
	let obj = mesh
	while (obj) {
		const name = (obj.name || '').toLowerCase()

		if (name === 'keyboard') return { type: 'computer', plaqueIndex: null }
		if (name === 'monitor_monitor_0') return { type: 'box', plaqueIndex: null }
		if (name === 'obj3d66-395056-1-561_1') return { type: 'pathHint', plaqueIndex: null }

		if (Object.prototype.hasOwnProperty.call(PLAQUE_NAME_TO_INDEX, name)) {
			return { type: 'plaque', plaqueIndex: PLAQUE_NAME_TO_INDEX[name] }
		}

		obj = obj.parent
	}
	return { type: null, plaqueIndex: null }
}

export function useThreeScene(containerRef) {
	const isLoading = ref(true)
	const loadingProgress = ref(0)

	let renderer, scene, camera, controls
	let raycaster, pointer
	let animationId
	let roomBounds = null

	const moveSpeed = 0.08
	const verticalSpeed = 0.06
	const keys = {
		forward: false,
		backward: false,
		left: false,
		right: false,
		up: false,
		down: false,
	}

	const { showComputer, showCodeBox, showPlaquette, currentPlaqueIndex, showPathHint } = useGameState()
	const { discoveredComputer, discoveredBox, unlockPlaque } = useGameState()

	function init() {
		const container = containerRef.value
		if (!container) return

		renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		renderer.setSize(container.clientWidth, container.clientHeight)
		renderer.toneMapping = THREE.ACESFilmicToneMapping
		renderer.toneMappingExposure = 1.0
		renderer.outputColorSpace = THREE.SRGBColorSpace
		renderer.shadowMap.enabled = true
		renderer.shadowMap.type = THREE.PCFShadowMap
		container.appendChild(renderer.domElement)

		scene = new THREE.Scene()
		scene.background = new THREE.Color(SKY_COLOR)

		camera = new THREE.PerspectiveCamera(
			75,
			container.clientWidth / container.clientHeight,
			0.1,
			1000
		)
		camera.position.set(8, 8, 8)

		controls = new OrbitControls(camera, renderer.domElement)
		controls.enableDamping = true
		controls.dampingFactor = 0.08
		controls.enablePan = false
		controls.enableZoom = false
		controls.target.set(0, 1.5, 0)
		controls.maxPolarAngle = Math.PI / 2
		controls.minPolarAngle = Math.PI * 0.15
		controls.update()

		raycaster = new THREE.Raycaster()
		pointer = new THREE.Vector2()

		scene.add(new THREE.AmbientLight(0xffffff, 0.6))
		const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
		dirLight.position.set(5, 10, 5)
		dirLight.castShadow = true
		scene.add(dirLight)

		loadModel()

		renderer.domElement.addEventListener('pointermove', onPointerMove)
		renderer.domElement.addEventListener('click', onClick)
		window.addEventListener('keydown', onKeyDown)
		window.addEventListener('keyup', onKeyUp)
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

				const box = new THREE.Box3().setFromObject(model)
				const margin = 0.35
				roomBounds = box.clone().expandByScalar(-margin)
				const center = box.getCenter(new THREE.Vector3())
				const size = box.getSize(new THREE.Vector3())
				camera.position.set(
					center.x - size.x * 0.35,
					center.y + size.y * 0.15,
					center.z + size.z * 0.35
				)
				controls.target.set(
					center.x + size.x * 0.2,
					center.y - size.y * 0.1,
					center.z - size.z * 0.2
				)
				controls.update()
				clampCameraToRoom()

				// Log tous les meshes (aide au mapping des noms)
				console.group('[Meshes chambre_patient]')
				model.traverse((c) => {
					if (c.isMesh) {
						const { type } = resolveInteraction(c)
						console.log(type ? `⭐ [${type}] ${c.name}` : c.name)
					}
				})
				console.groupEnd()

				isLoading.value = false
				dracoLoader.dispose()
				ktx2Loader.dispose()
			},
			(xhr) => {
				if (xhr.total) loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100)
			},
			(err) => {
				console.error('Erreur chargement GLB:', err)
				isLoading.value = false
			}
		)
	}

	function clamp(value, min, max) {
		return Math.max(min, Math.min(max, value))
	}

	function clampCameraToRoom() {
		if (!roomBounds) return

		const camPos = camera.position
		camPos.x = clamp(camPos.x, roomBounds.min.x, roomBounds.max.x)
		camPos.y = clamp(camPos.y, roomBounds.min.y + 1.2, roomBounds.max.y - 0.15)
		camPos.z = clamp(camPos.z, roomBounds.min.z, roomBounds.max.z)

		// On garde le même offset camera -> target pour la rotation OrbitControls.
		const offset = new THREE.Vector3().subVectors(controls.target, camera.position)
		controls.target.copy(camPos).add(offset)
	}

	function onKeyDown(event) {
		switch (event.code) {
			case 'KeyW':
			case 'KeyZ':
			case 'ArrowUp':
				keys.forward = true
				event.preventDefault()
				break
			case 'KeyS':
			case 'ArrowDown':
				keys.backward = true
				event.preventDefault()
				break
			case 'KeyA':
			case 'KeyQ':
			case 'ArrowLeft':
				keys.left = true
				event.preventDefault()
				break
			case 'KeyD':
			case 'ArrowRight':
				keys.right = true
				event.preventDefault()
				break
			case 'Space':
				keys.up = true
				event.preventDefault()
				break
			case 'ShiftLeft':
			case 'ShiftRight':
				keys.down = true
				break
		}
	}

	function onKeyUp(event) {
		switch (event.code) {
			case 'KeyW':
			case 'KeyZ':
			case 'ArrowUp':
				keys.forward = false
				break
			case 'KeyS':
			case 'ArrowDown':
				keys.backward = false
				break
			case 'KeyA':
			case 'KeyQ':
			case 'ArrowLeft':
				keys.left = false
				break
			case 'KeyD':
			case 'ArrowRight':
				keys.right = false
				break
			case 'Space':
				keys.up = false
				break
			case 'ShiftLeft':
			case 'ShiftRight':
				keys.down = false
				break
		}
	}

	function updateMovement() {
		if (!camera || !controls) return

		const move = new THREE.Vector3()
		const forward = new THREE.Vector3()
		camera.getWorldDirection(forward)
		forward.y = 0
		if (forward.lengthSq() > 0) forward.normalize()

		const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize()

		if (keys.forward) move.add(forward)
		if (keys.backward) move.addScaledVector(forward, -1)
		if (keys.right) move.add(right)
		if (keys.left) move.addScaledVector(right, -1)

		if (move.lengthSq() > 0) {
			move.normalize().multiplyScalar(moveSpeed)
			camera.position.add(move)
			controls.target.add(move)
		}

		if (keys.up) {
			camera.position.y += verticalSpeed
			controls.target.y += verticalSpeed
		}
		if (keys.down) {
			camera.position.y -= verticalSpeed
			controls.target.y -= verticalSpeed
		}

		clampCameraToRoom()
	}

	// Gestion du pointeur
	function onPointerMove(e) {
		const r = renderer.domElement.getBoundingClientRect()
		pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
		pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1

		if (scene) {
			raycaster.setFromCamera(pointer, camera)
			const hits = raycaster.intersectObjects(scene.children, true)
			const interaction = hits.length ? resolveInteraction(hits[0].object) : { type: null }
			renderer.domElement.style.cursor =
				interaction.type ? 'pointer' : 'default'
		}
	}

	// Gestion du clic──
	function onClick() {
		raycaster.setFromCamera(pointer, camera)
		const hits = raycaster.intersectObjects(scene.children, true)
		if (!hits.length) return
		const obj = hits[0].object
		
		console.log('Objet cliqué dans la chambre :', obj.name)

		const { type, plaqueIndex } = resolveInteraction(obj)
		if (type === 'computer') {
			discoveredComputer.value = true
			showComputer.value = true
		} else if (type === 'box') {
			discoveredBox.value = true
			showCodeBox.value = true
		} else if (type === 'pathHint') {
			showPathHint.value = true
		} else if (type === 'plaque') {
			const idx = plaqueIndex ?? 0
			unlockPlaque(idx)
			currentPlaqueIndex.value = idx
			showPlaquette.value = true
		}
	}

	function onResize() {
		const c = containerRef.value
		if (!c) return
		camera.aspect = c.clientWidth / c.clientHeight
		camera.updateProjectionMatrix()
		renderer.setSize(c.clientWidth, c.clientHeight)
	}

	function animate() {
		animationId = requestAnimationFrame(animate)
		updateMovement()
		controls.update()
		renderer.render(scene, camera)
	}

	function dispose() {
		cancelAnimationFrame(animationId)
		if (renderer) {
			renderer.domElement.removeEventListener('pointermove', onPointerMove)
			renderer.domElement.removeEventListener('click', onClick)
		}
		window.removeEventListener('keydown', onKeyDown)
		window.removeEventListener('keyup', onKeyUp)
		window.removeEventListener('resize', onResize)
		if (renderer) renderer.dispose()
	}

	onBeforeUnmount(dispose)

	return { init, isLoading, loadingProgress }
}
