import * as PIXI from "pixi.js";
import sound from "./sound.js";
import effect from "./effect.js";
import judgement from "./judgement.js";
import combo from "./combo.js";
import {
  TOP,
  BOTTOM,
  JUDGEMENT_LINE_X,
  JUDEGMENT_LINE_TOP_Y,
  JUDEGMENT_LINE_BOTTOM_Y,
  DEFAULT_NOTE_SPEED,
  TIMING_WINDOW,
} from "./const.js";
import { sprites } from "./pixi.js";
import setting from "./setting.js";

class LongNote {
  constructor(longNote, lane, score, playbackRate) {
    this.startTime =
      (longNote[0] / 12) * (60 / (score.bpm * playbackRate)) * 1000;
    this.endTime =
      (longNote[1] / 12) * (60 / (score.bpm * playbackRate)) * 1000;
    this.lane = lane;
    this.headSprite =
      lane === TOP
        ? PIXI.Sprite.from(sprites.longnoteBlue)
        : PIXI.Sprite.from(sprites.longnotePink);
    this.tailSprite =
      lane === TOP
        ? PIXI.Sprite.from(sprites.longnoteBlue)
        : PIXI.Sprite.from(sprites.longnotePink);
    this.staffSprite =
      lane === TOP
        ? PIXI.Sprite.from(sprites.staffBlue)
        : PIXI.Sprite.from(sprites.staffPink);
    this.holdStartTime = null;
    this.releaseTime = null;
    this.codes = [];
    this.isHeld = false;
    this.isReleased = false;
    this.missed = false;

    this.headSprite.y =
      lane === TOP ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;
    this.tailSprite.y =
      lane === TOP ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;
    this.staffSprite.y =
      lane === TOP ? JUDEGMENT_LINE_TOP_Y : JUDEGMENT_LINE_BOTTOM_Y;
    this.headSprite.anchor.set(0.5);
    this.tailSprite.anchor.set(0.5);
    this.staffSprite.anchor.set(0.5);
  }
  update(elapsedTime) {
    if (
      !this.isHeld &&
      !this.isReleased // 다가오기 전
    ) {
      this.headSprite.x =
        JUDGEMENT_LINE_X -
        DEFAULT_NOTE_SPEED *
          setting.noteSpeedRate *
          (elapsedTime - (this.startTime + setting.userOffset));
    } else if (this.isHeld) {
      // 누르고 있는 중
      this.headSprite.x = JUDGEMENT_LINE_X;
    } else if (this.isReleased) {
      // 중간에 놓침
      this.headSprite.x =
        JUDGEMENT_LINE_X -
        DEFAULT_NOTE_SPEED *
          setting.noteSpeedRate *
          (elapsedTime -
            (this.startTime + setting.userOffset) -
            (this.releaseTime - this.holdStartTime));
    }
    this.headSprite.rotation = this.isHeld
      ? -elapsedTime / 100
      : -elapsedTime / 200;

    this.tailSprite.x =
      JUDGEMENT_LINE_X -
      DEFAULT_NOTE_SPEED *
        setting.noteSpeedRate *
        (elapsedTime - (this.endTime + setting.userOffset));
    this.tailSprite.rotation = -elapsedTime / 200;

    this.staffSprite.x = (this.tailSprite.x + this.headSprite.x) / 2;
    this.staffSprite.scale.x = (this.tailSprite.x - this.headSprite.x) / 100;

    if (
      !this.missed &&
      !this.isHeld &&
      elapsedTime > this.startTime + setting.userOffset + TIMING_WINDOW.GREAT
    ) {
      this.missed = true;
      this.headSprite.alpha = 0.5;
      this.tailSprite.alpha = 0.5;
      this.staffSprite.alpha = 0.5;
      combo.reset();
    }
  }
  destroy() {
    this.headSprite.destroy();
    this.tailSprite.destroy();
    this.staffSprite.destroy();
  }
}

const longNote = {
  container: new PIXI.Container(),
  longNotes: [],
  init(score, playbackRate) {
    score.longNotes.top.forEach((longNote) =>
      this.longNotes.push(new LongNote(longNote, TOP, score, playbackRate))
    );
    score.longNotes.bottom.forEach((longNote) =>
      this.longNotes.push(new LongNote(longNote, BOTTOM, score, playbackRate))
    );
    this.longNotes.forEach((longNote) => {
      this.container.addChild(longNote.staffSprite);
      this.container.addChild(longNote.headSprite);
      this.container.addChild(longNote.tailSprite);
    });
  },
  update(elapsedTime) {
    this.longNotes.forEach((longNote) => longNote.update(elapsedTime));
    while (true) {
      const index = this.longNotes.findIndex(
        (longNote) => longNote.tailSprite.x < -100
      );
      if (index === -1) {
        break;
      }
      this.longNotes[index].destroy();
      this.longNotes.splice(index, 1);
    }
    while (true) {
      const releaseableLongNote = this.longNotes.find(
        (longNote) =>
          longNote.isHeld &&
          elapsedTime >= longNote.endTime + setting.userOffset - 4
      );
      if (!releaseableLongNote) {
        break;
      }
      this.release(releaseableLongNote, elapsedTime);
    }
  },
  getHoldableLongNote(lane, elapsedTime) {
    return this.longNotes.find((longNote) => {
      const timeDelta = elapsedTime - (longNote.startTime + setting.userOffset);
      return (
        lane === longNote.lane &&
        !longNote.isHeld &&
        !longNote.isReleased &&
        -TIMING_WINDOW.GREAT <= timeDelta &&
        timeDelta <= TIMING_WINDOW.GREAT
      );
    });
  },
  hold(longNote, elapsedTime, code) {
    sound.play("longNote");
    effect.notePop(longNote.lane);
    effect.scatter(longNote.lane);
    judgement.add(
      longNote.lane,
      elapsedTime - (longNote.startTime + setting.userOffset)
    );
    combo.add();
    longNote.isHeld = true;
    longNote.holdStartTime = elapsedTime;
    longNote.codes.push(code);
  },
  getReleaseableLongNote(code) {
    return this.longNotes.find(
      (longNote) => longNote.isHeld && longNote.codes.includes(code)
    );
  },
  release(longNote, elapsedTime) {
    const timeDelta = elapsedTime - (longNote.endTime + setting.userOffset);
    if (timeDelta < -TIMING_WINDOW.GREAT) {
      //롱노트 놓침
      longNote.isHeld = false;
      longNote.isReleased = true;
      longNote.releaseTime = elapsedTime;
      combo.reset();
    } else {
      sound.play("longNote");
      effect.notePop(longNote.lane);
      effect.scatter(longNote.lane);
      judgement.add(longNote.lane, timeDelta);
      combo.add();
      longNote.destroy();
      this.longNotes.splice(
        this.longNotes.findIndex((thisLongNote) => thisLongNote === longNote),
        1
      );
    }
  },
  stop() {
    this.longNotes.forEach((longNote) => {
      this.container.removeChild(longNote.headSprite);
      this.container.removeChild(longNote.tailSprite);
      this.container.removeChild(longNote.staffSprite);
    });
    this.longNotes.forEach((longNote) => longNote.destroy());
    this.longNotes = [];
  },
};

export default longNote;
