<template>
  <div class="intro-container">
    <div class="starfield"></div>
    
    <button class="Btn" @click="skipIntro">
      Passer l'introduction
      <svg viewBox="0 0 320 512" class="svg">
        <path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"></path>
      </svg>
    </button>

    <div class="fade"></div>

    <section class="star-wars">
      <div class="crawl" @animationend="skipIntro">
        <div class="title">
          <p>à‰pisode IV</p>
          <h1>L'ENQUàŠTE</h1>
        </div>
        
        <p>Une mort suspecte a eu lieu.</p>
        <p>Vous êtes dans la salle réseau du laboratoire, un lieu clé pour comprendre ce qui s'est réellement passé.</p>
        <p>Votre mission : rétablir la connexion Internet, accéder au système informatique et trouver le code du coffre-fort.</p>
        <p>En analysant les fichiers secrets et le rapport d'autopsie, vous devrez découvrir la véritable cause du décès.</p>
        <p>Le temps presse... La vérité ne tient qu'à  un fil.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const emit = defineEmits(['finish'])

function skipIntro() {
  emit('finish')
}
</script>

<style scoped>
.intro-container { position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
  z-index: 10000;
  font-family: 'Pathway Gothic One', sans-serif;
}

/* Starfield background */
.starfield {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000 url('https://www.transparenttextures.com/patterns/stardust.png') repeat top center;
  z-index: 1;
}

/* Skip Button */
.Btn {
  position: absolute;
  bottom: 30px;
  right: 30px;
  z-index: 10002;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: auto;
  height: 40px;
  border: none;
  padding: 0px 45px 0px 20px;
  background: linear-gradient(to right, #8be3fc, #576bff);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  box-shadow: 0 20px 30px -7px rgba(97, 118, 238, 0.5);
  transition-duration: 0.3s;
}

.svg {
  width: 12px;
  position: absolute;
  right: 0;
  margin-right: 20px;
  fill: white;
  transition-duration: 0.3s;
}

.Btn:hover {
  color: transparent;
}

.Btn:hover svg {
  right: 50%;
  transform: translateX(50%);
  margin: 0;
  padding: 0;
  border: none;
  transition-duration: 0.3s;
}

.Btn:active {
  transform: translate(3px, 3px);
  transition-duration: 0.3s;
}

/* Fade out at the top */
.fade {
  position: relative;
  width: 100%;
  min-height: 40vh;
  top: -25px;
  background-image: linear-gradient(0deg, transparent, black 75%);
  z-index: 10001;
}

/* Star Wars Crawl Container */
.star-wars {
  display: flex;
  justify-content: center;
  position: relative;
  height: 800px;
  color: #feda4a;
  font-family: 'Century Gothic', CenturyGothic, AppleGothic, sans-serif;
  font-size: 500%;
  font-weight: 600;
  letter-spacing: 6px;
  line-height: 150%;
  perspective: 400px;
  text-align: justify;
  z-index: 2;
}

.crawl {
  position: relative;
  top: 9999px;
  transform-origin: 50% 100%;
  animation: crawl 45s linear;
  max-width: 60%;
}

.crawl > .title {
  font-size: 90%;
  text-align: center;
}

.crawl > .title h1 {
  margin: 0 0 100px;
  text-transform: uppercase;
}

/* Keyframes for the scrolling text */
@keyframes crawl {
  0% {
    top: -100px;
    transform: rotateX(20deg)  translateZ(0);
  }
  100% { 
    top: -6000px;
    transform: rotateX(25deg) translateZ(-2500px);
  }
}

@media screen and (max-width: 768px) {
  .star-wars {
    font-size: 250%;
  }
  .crawl {
    max-width: 80%;
  }
}
</style>


