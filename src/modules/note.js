import * as PIXI from "pixi.js";
import sound from "./sound.js";
import effect from "./effect.js";
import judgement from "./judgement.js";
import note_blue from "../assets/sprite/note_blue.png";
import note_pink from "../assets/sprite/note_pink.png";
import note_yellow from "../assets/sprite/note_yellow.png";
import { TIMING_WINDOW } from "./judgement.js";
import {
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
} from "./judgement-line.js";
import combo from "./combo.js";

const sprites = {
  blue: Array(50)
    .fill(null)
    .map(() => {
      const sprite = PIXI.Sprite.from(note_blue);
      sprite.y = JUDEGMENT_LINE_TOP_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  pink: Array(50)
    .fill(null)
    .map(() => {
      const sprite = PIXI.Sprite.from(note_pink);
      sprite.y = JUDEGMENT_LINE_BOTTOM_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  yellowTop: Array(50)
    .fill(null)
    .map(() => {
      const sprite = PIXI.Sprite.from(note_yellow);
      sprite.y = JUDEGMENT_LINE_TOP_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
  yellowBottom: Array(50)
    .fill(null)
    .map(() => {
      const sprite = PIXI.Sprite.from(note_yellow);
      sprite.y = JUDEGMENT_LINE_BOTTOM_Y;
      sprite.anchor.set(0.5);
      return sprite;
    }),
};
const notes = {
  top: [],
  bottom: [],
};
export const DEFAULT_NOTE_SPEED = 1.5; // pixel/ms
let noteSpeed;

const container = new PIXI.Container();
function init(options) {
  const { score, playbackRate, userOffset } = options;
  function noteToTime(note) {
    return (note / 12) * (60 / (score.bpm * playbackRate)) * 1000 + userOffset;
  }
  function getNoteColor(note, longNotes, lane) {
    const index = longNotes[lane].findIndex((longNote) => {
      return longNote[0] <= note && note <= longNote[1];
    });
    if (index === -1) {
      if (lane === "top") {
        return "blue";
      } else if (lane === "bottom") {
        return "pink";
      }
    } else {
      return "yellow";
    }
  }
  notes.top = score.notes.top.map((note) => {
    return {
      time: noteToTime(note),
      color: getNoteColor(note, score.longNotes, "top"),
      missed: false,
    };
  });
  notes.bottom = score.notes.bottom.map((note) => {
    return {
      time: noteToTime(note),
      color: getNoteColor(note, score.longNotes, "bottom"),
      missed: false,
    };
  });
  noteSpeed = DEFAULT_NOTE_SPEED * options.noteSpeedRate;
}

function getNoteX(note, elapsedTime, noteSpeed) {
  return JUDGEMENT_LINE_X + noteSpeed * (note.time - elapsedTime);
}
function update(elapsedTime) {
  while (
    notes.top.length > 0 &&
    getNoteX(notes.top[0], elapsedTime, noteSpeed) < -100
  ) {
    notes.top.shift();
  }
  while (
    notes.bottom.length > 0 &&
    getNoteX(notes.bottom[0], elapsedTime, noteSpeed) < -100
  ) {
    notes.bottom.shift();
  }

  const missedTopNote = notes.top.find(
    (note) => !note.missed && note.time + TIMING_WINDOW.GREAT < elapsedTime
  );
  if (missedTopNote) {
    missedTopNote.missed = true;
    combo.reset();
  }
  const missedBottomNote = notes.bottom.find(
    (note) => !note.missed && note.time + TIMING_WINDOW.GREAT < elapsedTime
  );
  if (missedBottomNote) {
    missedBottomNote.missed = true;
    combo.reset();
  }
}
function draw(elapsedTime) {
  sprites.blue.forEach((sprite) => {
    sprite.alpha = 1;
    container.removeChild(sprite);
  });
  sprites.yellowTop.forEach((sprite) => {
    sprite.alpha = 1;
    container.removeChild(sprite);
  });
  notes.top.forEach((note, i) => {
    if (i >= 50) {
      return;
    }
    if (note.color === "blue") {
      sprites.blue[i].x = getNoteX(note, elapsedTime, noteSpeed);
      if (note.missed) {
        sprites.blue[i].alpha = 0.5;
      }
      container.addChild(sprites.blue[i]);
    } else if (note.color === "yellow") {
      sprites.yellowTop[i].x = getNoteX(note, elapsedTime, noteSpeed);
      if (note.missed) {
        sprites.yellowTop[i].alpha = 0.5;
      }
      container.addChild(sprites.yellowTop[i]);
    }
  });

  sprites.pink.forEach((sprite) => {
    sprite.alpha = 1;
    container.removeChild(sprite);
  });
  sprites.yellowBottom.forEach((sprite) => {
    sprite.alpha = 1;
    container.removeChild(sprite);
  });
  notes.bottom.forEach((note, i) => {
    if (i >= 50) {
      return;
    }
    if (note.color === "pink") {
      sprites.pink[i].x = getNoteX(note, elapsedTime, noteSpeed);
      if (note.missed) {
        sprites.pink[i].alpha = 0.5;
      }
      container.addChild(sprites.pink[i]);
    } else if (note.color === "yellow") {
      sprites.yellowBottom[i].x = getNoteX(note, elapsedTime, noteSpeed);
      if (note.missed) {
        sprites.yellowBottom[i].alpha = 0.5;
      }
      container.addChild(sprites.yellowBottom[i]);
    }
  });
}
function stop() {
  sprites.blue.forEach((sprite) => container.removeChild(sprite));
  sprites.yellowTop.forEach((sprite) => container.removeChild(sprite));
  sprites.pink.forEach((sprite) => container.removeChild(sprite));
  sprites.yellowBottom.forEach((sprite) => container.removeChild(sprite));
  notes.top = [];
  notes.bottom = [];
}

function getPlayableNote(lane, elapsedTime) {
  return notes[lane].find((note) => {
    const timeDelta = note.time - elapsedTime;
    return (
      -TIMING_WINDOW.GREAT <= timeDelta && timeDelta <= TIMING_WINDOW.GREAT
    );
  });
}

function hit(lane, playableNote, elapsedTime) {
  const index = notes[lane].findIndex((note) => {
    return note === playableNote;
  });
  const timeDelta = elapsedTime - playableNote.time;
  sound.play("note");
  effect.notePop(lane);
  effect.scatter(lane);
  judgement.add(lane, timeDelta);
  combo.add();
  notes[lane].splice(index, 1);
}

const note = { container, init, update, draw, stop, getPlayableNote, hit };
export default note;
