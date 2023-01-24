<script setup>
import { onMounted } from "vue";
import app from "../modules/app.js";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";

const store = useStore();
const { score, playbackRate } = storeToRefs(store);

function play(videoCurrentTime) {
  app.play(score.value, playbackRate.value / 100, videoCurrentTime * 1000);
}
function stop() {
  app.stop();
}

onMounted(() => {
  document.getElementById("pixi").appendChild(app.pixi.view);
});
defineExpose({ play, stop });
</script>

<template>
  <div id="pixi"></div>
</template>

<style scoped>
#pixi {
  position: absolute;
  top: 0;
  width: 1920px;
  height: 1080px;
}
</style>
