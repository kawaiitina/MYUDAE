<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useSettingStore } from "../store.js";

const store = useSettingStore();
const {
  loadString,
  score,
  recentScores,
  volume,
  userOffset,
  noteSpeed,
  keyTop,
  keyBottom,
} = storeToRefs(store);

const emit = defineEmits(["volume-change", "score-change"]);
function onVolumeChange() {
  emit("volume-change", volume.value);
}
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "[",
  "]",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  ";",
  "'",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  ",",
  ".",
  "/",
];

function load() {
  score.value = JSON.parse(loadString.value);
  recentScores.value.push(score.value);
  recentScores.value.sort((score1, score2) =>
    score1.title.localeCompare(score2.title)
  );
  localStorage.setItem("loadString", loadString.value);
  localStorage.setItem("recentScores", recentScores.value);
  loadString.value = "";
  emit("score-change", score.value);
}

function loadRecentScore(recentScore) {
  score.value = recentScore;
  localStorage.setItem("loadString", JSON.stringify(recentScore));
  emit("score-change", score.value);
}
function deleteRecentScores(i) {
  recentScores.value.splice(i, 1);
}

onMounted(() => {
  const settingString = localStorage.getItem("setting");
  if (settingString) {
    const data = JSON.parse(settingString);
    // playbackRate.value = data.playbackRate;
    volume.value = data.volume;
    userOffset.value = data.userOffset;
    noteSpeed.value = data.noteSpeed;
    keyTop.value = data.keyTop;
    keyBottom.value = data.keyBottom;
    recentScores.value = data.recentScores;

    emit("volume-change", volume.value);
  }
  const loadString = localStorage.getItem("loadString");
  if (loadString) {
    score.value = JSON.parse(loadString);
    emit("score-change", score.value);
  }
  addEventListener("beforeunload", function save() {
    const data = {
      // playbackRate: playbackRate.value,
      volume: volume.value,
      userOffset: userOffset.value,
      noteSpeed: noteSpeed.value,
      keyTop: keyTop.value,
      keyBottom: keyBottom.value,
      recentScores: recentScores.value,
    };
    localStorage.setItem("setting", JSON.stringify(data));
  });
});
</script>

<template>
  <q-card class="q-mt-md q-pa-lg" style="width: 960px">
    <q-card-section class="row fit justify-between">
      <!-- <div class="text-h6 col-2">재생 속도</div>
      <div class="col-3 text-h6">{{ playbackRate }}%</div> -->
      <div class="text-h6 col-1">효과음</div>
      <q-slider
        v-model="volume"
        :min="0"
        :max="100"
        class="col-3"
        @update:model-value="onVolumeChange"
      />
      <div class="col-5"></div>
    </q-card-section>
    <q-card-section class="row fit justify-between">
      <q-input
        v-model.number="userOffset"
        type="number"
        label="오프셋(ms)"
        class="col-2"
      />
      <q-input
        v-model.number="noteSpeed"
        type="number"
        label="노트 속도(%)"
        class="col-2"
        :min="10"
        :max="1000"
      />
      <q-select
        v-model="keyTop"
        label="키 설정(위)"
        multiple
        :options="keys"
        class="col-3"
      />
      <q-select
        v-model="keyBottom"
        label="키 설정(아래)"
        multiple
        :options="keys"
        class="col-3"
      />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="column">
        <q-input
          outlined
          v-model="loadString"
          label="불러오기"
          type="textarea"
        />
        <q-btn
          color="white"
          text-color="black"
          label="불러오기"
          @click="load"
        />
      </div>
      <q-list v-if="recentScores.length > 0" bordered separator class="q-mt-md">
        <q-item
          v-for="(recentScore, i) in recentScores"
          clickable
          v-ripple
          @click="loadRecentScore(recentScore)"
        >
          <q-item-section>
            {{ recentScore.title }} - {{ recentScore.artist }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              round
              flat
              icon="close"
              @click.stop="deleteRecentScores(i)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-separator />
    <q-card-section>
      space: 재시작 <br />
      -: 느리게, +: 빠르게 (백스페이스 옆에 있는 것)<br />
      esc: 정지
    </q-card-section>
  </q-card>
</template>

<style scoped></style>
