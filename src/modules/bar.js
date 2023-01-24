import * as PIXI from "pixi.js";
import { JUDGEMENT_LINE_X, DEFAULT_NOTE_SPEED } from "./const.js";
import { sprites } from "./pixi.js";
import setting from "./setting.js";

class Bar {
  constructor(beat, score, playbackRate) {
    this.time = beat * (60 / (score.bpm * playbackRate)) * 1000;
    this.sprite = score.bars.includes(beat)
      ? PIXI.Sprite.from(sprites.barRed)
      : PIXI.Sprite.from(sprites.barGray);
    this.sprite.y = 540;
    this.sprite.anchor.set(0.5);
    this.sprite.alpha = 0.5;
  }
  update(elapsedTime) {
    this.sprite.x =
      JUDGEMENT_LINE_X -
      DEFAULT_NOTE_SPEED *
        setting.noteSpeedRate *
        (elapsedTime - (this.time + setting.userOffset));
  }
  destroy() {
    this.sprite.destroy();
  }
}
const bar = {
  container: new PIXI.Container(),
  bars: [],
  init(score, playbackRate) {
    for (let i = 0; i < score.beats; i += 1) {
      this.bars.push(new Bar(i, score, playbackRate));
    }
    this.bars.forEach((bar) => {
      this.container.addChild(bar.sprite);
    });
  },
  update(elapsedTime) {
    this.bars.forEach((bar) => bar.update(elapsedTime));
  },
  stop() {
    this.bars.forEach((bar) => this.container.removeChild(bar.sprite));
    this.bars.forEach((bar) => bar.destroy());
    this.bars = [];
  },
};

export default bar;
