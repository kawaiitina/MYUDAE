<script setup>
import { onMounted } from "vue";
import { useSettingStore } from "/src/store.js";
import { storeToRefs } from "pinia";

const store = useSettingStore();
const {
  score,
  playbackRate,
  volume,
  userOffset,
  noteSpeed,
  keyTop,
  keyBottom,
  loadString,
} = storeToRefs(store);

const emit = defineEmits(["playback-rate-change", "volume-change"]);
function onPlaybackRateChange() {
  emit("playback-rate-change", playbackRate.value);
}
function onVolumeChange() {
  emit("volume-change", volume.value);
}
const playbackRateMarkerLabel = [
  { value: 25, label: "x0.25" },
  { value: 50, label: "x0.5" },
  { value: 75, label: "x0.75" },
  { value: 100, label: "x1" },
];
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
  localStorage.setItem("load", loadString.value);
  loadString.value = "";
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
    emit("volume-change", volume.value);
  }
  const loadString = localStorage.getItem("load");
  if (loadString) {
    score.value = JSON.parse(loadString);
  }
  addEventListener("beforeunload", function save() {
    const data = {
      // playbackRate: playbackRate.value,
      volume: volume.value,
      userOffset: userOffset.value,
      noteSpeed: noteSpeed.value,
      keyTop: keyTop.value,
      keyBottom: keyBottom.value,
    };
    localStorage.setItem("setting", JSON.stringify(data));
  });
});
</script>

<template>
  <q-card class="q-pa-lg" style="width: 960px">
    <q-card-section class="row fit justify-between">
      <div class="text-h6 col-1">배속({{ playbackRate }}%)</div>
      <q-slider
        v-model="playbackRate"
        markers
        :marker-labels="playbackRateMarkerLabel"
        :step="5"
        snap
        :min="0"
        :inner-min="25"
        :max="150"
        class="col-4"
        @change="onPlaybackRateChange"
      />
      <div>
        <div class="text-h6 col-1">효과음</div>
      </div>
      <q-slider
        v-model="volume"
        :min="0"
        :max="100"
        class="col-4"
        @update:model-value="onVolumeChange"
      />
      <!-- 알 수 없는 이유로 q-slider의 v-model이 0일 때 이벤트가 발생하지 않음 -->
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
        use-input
        multiple
        input-debounce="0"
        :options="keys"
        class="col-3"
      />
      <q-select
        v-model="keyBottom"
        label="키 설정(아래)"
        use-input
        multiple
        input-debounce="0"
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
