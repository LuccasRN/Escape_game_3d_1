<template>
  <div class="minigame-overlay">
    <button class="minigame-close" @click="closeGame">✕</button>
    <canvas ref="canvasRef" :width="CANVAS_W" :height="CANVAS_H"></canvas>


    <div v-if="victory" class="victory-screen">
      <h2>Victoire !</h2>
      <p>Le pingouin gardien est vaincu.</p>
      <p class="victory-code">Un papier tombe de la peluche…</p>
      <button class="btn-continue" @click="$emit('victory')">Récupérer le papier</button>
    </div>


    <div v-if="defeated" class="defeat-screen">
      <h2>Défaite…</h2>
      <p>Le pingouin vous a terrassé.</p>
      <button class="btn-retry" @click="restartGame">Réessayer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { loadImage, SpriteAnimation } from '../composables/useSpriteEngine.vue'

const emit = defineEmits(['victory', 'close'])

// Constantes
const CANVAS_W = 1000
const CANVAS_H = 560
const GRAVITY = 0.6
const GROUND_Y = CANVAS_H - 40
const SCALE_BEAR = 4
const SCALE_PENGU = 1.5

const canvasRef = ref(null)
const victory = ref(false)
const defeated = ref(false)

// Audio
let battleMusic = null
let victoryMusic = null

function initAudio() {
  battleMusic = new Audio('/enigmes/pharmacie/music/05 - Battle 1.mp3')
  battleMusic.loop = true
  battleMusic.volume = 0.4
  victoryMusic = new Audio('/enigmes/pharmacie/music/06 - Victory!.mp3')
  victoryMusic.loop = false
  victoryMusic.volume = 0.5
}

function playBattleMusic() {
  if (battleMusic) {
    battleMusic.currentTime = 0
    battleMusic.play().catch(() => {})
  }
}

function stopBattleMusic() {
  if (battleMusic) {
    battleMusic.pause()
    battleMusic.currentTime = 0
  }
}

function playVictoryMusic() {
  if (victoryMusic) {
    victoryMusic.currentTime = 0
    victoryMusic.play().catch(() => {})
  }
}

function stopAllAudio() {
  stopBattleMusic()
  if (victoryMusic) {
    victoryMusic.pause()
    victoryMusic.currentTime = 0
  }
}

// Objets du jeu
const keys = {}
let animFrameId = null
let lastTime = 0
let gameRunning = false

// Sprites
let bearIdle, bearWalk
let penguIdle, penguMove, penguPeck, penguIce, penguRay, penguHurt
let fxIce

// Attack effect frames (individual images)
let attackFrames = []
const ATTACK_FRAME_COUNT = 4
const ATTACK_FRAME_DURATION = 70 // ms per frame

// Platforms
const platforms = [
  { x: 0, y: GROUND_Y, w: CANVAS_W, h: 40 },
  { x: 100, y: 410, w: 180, h: 16 },
  { x: 620, y: 390, w: 200, h: 16 },
  { x: 370, y: 290, w: 160, h: 16 },
]

// Player state
const player = {
  x: 100, y: GROUND_Y, vx: 0, vy: 0,
  w: 14 * SCALE_BEAR, h: 16 * SCALE_BEAR,
  onGround: false, facingRight: true,
  hp: 5, maxHp: 5,
  attacking: false, attackTimer: 0, attackCooldown: 0,
  invincible: false, invTimer: 0,
  hurtTimer: 0,
}

// Boss state
const boss = {
  x: 750, y: GROUND_Y, vx: 0, vy: 0,
  w: 40 * SCALE_PENGU, h: 45 * SCALE_PENGU,
  onGround: false, facingRight: false,
  hp: 20, maxHp: 20,
  state: 'idle',
  stateTimer: 0,
  attackCooldown: 0,
  phase: 1,
  hurtTimer: 0,
  invincible: false, invTimer: 0,
}

// Projectiles
let projectiles = []

