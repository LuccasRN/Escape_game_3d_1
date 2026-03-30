<template>
  <div class="capybara-overlay">
    <div class="jp-matrix">
      <template v-for="n in 10" :key="n">
        <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span> <span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span><span>マ</span><span>ミ</span><span>ム</span><span>メ</span><span>モ</span><span>ヤ</span><span>ユ</span><span>ヨ</span><span>ラ</span><span>リ</span><span>ル</span><span>レ</span><span>ロ</span><span>ワ</span><span>ヲ</span><span>ン</span><span>ガ</span><span>ギ</span><span>グ</span><span>ゲ</span><span>ゴ</span><span>ザ</span><span>ジ</span><span>ズ</span><span>ゼ</span><span>ゾ</span><span>ダ</span><span>ヂ</span><span>ヅ</span><span>デ</span><span>ド</span><span>バ</span><span>ビ</span><span>ブ</span><span>ベ</span><span>ボ</span><span>パ</span><span>ピ</span><span>プ</span><span>ペ</span><span>ポ</span><span>ア</span><span>イ</span><span>ウ</span><span>エ</span><span>オ</span><span>カ</span><span>キ</span><span>ク</span><span>ケ</span><span>コ</span><span>サ</span><span>シ</span><span>ス</span><span>セ</span><span>ソ</span><span>タ</span><span>チ</span><span>ツ</span><span>テ</span><span>ト</span><span>ナ</span><span>ニ</span><span>ヌ</span><span>ネ</span><span>ノ</span><span>ハ</span><span>ヒ</span><span>フ</span><span>ヘ</span><span>ホ</span>
      </template>
    </div>
    
    <div class="capybara-content">
      <div class="capybaraloader">
        <div class="capybara">
          <div class="capyhead">
            <div class="capyear"><div class="capyear2"></div></div>
            <div class="capyear"></div>
            <div class="capymouth">
              <div class="capylips"></div>
              <div class="capylips"></div>
            </div>
            <div class="capyeye"></div>
            <div class="capyeye"></div>
          </div>
          <div class="capyleg"></div>
          <div class="capyleg2"></div>
          <div class="capyleg2"></div>
          <div class="capy"></div>
        </div>
        <div class="loader">
          <div class="loaderline"></div>
        </div>
      </div>
      <div class="loading-text">Chargement... {{ progress }}%</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped>
.capybara-overlay {
  position: fixed;
  inset: 0;
  z-index: 999999;
  background: #05050a;
}

.capybara-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.loading-text {
  color: white;
  margin-top: 2rem;
  font-family: monospace;
  font-size: 1.5rem;
}

/* Matrix Background */
.jp-matrix {
  position: absolute;
  inset: 0;
  background-color: #05050a;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  grid-auto-rows: 40px;
  font-size: 32px;
  color: rgba(0, 150, 255, 0.4);
  font-family: "Courier New", Courier, monospace;
  justify-content: center;
  align-content: center;
  z-index: 1;
}

.jp-matrix > span {
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 150, 255, 0.5);
  user-select: none;
  transition: color 0.5s, text-shadow 0.5s;
  line-height: 1;
}

.jp-matrix > span:nth-child(19n + 2) { animation: smooth-pulse 3.5s ease-in-out infinite 0.2s; }
.jp-matrix > span:nth-child(29n + 1) { animation: smooth-pulse 4.1s ease-in-out infinite 0.7s; }
.jp-matrix > span:nth-child(11n) { color: rgba(100, 200, 255, 0.7); animation: smooth-pulse 2.9s ease-in-out infinite 1.1s; }
.jp-matrix > span:nth-child(37n + 10) { animation: smooth-pulse 5.3s ease-in-out infinite 1.5s; }
.jp-matrix > span:nth-child(41n + 1) { animation: smooth-pulse 3.9s ease-in-out infinite 0.4s; }
.jp-matrix > span:nth-child(17n + 9) { animation: smooth-pulse 2.8s ease-in-out infinite 0.9s; }
.jp-matrix > span:nth-child(23n + 18) { animation: smooth-pulse 4.3s ease-in-out infinite 1.3s; }
.jp-matrix > span:nth-child(31n + 4) { animation: smooth-pulse 5.6s ease-in-out infinite 0.1s; }
.jp-matrix > span:nth-child(43n + 20) { animation: smooth-pulse 3.6s ease-in-out infinite 1.8s; }
.jp-matrix > span:nth-child(13n + 6) { animation: smooth-pulse 3.2s ease-in-out infinite 1.2s; }
.jp-matrix > span:nth-child(53n + 5) { animation: smooth-pulse 4.9s ease-in-out infinite 0.5s; }
.jp-matrix > span:nth-child(47n + 15) { animation: smooth-pulse 5.9s ease-in-out infinite 1s; }

