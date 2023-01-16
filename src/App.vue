<script setup>
import { ref } from "vue";
import Youtube from "./components/Youtube.vue";
import Play from "./components/Play.vue";
import Setting from "./components/Setting.vue";

const youtube = ref();
const play = ref();

function handlePlayVideo() {
  youtube.value.playVideo();
}

function handleStop() {
  youtube.value.pauseVideo();
}

function handleVideoPlaying(videoCurrentTime) {
  play.value.onVideoPlaying(videoCurrentTime);
}
function handleVideoPaused() {
  play.value.onVideoPaused();
}

function handlePlaybackRateChange(playbackRate) {
  youtube.value.setPlaybackRate(playbackRate);
}
function handleVolumeChange(volume) {
  play.value.changeVolume(volume);
}
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="fit column items-center q-pb-md">
        <Youtube
          ref="youtube"
          @video-playing="
            (videoCurrentTime) => handleVideoPlaying(videoCurrentTime)
          "
          @video-paused="handleVideoPaused"
        />
        <Play ref="play" @play-video="handlePlayVideo()" @stop="handleStop()" />
        <Setting
          @playback-rate-change="
            (playbackRate) => handlePlaybackRateChange(playbackRate)
          "
          @volume-change="handleVolumeChange"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* @font-face {
  font-family: "FredokaOne";
  src: local("FredokaOne"),
    url(assets/font/FredokaOne-Regular.ttf) format("truetype");
} */
</style>