// Chargement des sprites
async function loadAllSprites() {
  const [
    imgBearIdle, imgBearWalk,
    imgPenguIdle, imgPenguMove, imgPenguPeck, imgPenguIce, imgPenguRay, imgPenguHurt,
    imgFxIce,
    imgAtk1, imgAtk2, imgAtk3, imgAtk4,
  ] = await Promise.all([
    loadImage('/enigmes/pharmacie/bear/little-bear-idle.png'),
    loadImage('/enigmes/pharmacie/bear/little-bear-walk.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_idle.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_move.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_attack_peck.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_attack_ice.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_attack_ray.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_hurt.png'),
    loadImage('/enigmes/pharmacie/Pengu/pengu_fx_ice.png'),
    loadImage('/enigmes/pharmacie/attack/A200-1.png'),
    loadImage('/enigmes/pharmacie/attack/A200-2.png'),
    loadImage('/enigmes/pharmacie/attack/A200-3.png'),
    loadImage('/enigmes/pharmacie/attack/A200-4.png'),
  ])

  bearIdle = new SpriteAnimation(imgBearIdle, 1, 200)
  bearWalk = new SpriteAnimation(imgBearWalk, 4, 120)

  penguIdle = new SpriteAnimation(imgPenguIdle, 5, 160)
  penguMove = new SpriteAnimation(imgPenguMove, 8, 100)
  penguPeck = new SpriteAnimation(imgPenguPeck, 8, 80, false)
  penguIce = new SpriteAnimation(imgPenguIce, 8, 100, false)
  penguRay = new SpriteAnimation(imgPenguRay, 13, 80, false)
  penguHurt = new SpriteAnimation(imgPenguHurt, 4, 120, false)

  fxIce = new SpriteAnimation(imgFxIce, 14, 60)
  attackFrames = [imgAtk1, imgAtk2, imgAtk3, imgAtk4]
}

// Entrées clavier
function onKeyDown(e) {
  keys[e.code] = true
  e.preventDefault()
}
function onKeyUp(e) {
  keys[e.code] = false
  e.preventDefault()
}

// Détection de collisions
function rectOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

function resolveplatformCollisions(entity) {
  entity.onGround = false
  for (const p of platforms) {
    // Check if entity is falling onto platform
    const prevBottom = entity.y - entity.vy
    const curBottom = entity.y
    if (
      entity.vy >= 0 &&
      prevBottom <= p.y &&
      curBottom >= p.y &&
      entity.x + entity.w * 0.3 > p.x &&
      entity.x - entity.w * 0.3 < p.x + p.w
    ) {
      entity.y = p.y
      entity.vy = 0
      entity.onGround = true
    }
  }
}

// Mise à jour du joueur
function updatePlayer(dt) {
  const speed = 3.5
  let moving = false

  // Attack cooldown
  if (player.attackCooldown > 0) player.attackCooldown -= dt

  // Attack
  if ((keys['KeyE'] || keys['KeyX']) && player.attackCooldown <= 0 && !player.attacking) {
    player.attacking = true
    player.attackTimer = 300
    player.attackCooldown = 800
  }

  if (player.attacking) {
    player.attackTimer -= dt
    if (player.attackTimer <= 0) {
      player.attacking = false
    }
  }

  // Movement
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.vx = -speed
    player.facingRight = false
    moving = true
  } else if (keys['ArrowRight'] || keys['KeyD']) {
    player.vx = speed
    player.facingRight = true
    moving = true
  } else {
    player.vx = 0
  }

  // Jump
  if ((keys['Space'] || keys['ArrowUp'] || keys['KeyW']) && player.onGround) {
    player.vy = -14
    player.onGround = false
  }

  // Physics
  player.vy += GRAVITY
  player.x += player.vx
  player.y += player.vy

  // Clamp to canvas
  if (player.x - player.w / 2 < 0) player.x = player.w / 2
  if (player.x + player.w / 2 > CANVAS_W) player.x = CANVAS_W - player.w / 2

  resolveplatformCollisions(player)

  // Invincibility timer
  if (player.invincible) {
    player.invTimer -= dt
    if (player.invTimer <= 0) player.invincible = false
  }

  // Hurt timer
  if (player.hurtTimer > 0) player.hurtTimer -= dt

  // Choose sprite
  player.currentSprite = moving ? bearWalk : bearIdle

  // Attack hitbox check against boss
  if (player.attacking && player.attackTimer > 200) {
    const attackRange = 50
    const ax = player.facingRight ? player.x + player.w / 2 : player.x - player.w / 2 - attackRange
    const attackBox = { x: ax, y: player.y - player.h, w: attackRange, h: player.h }
    const bossBox = { x: boss.x - boss.w / 2, y: boss.y - boss.h, w: boss.w, h: boss.h }

    if (rectOverlap(attackBox, bossBox) && boss.state !== 'hurt') {
      damageBoss(3)
    }
  }
}

