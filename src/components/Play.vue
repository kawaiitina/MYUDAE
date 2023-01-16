<script setup>
import { ref, onMounted } from "vue";
import { pixi, play, stop, setting } from "../modules/app.js";
import { useSettingStore } from "/src/store.js";
import { storeToRefs } from "pinia";

const store = useSettingStore();
const { playbackRate, userOffset, noteSpeed, keyTop, keyBottom, score } =
  storeToRefs(store);

const emit = defineEmits(["play-video", "stop"]);
const playing = ref(false);

function handleClick() {
  if (!playing.value) {
    emit("play-video");
  } else {
    emit("stop");
    stop();
  }
}

function onVideoPlaying(videoCurrentTime) {
  playing.value = true;
  play({
    score: score.value,
    videoCurrentTime: videoCurrentTime * 1000,
    playbackRate: playbackRate.value / 100,
    userOffset: userOffset.value,
    noteSpeed: noteSpeed.value / 100,
    keyTop: keyTop.value,
    keyBottom: keyBottom.value,
  });
}
function onVideoPaused() {
  playing.value = false;
  stop();
}

function restart() {
  stop();
  emit("play-video");
}

function changeVolume(volume) {
  setting({ volume });
}

onMounted(() => {
  document.getElementById("pixi").appendChild(pixi.view);
  document.body.addEventListener("keydown", function (event) {
    if (event.repeat) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      restart();
    } else if (event.code === "Equal") {
      if (playbackRate.value >= 150) {
        return;
      }
      playbackRate.value += 5;
      restart();
    } else if (event.code === "Minus") {
      if (playbackRate.value <= 25) {
        return;
      }
      playbackRate.value -= 5;
      restart();
    } else if (event.code === "Escape") {
      emit("stop");
      stop();
    }
  });
});
defineExpose({ onVideoPlaying, onVideoPaused, changeVolume });
</script>

<template>
  <div id="pixi" style="height: 1080px"></div>
  <q-btn
    :label="playing ? 'STOP' : 'PLAY'"
    class="q-mb-md q-no-margin"
    :class="playing ? 'bg-red-5' : 'bg-blue'"
    color="white"
    square
    style="width: 1920px; height: 40px"
    @click="handleClick"
  />
</template>

<style scoped>
#pixi {
  position: absolute;
  top: 0;
  pointer-events: none;
}
</style>
