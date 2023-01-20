<script setup>
import { onMounted } from "vue";
import { pixi, play, stop, setting } from "../modules/app.js";
import { useSettingStore } from "/src/store.js";
import { storeToRefs } from "pinia";

const store = useSettingStore();
const { score, playbackRate, userOffset, noteSpeed, keyTop, keyBottom } =
  storeToRefs(store);

function onVideoPlaying(videoCurrentTime) {
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
  stop();
}

function changeVolume(volume) {
  setting({ volume });
}
function changeScore(score) {
  setting({ score });
}
function changePlaybackRate(playbackRate) {
  setting({ playbackRate });
}

onMounted(() => {
  document.getElementById("pixi").appendChild(pixi.view);
});
defineExpose({
  onVideoPlaying,
  onVideoPaused,
  changeVolume,
  changeScore,
  changePlaybackRate,
});
</script>

<template>
  <div id="pixi" style="height: 1080px"></div>
</template>

<style scoped>
#pixi {
  position: absolute;
  top: 0;
  pointer-events: none;
}
</style>