// IA du boss
function updateBoss(dt) {
  // Determine phase
  if (boss.hp > 14) boss.phase = 1
  else if (boss.hp > 7) boss.phase = 2
  else boss.phase = 3

  // Cooldown
  if (boss.attackCooldown > 0) boss.attackCooldown -= dt

  // Boss invincibility timer
  if (boss.invincible) {
    boss.invTimer -= dt
    if (boss.invTimer <= 0) boss.invincible = false
  }

  // State machine
  switch (boss.state) {
    case 'hurt':
      boss.stateTimer -= dt
      penguHurt.update(dt)
      if (penguHurt.finished || boss.stateTimer <= 0) {
        penguHurt.reset()
        const distAfterHurt = Math.abs(player.x - boss.x)
        const nearWall = boss.x < 80 || boss.x > CANVAS_W - 80
        if (nearWall) {
          boss.state = 'escape'
          boss.stateTimer = 600
          penguMove.reset()
          boss.attackCooldown = 200
        } else if (distAfterHurt < 130) {
          boss.state = 'attack_peck'
          boss.stateTimer = 700
          penguPeck.reset()
          boss.attackCooldown = 400
        } else {
          boss.state = 'attack_ice'
          boss.stateTimer = 1000
          penguIce.reset()
          boss._iceSpawned = false
          boss.attackCooldown = 400
        }
      }
      break

    case 'idle':
      boss.stateTimer -= dt
      penguIdle.update(dt)
      if (Math.abs(player.x - boss.x) > 3) boss.facingRight = player.x > boss.x

      // Escape corner while idle
      if (boss.x < 80 || boss.x > CANVAS_W - 80) {
        boss.state = 'escape'
        boss.stateTimer = 500
        penguMove.reset()
        break
      }

      if (boss.stateTimer <= 0 && boss.attackCooldown <= 0) {
        const distX = Math.abs(player.x - boss.x)
        const distY = Math.abs(player.y - boss.y)

        if (boss.phase === 1) {
          boss.state = 'walk'
          boss.stateTimer = 2000
          penguMove.reset()
        } else if (boss.phase === 2) {
          if (distX < 120 && distY <= 40) {
            boss.state = 'attack_peck'
            boss.stateTimer = 800
            penguPeck.reset()
          } else {
            boss.state = 'attack_ice'
            boss.stateTimer = 1000
            penguIce.reset()
          }
        } else {
          const r = Math.random()
          if (r < 0.4) {
            boss.state = 'attack_ray'
            boss.stateTimer = 1200
            penguRay.reset()
          } else if (r < 0.7) {
            boss.state = 'attack_ice'
            boss.stateTimer = 1000
            penguIce.reset()
          } else {
            boss.state = 'walk'
            boss.stateTimer = 1500
            penguMove.reset()
          }
        }
      }
      break

    case 'escape': {
      boss.stateTimer -= dt
      penguMove.update(dt)
      const center = CANVAS_W / 2
      const escDir = boss.x < center ? 1 : -1
      boss.facingRight = escDir > 0
      boss.x += escDir * 4
      boss.vy += GRAVITY
      boss.y += boss.vy
      if (boss.onGround && boss.stateTimer > 300) {
        boss.vy = -10
      }
      resolveplatformCollisions(boss)
      if (boss.stateTimer <= 0 || (Math.abs(boss.x - center) < 100)) {
        boss.state = 'idle'
        boss.stateTimer = 200
        boss.attackCooldown = 300
      }
      break
    }

    case 'walk': {
      boss.stateTimer -= dt
      penguMove.update(dt)
      let dir = 0
      if (player.x > boss.x + 3) dir = 1
      else if (player.x < boss.x - 3) dir = -1
      
      if (dir !== 0) boss.facingRight = dir > 0
      
      boss.x += dir * 2.5
      boss.vy += GRAVITY
      boss.y += boss.vy
      resolveplatformCollisions(boss)

      const distX = Math.abs(player.x - boss.x)
      const distY = Math.abs(player.y - boss.y)
      
      if (distX < 100 && distY <= 40 && boss.phase >= 1) {
        boss.state = 'attack_peck'
        boss.stateTimer = 700
        penguPeck.reset()
        boss.attackCooldown = 800
      } else if (boss.stateTimer <= 0) {
        boss.state = 'idle'
        boss.stateTimer = 600
      }
      break
    }

    case 'attack_peck':
      boss.stateTimer -= dt
      penguPeck.update(dt)
      if (Math.abs(player.x - boss.x) > 3) boss.facingRight = player.x > boss.x

      // Deal damage mid-animation
      if (penguPeck.currentFrame >= 4 && penguPeck.currentFrame <= 5) {
        const peckRange = 70
        const px = boss.facingRight ? boss.x + boss.w / 2 - 20 : boss.x - boss.w / 2 - peckRange + 20
        const peckBox = { x: px, y: boss.y - boss.h * 0.6, w: peckRange, h: boss.h * 0.5 }
        const playerBox = { x: player.x - player.w / 2, y: player.y - player.h, w: player.w, h: player.h }
        if (rectOverlap(peckBox, playerBox)) {
          damagePlayer(1)
        }
      }

      if (penguPeck.finished || boss.stateTimer <= 0) {
        boss.state = 'idle'
        boss.stateTimer = 800
        boss.attackCooldown = 1200
        penguPeck.reset()
      }
      break

    case 'attack_ice':
      boss.stateTimer -= dt
      penguIce.update(dt)

      // Spawn projectile at frame 5
      if (penguIce.currentFrame === 5 && !boss._iceSpawned) {
        boss._iceSpawned = true
        const dir = boss.facingRight ? 1 : -1
        projectiles.push({
          x: boss.x + dir * 40,
          y: boss.y - boss.h * 0.4,
          vx: dir * 6,
          vy: -2,
          w: 24, h: 24,
          alive: true,
          bounced: false,
          timer: 3000,
        })
      }

      if (penguIce.finished || boss.stateTimer <= 0) {
        boss.state = 'idle'
        boss.stateTimer = 600
        boss.attackCooldown = 1500
        penguIce.reset()
        boss._iceSpawned = false
      }
      break

    case 'attack_ray':
      boss.stateTimer -= dt
      penguRay.update(dt)

      // Ray damage during frames 8–11
      if (penguRay.currentFrame >= 8 && penguRay.currentFrame <= 11) {
        const rayDir = boss.facingRight ? 1 : -1
        const rayBox = {
          x: boss.facingRight ? boss.x : boss.x - 300,
          y: boss.y - boss.h * 0.5,
          w: 300,
          h: 30,
        }
        const playerBox = { x: player.x - player.w / 2, y: player.y - player.h, w: player.w, h: player.h }
        if (rectOverlap(rayBox, playerBox)) {
          damagePlayer(1)
        }
      }

      if (penguRay.finished || boss.stateTimer <= 0) {
        boss.state = 'idle'
        boss.stateTimer = 1000
        boss.attackCooldown = 2000
        penguRay.reset()
      }
      break
  }

  // Boss gravity & velocity (non-walk states)
  if (boss.state !== 'walk' && boss.state !== 'escape') {
    boss.vy += GRAVITY
    boss.y += boss.vy
    
    if (boss.vx !== 0) {
      boss.x += boss.vx
      if (boss.vx > 0) {
        boss.vx -= 0.3
        if (boss.vx < 0) boss.vx = 0
      } else {
        boss.vx += 0.3
        if (boss.vx > 0) boss.vx = 0
      }
    }
    
    resolveplatformCollisions(boss)
  }

  // Clamp
  if (boss.x - boss.w / 2 < 0) boss.x = boss.w / 2
  if (boss.x + boss.w / 2 > CANVAS_W) boss.x = CANVAS_W - boss.w / 2
}

