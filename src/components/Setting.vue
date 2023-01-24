<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";
import app from "../modules/app.js";

const store = useStore();
const {
  loadedScores,
  currentScoreIndex,
  sfxVolume,
  youtubeVolume,
  keyTop,
  keyBottom,
  userOffset,
  noteSpeedRate,
  score,
} = storeToRefs(store);
const loadString = ref("");

const emit = defineEmits(["youtube-volume-change"]);

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

function loadScore() {
  loadedScores.value.push(JSON.parse(loadString.value));
  loadedScores.value.sort((score1, score2) =>
    score1.title.localeCompare(score2.title)
  );
  loadString.value = "";
}

function deleteScore(selectedScoreIndex) {
  loadedScores.value.splice(selectedScoreIndex, 1);
  if (selectedScoreIndex === currentScoreIndex.value) {
    currentScoreIndex.value = 0;
    app.setting.changeScore(score.value);
  } else if (selectedScoreIndex < currentScoreIndex.value) {
    currentScoreIndex.value -= 1;
  }
}

function selectScore(selectedScoreIndex) {
  currentScoreIndex.value = selectedScoreIndex;
  app.setting.changeScore(score.value);
}
</script>

<template>
  <q-card class="q-mt-md q-pa-lg" style="width: 960px">
    <q-card-section class="row fit justify-between">
      <div class="text-h6 col-2">유튜브 음량</div>
      <q-slider
        v-model="youtubeVolume"
        :min="0"
        :max="100"
        class="col-3"
        @update:model-value="emit('youtube-volume-change', youtubeVolume)"
      />
      <div class="text-h6 col-2">효과음 음량</div>
      <q-slider
        v-model="sfxVolume"
        :min="0"
        :max="100"
        class="col-3"
        @update:model-value="app.setting.changeSfxVolume(sfxVolume)"
      />
    </q-card-section>
    <q-card-section class="row fit justify-between">
      <q-select
        v-model="keyTop"
        label="키 설정(위)"
        multiple
        :options="keys"
        class="col-3"
        @update:model-value="app.setting.changeKey(keyTop, keyBottom)"
      />
      <q-select
        v-model="keyBottom"
        label="키 설정(아래)"
        multiple
        :options="keys"
        class="col-3"
        @update:model-value="app.setting.changeKey(keyTop, keyBottom)"
      />
      <q-input
        v-model.number="userOffset"
        type="number"
        label="오프셋(ms)"
        class="col-2"
        @update:model-value="app.setting.changeUserOffset(userOffset)"
      />
      <q-input
        v-model.number="noteSpeedRate"
        type="number"
        label="노트 속도 배율(%)"
        class="col-2"
        :min="10"
        :max="1000"
        @update:model-value="
          app.setting.changeNoteSpeedRate(noteSpeedRate / 100)
        "
      />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row justify-between">
        <q-input
          outlined
          v-model="loadString"
          label="불러오기"
          placeholder="여기에 붙여넣고 엔터키를 누르거나 오른쪽 버튼을 누르세요."
          @keydown.enter.prevent="loadScore"
          class="col-9"
        />
        <q-btn
          color="white"
          text-color="black"
          label="불러오기"
          @click="loadScore"
          class="col-2"
        />
      </div>
      <q-list v-if="loadedScores.length > 0" bordered separator class="q-mt-md">
        <q-item
          v-for="(loadedScore, i) in loadedScores"
          clickable
          v-ripple
          @click="selectScore(i)"
          :class="currentScoreIndex === i ? 'text-bold' : ''"
        >
          <q-item-section>
            {{ loadedScore.title }} - {{ loadedScore.artist }}
          </q-item-section>
          <q-item-section side>
            <q-btn round flat icon="close" @click.stop="deleteScore(i)" />
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
