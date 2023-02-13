<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";

const store = useStore();
const { playbackRate, playing, showButtons } = storeToRefs(store);

const emit = defineEmits([
  "play",
  "stop",
  "restart",
  "set-playback-rate",
  "toggle-fullscreen",
]);

onMounted(() => {
  document.body.addEventListener("keydown", function (event) {
    if (event.repeat) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      playing ? emit("restart") : emit("play");
    } else if (event.code === "Equal") {
      emit("set-playback-rate", playbackRate.value + 5);
    } else if (event.code === "Minus") {
      emit("set-playback-rate", playbackRate.value - 5);
    } else if (event.code === "Escape") {
      emit("stop");
    }
  });
});
</script>

<template>
  <div class="relative-position" style="width: 1920px; height: 1080px">
    <q-btn
      v-show="showButtons"
      id="play"
      icon="play_arrow"
      text-color="white"
      flat
      @click="playing ? emit('restart') : emit('play')"
    />
    <q-btn
      v-show="showButtons"
      id="pause"
      icon="pause"
      text-color="white"
      flat
      @click="emit('stop')"
      :disabled="!playing"
    />
    <q-btn
      v-show="showButtons"
      id="slow"
      icon="remove"
      text-color="white"
      flat
      @click="emit('set-playback-rate', playbackRate - 5)"
      :disabled="playbackRate <= 25"
    />
    <q-btn
      v-show="showButtons"
      id="fast"
      icon="add"
      text-color="white"
      flat
      @click="emit('set-playback-rate', playbackRate + 5)"
      :disabled="playbackRate >= 200"
    />
    <q-btn
      v-show="showButtons"
      id="fullscreen"
      icon="fullscreen"
      text-color="white"
      flat
      @click="emit('toggle-fullscreen')"
    />
  </div>
</template>

<style scoped>
#play {
  position: absolute;
  width: 180px;
  height: 120px;
  font-size: 48px;
  top: 940px;
  left: calc(50% - 380px);
}
#pause {
  position: absolute;
  width: 180px;
  height: 120px;
  font-size: 48px;
  top: 940px;
  left: calc(50% - 190px);
}
#slow {
  position: absolute;
  width: 180px;
  height: 120px;
  font-size: 48px;
  top: 940px;
  left: calc(50% + 10px);
}
#fast {
  position: absolute;
  width: 180px;
  height: 120px;
  font-size: 48px;
  top: 940px;
  left: calc(50% + 200px);
}
#fullscreen {
  position: absolute;
  width: 120px;
  height: 120px;
  font-size: 48px;
  top: 10px;
  right: 10px;
}
</style>
