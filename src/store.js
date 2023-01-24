import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStore = defineStore("store", () => {
  const loadedScores = ref([]);
  const currentScoreIndex = ref(0);
  const playbackRate = ref(100);
  const sfxVolume = ref(50);
  const keyTop = ref(["A", "S", "D", "F"]);
  const keyBottom = ref(["J", "K", "L", ";"]);
  const userOffset = ref(0);
  const noteSpeedRate = ref(100);
  const score = computed(() => loadedScores.value[currentScoreIndex.value]);

  const youtubeVolume = ref(100);

  return {
    loadedScores,
    currentScoreIndex,
    playbackRate,
    sfxVolume,
    keyTop,
    keyBottom,
    userOffset,
    noteSpeedRate,
    score,
    youtubeVolume,
  };
});
