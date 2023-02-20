<script setup>
import { ref, onMounted } from "vue";
import Setting from "./Setting.vue";
import ScoreList from "./ScoreList.vue";

const emit = defineEmits(["youtube-volume-change"]);

const showMenu = ref(false);
const btn = ref();

onMounted(() => {
  document.body.addEventListener("keydown", function (event) {
    if (event.repeat) {
      return;
    }
    if (event.code === "Escape") {
      showMenu.value = false;
      btn.value.$el.blur();
    }
  });
});
</script>

<template>
  <div style="position: absolute; top: 0; opacity: 0.95">
    <div class="relative-position">
      <q-card
        v-show="showMenu"
        class="row justify-around"
        style="
          position: absolute;
          top: 0;
          padding-left: 100px;
          width: 1920px;
          height: 1080px;
        "
        flat
        square
      >
        <ScoreList class="col-5" />
        <Setting
          class="col-5"
          @youtube-volume-change="emit('youtube-volume-change', youtubeVolume)"
        />
      </q-card>
      <q-btn
        ref="btn"
        icon="menu"
        :text-color="showMenu ? 'black' : 'white'"
        flat
        @click="showMenu = !showMenu"
        style="
          position: absolute;
          width: 120px;
          height: 120px;
          font-size: 48px;
          top: 10px;
          left: 10px;
          opacity: 0.8;
        "
      />
    </div>
  </div>
</template>

<style scoped></style>
