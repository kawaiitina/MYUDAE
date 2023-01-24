import * as PIXI from "pixi.js";
import sound from "./sound.js";
import effect from "./effect.js";
import combo from "./combo.js";
import {
  TOP,
  BOTTOM,
  DEFAULT_NOTE_SPEED,
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
  TIMING_WINDOW,
} from "./const.js";
import { sprites } from "./pixi.js";
import setting from "./setting.js";

class Note {
  constructor(note, lane, score, playbackRate) {
    this.time = (note / 12) * (60 / (score.bpm * playbackRate)) * 1000;
    this.lane = lane;
    this.sprite = Note.getSprite(note, lane, score.longNotes);
    this.missed = false;

    this.sprite.y =
      lane === TOP ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;
    this.sprite.anchor.set(0.5);
  }
  update(elapsedTime) {
    this.sprite.x =
      JUDGEMENT_LINE_X -
      DEFAULT_NOTE_SPEED *
        setting.noteSpeedRate *
        (elapsedTime - (this.time + setting.userOffset));
    if (
      !this.missed &&
      elapsedTime > this.time + setting.userOffset + TIMING_WINDOW.GREAT
    ) {
      this.missed = true;
      this.sprite.alpha = 0.5;
      combo.reset();
    }
  }
  destroy() {
    this.sprite.destroy();
  }
  static getSprite(note, lane, longNotes) {
    if (lane === TOP) {
      const isBetweenLongNote = longNotes.top.some((longNote) => {
        return longNote[0] <= note && note <= longNote[1];
      });
      if (isBetweenLongNote) {
        return PIXI.Sprite.from(sprites.noteYellow);
      } else {
        return PIXI.Sprite.from(sprites.noteBlue);
      }
    } else if (lane === BOTTOM) {
      const isBetweenLongNote = longNotes.bottom.some((longNote) => {
        return longNote[0] <= note && note <= longNote[1];
      });
      if (isBetweenLongNote) {
        return PIXI.Sprite.from(sprites.noteYellow);
      } else {
        return PIXI.Sprite.from(sprites.notePink);
      }
    }
  }
}

const note = {
  container: new PIXI.Container(),
  notes: [],
  init(score, playbackRate) {
    score.notes.top.forEach((note) =>
      this.notes.push(new Note(note, TOP, score, playbackRate))
    );
    score.notes.bottom.forEach((note) =>
      this.notes.push(new Note(note, BOTTOM, score, playbackRate))
    );
    this.notes.forEach((note) => {
      this.container.addChild(note.sprite);
    });
  },
  update(elapsedTime) {
    this.notes.forEach((note) => note.update(elapsedTime));
    while (true) {
      const index = this.notes.findIndex((note) => note.sprite.x < -100);
      if (index === -1) {
        break;
      }
      this.notes[index].destroy();
      this.notes.splice(index, 1);
    }
  },
  hit(note, elapsedTime) {
    sound.play("note");
    effect.notePop(note.lane);
    effect.scatter(note.lane);
    effect.judgement(note.lane, elapsedTime - (note.time + setting.userOffset));
    combo.add();
    note.destroy();
    this.notes.splice(
      this.notes.findIndex((thisNote) => thisNote === note),
      1
    );
  },
  getPlayableNote(lane, elapsedTime) {
    return this.notes.find((note) => {
      const timeDelta = elapsedTime - (note.time + setting.userOffset);
      return (
        lane === note.lane &&
        -TIMING_WINDOW.GREAT <= timeDelta &&
        timeDelta <= TIMING_WINDOW.GREAT
      );
    });
  },
  stop() {
    this.notes.forEach((note) => this.container.removeChild(note.sprite));
    this.notes.forEach((note) => note.destroy());
    this.notes = [];
  },
};

export default note;
