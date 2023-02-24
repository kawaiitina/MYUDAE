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
    if (playing.value) {
      app.play(youtube.value.getCurrentTime() * 1000);
    } else {
      // src 바뀌었을 때 자동재생 방지
      youtube.value.pauseVideo();
    }
  }
}

onMounted(() => {
  document.getElementById("pixi").appendChild(app.pixi.view);
  document.body.addEventListener("keydown", function (event) {
    if (event.repeat) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      playing ? restart() : play();
    } else if (event.code === "Equal") {
      setPlaybackRate(playbackRate.value + 5);
    } else if (event.code === "Minus") {
      setPlaybackRate(playbackRate.value - 5);
    } else if (event.code === "Escape") {
      stop();
    }
  });
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
      @play="play"
      @stop="stop"
      @restart="restart"
      @set-playback-rate="setPlaybackRate"
      @toggle-fullscreen="toggleFullscreen"
    />
    <Menu @youtube-volume-change="youtube.setVolume(youtubeVolume)" />
  </div>
</template>

<style scoped>
#pixi {
  position: absolute;
  top: 0;
  /* pointer-events: none; */
}
</style>
