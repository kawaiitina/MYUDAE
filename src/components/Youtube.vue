<script setup>
import { ref, onMounted } from "vue";
import YouTube from "vue3-youtube";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";

const store = useStore();
const { playbackRate, youtubeVolume, score } = storeToRefs(store);

const emit = defineEmits([
  "video-playing",
  "video-paused",
  "playback-rate-change",
]);

const youtube = ref(null);
function playVideo() {
  youtube.value.setPlaybackRate(playbackRate.value / 100);
  youtube.value.seekTo(
    score.value?.videoStartTime - (60 / score.value?.bpm) * 4
  );
  youtube.value.playVideo();
  playing.value = true;
}
function pauseVideo() {
  youtube.value.pauseVideo();
  playing.value = false;
}
function restart() {
  pauseVideo();
  playVideo();
}

function changeVolume(value) {
  youtube.value.setVolume(value);
}
const playing = ref(false);
// const btn = ref(null);
// function handleClick() {
//   if (!playing.value) {
//     playVideo();
//   } else {
//     pauseVideo();
//   }
// }
function handleReady() {
  youtube.value.setPlaybackRate(playbackRate.value / 100);
  youtube.value.setVolume(youtubeVolume.value);
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
defineExpose({ playVideo, pauseVideo, restart, changeVolume });
</script>

<template>
  <q-card>
    <q-card-section class="q-pa-none">
      <YouTube
        :src="score?.src || ''"
        width="1920"
        height="1080"
        ref="youtube"
        @ready="handleReady"
        @state-change="handleStateChange"
      />
      <!-- <q-btn
        :label="playing ? 'STOP' : 'PLAY'"
        :class="playing ? 'bg-red-5' : 'bg-blue'"
        color="white"
        square
        flat
        style="width: 1920px; height: 40px"
        @click="handleClick"
        @focus="$event.target.blur()"
        ref="btn"
      /> -->
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
