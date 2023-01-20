import note from "./note.js";
import longNote from "./longnote.js";

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

const recentKeydowns = [];
const recentKeyups = [];
let keys;
let startTime;

function handleKeydown(event) {
  if (event.repeat) {
    return;
  }
  recentKeydowns.push(event);
}
function handleKeyup(event) {
  recentKeyups.push(event);
}
function init(options, _startTime) {
  document.body.addEventListener("keydown", handleKeydown);
  document.body.addEventListener("keyup", handleKeyup);

  startTime = _startTime;
  keys = {
    top: options.keyTop.map((key) => KEY_TO_CODE[key]),
    bottom: options.keyBottom.map((key) => KEY_TO_CODE[key]),
  };
}
function stop() {
  document.body.removeEventListener("keydown", handleKeydown);
  document.body.removeEventListener("keyup", handleKeyup);
}

function update() {
  while (recentKeydowns.length > 0) {
    const recentKeydown = recentKeydowns.shift();
    const elapsedTime = recentKeydown.timeStamp - startTime;
    if (keys.top.includes(recentKeydown.code)) {
      const playableNote = note.getPlayableNote("top", elapsedTime);
      const holdableLongNote = longNote.getHoldableLongNote("top", elapsedTime);
      if (playableNote && holdableLongNote) {
        if (playableNote.time < holdableLongNote.startTime) {
          note.hit("top", playableNote, elapsedTime);
        } else {
          longNote.hold(
            "top",
            holdableLongNote,
            elapsedTime,
            recentKeydown.code
          );
        }
      } else if (playableNote) {
        note.hit("top", playableNote, elapsedTime);
      } else if (holdableLongNote) {
        longNote.hold("top", holdableLongNote, elapsedTime, recentKeydown.code);
      }
    } else if (keys.bottom.includes(recentKeydown.code)) {
      const playableNote = note.getPlayableNote("bottom", elapsedTime);
      const holdableLongNote = longNote.getHoldableLongNote(
        "bottom",
        elapsedTime
      );
      if (playableNote && holdableLongNote) {
        if (playableNote.time < holdableLongNote.startTime) {
          note.hit("bottom", playableNote, elapsedTime);
        } else {
          longNote.hold(
            "bottom",
            holdableLongNote,
            elapsedTime,
            recentKeydown.code
          );
        }
      } else if (playableNote) {
        note.hit("bottom", playableNote, elapsedTime);
      } else if (holdableLongNote) {
        longNote.hold(
          "bottom",
          holdableLongNote,
          elapsedTime,
          recentKeydown.code
        );
      }
    }
  }

  while (recentKeyups.length > 0) {
    const recentKeyup = recentKeyups.shift();
    const elapsedTime = recentKeyup.timeStamp - startTime;
    if (keys.top.includes(recentKeyup.code)) {
      const releaseableLongNote = longNote.getReleaseableLongNote(
        "top",
        recentKeyup.code
      );
      if (releaseableLongNote) {
        longNote.release("top", releaseableLongNote, elapsedTime);
      }
    } else if (keys.bottom.includes(recentKeyup.code)) {
      const releaseableLongNote = longNote.getReleaseableLongNote(
        "bottom",
        recentKeyup.code
      );
      if (releaseableLongNote) {
        longNote.release("bottom", releaseableLongNote, elapsedTime);
      }
    }
  }
}

const keyboard = { init, update, stop };
export default keyboard;
