<script setup>
import { ref } from "vue";
import YouTube from "vue3-youtube";
import { useSettingStore } from "/src/store";
import { storeToRefs } from "pinia";

const store = useSettingStore();
const { playbackRate, score } = storeToRefs(store);

const emit = defineEmits(["video-playing", "video-paused"]);

const youtube = ref(null);

function playVideo() {
  youtube.value.setPlaybackRate(playbackRate.value / 100);
  youtube.value.seekTo(score.value.offset - (60 / score.value.bpm) * 4);
  youtube.value.playVideo();
}
function pauseVideo() {
  youtube.value.pauseVideo();
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
function setPlaybackRate() {
  youtube.value.setPlaybackRate(playbackRate / 100);
}

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
        @ready="pauseVideo"
      />
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