@keyframes smooth-pulse {
  0%, 100% {
    color: rgba(0, 150, 255, 0.4);
    text-shadow: 0 0 5px rgba(0, 150, 255, 0.5);
  }
  30% {
    color: rgba(100, 200, 255, 1);
    text-shadow: 0 0 10px rgba(100, 200, 255, 1), 0 0 15px rgba(100, 200, 255, 1);
  }
  50% {
    color: rgba(255, 105, 180, 1);
    text-shadow: 0 0 10px rgba(255, 105, 180, 1), 0 0 15px rgba(255, 105, 180, 1);
  }
  70% {
    color: #ffffff;
    text-shadow: 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #fff;
  }
}

/* Capybara Loader */ 
.capybaraloader {
  width: 14em;
  height: 10em;
  position: relative;
  z-index: 1;
  --color: rgb(204, 125, 45);
  --color2: rgb(83, 56, 28);
  transform: scale(0.75);
}
.capybara { width: 100%; height: 7.5em; position: relative; z-index: 1; }
.loader { width: 100%; height: 2.5em; position: relative; z-index: 1; overflow: hidden; }
.capy {
  width: 85%; height: 100%; background: linear-gradient(var(--color), 90%, var(--color2));
  border-radius: 45%; position: relative; z-index: 1; animation: movebody 1s linear infinite;
}
.capyhead {
  width: 7.5em; height: 7em; bottom: 0em; right: 0em; position: absolute;
  background-color: var(--color); z-index: 3; border-radius: 3.5em;
  box-shadow: -1em 0em var(--color2); animation: movebody 1s linear infinite;
}
.capyear {
  width: 2em; height: 2em; background: linear-gradient(-45deg, var(--color), 90%, var(--color2));
  top: 0em; left: 0em; border-radius: 100%; position: absolute; overflow: hidden; z-index: 3;
}
.capyear:nth-child(2) { left: 5em; background: linear-gradient(25deg, var(--color), 90%, var(--color2)); }
.capyear2 {
  width: 100%; height: 1em; background-color: var(--color2); bottom: 0em; left: 0.5em;
  border-radius: 100%; position: absolute; transform: rotate(-45deg);
}
.capymouth {
  width: 3.5em; height: 2em; background-color: var(--color2); position: absolute;
  bottom: 0em; left: 2.5em; border-radius: 50%; display: flex; justify-content: space-around;
  align-items: center; padding: 0.5em;
}
.capylips { width: 0.25em; height: 0.75em; border-radius: 100%; transform: rotate(-45deg); background-color: var(--color); }
.capylips:nth-child(2) { transform: rotate(45deg); }
.capyeye {
  width: 2em; height: 0.5em; background-color: var(--color2); position: absolute;
  bottom: 3.5em; left: 1.5em; border-radius: 5em; transform: rotate(45deg);
}
.capyeye:nth-child(4) { transform: rotate(-45deg); left: 5.5em; width: 1.75em; }
.capyleg {
  width: 6em; height: 5em; bottom: 0em; left: 0em; position: absolute;
  background: linear-gradient(var(--color), 95%, var(--color2)); z-index: 2;
  border-radius: 2em; animation: movebody 1s linear infinite;
}
.capyleg2 {
  width: 1.75em; height: 3em; bottom: 0em; left: 3.25em; position: absolute;
  background: linear-gradient(var(--color), 80%, var(--color2)); z-index: 2;
  border-radius: 0.75em; box-shadow: inset 0em -0.5em var(--color2); animation: moveleg 1s linear infinite;
}
.capyleg2:nth-child(3) { width: 1.25em; left: 0.5em; height: 2em; animation: moveleg2 1s linear infinite 0.075s; }

@keyframes moveleg {
  0% { transform: rotate(-45deg) translateX(-5%); }
  50% { transform: rotate(45deg) translateX(5%); }
  100% { transform: rotate(-45deg) translateX(-5%); }
}
@keyframes moveleg2 {
  0% { transform: rotate(45deg); }
  50% { transform: rotate(-45deg); }
  100% { transform: rotate(45deg); }
}
@keyframes movebody {
  0% { transform: translateX(0%); }
  50% { transform: translateX(2%); }
  100% { transform: translateX(0%); }
}

.loaderline {
  width: 50em; height: 0.5em; border-top: 0.5em dashed var(--color2);
  animation: moveline 10s linear infinite;
}
@keyframes moveline {
  0% { transform: translateX(0%); opacity: 0%; }
  5% { opacity: 100%; }
  95% { opacity: 100%; }
  100% { opacity: 0%; transform: translateX(-70%); }
}
</style>
