<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";
import app from "../modules/app.js";

const store = useStore();
const { loadedScores, currentScoreIndex, score } = storeToRefs(store);
const loadString = ref("");

function loadScore() {
  const newScore = JSON.parse(loadString.value);
  loadedScores.value.push(newScore);
  loadedScores.value.sort((score1, score2) =>
    score1.title.localeCompare(score2.title)
  );
  loadString.value = "";
  selectScore(
    loadedScores.value.findIndex((score) => score.title === newScore.title)
  );
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
onMounted(() => {
  const saveString = localStorage.getItem("scores");
  if (saveString) {
    const data = JSON.parse(saveString);

    loadedScores.value = JSON.parse(data.loadedScores);
    currentScoreIndex.value = data.currentScoreIndex;

    app.setting.changeScore(score.value);
  }

  addEventListener("beforeunload", function () {
    const data = {
      loadedScores: JSON.stringify(loadedScores.value),
      currentScoreIndex: currentScoreIndex.value,
    };
    localStorage.setItem("scores", JSON.stringify(data));
  });
});
</script>

<template>
  <q-card-section class="q-pa-lg q-pt-xl">
    <div class="text-h6 text-bold q-mb-lg">악보 목록</div>
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
    <q-list v-if="loadedScores.length > 0" bordered separator class="q-mt-lg">
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
</template>

<style scoped></style>