// Projectiles
function updateProjectiles(dt) {
  for (const p of projectiles) {
    p.timer -= dt
    p.vy += 0.3
    p.x += p.vx
    p.y += p.vy

    // Bounce off ground
    if (p.y >= GROUND_Y && !p.bounced) {
      p.vy = -6
      p.bounced = true
    } else if (p.y >= GROUND_Y && p.bounced) {
      p.alive = false
    }

    // Off screen
    if (p.x < -50 || p.x > CANVAS_W + 50 || p.timer <= 0) {
      p.alive = false
    }

    // Hit player
    const playerBox = { x: player.x - player.w / 2, y: player.y - player.h, w: player.w, h: player.h }
    if (rectOverlap({ x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h }, playerBox)) {
      damagePlayer(1)
      p.alive = false
    }
  }
  projectiles = projectiles.filter(p => p.alive)
}

// Dégâts
function damagePlayer(amount) {
  if (player.invincible || defeated.value || victory.value) return
  player.hp -= amount
  player.invincible = true
  player.invTimer = 1000
  player.hurtTimer = 300
  if (player.hp <= 0) {
    player.hp = 0
    defeated.value = true
    gameRunning = false
    stopBattleMusic()
  }
}

function damageBoss(amount) {
  if (boss.state === 'hurt' || boss.invincible || victory.value) return
  boss.hp -= amount
  if (boss.hp <= 0) {
    boss.hp = 0
    victory.value = true
    gameRunning = false
    stopBattleMusic()
    playVictoryMusic()
  } else {
    boss.state = 'hurt'
    boss.stateTimer = 500
    boss.invincible = true
    boss.invTimer = 1200
    
    const knockDir = player.x < boss.x ? 1 : -1
    boss.vx = knockDir * 8
    boss.vy = -8
    
    penguHurt.reset()
  }
}

