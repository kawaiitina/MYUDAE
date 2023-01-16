import { Howl } from "howler";
import sfx_mezzo_1 from "../assets/sound/sfx_mezzo_1.wav";
import sfx_press_top from "../assets/sound/sfx_press_top.wav";

const noteHitSound = new Howl({
  src: sfx_mezzo_1,
});
const longNoteHitSound = new Howl({
  src: sfx_press_top,
});
function play(which) {
  if (which === "note") {
    noteHitSound.play();
  } else if (which === "longNote") {
    longNoteHitSound.play();
  }
}
function changeVolume(value) {
  // 알 수 없는 이유로 q-slider의 v-model이 0일 때 이벤트가 발생하지 않음
  if (value <= 1) {
    noteHitSound.mute(true);
    longNoteHitSound.mute(true);
  } else {
    noteHitSound.mute(false);
    longNoteHitSound.mute(false);
    noteHitSound.volume(value / 100);
    longNoteHitSound.volume(value / 100);
  }
}

const sound = {
  play,
  changeVolume,
};

export default sound;
