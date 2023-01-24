<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "./store.js";
import app from "./modules/app.js";
import Youtube from "./components/Youtube.vue";
import Play from "./components/Play.vue";
import Setting from "./components/Setting.vue";

const store = useStore();
const {
  loadedScores,
  currentScoreIndex,
  playbackRate,
  sfxVolume,
  youtubeVolume,
  userOffset,
  noteSpeedRate,
  keyTop,
  keyBottom,
  score,
} = storeToRefs(store);

const youtube = ref();
const play = ref();

onMounted(() => {
  const saveString = localStorage.getItem("save");
  if (saveString) {
    const data = JSON.parse(saveString);

    sfxVolume.value = data.sfxVolume;
    youtubeVolume.value = data.youtubeVolume;
    userOffset.value = data.userOffset;
    noteSpeedRate.value = data.noteSpeedRate;
    keyTop.value = data.keyTop;
    keyBottom.value = data.keyBottom;
    loadedScores.value = JSON.parse(data.loadedScores);
    currentScoreIndex.value = data.currentScoreIndex;

    app.setting.changeSfxVolume(sfxVolume.value);
    app.setting.changeScore(score.value);
    app.setting.changeUserOffset(userOffset.value);
    app.setting.changeNoteSpeedRate(noteSpeedRate.value / 100);
    app.setting.changeKey(keyTop.value, keyBottom.value);
  }

  addEventListener("beforeunload", function () {
    const data = {
      sfxVolume: sfxVolume.value,
      youtubeVolume: youtubeVolume.value,
      userOffset: userOffset.value,
      noteSpeedRate: noteSpeedRate.value,
      keyTop: keyTop.value,
      keyBottom: keyBottom.value,
      loadedScores: JSON.stringify(loadedScores.value),
      currentScoreIndex: currentScoreIndex.value,
    };
    localStorage.setItem("save", JSON.stringify(data));
  });

  document.body.addEventListener("keydown", function (event) {
    if (event.repeat) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      youtube.value.restart();
    } else if (event.code === "Equal") {
      if (playbackRate.value >= 200) {
        return;
      }
      playbackRate.value += 5;
      app.setting.changePlaybackRate(playbackRate.value);
      youtube.value.restart();
    } else if (event.code === "Minus") {
      if (playbackRate.value <= 25) {
        return;
      }
      playbackRate.value -= 5;
      app.setting.changePlaybackRate(playbackRate.value);
      youtube.value.restart();
    } else if (event.code === "Escape") {
      youtube.value.pauseVideo();
    }
  });
});
</script>

<template>
  <q-layout>
    <q-page-container>
      <q-page class="fit column items-center q-pb-md">
        <Youtube
          ref="youtube"
          @video-playing="(videoCurrentTime) => play.play(videoCurrentTime)"
          @video-paused="play.stop()"
        />
        <Play ref="play" />
        <Setting
          @youtube-volume-change="(volume) => youtube.changeVolume(volume)"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped></style>