// Rendu graphique
function render(ctx) {
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
  grad.addColorStop(0, '#0f0c29')
  grad.addColorStop(0.5, '#302b63')
  grad.addColorStop(1, '#24243e')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

  // Stars
  ctx.fillStyle = 'rgba(255,255,255,0.3)'
  for (let i = 0; i < 40; i++) {
    const sx = (i * 97 + 13) % CANVAS_W
    const sy = (i * 53 + 7) % (CANVAS_H * 0.6)
    ctx.fillRect(sx, sy, 2, 2)
  }

  // Platforms
  ctx.imageSmoothingEnabled = false
  for (const p of platforms) {
    if (p.y === GROUND_Y) {
      // Ground
      ctx.fillStyle = '#3a3a5c'
      ctx.fillRect(p.x, p.y, p.w, p.h)
      ctx.fillStyle = '#5a5a8c'
      ctx.fillRect(p.x, p.y, p.w, 3)
    } else {
      // Floating platforms
      ctx.fillStyle = '#4a4a6e'
      ctx.fillRect(p.x, p.y, p.w, p.h)
      ctx.fillStyle = '#7a7ab0'
      ctx.fillRect(p.x, p.y, p.w, 3)
    }
  }

  // Projectiles (ice)
  ctx.fillStyle = '#88ccff'
  for (const p of projectiles) {
    ctx.save()
    ctx.shadowColor = '#88ccff'
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Boss
  if (!victory.value) {
    let bossSprite
    switch (boss.state) {
      case 'hurt': bossSprite = penguHurt; break
      case 'walk': bossSprite = penguMove; break
      case 'escape': bossSprite = penguMove; break
      case 'attack_peck': bossSprite = penguPeck; break
      case 'attack_ice': bossSprite = penguIce; break
      case 'attack_ray': bossSprite = penguRay; break
      default: bossSprite = penguIdle; break
    }
    if (bossSprite) {
      bossSprite.draw(ctx, boss.x, boss.y, SCALE_PENGU, !boss.facingRight)
    }

    // Ray beam visual
    if (boss.state === 'attack_ray' && penguRay.currentFrame >= 8) {
      ctx.save()
      ctx.globalAlpha = 0.4
      const rayGrad = ctx.createLinearGradient(
        boss.x, boss.y - boss.h * 0.45,
        boss.facingRight ? boss.x + 300 : boss.x - 300, boss.y - boss.h * 0.45
      )
      rayGrad.addColorStop(0, '#00e5ff')
      rayGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = rayGrad
      ctx.fillRect(
        boss.facingRight ? boss.x : boss.x - 300,
        boss.y - boss.h * 0.55,
        300, 30
      )
      ctx.restore()
    }
  }

  // Player
  const blinkOff = player.invincible && Math.floor(Date.now() / 80) % 2 === 0
  if (!blinkOff && player.currentSprite) {
    player.currentSprite.draw(ctx, player.x, player.y, SCALE_BEAR, !player.facingRight)
  }

  // Attack visual effect (sprite-based)
  if (player.attacking && attackFrames.length > 0) {
    const elapsed = 300 - player.attackTimer
    const frameIdx = Math.min(Math.floor(elapsed / ATTACK_FRAME_DURATION), ATTACK_FRAME_COUNT - 1)
    const atkImg = attackFrames[frameIdx]
    if (atkImg) {
      ctx.save()
      const atkSize = 80
      const ax = player.facingRight ? player.x + 15 : player.x - 15 - atkSize
      const ay = player.y - player.h - 10
      ctx.globalAlpha = 0.85
      if (!player.facingRight) {
        ctx.translate(ax + atkSize, ay)
        ctx.scale(-1, 1)
        ctx.drawImage(atkImg, 0, 0, atkSize, atkSize)
      } else {
        ctx.drawImage(atkImg, ax, ay, atkSize, atkSize)
      }
      ctx.restore()
    }
  }

  // HUD — player hearts
  ctx.save()
  ctx.font = '20px sans-serif'
  for (let i = 0; i < player.maxHp; i++) {
    ctx.fillText(i < player.hp ? '❤️' : '🖤', 16 + i * 28, 32)
  }
  ctx.restore()

  // HUD — boss HP bar
  if (!victory.value) {
    ctx.save()
    const barW = 200
    const barH = 14
    const barX = CANVAS_W - barW - 20
    const barY = 16
    // Background
    ctx.fillStyle = '#333'
    ctx.fillRect(barX, barY, barW, barH)
    // HP
    const hpRatio = boss.hp / boss.maxHp
    const hpColor = hpRatio > 0.5 ? '#e53935' : hpRatio > 0.25 ? '#ff9800' : '#ff1744'
    ctx.fillStyle = hpColor
    ctx.fillRect(barX, barY, barW * hpRatio, barH)
    // Border
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.strokeRect(barX, barY, barW, barH)
    // Label
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px sans-serif'
    ctx.fillText('Boss', barX, barY - 4)
    ctx.restore()
  }

  // Phase indicator
  if (!victory.value && !defeated.value) {
    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '11px sans-serif'
    ctx.fillText(`Phase ${boss.phase}/3`, CANVAS_W - 80, 50)
    ctx.restore()
  }

  // Controls hint
  if (!victory.value && !defeated.value) {
    ctx.save()
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('← → Déplacer  |  Espace Sauter  |  E Attaquer', CANVAS_W / 2, CANVAS_H - 10)
    ctx.restore()
  }
}

// Boucle de jeu
function gameLoop(timestamp) {
  if (!gameRunning) return

  const dt = lastTime ? Math.min(timestamp - lastTime, 33) : 16
  lastTime = timestamp

  // Update sprites
  if (player.currentSprite) player.currentSprite.update(dt)

  updatePlayer(dt)
  updateBoss(dt)
  updateProjectiles(dt)

  // (no contact damage — only boss attacks deal damage)

  const ctx = canvasRef.value?.getContext('2d')
  if (ctx) render(ctx)

  animFrameId = requestAnimationFrame(gameLoop)
}

// Réinitialisation
function resetState() {
  player.x = 100
  player.y = GROUND_Y
  player.vx = 0
  player.vy = 0
  player.hp = player.maxHp
  player.onGround = false
  player.attacking = false
  player.attackTimer = 0
  player.attackCooldown = 0
  player.invincible = false
  player.invTimer = 0
  player.hurtTimer = 0
  player.facingRight = true

  boss.x = 750
  boss.y = GROUND_Y
  boss.vx = 0
  boss.vy = 0
  boss.hp = boss.maxHp
  boss.state = 'idle'
  boss.stateTimer = 1000
  boss.attackCooldown = 0
  boss.phase = 1
  boss.hurtTimer = 0
  boss.invincible = false
  boss.invTimer = 0
  boss._iceSpawned = false
  boss.facingRight = false

  projectiles = []
  victory.value = false
  defeated.value = false
  lastTime = 0
}

function restartGame() {
  resetState()
  gameRunning = true
  playBattleMusic()
  animFrameId = requestAnimationFrame(gameLoop)
}

function closeGame() {
  gameRunning = false
  stopAllAudio()
  if (animFrameId) cancelAnimationFrame(animFrameId)
  emit('close')
}

// Cycle de vie
onMounted(async () => {
  try {
    await loadAllSprites()
  } catch (err) {
    console.error('Erreur chargement sprites:', err)
  }
  initAudio()
  player.currentSprite = bearIdle

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  resetState()
  gameRunning = true
  playBattleMusic()
  animFrameId = requestAnimationFrame(gameLoop)
})

onUnmounted(() => {
  gameRunning = false
  stopAllAudio()
  if (animFrameId) cancelAnimationFrame(animFrameId)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>

<style scoped>
.minigame-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.minigame-close {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 22px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10001;
  transition: background 0.2s;
}
.minigame-close:hover {
  background: rgba(255, 70, 70, 0.5);
}

canvas {
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  max-width: 90vw;
  max-height: 80vh;
}

.victory-screen,
.defeat-screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.victory-screen {
  background: radial-gradient(ellipse at center, rgba(76, 175, 80, 0.35), rgba(0, 0, 0, 0.75));
}
.victory-screen h2 {
  font-size: 48px;
  color: #66bb6a;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
  animation: popIn 0.4s ease-out;
}
.victory-screen p {
  color: #c8e6c9;
  font-size: 18px;
  margin: 4px 0;
}
.victory-code {
  font-style: italic;
  color: #a5d6a7 !important;
  margin-top: 12px !important;
}

.defeat-screen {
  background: radial-gradient(ellipse at center, rgba(229, 57, 53, 0.3), rgba(0, 0, 0, 0.8));
}
.defeat-screen h2 {
  font-size: 48px;
  color: #ef5350;
  margin-bottom: 8px;
  text-shadow: 0 0 20px rgba(229, 57, 53, 0.5);
  animation: popIn 0.4s ease-out;
}
.defeat-screen p {
  color: #ffcdd2;
  font-size: 18px;
}

.btn-continue,
.btn-retry {
  margin-top: 24px;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.2s;
}
.btn-continue {
  background: linear-gradient(135deg, #43a047, #66bb6a);
  color: #fff;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}
.btn-continue:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(76, 175, 80, 0.6);
}
.btn-retry {
  background: linear-gradient(135deg, #e53935, #ef5350);
  color: #fff;
  box-shadow: 0 4px 15px rgba(229, 57, 53, 0.4);
}
.btn-retry:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(229, 57, 53, 0.6);
}

@keyframes popIn {
  from { transform: scale(0.5); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
