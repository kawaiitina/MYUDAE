<script setup>
import { ref } from "vue";
import Youtube from "./components/Youtube.vue";
import Play from "./components/Play.vue";
import Setting from "./components/Setting.vue";

const youtube = ref();
const play = ref();

function handleVideoPlaying(videoCurrentTime) {
  play.value.onVideoPlaying(videoCurrentTime);
}
function handleVideoPaused() {
  play.value.onVideoPaused();
}
function handlePlaybackRateChange(playbackRate) {
  play.value.changePlaybackRate(playbackRate);
}
function handleVolumeChange(volume) {
  play.value.changeVolume(volume);
}
function handleScoreChange(score) {
  play.value.changeScore(score);
}
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="fit column items-center q-pb-md">
        <Youtube
          ref="youtube"
          @video-playing="handleVideoPlaying"
          @video-paused="handleVideoPaused"
          @playback-rate-change="handlePlaybackRateChange"
        />
        <Play ref="play" />
        <Setting
          @volume-change="handleVolumeChange"
          @score-change="handleScoreChange"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
