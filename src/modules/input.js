import note from "./note.js";
import longNote from "./longnote.js";
import setting from "./setting.js";

const recentKeydowns = [];
const recentKeyups = [];
let startTime;

function handleKeydown(event) {
  if (event.repeat) {
    return;
  }
  if (setting.keys.some((key) => key.code === event.code)) {
    const pressedKey = setting.keys.find((key) => key.code === event.code);
    recentKeydowns.push({
      timeStamp: event.timeStamp,
      lane: pressedKey.lane,
      code: pressedKey.code,
    });
    pressedKey.pressed = true;
  }
}
function handleKeyup(event) {
  if (setting.keys.some((key) => key.code === event.code)) {
    const releasedKey = setting.keys.find((key) => key.code === event.code);
    recentKeyups.push({
      timeStamp: event.timeStamp,
      lane: releasedKey.lane,
      code: releasedKey.code,
    });
    releasedKey.pressed = false;
  }
}
function init(_startTime) {
  document.body.addEventListener("keydown", handleKeydown);
  document.body.addEventListener("keyup", handleKeyup);

  startTime = _startTime;
}
function stop() {
  document.body.removeEventListener("keydown", handleKeydown);
  document.body.removeEventListener("keyup", handleKeyup);
}

function update() {
  while (recentKeydowns.length > 0) {
    const recentKeydown = recentKeydowns.shift();
    const elapsedTime = recentKeydown.timeStamp - startTime;
    const playableNote = note.getPlayableNote(recentKeydown.lane, elapsedTime);
    const holdableLongNote = longNote.getHoldableLongNote(
      recentKeydown.lane,
      elapsedTime
    );
    if (playableNote && holdableLongNote) {
      if (playableNote.time < holdableLongNote.startTime) {
        note.hit(playableNote, elapsedTime);
      } else {
        longNote.hold(holdableLongNote, elapsedTime, recentKeydown.code);
      }
    } else if (playableNote) {
      note.hit(playableNote, elapsedTime);
    } else if (holdableLongNote) {
      longNote.hold(holdableLongNote, elapsedTime, recentKeydown.code);
    }
  }

  while (recentKeyups.length > 0) {
    const recentKeyup = recentKeyups.shift();
    const elapsedTime = recentKeyup.timeStamp - startTime;
    const releaseableLongNote = longNote.getReleaseableLongNote(
      recentKeyup.code
    );
    if (releaseableLongNote) {
      longNote.release(releaseableLongNote, elapsedTime);
    }
  }
}

const keyboard = { init, update, stop };
export default keyboard;
