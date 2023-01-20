<script setup>
import { ref, onMounted } from "vue";
import YouTube from "vue3-youtube";
import { useSettingStore } from "../store.js";
import { storeToRefs } from "pinia";

const store = useSettingStore();
const { playbackRate, score } = storeToRefs(store);

const emit = defineEmits([
  "video-playing",
  "video-paused",
  "playback-rate-change",
]);

const youtube = ref(null);
function playVideo() {
  youtube.value.setPlaybackRate(playbackRate.value / 100);
  youtube.value.seekTo(score.value.offset - (60 / score.value.bpm) * 4);
  youtube.value.playVideo();
  playing.value = true;
}
function pauseVideo() {
  youtube.value.pauseVideo();
  playing.value = false;
}
function setPlaybackRate() {
  youtube.value.setPlaybackRate(playbackRate / 100);
}
function restart() {
  pauseVideo();
  playVideo();
}

const playing = ref(false);
const btn = ref(null);
function handleClick() {
  if (!playing.value) {
    playVideo();
  } else {
    pauseVideo();
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
    emit("video-playing", youtube.value.getCurrentTime());
  } else if (youtube.value.getPlayerState() === 2) {
    emit("video-paused");
  }
}

onMounted(() => {
  document.body.addEventListener("keydown", function (event) {
    if (event.repeat) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      restart();
    } else if (event.code === "Equal") {
      if (playbackRate.value >= 200) {
        return;
      }
      playbackRate.value += 5;
      emit("playback-rate-change", playbackRate.value);
      restart();
    } else if (event.code === "Minus") {
      if (playbackRate.value <= 25) {
        return;
      }
      playbackRate.value -= 5;
      emit("playback-rate-change", playbackRate.value);
      restart();
    } else if (event.code === "Escape") {
      pauseVideo();
    }
  });
  btn.value.$el.setAttribute("tabIndex", "-1");
});
defineExpose({ playVideo, pauseVideo, setPlaybackRate });
</script>

<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <YouTube
        :src="score.src || ''"
        width="1920"
        height="1080"
        ref="youtube"
        @state-change="handleStateChange"
      />
      <q-btn
        :label="playing ? 'STOP' : 'PLAY'"
        :class="playing ? 'bg-red-5' : 'bg-blue'"
        color="white"
        square
        flat
        style="width: 1920px; height: 40px"
        @click="handleClick"
        ref="btn"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
