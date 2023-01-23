import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const loadString = ref("");
  const score = ref({});
  const recentScores = ref([]);

  const playbackRate = ref(100);
  const sfxVolume = ref(50);
  const youtubeVolume = ref(100);
  const userOffset = ref(0);
  const noteSpeedRate = ref(100);
  const keyTop = ref(["D", "F"]);
  const keyBottom = ref(["J", "K"]);

  return {
    loadString,
    score,
    recentScores,
    playbackRate,
    sfxVolume,
    youtubeVolume,
    userOffset,
    noteSpeedRate,
    keyTop,
    keyBottom,
  };
});
