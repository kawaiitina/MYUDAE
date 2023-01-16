import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const playbackRate = ref(100);
  const volume = ref(50);
  const userOffset = ref(0);
  const noteSpeed = ref(100);
  const keyTop = ref(["D", "F"]);
  const keyBottom = ref(["J", "K"]);

  const loadString = ref("");
  const score = ref({});

  return {
    playbackRate,
    volume,
    userOffset,
    noteSpeed,
    keyTop,
    keyBottom,
    loadString,
    score,
  };
});
