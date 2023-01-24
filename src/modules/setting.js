import { TOP, BOTTOM } from "./const.js";
import sound from "./sound.js";
import uiText from "./ui-text.js";
const KEY_TO_CODE = {
  Q: "KeyQ",
  W: "KeyW",
  E: "KeyE",
  R: "KeyR",
  T: "KeyT",
  Y: "KeyY",
  U: "KeyU",
  I: "KeyI",
  O: "KeyO",
  P: "KeyP",
  "[": "BracketLeft",
  "]": "BracketRight",
  A: "KeyA",
  S: "KeyS",
  D: "KeyD",
  F: "KeyF",
  G: "KeyG",
  H: "KeyH",
  J: "KeyJ",
  K: "KeyK",
  L: "KeyL",
  ";": "Semicolon",
  "'": "Quote",
  Z: "KeyZ",
  X: "KeyX",
  C: "KeyC",
  V: "KeyV",
  B: "KeyB",
  N: "KeyN",
  M: "KeyM",
  ",": "Comma",
  ".": "Period",
  "/": "Slash",
};

const INPUT_MODE = {
  LEFT_RIGHT: 0,
  UP_DOWN: 1,
};

const setting = {
  keys: [
    {
      code: "KeyA",
      lane: TOP,
    },
    {
      code: "KeyS",
      lane: TOP,
    },
    {
      code: "KeyD",
      lane: TOP,
    },
    {
      code: "KeyF",
      lane: TOP,
    },
    {
      code: "KeyJ",
      lane: BOTTOM,
    },
    {
      code: "KeyK",
      lane: BOTTOM,
    },
    {
      code: "KeyL",
      lane: BOTTOM,
    },
    {
      code: "Semicolon",
      lane: BOTTOM,
    },
  ],
  inputMode: INPUT_MODE.LEFT_RIGHT,
  userOffset: 0,
  noteSpeedRate: 1,
  changeSfxVolume(sfxVolume) {
    sound.changeSfxVolume(sfxVolume);
  },
  changeScore(score) {
    uiText.changeScore(score);
  },
  changePlaybackRate(playbackRate) {
    uiText.changePlaybackRate(playbackRate);
  },
  changeUserOffset(value) {
    this.userOffset = value;
  },
  changeNoteSpeedRate(value) {
    this.noteSpeedRate = value;
  },
  changeKey(keyTop, keyBottom) {
    const top = keyTop.map((key) => {
      return {
        code: KEY_TO_CODE[key],
        lane: TOP,
      };
    });
    const bottom = keyBottom.map((key) => {
      return {
        code: KEY_TO_CODE[key],
        lane: BOTTOM,
      };
    });
    this.keys = top.concat(bottom);
  },
};

export default setting;
