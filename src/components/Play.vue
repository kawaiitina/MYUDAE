<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";
import app from "../modules/app.js";
import YouTube from "vue3-youtube";
import Controller from "./Controller.vue";
import Menu from "./Menu.vue";

const store = useStore();
const { score, playbackRate, youtubeVolume, playing } = storeToRefs(store);
const youtube = ref(null);
const view = ref(null);

function play() {
  playing.value = true;
  youtube.value.pauseVideo();
  youtube.value.setPlaybackRate(playbackRate.value / 100);
  youtube.value.seekTo(
    score.value?.videoStartTime - (60 / score.value?.bpm) * 4
  );
  youtube.value.playVideo();
  // YouTube @state-change="handleStateChange" calls app.play(...)
}
function stop() {
  playing.value = false;
  youtube.value.pauseVideo();
  app.stop();
}
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    view.value.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}
function restart() {
  app.stop();
  play();
}
function setPlaybackRate(value) {
  if (value < 25 || value > 200) {
    return;
  }
  playbackRate.value = value;
  app.setting.changePlaybackRate(playbackRate.value);
  if (playing.value) {
    restart();
  }
}

function handleStateChange() {
  // -1 – 시작되지 않음
  // 0 – 종료
  // 1 – 재생 중
  // 2 – 일시중지
  // 3 – 버퍼링
  // 5 – 동영상 신호
  if (youtube.value.getPlayerState() === 1) {
    app.play(youtube.value.getCurrentTime() * 1000);
  }
}

function getWidth() {
  const w = document.body.clientWidth;
  document.body.clientWidth;
}

onMounted(() => {
  document.getElementById("pixi").appendChild(app.pixi.view);
});
</script>

<template>
  <div ref="view" style="width: 1920px; height: 1080px">
    <YouTube
      :src="score?.src || ''"
      width="1920"
      height="1080"
      ref="youtube"
      @ready="youtube.setVolume(youtubeVolume)"
      @state-change="handleStateChange"
    />
    <div id="pixi"></div>
    <Controller
      id="controller"
      @play="play"
      @stop="stop"
      @restart="restart"
      @set-playback-rate="setPlaybackRate"
      @toggle-fullscreen="toggleFullscreen"
    />
    <Menu id="menu" @youtube-volume-change="youtube.setVolume(youtubeVolume)" />
  </div>
</template>

<style scoped>
#pixi {
  position: absolute;
  top: 0;
}
#controller {
  position: absolute;
  top: 0;
  opacity: 0.8;
}
#menu {
  position: absolute;
  top: 0;
  opacity: 0.95;
}
</style>
