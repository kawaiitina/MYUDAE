import note from "./note.js";
import longNote from "./longnote.js";

const recentKeydowns = [];
const recentKeyups = [];

function handleKeydown(event) {
  if (event.repeat) {
    return;
  }
  recentKeydowns.push(event);
}
function handleKeyup(event) {
  recentKeyups.push(event);
}
function init() {
  document.body.addEventListener("keydown", handleKeydown);
  document.body.addEventListener("keyup", handleKeyup);
}
function stop() {
  document.body.removeEventListener("keydown", handleKeydown);
  document.body.removeEventListener("keyup", handleKeyup);
}

function update(options) {
  const { notes, longNotes, startTime, keys } = options;
  while (recentKeydowns.length > 0) {
    const recentKeydown = recentKeydowns.shift();
    const elapsedTime = recentKeydown.timeStamp - startTime;
    if (keys.top.includes(recentKeydown.code)) {
      const result = longNote.hold(
        longNotes,
        "top",
        elapsedTime,
        recentKeydown.code
      );
      if (result) {
        continue;
      }
      note.hit(notes, "top", elapsedTime);
    } else if (keys.bottom.includes(recentKeydown.code)) {
      const result = longNote.hold(
        longNotes,
        "bottom",
        elapsedTime,
        recentKeydown.code
      );
      if (result) {
        continue;
      }
      note.hit(notes, "bottom", elapsedTime);
    }
  }

  while (recentKeyups.length > 0) {
    const recentKeyup = recentKeyups.shift();
    const elapsedTime = recentKeyup.timeStamp - startTime;
    if (keys.top.includes(recentKeyup.code)) {
      longNote.release(longNotes, "top", elapsedTime, recentKeyup.code);
    } else if (keys.bottom.includes(recentKeyup.code)) {
      longNote.release(longNotes, "bottom", elapsedTime, recentKeyup.code);
    }
  }
}

const keyboard = { init, update, stop };
export default keyboard;
