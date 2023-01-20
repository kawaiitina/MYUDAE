import * as PIXI from "pixi.js";
import sound from "./sound.js";
import effect from "./effect.js";
import judgement, { TIMING_WINDOW } from "./judgement.js";
import {
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
} from "./judgement-line.js";

import longnote_blue from "../assets/sprite/longnote_blue.png";
import staff_blue from "../assets/sprite/staff_blue.png";
import longnote_pink from "../assets/sprite/longnote_pink.png";
import staff_pink from "../assets/sprite/staff_pink.png";
import combo from "./combo.js";

const sprites = {
  blueStar1: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_blue);
      sprite.y = JUDEGMENT_LINE_TOP_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  blueStar2: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_blue);
      sprite.y = JUDEGMENT_LINE_TOP_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  blueStaff: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(staff_blue);
      sprite.y = JUDEGMENT_LINE_TOP_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pinkStar1: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_pink);
      sprite.y = JUDEGMENT_LINE_BOTTOM_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pinkStar2: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(longnote_pink);
      sprite.y = JUDEGMENT_LINE_BOTTOM_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pinkStaff: Array(25)
    .fill(null)
    .map((el) => {
      const sprite = PIXI.Sprite.from(staff_pink);
      sprite.y = JUDEGMENT_LINE_BOTTOM_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
};
const container = new PIXI.Container();

let longNotes;
let noteSpeed;

function init(options) {
  const { score, playbackRate, userOffset } = options;
  function noteToTime(note) {
    return (note / 12) * (60 / (score.bpm * playbackRate)) * 1000 + userOffset;
  }
  longNotes = {
    top: score.longNotes.top.map((longNote) => {
      return {
        startTime: noteToTime(longNote[0]),
        endTime: noteToTime(longNote[1]),
        holdStartTime: null,
        releaseTime: null,
        code: null,
        isHeld: false,
        isReleased: false,
      };
    }),
    bottom: score.longNotes.bottom.map((longNote) => {
      return {
        startTime: noteToTime(longNote[0]),
        endTime: noteToTime(longNote[1]),
        holdStartTime: null,
        releaseTime: null,
        code: null,
        isHeld: false,
        isReleased: false,
      };
    }),
  };
  noteSpeed = options.noteSpeed;
}

function update(elapsedTime) {
  removePassedLongNote(elapsedTime);
  autoRelease(elapsedTime);
  drawLongNote(elapsedTime);

  function removePassedLongNote(elapsedTime) {
    while (elapsedTime - longNotes.top[0]?.endTime > 1000) {
      longNotes.top.shift();
    }
    while (elapsedTime - longNotes.bottom[0]?.endTime > 1000) {
      longNotes.bottom.shift();
    }
  }
  function autoRelease(elapsedTime) {
    const releaseableLongNoteTop = longNotes.top.find(
      (longNote) => longNote.isHeld && elapsedTime >= longNote.endTime - 4
    );
    if (releaseableLongNoteTop) {
      release("top", releaseableLongNoteTop, elapsedTime);
    }
    const releaseableLongNoteBottom = longNotes.bottom.find(
      (longNote) => longNote.isHeld && elapsedTime >= longNote.endTime - 4
    );
    if (releaseableLongNoteBottom) {
      release("bottom", releaseableLongNoteBottom, elapsedTime);
    }
  }
  function drawLongNote(elapsedTime) {
    function getHeadX(longNote, elapsedTime, noteSpeed) {
      if (
        !longNote.isHeld &&
        !longNote.isReleased // 다가오기 전
      ) {
        return (
          JUDGEMENT_LINE_X +
          1.5 * (longNote.startTime - elapsedTime) * noteSpeed
        );
      } else if (longNote.isHeld) {
        // 누르고 있는 중
        return JUDGEMENT_LINE_X;
      } else if (longNote.isReleased) {
        // 중간에 놓침
        return (
          JUDGEMENT_LINE_X +
          1.5 *
            (longNote.startTime -
              elapsedTime +
              (longNote.releaseTime - longNote.holdStartTime)) *
            noteSpeed
        );
      }
    }
    function getTailX(longNote, elapsedTime, noteSpeed) {
      return (
        JUDGEMENT_LINE_X + 1.5 * (longNote.endTime - elapsedTime) * noteSpeed
      );
    }
    sprites.blueStaff.forEach((sprite) => container.removeChild(sprite));
    sprites.blueStar1.forEach((sprite) => container.removeChild(sprite));
    sprites.blueStar2.forEach((sprite) => container.removeChild(sprite));
    longNotes.top.forEach((longNote, i) => {
      if (i >= 25) {
        return;
      }
      const headX = getHeadX(longNote, elapsedTime, noteSpeed);
      const tailX = getTailX(longNote, elapsedTime, noteSpeed);
      sprites.blueStaff[i].x = (tailX + headX) / 2;
      sprites.blueStaff[i].scale.x = (tailX - headX) / 100;
      sprites.blueStar1[i].x = headX;
      sprites.blueStar1[i].rotation = -elapsedTime / 200;
      sprites.blueStar2[i].x = tailX;
      sprites.blueStar2[i].rotation = -elapsedTime / 200;

      container.addChild(sprites.blueStaff[i]);
      container.addChild(sprites.blueStar1[i]);
      container.addChild(sprites.blueStar2[i]);
    });
    sprites.pinkStaff.forEach((sprite) => container.removeChild(sprite));
    sprites.pinkStar1.forEach((sprite) => container.removeChild(sprite));
    sprites.pinkStar2.forEach((sprite) => container.removeChild(sprite));
    longNotes.bottom.forEach((longNote, i) => {
      if (i >= 25) {
        return;
      }
      const headX = getHeadX(longNote, elapsedTime, noteSpeed);
      const tailX = getTailX(longNote, elapsedTime, noteSpeed);
      sprites.pinkStaff[i].x = (tailX + headX) / 2;
      sprites.pinkStaff[i].scale.x = (tailX - headX) / 100;
      sprites.pinkStar1[i].x = headX;
      sprites.pinkStar1[i].rotation = -elapsedTime / 200;
      sprites.pinkStar2[i].x = tailX;
      sprites.pinkStar2[i].rotation = -elapsedTime / 200;

      container.addChild(sprites.pinkStaff[i]);
      container.addChild(sprites.pinkStar1[i]);
      container.addChild(sprites.pinkStar2[i]);
    });
  }
}
function stop() {
  sprites.blueStaff.forEach((sprite) => container.removeChild(sprite));
  sprites.blueStar1.forEach((sprite) => container.removeChild(sprite));
  sprites.blueStar2.forEach((sprite) => container.removeChild(sprite));
  sprites.pinkStaff.forEach((sprite) => container.removeChild(sprite));
  sprites.pinkStar1.forEach((sprite) => container.removeChild(sprite));
  sprites.pinkStar2.forEach((sprite) => container.removeChild(sprite));

  longNotes = {
    top: [],
    bottom: [],
  };
}

function getHoldableLongNote(lane, elapsedTime) {
  return longNotes[lane].find((longNote) => {
    const timeDelta = longNote.startTime - elapsedTime;
    return (
      !longNote.isHeld &&
      !longNote.isReleased &&
      -TIMING_WINDOW.GREAT <= timeDelta &&
      timeDelta <= TIMING_WINDOW.GREAT
    );
  });
}

function hold(lane, holdableLongNote, elapsedTime, code) {
  const timeDelta = elapsedTime - holdableLongNote.startTime;
  sound.play("longNote");
  effect.notePop(lane);
  effect.scatter(lane);
  judgement.add(lane, timeDelta);
  combo.add();
  holdableLongNote.isHeld = true;
  holdableLongNote.holdStartTime = elapsedTime;
  holdableLongNote.code = code;
}

function getReleaseableLongNote(lane, code) {
  return longNotes[lane].find(
    (longNote) => longNote.isHeld && longNote.code === code
  );
}

function release(lane, releaseableLongNote, elapsedTime) {
  const index = longNotes[lane].findIndex(
    (longNote) => longNote === releaseableLongNote
  );
  const timeDelta = elapsedTime - releaseableLongNote.endTime;
  if (timeDelta < -TIMING_WINDOW.GREAT) {
    //롱노트 놓침
    releaseableLongNote.isHeld = false;
    releaseableLongNote.isReleased = true;
    releaseableLongNote.releaseTime = elapsedTime;
    combo.reset();
  } else if (timeDelta < TIMING_WINDOW.GREAT) {
    sound.play("longNote");
    effect.notePop(lane);
    effect.scatter(lane);
    judgement.add(lane, timeDelta);
    combo.add();
    longNotes[lane].splice(index, 1);
  } else {
    longNotes[lane].splice(index, 1);
  }
}

const longNote = {
  container,
  init,
  update,
  stop,
  getHoldableLongNote,
  hold,
  getReleaseableLongNote,
  release,
};
export default longNote;
