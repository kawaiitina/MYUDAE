<script setup>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "../store.js";
import app from "../modules/app.js";

const store = useStore();
const {
  sfxVolume,
  youtubeVolume,
  keyTop,
  keyBottom,
  userOffset,
  noteSpeedRate,
  showButtons,
} = storeToRefs(store);
// const touchInputMode = ref(0);

const emit = defineEmits(["youtube-volume-change"]);

const keys = [
  { label: "Q", value: "KeyQ" },
  { label: "W", value: "KeyW" },
  { label: "E", value: "KeyE" },
  { label: "R", value: "KeyR" },
  { label: "T", value: "KeyT" },
  { label: "Y", value: "KeyY" },
  { label: "U", value: "KeyU" },
  { label: "I", value: "KeyI" },
  { label: "O", value: "KeyO" },
  { label: "P", value: "KeyP" },
  { label: "[", value: "BracketLeft" },
  { label: "]", value: "BracketRight" },
  { label: "A", value: "KeyA" },
  { label: "S", value: "KeyS" },
  { label: "D", value: "KeyD" },
  { label: "F", value: "KeyF" },
  { label: "G", value: "KeyG" },
  { label: "H", value: "KeyH" },
  { label: "J", value: "KeyJ" },
  { label: "K", value: "KeyK" },
  { label: "L", value: "KeyL" },
  { label: ";", value: "Semicolon" },
  { label: "'", value: "Quote" },
  { label: "Z", value: "KeyZ" },
  { label: "X", value: "KeyX" },
  { label: "C", value: "KeyC" },
  { label: "V", value: "KeyV" },
  { label: "B", value: "KeyB" },
  { label: "N", value: "KeyN" },
  { label: "M", value: "KeyM" },
  { label: ",", value: "Comma" },
  { label: ".", value: "Period" },
  { label: "/", value: "Slash" },
];
// const touchInputModes = [
//   { label: "좌우", value: 0 },
//   { label: "상하", value: 1 },
// ];

onMounted(() => {
  const saveString = localStorage.getItem("settings");
  if (saveString) {
    const data = JSON.parse(saveString);

    sfxVolume.value = data.sfxVolume;
    youtubeVolume.value = data.youtubeVolume;
    userOffset.value = data.userOffset;
    noteSpeedRate.value = data.noteSpeedRate;
    keyTop.value = data.keyTop;
    keyBottom.value = data.keyBottom;

    app.setting.changeSfxVolume(sfxVolume.value);
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
    };
    localStorage.setItem("settings", JSON.stringify(data));
  });
});
</script>

<template>
  <q-card-section class="column">
    <div class="text-h6 text-bold q-mb-md">입력</div>
    <q-select
      v-model="keyTop"
      label="키 설정(위)"
      class="q-mb-md"
      multiple
      map-options
      emit-value
      :options="keys"
      @update:model-value="app.setting.changeKey(keyTop, keyBottom)"
    />
    <q-select
      v-model="keyBottom"
      label="키 설정(아래)"
      class="q-mb-md"
      multiple
      map-options
      emit-value
      :options="keys"
      @update:model-value="app.setting.changeKey(keyTop, keyBottom)"
    />
    <!-- <q-select
      v-model="touchInputMode"
      label="터치 입력"
      class="q-mb-md"
      :options="touchInputModes"
      map-options
      emit-value
      @update:model-value="app.setting.changeKey(keyTop, keyBottom)"
    /> -->
    <q-input
      v-model.number="userOffset"
      type="number"
      label="오프셋(ms)"
      class="q-mb-md"
      @update:model-value="app.setting.changeUserOffset(userOffset)"
    />
    <div class="text-h6 text-bold q-mb-md">소리</div>
    <div class="row q-mb-md">
      <q-badge>유튜브</q-badge>
      <q-slider
        v-model="youtubeVolume"
        :min="0"
        :max="100"
        @update:model-value="emit('youtube-volume-change', youtubeVolume)"
      />
    </div>
    <div class="row q-mb-md">
      <q-badge>효과음</q-badge>
      <q-slider
        v-model="sfxVolume"
        :min="0"
        :max="100"
        @update:model-value="app.setting.changeSfxVolume(sfxVolume)"
      />
    </div>
    <div class="text-h6 text-bold q-mb-md">화면</div>
    <q-input
      v-model.number="noteSpeedRate"
      type="number"
      label="노트 속도 (%)"
      class="q-mb-md"
      :min="10"
      :max="1000"
      @update:model-value="app.setting.changeNoteSpeedRate(noteSpeedRate / 100)"
    />
    <q-checkbox
      v-model="showButtons"
      label="재생, 일시정지, 속도 조절 버튼 표시"
      class="q-mb-md"
    />
    <div class="text-h6 text-bold q-mb-md">단축키</div>
    <q-list dense>
      <q-item> space: 재시작 </q-item>
      <q-item> -: 느리게 </q-item>
      <q-item> +: 빠르게 </q-item>
      <q-item> esc: 정지 </q-item>
    </q-list>
    <q-separator class="q-mt-md q-mb-md" />
    모바일 지원 안 합니다.<br />
    이 사이트는 뮤즈대시, 페로페로 공식 웹사이트가 아닙니다.
  </q-card-section>
</template>

<style scoped></style>
